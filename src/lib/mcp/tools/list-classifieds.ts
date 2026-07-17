import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { CLASSIFIEDS_SEED } from "@/lib/classifieds-data";

export default defineTool({
  name: "list_classifieds",
  title: "List classified ads",
  description:
    "List active classified ads. Optional category and location filters. Returns up to 20 ads.",
  inputSchema: {
    category: z.enum(["Empleo", "Alquiler", "Venta", "Servicios"]).optional(),
    location: z.string().optional().describe("Neighborhood in Tarragona, e.g. 'Part Alta'."),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: ({ category, location }) => {
    const items = CLASSIFIEDS_SEED.filter((c) => {
      if (category && c.cat !== category) return false;
      if (location && c.location.toLowerCase() !== location.toLowerCase()) return false;
      return true;
    }).slice(0, 20);
    return {
      content: [{ type: "text", text: JSON.stringify(items, null, 2) }],
      structuredContent: { count: items.length, items },
    };
  },
});
