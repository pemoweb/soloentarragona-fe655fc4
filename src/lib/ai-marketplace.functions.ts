import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const Input = z.object({
  query: z.string().trim().min(3).max(500),
  ads: z
    .array(
      z.object({
        id: z.string().max(100),
        cat: z.string().max(40),
        title: z.string().max(200),
        location: z.string().max(100),
        price: z.number().nonnegative(),
        description: z.string().max(1000).optional(),
      }),
    )
    .max(200),
});

export type AiMatch = { id: string; reason: string };
export type AiSearchResult = { ok: true; matches: AiMatch[] } | { ok: false; status: number; message: string };

export const aiSearchMarketplace = createServerFn({ method: "POST" })
  .inputValidator((d) => Input.parse(d))
  .handler(async ({ data }): Promise<AiSearchResult> => {
    const apiKey = process.env["LOVABLE_API_KEY"];
    if (!apiKey) return { ok: false, status: 401, message: "La búsqueda inteligente no está configurada." };
    const { createOpenAI } = await import("@ai-sdk/openai");
    const { streamText } = await import("ai");
    const provider = createOpenAI({
      baseURL: "https://ai.gateway.lovable.dev/v1",
      apiKey,
      headers: { "Lovable-API-Key": apiKey, "X-Lovable-AIG-SDK": "vercel-ai-sdk" },
    });
    const catalog = data.ads
      .map((a) => `- id:${a.id} | ${a.cat} | ${a.location} | ${a.price}€ | ${a.title} | ${(a.description ?? "").slice(0, 300)}`)
      .join("\n");
    let status = 500;
    let message = "No se pudo completar la búsqueda. Inténtalo más tarde.";
    try {
      const result = streamText({
        model: provider.responses("openai/gpt-6-astra"),
        maxRetries: 0,
        system:
          "Eres el buscador del Marketplace de Tarragona. Dada la petición del visitante y un catálogo, elige como máximo 6 anuncios relevantes según descripción, categoría, precio y ubicación (barrios de Tarragona). Responde SOLO JSON: {\"matches\":[{\"id\":\"...\",\"reason\":\"frase breve en español\"}]} ordenado por relevancia. Usa solo ids del catálogo. Si nada encaja, matches vacío.",
        prompt: `Petición: ${data.query}\n\nCatálogo:\n${catalog}`,
        onError: ({ error }) => {
          const e = error as { statusCode?: number; responseBody?: string };
          if (e?.statusCode) status = e.statusCode;
          if (status === 402) message = "Se agotaron los créditos de IA del espacio de trabajo.";
          if (status === 429) message = "Demasiadas búsquedas ahora mismo. Prueba en unos segundos.";
        },
        providerOptions: {
          openai: {
            forceReasoning: true,
            reasoningEffort: "low",
            reasoningSummary: "auto",
            store: false,
            include: ["reasoning.encrypted_content"],
          },
        },
      });
      const text = await result.text;
      const json = text.match(/\{[\s\S]*\}/)?.[0];
      if (!json) return { ok: false, status, message };
      const parsed = JSON.parse(json) as { matches?: AiMatch[] };
      const ids = new Set(data.ads.map((a) => a.id));
      const matches = (parsed.matches ?? []).filter((m) => ids.has(m.id)).slice(0, 6);
      return { ok: true, matches };
    } catch {
      return { ok: false, status, message };
    }
  });
