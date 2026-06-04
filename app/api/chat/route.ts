import nodemailer from "nodemailer";
import { getClient } from "@/lib/clients";

type Msg = { role: "user" | "assistant"; content: string };

const PHONE_RE = /(\+?\d[\d\s().-]{7,}\d)/;
const EMAIL_RE = /[^\s@]+@[^\s@]+\.[^\s@]+/;

// Send a captured lead using the exact same Gmail code as the contact form.
async function emailLead(messages: Msg[]) {
  const pass = process.env.GMAIL_APP_PASSWORD;
  if (!pass) {
    console.error("[lead] GMAIL_APP_PASSWORD is not set - cannot email lead");
    return;
  }

  const userText = messages
    .filter((m) => m.role === "user")
    .map((m) => m.content)
    .join("\n");
  const phoneMatch = userText.match(PHONE_RE);
  const emailMatch = userText.match(EMAIL_RE);
  const phone = phoneMatch ? phoneMatch[0].trim() : "";
  const email = emailMatch ? emailMatch[0].trim() : "";

  const transcript = messages
    .map((m) => `${m.role === "user" ? "Visitor" : "UNRVLD bot"}: ${m.content}`)
    .join("\n");

  const body = `New lead from the UNRVLD website chat.

Phone: ${phone || "-"}
Email: ${email || "-"}

--- Conversation ---
${transcript}`.trim();

  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: { user: "unrvldllc@gmail.com", pass },
    });
    await transporter.sendMail({
      from: "UNRVLD Site <unrvldllc@gmail.com>",
      to: "unrvldllc@gmail.com",
      replyTo: email || undefined,
      subject: `New chat lead - ${phone || email || "website visitor"}`,
      text: body,
    });
    console.log("[lead] email sent");
  } catch (err) {
    console.error("[lead] email failed:", err);
  }
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

    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      return Response.json({
        text: "Config error: ANTHROPIC_API_KEY is not set on the server.",
      });
    }

    // Fire the lead email the moment the visitor shares a phone or email,
    // independently of the AI reply so a lead is never lost.
    const lastUser = [...messages].reverse().find((m) => m.role === "user");
    const hasContact =
      !!lastUser && (PHONE_RE.test(lastUser.content) || EMAIL_RE.test(lastUser.content));
    const leadPromise = hasContact ? emailLead(messages) : Promise.resolve();

    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
        "content-type": "application/json",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-5",
        max_tokens: 1000,
        system: client.systemPrompt,
        messages: messages.map(({ role, content }) => ({ role, content })),
      }),
    });

    const data = (await response.json()) as {
      content?: { type: string; text?: string }[];
      error?: { message?: string };
    };

    // Make sure the email finishes before the serverless function returns.
    await leadPromise;

    if (!response.ok) {
      return Response.json({
        text: `API error: ${data?.error?.message || `API error (${response.status})`}`,
      });
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
