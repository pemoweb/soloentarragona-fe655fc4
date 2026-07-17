import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { SEED_POSTS } from "@/lib/news-data";

export default defineTool({
  name: "get_news_post",
  title: "Get news post",
  description: "Return the full content of a news post by its slug.",
  inputSchema: {
    slug: z.string().min(1).describe("News post slug."),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: ({ slug }) => {
    const p = SEED_POSTS.find((x) => x.slug === slug);
    if (!p) {
      return {
        content: [{ type: "text", text: `No news post with slug: ${slug}` }],
        isError: true,
      };
    }
    return {
      content: [{ type: "text", text: JSON.stringify(p, null, 2) }],
      structuredContent: { post: p },
    };
  },
});
