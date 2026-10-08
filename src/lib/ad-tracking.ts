import { supabase } from "@/integrations/supabase/client";

export type AdEventType = "view" | "call" | "whatsapp";

export function trackAdEvent(slug: string, title: string, type: AdEventType) {
  if (typeof window === "undefined") return;
  if (type === "view") {
    const key = `set_ad_viewed_${slug}`;
    try {
      if (sessionStorage.getItem(key)) return;
      sessionStorage.setItem(key, "1");
    } catch {
      /* ignore */
    }
  }
  void supabase
    .from("ad_events")
    .insert({ ad_slug: slug, ad_title: title.slice(0, 200), event_type: type })
    .then(() => {});
}
