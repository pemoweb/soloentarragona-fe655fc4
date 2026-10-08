import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, MapPin, Heart, Share2, ShieldCheck, Clock, Star, Phone, AlertTriangle, Check, Tag } from "lucide-react";
import { useEffect, useState } from "react";
import { trackAdEvent } from "@/lib/ad-tracking";

import { PageShell } from "@/components/PageShell";
import { MiniCarousel } from "@/components/MiniCarousel";
import { MARKETPLACE_ITEMS, getMarketplaceItem, formatEuro, type MarketplaceItem } from "@/lib/marketplace-data";
import { REPORT_REASONS, submitReport } from "@/lib/reports";

export const Route = createFileRoute("/marketplace/$slug")({
  loader: ({ params }): MarketplaceItem | null => getMarketplaceItem(params.slug) ?? null,

  head: ({ params, loaderData }) => {
    if (!loaderData) {
      return { meta: [{ title: "Anuncio no encontrado — Marketplace Tarragona" }, { name: "robots", content: "noindex" }] };
    }
    const seo = loaderData.seo ?? {};
    const title = seo.title?.trim()
      ? seo.title.trim()
      : `${loaderData.title} — ${formatEuro(loaderData.price)} en Tarragona`;
    const description = (seo.description?.trim() || loaderData.description).slice(0, 155);
    const url = `https://soloentarragona.lovable.app/marketplace/${params.slug}`;
    const shareImage =
      seo.image?.trim().startsWith("https://") ? seo.image.trim() : undefined;
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:type", content: "product" },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:url", content: url },
        { property: "product:price:amount", content: String(loaderData.price) },
        { property: "product:price:currency", content: "EUR" },
        { name: "twitter:card", content: "summary_large_image" },
        ...(shareImage
          ? [
              { property: "og:image", content: shareImage },
              { name: "twitter:image", content: shareImage },
            ]
          : []),
      ],
      links: [{ rel: "canonical", href: url }],
      scripts: [
        {
          type: "application/ld+json",
          children: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Product",
            name: loaderData.title,
            description: loaderData.description,
            category: loaderData.category,
            itemCondition: "https://schema.org/UsedCondition",
            offers: {
              "@type": "Offer",
              price: loaderData.price,
              priceCurrency: "EUR",
              availability: "https://schema.org/InStock",
              url,
              areaServed: loaderData.location,
              seller: { "@type": "Person", name: loaderData.seller.name },
            },
          }),
        },
      ],
    };
  },

  notFoundComponent: MarketplaceNotFound,
  component: MarketplaceDetail,
});

function MarketplaceNotFound() {
  return (
    <PageShell>
      <div className="mx-auto max-w-3xl px-4 py-24 text-center">
        <h1 className="font-display text-5xl font-black">404</h1>
        <p className="mt-4 text-muted-foreground">Este anuncio no existe o ya se ha vendido.</p>
        <Link to="/marketplace" className="inline-flex items-center gap-2 mt-8 px-6 py-3 rounded-full bg-coral text-coral-foreground font-semibold">
          <ArrowLeft className="h-4 w-4" /> Volver al marketplace
        </Link>
      </div>
    </PageShell>
  );
}

