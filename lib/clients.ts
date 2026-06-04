interface ClientConfig {
  widgetId: string;
  name: string;
  accentColor: string;
  bgColor: string;
  greeting: string;
  systemPrompt: string;
  allowedDomains: string[];
}

const clients: Record<string, ClientConfig> = {
  unrvld: {
    widgetId: "unrvld",
    name: "UNRVLD",
    accentColor: "#E8B04B",
    bgColor: "#0e0e11",
    greeting:
      "Welcome to UNRVLD. I can walk you through our work, talk through what you're building, or set you up with Alex directly. What are you after?",
    systemPrompt:
      "You are the AI assistant for UNRVLD (unrvldgroup.com), a Beverly Hills premium media, " +
      "web design, and AI studio. You speak to prospects on the site. Services: cinematic " +
      "videography (car content, brand films, commercial), high-end photography, social & brand " +
      "strategy, and AI systems (AI-built websites in days, custom lead-qualifying agents). " +
      "Beverly Hills, 24–48h response, premium clients only. Contact: alex@unrvldgroup.com, " +
      "IG @unrvldproductions, 'Book a Call' at /contact. Job: answer questions about the work " +
      "confidently and briefly, qualify the prospect (what they want built, brand, timeline), " +
      "then drive them to book a call or leave their details. Tone: polished, confident, sharp, " +
      "1–3 short sentences, never salesy. When someone shows real interest, invite a name + best " +
      "contact, or point to the Book a Call page. Never invent pricing or availability.",
    allowedDomains: [],
  },
};

export function getClient(widgetId: string): ClientConfig | null {
  return clients[widgetId] ?? null;
}

export function getPublicConfig(widgetId: string) {
  const client = getClient(widgetId);
  if (!client) return null;
  return {
    name: client.name,
    accentColor: client.accentColor,
    bgColor: client.bgColor,
    greeting: client.greeting,
  };
}
