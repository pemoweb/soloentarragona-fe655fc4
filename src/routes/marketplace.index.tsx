import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { PageShell } from "@/components/PageShell";
import { MiniCarousel } from "@/components/MiniCarousel";

import { Search, MapPin, Heart, Filter, RotateCcw, ArrowRight } from "lucide-react";
import { useState } from "react";
import { useDynamicSeo } from "@/lib/use-dynamic-seo";
import { MARKETPLACE_CATEGORIES, formatEuro, useAllMarketplaceItems } from "@/lib/marketplace-data";

const SEO_BY_CAT: Record<string, { title: string; description: string }> = {
  Todo: {
    title: "Marketplace de Tarragona — Compra y vende cerca de ti",
    description: "Compra y vende productos de segunda mano y nuevos en Tarragona y alrededores.",
  },
  Electrónica: {
    title: "Electrónica de segunda mano en Tarragona — Marketplace",
    description: "Móviles, ordenadores, cámaras y consolas de segunda mano en Tarragona. Compra y vende entre vecinos.",
  },
  Hogar: {
    title: "Muebles y artículos para el hogar en Tarragona",
    description: "Sofás, mesas, decoración y electrodomésticos de segunda mano en Tarragona. Precios entre vecinos.",
  },
  Moda: {
    title: "Moda y ropa de segunda mano en Tarragona",
    description: "Ropa, calzado y accesorios de segunda mano en Tarragona. Compra y vende sin intermediarios.",
  },
  Deporte: {
    title: "Material deportivo de segunda mano en Tarragona",
    description: "Bicis, tablas, equipación y material deportivo de segunda mano en Tarragona.",
  },
  Vehículos: {
    title: "Vehículos de segunda mano en Tarragona",
    description: "Coches, motos y bicis de segunda mano en Tarragona. Trato directo entre particulares.",
  },
  Niños: {
    title: "Artículos para niños de segunda mano en Tarragona",
    description: "Carritos, ropa, juguetes y mobiliario infantil de segunda mano en Tarragona.",
  },
  Coleccionismo: {
    title: "Coleccionismo y antigüedades en Tarragona",
    description: "Cómics, vinilos, sellos y piezas únicas de coleccionismo en Tarragona.",
  },
};

export const Route = createFileRoute("/marketplace/")({
  head: () => ({
    meta: [
      { title: "Segunda mano en Tarragona — Marketplace local para comprar y vender" },
      {
        name: "description",
        content:
          "Compra y vende de segunda mano en Tarragona: electrónica, muebles, moda, deporte y vehículos. Anuncios de vecinos y comercios locales, sin intermediarios.",
      },
      {
        name: "keywords",
        content:
          "segunda mano Tarragona, marketplace Tarragona, comprar y vender Tarragona, anuncios Tarragona, muebles Tarragona, móviles Tarragona",
      },
      { property: "og:type", content: "website" },
      { property: "og:title", content: "Segunda mano en Tarragona — Marketplace local" },
      { property: "og:description", content: "Productos de segunda mano publicados por vecinos y comercios locales de Tarragona." },
      { property: "og:url", content: "https://soloentarragona.lovable.app/marketplace" },
      { property: "og:locale", content: "es_ES" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "geo.placename", content: "Tarragona, Catalunya, España" },
      { name: "geo.region", content: "ES-T" },
    ],
    links: [{ rel: "canonical", href: "https://soloentarragona.lovable.app/marketplace" }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          name: "Marketplace de segunda mano en Tarragona",
          description:
            "Anuncios de compraventa de segunda mano en Tarragona: electrónica, hogar, moda, deporte y vehículos.",
          url: "https://soloentarragona.lovable.app/marketplace",
          inLanguage: "es-ES",
          about: { "@type": "City", name: "Tarragona" },
        }),
      },
    ],
  }),
  component: MarketplacePage,
});

