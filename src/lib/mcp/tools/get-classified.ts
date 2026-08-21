import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { CLASSIFIEDS_SEED } from "@/lib/classifieds-data";

export default defineTool({
  name: "get_classified",
  title: "Get classified ad details",
  description:
    "Return the full details of a classified ad by its id. Contact information (name, phone, email) is only included when the caller is authenticated.",
  inputSchema: {
    id: z.string().trim().min(1).describe("Classified ad id, e.g. 'c1'."),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: ({ id }, ctx) => {
    const item = CLASSIFIEDS_SEED.find(
      (c) => c.id.toLowerCase() === id.toLowerCase(),
    );
    if (!item) {
      return {
        content: [{ type: "text", text: `No classified ad found with id '${id}'.` }],
        isError: true,
      };
    }

    const canSeeContact = ctx.isAuthenticated();
    const { contact, ...publicFields } = item;
    const payload = canSeeContact
      ? { ...publicFields, contact: contact ?? null, contactVisible: true }
      : {
          ...publicFields,
          contact: null,
          contactVisible: false,
          contactNote:
            "Inicia sesión (OAuth) para ver los datos de contacto de este anuncio.",
        };

    return {
      content: [{ type: "text", text: JSON.stringify(payload, null, 2) }],
      structuredContent: payload,
    };
  },
});
