import { createServerFn } from "@tanstack/react-start";
import { createClient } from "@supabase/supabase-js";
import { z } from "zod";
import type { Database } from "@/integrations/supabase/types";
import type { MarketplaceItem } from "./marketplace-data";
import type { Classified } from "./classifieds-data";

const ADMIN_PIN = "1234";
const PHOTO_PREFIX = "/api/public/ad-photo/";

type MpRow = Database["public"]["Tables"]["marketplace_ads"]["Row"];
type ClRow = Pick<
  Database["public"]["Tables"]["classified_ads"]["Row"],
  "id" | "category" | "title" | "location" | "description" | "image_url" | "days_left" | "created_at"
>;
const CL_PUBLIC_COLS = "id, category, title, location, description, image_url, days_left, created_at";

function ago(iso: string) {
  const mins = Math.max(1, Math.round((Date.now() - new Date(iso).getTime()) / 60000));
  if (mins < 60) return "hace unos minutos";
  const h = Math.round(mins / 60);
  if (h < 24) return `hace ${h} h`;
  const d = Math.round(h / 24);
  return d === 1 ? "hace 1 día" : `hace ${d} días`;
}

function toMarketplace(r: MpRow): MarketplaceItem {
  return {
    slug: r.slug,
    title: r.title,
    price: Number(r.price),
    location: r.location,
    category: r.category,
    condition: r.condition,
    publishedAgo: ago(r.created_at),
    description: r.description,
    gallery: r.image_url ? [r.image_url] : [],
    seller: {
      name: r.seller_name || "Solo en Tarragona",
      since: String(new Date(r.created_at).getFullYear()),
      rating: 5,
      phone: r.seller_phone || "+34 977 000 000",
    },
    seo:
      r.seo_title || r.seo_description || r.seo_image
        ? { title: r.seo_title ?? undefined, description: r.seo_description ?? undefined, image: r.seo_image ?? undefined }
        : undefined,
  };
}

function toClassified(r: ClRow): Classified {
  const elapsed = Math.floor((Date.now() - new Date(r.created_at).getTime()) / 86400000);
  const left = Math.max(0, r.days_left - elapsed);
  return {
    id: r.id,
    cat: r.category as Classified["cat"],
    title: r.title,
    location: r.location,
    description: r.description ?? undefined,
    img: r.image_url ?? undefined,
    daysLeft: left,
    time: left === 1 ? "1 día restante" : `${left} días restantes`,
  };
}

function publicClient() {
  const key = process.env["SUPABASE_PUBLISHABLE_KEY"]!;
  return createClient<Database>(process.env["SUPABASE_URL"]!, key, {
    auth: { storage: undefined, persistSession: false, autoRefreshToken: false },
    global: {
      fetch: (input, init) => {
        const h = new Headers(init?.headers);
        if (key.startsWith("sb_") && h.get("Authorization") === `Bearer ${key}`) h.delete("Authorization");
        h.set("apikey", key);
        return fetch(input, { ...init, headers: h });
      },
    },
  });
}

export const listAdminAds = createServerFn({ method: "GET" }).handler(async () => {
  const sb = publicClient();
  const [mp, cl] = await Promise.all([
    sb.from("marketplace_ads").select("*").order("created_at", { ascending: false }).limit(500),
    sb.from("classified_ads").select(CL_PUBLIC_COLS).order("created_at", { ascending: false }).limit(500),
  ]);
  return {
    marketplace: (mp.data ?? []).map(toMarketplace),
    classifieds: ((cl.data ?? []) as ClRow[]).map(toClassified).filter((c) => c.daysLeft > 0),
  };
});

export const getAdminMarketplaceAd = createServerFn({ method: "GET" })
  .inputValidator((d) => z.object({ slug: z.string().max(120) }).parse(d))
  .handler(async ({ data }) => {
    const { data: row } = await publicClient().from("marketplace_ads").select("*").eq("slug", data.slug).maybeSingle();
    return row ? toMarketplace(row) : null;
  });

