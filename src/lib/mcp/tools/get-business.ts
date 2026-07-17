import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { businesses } from "@/lib/directorio-data";

export default defineTool({
  name: "get_business",
  title: "Get business details",
  description: "Return the full details of a business in the directory by its slug.",
  inputSchema: {
    slug: z.string().min(1).describe("Business slug, e.g. 'el-terrat-de-sant-magi'."),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: ({ slug }) => {
    const b = businesses.find((x) => x.slug === slug);
    if (!b) {
      return {
        content: [{ type: "text", text: `No business found with slug: ${slug}` }],
        isError: true,
      };
    }
    return {
      content: [{ type: "text", text: JSON.stringify(b, null, 2) }],
      structuredContent: { business: b },
    };
  },
});