function MarketplacePage() {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<string>("Todo");

  const seo = SEO_BY_CAT[category] ?? SEO_BY_CAT.Todo;
  useDynamicSeo({ title: seo.title, description: seo.description });

  const allItems = useAllMarketplaceItems();

  const filtered = allItems.filter((p) => {
    if (category !== "Todo" && p.category !== category) return false;
    if (query.trim() && !p.title.toLowerCase().includes(query.trim().toLowerCase())) return false;
    return true;
  });

  const featured = filtered[0];
  const rest = filtered.slice(1);

  const countFor = (c: string) =>
    c === "Todo" ? allItems.length : allItems.filter((i) => i.category === c).length;


  return (
    <PageShell>
      {/* Editorial hero */}
      <section className="relative overflow-hidden bg-gradient-sea text-primary-foreground">
        <div className="absolute inset-0 opacity-20 [background-image:radial-gradient(circle_at_20%_20%,white,transparent_45%),radial-gradient(circle_at_80%_10%,white,transparent_40%)]" />
        <div className="relative mx-auto max-w-7xl px-4 md:px-8 py-16 md:py-24">
          <p className="text-xs font-bold uppercase tracking-[0.25em] opacity-80">Marketplace local</p>
          <h1 className="mt-4 font-display text-4xl md:text-6xl font-black leading-[1.05] max-w-3xl">
            Compra y vende<br />en tu barrio
          </h1>
          <p className="mt-5 max-w-xl text-base md:text-lg opacity-90">
            Objetos con historia, precios de vecino y trato directo. Sin intermediarios, sin envíos: solo Tarragona.
          </p>
          <div className="mt-8 flex flex-wrap gap-6 text-sm">
            <div>
              <div className="font-display text-3xl font-black">{allItems.length}</div>
              <div className="opacity-80">anuncios activos</div>
            </div>
            <div>
              <div className="font-display text-3xl font-black">{MARKETPLACE_CATEGORIES.length - 1}</div>
              <div className="opacity-80">categorías</div>
            </div>
            <div>
              <div className="font-display text-3xl font-black">24h</div>
              <div className="opacity-80">media de respuesta</div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 md:px-8 py-12">
        {/* Search bar */}
        <div className="flex flex-col md:flex-row gap-3 p-3 rounded-2xl bg-card border border-border shadow-card -mt-20 relative z-10">
          <div className="flex-1 flex items-center gap-2 px-3">
            <Search className="h-5 w-5 text-muted-foreground" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="¿Qué estás buscando?"
              className="flex-1 bg-transparent py-3 focus:outline-none"
            />
          </div>
          <div className="flex gap-2">
            <button className="px-4 py-3 rounded-xl border border-border font-medium text-sm inline-flex items-center gap-2 hover:border-coral">
              <MapPin className="h-4 w-4" /> Tarragona
            </button>
            <button className="px-4 py-3 rounded-xl border border-border font-medium text-sm inline-flex items-center gap-2 hover:border-coral">
              <Filter className="h-4 w-4" /> Filtros
            </button>
            <button className="px-6 py-3 rounded-xl bg-coral text-coral-foreground font-semibold">Buscar</button>
          </div>
        </div>

        {/* Categories */}
        <div className="mt-8 flex gap-2 overflow-x-auto pb-2">
          {MARKETPLACE_CATEGORIES.map((c) => {
            const active = c === category;
            return (
              <button
                key={c}
                onClick={() => setCategory(c)}
                className={`shrink-0 px-4 py-2 rounded-full text-sm font-semibold border transition inline-flex items-center gap-2 ${
                  active ? "bg-foreground text-background border-foreground" : "bg-card text-muted-foreground border-border hover:border-coral hover:text-coral"
                }`}
              >
                {c}
                <span className={`text-[11px] font-bold ${active ? "opacity-70" : "opacity-60"}`}>{countFor(c)}</span>
              </button>
            );
          })}
          {category !== "Todo" && (
            <button
              onClick={() => { setCategory("Todo"); setQuery(""); }}
              className="shrink-0 px-3 py-2 rounded-full text-sm font-semibold border border-border text-muted-foreground hover:border-coral hover:text-coral inline-flex items-center gap-1 transition"
            >
              <RotateCcw className="h-3.5 w-3.5" /> Limpiar filtros
            </button>
          )}
        </div>

        {filtered.length === 0 && (
          <div className="mt-10 rounded-3xl border border-dashed border-border p-12 text-center text-muted-foreground">
            No hay productos con estos filtros.
          </div>
        )}

        {/* Featured item */}
        {featured && (
          <article
            onClick={() => navigate({ to: "/marketplace/$slug", params: { slug: featured.slug } })}
            className="group mt-10 grid cursor-pointer overflow-hidden rounded-3xl border border-border bg-card shadow-card transition hover:shadow-glow lg:grid-cols-2"
          >
            <div className="relative">
              <MiniCarousel images={featured.gallery} alt={featured.title} className="aspect-[4/3] lg:aspect-square" />
              <span className="pointer-events-none absolute top-4 left-4 px-3 py-1 rounded-full bg-coral text-coral-foreground text-xs font-bold uppercase tracking-wider shadow-lg">
                Destacado
              </span>
            </div>

            <div className="p-8 md:p-10 flex flex-col justify-center">
              <span className="text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground">{featured.category}</span>
              <h2 className="mt-3 font-display text-3xl md:text-4xl font-black leading-tight">{featured.title}</h2>
              <p className="mt-4 text-muted-foreground line-clamp-3">{featured.description}</p>
              <div className="mt-6 flex items-center gap-4">
                <span className="font-display text-4xl font-black text-coral">{formatEuro(featured.price)}</span>
                <span className="inline-flex items-center gap-1 text-sm text-muted-foreground">
                  <MapPin className="h-4 w-4" /> {featured.location}
                </span>
              </div>
              <Link
                to="/marketplace/$slug"
                params={{ slug: featured.slug }}
                onClick={(e) => e.stopPropagation()}
                className="mt-8 inline-flex w-fit items-center gap-2 rounded-full bg-foreground px-6 py-3 text-sm font-semibold text-background transition hover:bg-coral hover:text-coral-foreground"
              >
                Ver anuncio <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </article>
        )}

        {/* Products */}
        <div className="mt-6 flex flex-col gap-4 sm:grid sm:gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {rest.map((p) => (
            <article
              key={p.slug}
              onClick={() => navigate({ to: "/marketplace/$slug", params: { slug: p.slug } })}
              className="group flex cursor-pointer rounded-2xl bg-card border border-border overflow-hidden hover:shadow-glow transition-all hover:-translate-y-1 sm:block"
            >
              <div className="relative w-32 shrink-0 sm:w-auto">
                <MiniCarousel images={p.gallery} alt={p.title} className="aspect-[4/3]" />
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-foreground/70 via-transparent to-transparent opacity-80" />
                <span className="pointer-events-none absolute bottom-2 left-2 font-display text-lg sm:bottom-3 sm:left-3 sm:text-2xl font-black text-background drop-shadow">
                  {formatEuro(p.price)}
                </span>
                {p.featured && (
                  <span className="pointer-events-none absolute top-2 left-2 sm:top-3 sm:left-3 px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full bg-coral text-coral-foreground text-[10px] sm:text-xs font-bold uppercase tracking-wider shadow-lg">
                    Destacado
                  </span>
                )}
                <button
                  aria-label="Guardar en favoritos"
                  onClick={(e) => e.stopPropagation()}
                  className="absolute top-2 right-2 sm:top-3 sm:right-3 z-10 hidden sm:grid h-9 w-9 place-items-center rounded-full bg-background/90 backdrop-blur hover:bg-coral hover:text-coral-foreground transition"
                >
                  <Heart className="h-4 w-4" />
                </button>
              </div>

              <div className="min-w-0 flex-1 p-4 flex flex-col justify-center sm:block">
                <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-muted-foreground">{p.category}</span>
                <h3 className="mt-1 font-semibold leading-tight line-clamp-2">{p.title}</h3>
                <div className="mt-3 flex items-center justify-between gap-2 text-xs text-muted-foreground">
                  <span className="inline-flex min-w-0 items-center gap-1"><MapPin className="h-3 w-3 shrink-0" /> <span className="truncate">{p.location}</span></span>
                  <span className="inline-flex shrink-0 items-center gap-1 font-semibold text-coral">
                    Ver detalle <ArrowRight className="h-3 w-3" />
                  </span>
                </div>
              </div>
            </article>
          ))}
        </div>

      </section>
    </PageShell>
  );
}