export const getAdminClassifiedAd = createServerFn({ method: "GET" })
  .inputValidator((d) => z.object({ id: z.string().max(120) }).parse(d))
  .handler(async ({ data }) => {
    const { data: row } = await publicClient().from("classified_ads").select(CL_PUBLIC_COLS).eq("id", data.id).maybeSingle();
    return row ? toClassified(row as ClRow) : null;
  });

function slugify(v: string) {
  return v.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 50);
}

const publishSchema = z.object({
  pin: z.string(),
  kind: z.enum(["marketplace", "classified"]),
  title: z.string().trim().min(5).max(120),
  description: z.string().trim().min(20).max(4000),
  location: z.string().trim().min(1).max(80),
  category: z.string().trim().min(1).max(40),
  price: z.number().min(0).max(10_000_000).optional(),
  condition: z.string().max(40).optional(),
  sellerName: z.string().max(80).optional(),
  sellerPhone: z.string().max(30).optional(),
  contactEmail: z.string().max(120).optional(),
  daysLeft: z.number().int().min(1).max(60).optional(),
  img: z.string().max(5_000_000).optional(),
  seoTitle: z.string().max(70).optional(),
  seoDescription: z.string().max(170).optional(),
  seoImage: z.string().max(500).optional(),
});

export const publishAdminAd = createServerFn({ method: "POST" })
  .inputValidator((d) => publishSchema.parse(d))
  .handler(async ({ data }) => {
    if (data.pin !== ADMIN_PIN) throw new Error("PIN incorrecto");
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const suffix = Math.random().toString(36).slice(2, 7);
    const id = data.kind === "marketplace" ? `${slugify(data.title) || "anuncio"}-${suffix}` : `a${Date.now().toString(36)}${suffix}`;

    let imageUrl: string | null = null;
    const img = data.img?.trim();
    if (img?.startsWith("data:image/")) {
      const m = img.match(/^data:(image\/(jpeg|png|webp|gif));base64,(.+)$/);
      if (!m) throw new Error("Formato de foto no válido");
      const ext = m[2] === "jpeg" ? "jpg" : m[2];
      const bytes = Uint8Array.from(atob(m[3]), (c) => c.charCodeAt(0));
      const file = `${id}.${ext}`;
      const { error } = await supabaseAdmin.storage.from("ad-photos").upload(file, bytes, { contentType: m[1], upsert: true });
      if (error) throw new Error("No se pudo subir la foto");
      imageUrl = `${PHOTO_PREFIX}${file}`;
    } else if (img?.startsWith("https://")) {
      imageUrl = img;
    }

    if (data.kind === "marketplace") {
      const { error } = await supabaseAdmin.from("marketplace_ads").insert({
        slug: id,
        title: data.title,
        price: data.price ?? 0,
        location: data.location,
        category: data.category,
        condition: data.condition ?? "",
        description: data.description,
        image_url: imageUrl,
        seller_name: data.sellerName ?? "",
        seller_phone: data.sellerPhone ?? "",
        seo_title: data.seoTitle?.trim() || null,
        seo_description: data.seoDescription?.trim() || null,
        seo_image: data.seoImage?.trim().startsWith("https://") ? data.seoImage.trim() : imageUrl,
      });
      if (error) throw new Error(error.message);
    } else {
      const { error } = await supabaseAdmin.from("classified_ads").insert({
        id,
        category: data.category,
        title: data.title,
        location: data.location,
        description: data.description,
        image_url: imageUrl,
        days_left: data.daysLeft ?? 7,
        contact_name: data.sellerName?.trim() || null,
        contact_phone: data.sellerPhone?.trim() || null,
        contact_email: data.contactEmail?.trim() || null,
      });
      if (error) throw new Error(error.message);
    }
    return { id };
  });
