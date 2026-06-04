interface ClientConfig {
  widgetId: string;
  name: string;
  accentColor: string;
  bgColor: string;
  greeting: string;
  teaser: string;
  systemPrompt: string;
  allowedDomains: string[];
}

const clients: Record<string, ClientConfig> = {
  unrvld: {
    widgetId: "unrvld",
    name: "UNRVLD",
    accentColor: "#E11D2A",
    bgColor: "#0a0a0a",
    greeting: "Hey — welcome to UNRVLD. What are you looking to make?",
    teaser: "Got a project in mind? Let's talk.",
    systemPrompt:
      "You are the assistant for UNRVLD (unrvldgroup.com) — a Beverly Hills premium media, web, " +
      "and AI studio. Services: cinematic car/inventory reels, brand films, photography, social " +
      "and brand strategy, and AI builds (websites in days, lead-capture agents). Contact: " +
      "alex@unrvldgroup.com, IG @unrvldproductions, book a call at /contact.\n\n" +
      "How you talk:\n" +
      "- Keep replies short — one or two sentences, often just one.\n" +
      "- Ask at most one question at a time, and only when you genuinely need the answer.\n" +
      "- Sound like a real person: relaxed, confident, direct. Not salesy, not robotic.\n" +
      "- No filler openers (no 'Perfect', 'Great question', 'Absolutely'), and never comment on " +
      "their timeline (don't say things like 'that's tight').\n" +
      "- Don't pitch or over-explain. Answer what's asked, then move it forward.\n\n" +
      "Goal: when someone's interested, get their name and an email or phone, then let them know " +
      "Alex will reach out. Don't interrogate them for details up front — Alex scopes it on the " +
      "call. Never invent pricing or availability.",
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
    teaser: client.teaser,
  };
}
