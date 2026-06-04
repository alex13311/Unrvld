import { getPublicConfig } from "@/lib/clients";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const widgetId = searchParams.get("widgetId");

  if (!widgetId) {
    return Response.json({ error: "widgetId required" }, { status: 400 });
  }

  const config = getPublicConfig(widgetId);
  if (!config) {
    return Response.json({ error: "Widget not found." }, { status: 404 });
  }

  return Response.json(config);
}
