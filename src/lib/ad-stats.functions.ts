import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

export type AdStat = { slug: string; title: string; views: number; calls: number; whatsapp: number };

export const getAdStats = createServerFn({ method: "POST" })
  .inputValidator((d) => z.object({ pin: z.string() }).parse(d))
  .handler(async ({ data }): Promise<AdStat[]> => {
    if (data.pin !== "1234") throw new Error("PIN incorrecto");
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: rows, error } = await supabaseAdmin
      .from("ad_events")
      .select("ad_slug, ad_title, event_type")
      .order("created_at", { ascending: false })
      .limit(20000);
    if (error) throw new Error(error.message);
    const map = new Map<string, AdStat>();
    for (const r of rows ?? []) {
      const s = map.get(r.ad_slug) ?? { slug: r.ad_slug, title: r.ad_title, views: 0, calls: 0, whatsapp: 0 };
      if (r.event_type === "view") s.views++;
      else if (r.event_type === "call") s.calls++;
      else if (r.event_type === "whatsapp") s.whatsapp++;
      if (!s.title) s.title = r.ad_title;
      map.set(r.ad_slug, s);
    }
    return [...map.values()].sort((a, b) => b.views - a.views);
  });