function MarketplaceDetail() {
  const loaded = Route.useLoaderData() as MarketplaceItem | null;
  const { slug } = Route.useParams();
  const [item, setItem] = useState<MarketplaceItem | null>(loaded);
  const [showPhone, setShowPhone] = useState(false);
  const [reporting, setReporting] = useState(false);
  const [reason, setReason] = useState<string>(REPORT_REASONS[0]);
  const [details, setDetails] = useState("");
  const [reported, setReported] = useState(false);

  useEffect(() => {
    setItem(loaded ?? getMarketplaceItem(slug) ?? null);
  }, [loaded, slug]);

  useEffect(() => {
    if (item) trackAdEvent(item.slug, item.title, "view");
  }, [item?.slug]); // eslint-disable-line react-hooks/exhaustive-deps

  if (!item) return <MarketplaceNotFound />;

  const sameCategory = MARKETPLACE_ITEMS.filter((p) => p.slug !== item.slug && p.category === item.category);
  const others = MARKETPLACE_ITEMS.filter((p) => p.slug !== item.slug && p.category !== item.category);
  const related = [...sameCategory, ...others].slice(0, 3);

  const discount = item.oldPrice ? Math.round((1 - item.price / item.oldPrice) * 100) : 0;


  const handleShare = () => {
    if (typeof navigator === "undefined") return;
    if (navigator.share) {
      navigator.share({ title: item.title, text: item.description, url: window.location.href }).catch(() => {});
    } else {
      navigator.clipboard?.writeText(window.location.href);
    }
  };

  const handleReport = () => {
    submitReport({ target: "marketplace", itemId: item.slug, itemTitle: item.title, reason, details: details.trim() || undefined });
    setReported(true);
  };

  return (
    <PageShell>
      <article className="mx-auto max-w-7xl px-4 md:px-8 py-10 md:py-14">
        <Link to="/marketplace" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-coral">
          <ArrowLeft className="h-4 w-4" /> Volver al marketplace
        </Link>

        <div className="mt-6 grid gap-10 lg:grid-cols-2">
          <div>
            <div className="relative">
              <MiniCarousel images={item.gallery} alt={item.title} className="aspect-square" rounded="rounded-3xl border border-border" showThumbs />
              {item.featured && (
                <span className="absolute top-4 left-4 z-10 px-3 py-1.5 rounded-full bg-coral text-coral-foreground text-xs font-bold uppercase tracking-wider">
                  Destacado
                </span>
              )}
              {discount > 0 && (
                <span className="absolute top-4 right-4 z-10 inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-foreground text-background text-xs font-bold uppercase tracking-wider">
                  <Tag className="h-3 w-3" /> -{discount}%
                </span>
              )}
            </div>
          </div>

          <div>
            <div className="text-xs font-bold uppercase tracking-widest text-coral">{item.category}</div>
            <h1 className="mt-2 font-display text-3xl md:text-5xl font-black leading-[1.05]">{item.title}</h1>
            <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-muted-foreground">
              <span className="inline-flex items-center gap-1.5"><MapPin className="h-4 w-4" /> {item.location}</span>
              <span className="inline-flex items-center gap-1.5"><Clock className="h-4 w-4" /> {item.publishedAgo}</span>
              <span className="inline-flex items-center gap-1.5"><ShieldCheck className="h-4 w-4" /> {item.condition}</span>
            </div>

            <div className="mt-6 flex items-end gap-3">
              <span className="font-display text-4xl font-black text-coral">{formatEuro(item.price)}</span>
              {item.oldPrice && <span className="text-lg line-through text-muted-foreground mb-1">{formatEuro(item.oldPrice)}</span>}
            </div>

            <p className="mt-6 text-base leading-relaxed">{item.description}</p>

            <div className="mt-8 flex flex-wrap gap-3">
              <button
                onClick={() => { if (!showPhone) trackAdEvent(item.slug, item.title, "call"); setShowPhone(true); }}
                className="flex-1 min-w-[200px] inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full bg-coral text-coral-foreground font-bold hover:opacity-90 transition"
              >
                <Phone className="h-5 w-5" /> {showPhone ? item.seller.phone : "Contactar al vendedor"}
              </button>
              <button
                aria-label="Guardar en favoritos"
                className="inline-flex items-center gap-2 px-4 py-3.5 rounded-full bg-card border border-border font-semibold hover:border-coral hover:text-coral transition"
              >
                <Heart className="h-4 w-4" />
              </button>
              <button
                onClick={handleShare}
                aria-label="Compartir anuncio"
                className="inline-flex items-center gap-2 px-4 py-3.5 rounded-full bg-card border border-border font-semibold hover:border-coral hover:text-coral transition"
              >
                <Share2 className="h-4 w-4" />
              </button>
            </div>

            {/* Seller */}
            <div className="mt-8 rounded-2xl border border-border bg-card p-5">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <div className="font-display text-lg font-bold">{item.seller.name}</div>
                  <div className="text-sm text-muted-foreground">Vendiendo desde {item.seller.since}</div>
                </div>
                <div className="inline-flex items-center gap-1 text-sm font-semibold">
                  <Star className="h-4 w-4 fill-coral text-coral" /> {item.seller.rating.toFixed(1)}
                </div>
              </div>
            </div>

            {/* Report */}
            <div className="mt-6 rounded-2xl border border-border p-5">
              {reported ? (
                <div className="text-center py-2">
                  <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 mb-3">
                    <Check className="h-5 w-5" />
                  </div>
                  <p className="font-semibold">Denuncia enviada</p>
                  <p className="text-sm text-muted-foreground mt-1">Nuestro equipo de moderación la revisará.</p>
                </div>
              ) : reporting ? (
                <div>
                  <p className="font-semibold text-sm">Denunciar este anuncio</p>
                  <select
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    className="mt-3 w-full px-3 py-2.5 rounded-xl border border-border bg-background text-sm"
                  >
                    {REPORT_REASONS.map((r) => (
                      <option key={r} value={r}>{r}</option>
                    ))}
                  </select>
                  <textarea
                    value={details}
                    onChange={(e) => setDetails(e.target.value)}
                    placeholder="Detalles adicionales (opcional)"
                    className="mt-3 w-full min-h-[90px] p-3 rounded-xl border border-border bg-background text-sm resize-none focus:outline-none focus:ring-2 focus:ring-coral/40"
                  />
                  <div className="mt-3 flex justify-end gap-2">
                    <button onClick={() => setReporting(false)} className="px-4 py-2 rounded-full text-sm font-semibold hover:bg-secondary transition">
                      Cancelar
                    </button>
                    <button onClick={handleReport} className="px-4 py-2 rounded-full bg-destructive text-destructive-foreground text-sm font-semibold hover:opacity-90 transition">
                      Enviar denuncia
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => setReporting(true)}
                  className="inline-flex items-center gap-2 text-xs font-medium text-muted-foreground hover:text-destructive transition"
                >
                  <AlertTriangle className="h-3.5 w-3.5" /> Denunciar anuncio
                </button>
              )}
            </div>
          </div>
        </div>

        {related.length > 0 && (
          <section className="mt-20">
            <h2 className="font-display text-3xl font-black mb-8">Anuncios similares</h2>
            <div className="flex flex-col gap-4 lg:grid lg:grid-cols-3 lg:gap-6">
              {related.map((p) => (
                <article key={p.slug} className="rounded-2xl bg-card border border-border overflow-hidden hover:shadow-card transition-all hover:-translate-y-1 flex lg:block">
                  <div className="w-32 shrink-0 sm:w-44 lg:w-auto">
                    <MiniCarousel images={p.gallery} alt={p.title} />
                  </div>
                  <div className="p-4 sm:p-5 flex-1 flex flex-col justify-center lg:block">
                    <div className="text-xs font-bold uppercase tracking-wider text-coral">{p.category}</div>
                    <h3 className="mt-1 font-display text-base sm:text-lg font-bold line-clamp-2">{p.title}</h3>
                    <div className="mt-2 flex items-center justify-between gap-2">
                      <span className="font-display text-base sm:text-lg font-black">{formatEuro(p.price)}</span>
                      <Link to="/marketplace/$slug" params={{ slug: p.slug }} className="text-sm font-semibold text-coral hover:underline whitespace-nowrap">
                        Ver detalle
                      </Link>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </section>
        )}
      </article>
    </PageShell>
  );
}
