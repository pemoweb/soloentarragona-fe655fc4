import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { SEED_POSTS } from "@/lib/news-data";

export default defineTool({
  name: "list_news",
  title: "List local news posts",
  description:
    "List recent local news posts from Solo en Tarragona. Optional category filter and free-text query. Returns up to 20 posts.",
  inputSchema: {
    query: z.string().optional().describe("Free-text match against title, excerpt, tags."),
    category: z.string().optional().describe("Category filter, e.g. 'Cultura'."),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: ({ query, category }) => {
    const q = query?.trim().toLowerCase();
    const items = SEED_POSTS.filter((p) => {
      if (category && p.category !== category) return false;
      if (!q) return true;
      return (
        p.title.toLowerCase().includes(q) ||
        p.excerpt.toLowerCase().includes(q) ||
        p.tags.some((t) => t.toLowerCase().includes(q))
      );
    })
      .slice(0, 20)
      .map((p) => ({
        slug: p.slug,
        title: p.title,
        excerpt: p.excerpt,
        category: p.category,
        tags: p.tags,
        author: p.author,
        publishedAt: p.publishedAt,
      }));
    return {
      content: [{ type: "text", text: JSON.stringify(items, null, 2) }],
      structuredContent: { count: items.length, items },
    };
  },
});
