import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { PageShell, PageHero } from "@/components/PageShell";
import { Search, MapPin, Heart, Filter, RotateCcw, ArrowRight } from "lucide-react";
import { useState } from "react";
import { useDynamicSeo } from "@/lib/use-dynamic-seo";
import { MiniCarousel } from "@/components/MiniCarousel";
import { MARKETPLACE_ITEMS, MARKETPLACE_CATEGORIES, formatEuro } from "@/lib/marketplace-data";

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
      { title: "Marketplace de Tarragona — Compra y vende cerca de ti" },
      { name: "description", content: "Compra y vende productos de segunda mano y nuevos en Tarragona y alrededores." },
      { property: "og:type", content: "website" },
      { property: "og:title", content: "Marketplace de Tarragona — Compra y vende cerca de ti" },
      { property: "og:description", content: "Miles de productos publicados por vecinos y comercios locales de Tarragona." },
      { name: "twitter:card", content: "summary_large_image" },
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

  const filtered = MARKETPLACE_ITEMS.filter((p) => {
    if (category !== "Todo" && p.category !== category) return false;
    if (query.trim() && !p.title.toLowerCase().includes(query.trim().toLowerCase())) return false;
    return true;
  });

  return (
    <PageShell>
      <PageHero
        eyebrow="Marketplace"
        title="Compra y vende en tu barrio"
        subtitle="Miles de productos publicados por vecinos y comercios locales, sin intermediarios."
      />

      <section className="mx-auto max-w-7xl px-4 md:px-8 py-12">
        {/* Search bar */}
        <div className="flex flex-col md:flex-row gap-3 p-3 rounded-2xl bg-card border border-border shadow-card">
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
                className={`shrink-0 px-4 py-2 rounded-full text-sm font-semibold border transition ${
                  active ? "bg-foreground text-background border-foreground" : "bg-card text-muted-foreground border-border hover:border-coral hover:text-coral"
                }`}
              >
                {c}
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

        {/* Products */}
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filtered.map((p) => (
            <article
              key={p.slug}
              onClick={() => navigate({ to: "/marketplace/$slug", params: { slug: p.slug } })}
              className="group cursor-pointer rounded-2xl bg-card border border-border overflow-hidden hover:shadow-glow transition-all hover:-translate-y-1"
            >
              <div className="relative">
                <MiniCarousel images={p.gallery} alt={p.title} />
                {p.featured && (
                  <span className="absolute top-3 left-3 z-10 px-2.5 py-1 rounded-full bg-coral text-coral-foreground text-xs font-bold uppercase tracking-wider shadow-lg">
                    Destacado
                  </span>
                )}
                <button
                  aria-label="Guardar en favoritos"
                  onClick={(e) => e.stopPropagation()}
                  className="absolute top-3 right-3 z-10 grid h-9 w-9 place-items-center rounded-full bg-background/90 backdrop-blur hover:bg-coral hover:text-coral-foreground transition"
                >
                  <Heart className="h-4 w-4" />
                </button>
              </div>
              <div className="p-4">
                <div className="font-display text-2xl font-black text-coral">{formatEuro(p.price)}</div>
                <h3 className="mt-1 font-semibold leading-tight line-clamp-2">{p.title}</h3>
                <div className="mt-2 flex items-center justify-between text-xs text-muted-foreground">
                  <span className="inline-flex items-center gap-1"><MapPin className="h-3 w-3" /> {p.location}</span>
                  <Link
                    to="/marketplace/$slug"
                    params={{ slug: p.slug }}
                    onClick={(e) => e.stopPropagation()}
                    className="inline-flex items-center gap-1 font-semibold text-coral"
                  >
                    Ver detalle <ArrowRight className="h-3 w-3" />
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>
    </PageShell>
  );
}
