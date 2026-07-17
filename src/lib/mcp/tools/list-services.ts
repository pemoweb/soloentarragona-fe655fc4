import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { services } from "@/lib/services-data";

export default defineTool({
  name: "list_public_services",
  title: "List public services",
  description:
    "List public/emergency services in Tarragona (emergencies, pharmacies, hospitals). Filter by kind if desired.",
  inputSchema: {
    kind: z.enum(["emergency", "pharmacy", "hospital"]).optional(),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: ({ kind }) => {
    const items = services
      .filter((s) => (kind ? s.kind === kind : true))
      .map((s) => ({
        slug: s.slug,
        kind: s.kind,
        name: s.name,
        phone: s.phone,
        address: s.address,
        hours: s.hours,
        website: s.website,
      }));
    return {
      content: [{ type: "text", text: JSON.stringify(items, null, 2) }],
      structuredContent: { count: items.length, items },
    };
  },
});
