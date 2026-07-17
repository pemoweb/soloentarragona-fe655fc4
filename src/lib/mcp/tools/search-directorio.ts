import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { businesses } from "@/lib/directorio-data";

export default defineTool({
  name: "search_directorio",
  title: "Search local business directory",
  description:
    "Search the Solo en Tarragona local business directory. Optionally filter by category and/or verified status. Returns up to 20 matches.",
  inputSchema: {
    query: z.string().optional().describe("Free-text query matched against name, category, description."),
    category: z.string().optional().describe("Exact category filter, e.g. 'Restaurante'."),
    verifiedOnly: z.boolean().optional().describe("If true, only return verified businesses."),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: ({ query, category, verifiedOnly }) => {
    const q = query?.trim().toLowerCase();
    const filtered = businesses.filter((b) => {
      if (category && b.category !== category) return false;
      if (verifiedOnly && !b.verified) return false;
      if (!q) return true;
      return (
        b.name.toLowerCase().includes(q) ||
        b.category.toLowerCase().includes(q) ||
        (b.description ?? "").toLowerCase().includes(q)
      );
    }).slice(0, 20);
    const summary = filtered.map((b) => ({
      slug: b.slug,
      name: b.name,
      category: b.category,
      rating: b.rating,
      reviews: b.reviews,
      verified: b.verified,
      address: b.address,
      phone: b.phone,
      website: b.website,
    }));
    return {
      content: [{ type: "text", text: JSON.stringify(summary, null, 2) }],
      structuredContent: { count: summary.length, items: summary },
    };
  },
});
