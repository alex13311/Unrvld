import nodemailer from "nodemailer";
import { getClient } from "@/lib/clients";

type Msg = { role: "user" | "assistant"; content: string };
type Lead = { name?: string; phone?: string; email?: string; summary?: string };
type Block = { type: string; text?: string; name?: string; id?: string; input?: Lead };

interface ClaudeResponse {
  stop_reason?: string;
  content?: Block[];
  error?: { message?: string };
}

const PHONE_RE = /(\+?\d[\d\s().-]{7,}\d)/;
const EMAIL_RE = /[^\s@]+@[^\s@]+\.[^\s@]+/;

const SAVE_LEAD_TOOL = {
  name: "save_lead",
  description:
    "Record a sales lead. Call this exactly once, on the turn where the visitor shares a phone " +
    "number or email address. Include their name and a short summary of what they want, if known.",
  input_schema: {
    type: "object",
    properties: {
      name: { type: "string", description: "Visitor's name, if provided" },
      phone: { type: "string", description: "Phone number, if provided" },
      email: { type: "string", description: "Email address, if provided" },
      summary: {
        type: "string",
        description: "1-2 sentence summary of what they want, their brand, and any timeline",
      },
    },
    required: ["summary"],
  },
};

async function sendEmail(lead: Lead, transcript: string) {
  if (!process.env.GMAIL_APP_PASSWORD) return;
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: { user: "unrvldllc@gmail.com", pass: process.env.GMAIL_APP_PASSWORD },
  });
  const body = `New chatbot lead from unrvldgroup.com

Name: ${lead.name || "-"}
Phone: ${lead.phone || "-"}
Email: ${lead.email || "-"}

Summary: ${lead.summary || "-"}

- Transcript -
${transcript}`.trim();
  await transporter.sendMail({
    from: "UNRVLD Chatbot <unrvldllc@gmail.com>",
    to: "unrvldllc@gmail.com",
    replyTo: lead.email || undefined,
    subject: `New chatbot lead - ${lead.name || lead.phone || lead.email || "unknown"}`,
    text: body,
  });
}

async function sendSMS(lead: Lead) {
  const sid = process.env.TWILIO_ACCOUNT_SID;
  const token = process.env.TWILIO_AUTH_TOKEN;
  const from = process.env.TWILIO_FROM_NUMBER;
  const to = process.env.LEAD_ALERT_TO;
  if (!sid || !token || !from || !to) return;

  const lines = ["New UNRVLD lead", lead.name || "Unknown"];
  if (lead.phone) lines.push(lead.phone);
  if (lead.email) lines.push(lead.email);
  if (lead.summary) lines.push(lead.summary);

  const params = new URLSearchParams({ From: from, To: to, Body: lines.join("\n") });
  await fetch(`https://api.twilio.com/2010-04-01/Accounts/${sid}/Messages.json`, {
    method: "POST",
    headers: {
      Authorization: "Basic " + Buffer.from(`${sid}:${token}`).toString("base64"),
      "content-type": "application/x-www-form-urlencoded",
    },
    body: params.toString(),
  });
}

async function notify(lead: Lead, transcript: string) {
  // Best-effort: a failure in one channel must not break the chat reply.
  await Promise.allSettled([sendEmail(lead, transcript), sendSMS(lead)]);
}

export async function POST(request: Request) {
  try {
    const { widgetId, messages } = (await request.json()) as {
      widgetId: string;
      messages: Msg[];
    };

    const client = getClient(widgetId);
    if (!client) {
      return Response.json({ text: "Widget not found." }, { status: 404 });
    }
    if (!process.env.ANTHROPIC_API_KEY) {
      return Response.json({
        text: "Config error: ANTHROPIC_API_KEY is not set on the server.",
      });
    }

    const apiMessages: { role: string; content: unknown }[] = messages.map(
      ({ role, content }) => ({ role, content })
    );

    // Only attach the lead tool on the turn where the visitor shares contact info.
    // This keeps normal turns fast and makes the lead fire exactly once.
    const lastUser = [...messages].reverse().find((m) => m.role === "user");
    const hasContact =
      !!lastUser && (PHONE_RE.test(lastUser.content) || EMAIL_RE.test(lastUser.content));

    const callClaude = async (): Promise<{
      ok: boolean;
      status: number;
      data: ClaudeResponse;
    }> => {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "x-api-key": process.env.ANTHROPIC_API_KEY!,
          "anthropic-version": "2023-06-01",
          "content-type": "application/json",
        },
        body: JSON.stringify({
          model: "claude-sonnet-4-5",
          max_tokens: 1000,
          system: client.systemPrompt,
          messages: apiMessages,
          ...(hasContact ? { tools: [SAVE_LEAD_TOOL] } : {}),
        }),
      });
      const data = (await res.json()) as ClaudeResponse;
      return { ok: res.ok, status: res.status, data };
    };

    let { ok, status, data } = await callClaude();
    if (!ok) {
      return Response.json({
        text: `API error: ${data?.error?.message || `API error (${status})`}`,
      });
    }

    if (data.stop_reason === "tool_use") {
      const toolUse = (data.content || []).find(
        (b) => b.type === "tool_use" && b.name === "save_lead"
      );
      if (toolUse) {
        const transcript = messages
          .map((m) => `${m.role === "user" ? "Visitor" : "Bot"}: ${m.content}`)
          .join("\n");
        await notify(toolUse.input || {}, transcript);

        apiMessages.push({ role: "assistant", content: data.content });
        apiMessages.push({
          role: "user",
          content: [
            {
              type: "tool_result",
              tool_use_id: toolUse.id,
              content:
                "Lead saved. Thank the visitor warmly and confirm Alex will reach out within 24-48 hours.",
            },
          ],
        });

        ({ ok, status, data } = await callClaude());
        if (!ok) {
          return Response.json({
            text: `API error: ${data?.error?.message || `API error (${status})`}`,
          });
        }
      }
    }

    const text = (data.content || [])
      .filter((b) => b.type === "text")
      .map((b) => b.text)
      .join("");

    return Response.json({ text: text || "API returned an empty response." });
  } catch {
    return Response.json({
      text: "Something went wrong - please reach out directly.",
    });
  }
}
