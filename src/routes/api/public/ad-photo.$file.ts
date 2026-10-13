import { createFileRoute } from "@tanstack/react-router";

const TYPES: Record<string, string> = { jpg: "image/jpeg", png: "image/png", webp: "image/webp", gif: "image/gif" };

export const Route = createFileRoute("/api/public/ad-photo/$file")({
  server: {
    handlers: {
      GET: async ({ params }) => {
        const m = params.file.match(/^[a-z0-9-]{1,80}\.(jpg|png|webp|gif)$/);
        if (!m) return new Response("Not found", { status: 404 });
        const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
        const { data, error } = await supabaseAdmin.storage.from("ad-photos").download(params.file);
        if (error || !data) return new Response("Not found", { status: 404 });
        return new Response(data, {
          headers: { "Content-Type": TYPES[m[1]], "Cache-Control": "public, max-age=86400" },
        });
      },
    },
  },
});
