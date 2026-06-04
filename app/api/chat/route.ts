import { getClient } from "@/lib/clients";

type Msg = { role: "user" | "assistant"; content: string };

const PHONE_RE = /(\+?\d[\d\s().-]{7,}\d)/;
const EMAIL_RE = /[^\s@]+@[^\s@]+\.[^\s@]+/;

// Forward a captured lead to the same /api/contact endpoint the contact form
// uses, so it lands in the inbox exactly like a normal inquiry.
async function sendLead(origin: string, messages: Msg[]) {
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

  const message =
    `Lead captured from the website chat.\n\n` +
    `Phone: ${phone || "-"}\n` +
    `Email: ${email || "-"}\n\n` +
    `--- Conversation ---\n${transcript}`;

  try {
    const res = await fetch(origin + "/api/contact", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        name: phone ? `Chat lead (${phone})` : "Website chat lead",
        email: email || "unrvldllc@gmail.com",
        service: "AI chat lead",
        budget: "",
        message,
      }),
    });
    console.log("[lead] forwarded to /api/contact, status:", res.status);
  } catch (err) {
    console.error("[lead] forward failed:", err);
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

    // Fire the lead the moment the visitor shares a phone or email,
    // independently of the AI reply so a lead is never lost.
    const origin = new URL(request.url).origin;
    const lastUser = [...messages].reverse().find((m) => m.role === "user");
    const hasContact =
      !!lastUser && (PHONE_RE.test(lastUser.content) || EMAIL_RE.test(lastUser.content));
    const leadPromise = hasContact ? sendLead(origin, messages) : Promise.resolve();

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

    // Make sure the lead finishes sending before the function returns.
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
