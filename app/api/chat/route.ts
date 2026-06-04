import { getClient } from "@/lib/clients";

export async function POST(request: Request) {
  try {
    const { widgetId, messages } = await request.json();

    const client = getClient(widgetId);
    if (!client) {
      return Response.json({ text: "Widget not found." }, { status: 404 });
    }

    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "x-api-key": process.env.ANTHROPIC_API_KEY!,
        "anthropic-version": "2023-06-01",
        "content-type": "application/json",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: 1000,
        system: client.systemPrompt,
        messages: messages.map(({ role, content }: { role: string; content: string }) => ({ role, content })),
      }),
    });

    const data = await response.json();
    const text = ((data.content as { type: string; text: string }[]) || [])
      .filter((b) => b.type === "text")
      .map((b) => b.text)
      .join("");

    return Response.json({ text });
  } catch {
    return Response.json({
      text: "Something went wrong — please reach out directly.",
    });
  }
}
