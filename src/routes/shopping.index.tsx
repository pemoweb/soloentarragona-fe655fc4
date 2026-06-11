import { createFileRoute, Link } from "@tanstack/react-router";
import { PageShell } from "@/components/PageShell";
import { MapPin, Phone, Clock, Truck, ShieldCheck, Sparkles, ArrowRight, RotateCcw, Tag } from "lucide-react";
import { useMemo, useState } from "react";
import { useDynamicSeo } from "@/lib/use-dynamic-seo";
import { PRODUCTS, PRODUCT_CATEGORIES, STORE, formatPrice } from "@/lib/shopping-data";

export const Route = createFileRoute("/shopping/")({
  head: () => ({
    meta: [
      { title: `${STORE.name} — Tienda oficial Solo en Tarragona` },
      { name: "description", content: STORE.description.slice(0, 155) },
      { property: "og:title", content: STORE.name },
      { property: "og:description", content: STORE.description },
    ],
  }),
  component: ShoppingPage,
});

const CATEGORY_SEO: Record<string, { title: string; description: string }> = {
  Todos: {
    title: `${STORE.name} — Tienda oficial Solo en Tarragona`,
    description: STORE.description,
  },
  Gastronomía: {
    title: "Productos gastronómicos del Camp de Tarragona",
    description: "AOVE, miel del Montsant, conservas y cestas gourmet con producto local de Tarragona.",
  },
  "Vinos & Cavas": {
    title: "Vinos, cavas y vermuts de Tarragona",
    description: "Selección de vinos DOQ Priorat, DO Tarragona, cavas del Penedès y vermut artesano.",
  },
  Artesanía: {
    title: "Artesanía local del Camp de Tarragona",
    description: "Cerámica, vidrio y piezas únicas de talleres artesanos del Camp de Tarragona.",
  },
  Hogar: {
    title: "Decoración y aromas para el hogar — Solo en Tarragona",
    description: "Velas, textiles y piezas para el hogar inspiradas en el Mediterráneo.",
  },
  Moda: {
    title: "Moda y accesorios Solo en Tarragona",
    description: "Camisetas, totes y accesorios con diseño local y producción sostenible.",
  },
};

function ShoppingPage() {
  const [category, setCategory] = useState<string>("Todos");
  const [sort, setSort] = useState<"relevancia" | "precio-asc" | "precio-desc">("relevancia");

  const products = useMemo(() => {
    const filtered = category === "Todos" ? PRODUCTS : PRODUCTS.filter((p) => p.category === category);
    if (sort === "precio-asc") return [...filtered].sort((a, b) => a.price - b.price);
    if (sort === "precio-desc") return [...filtered].sort((a, b) => b.price - a.price);
    return filtered;
  }, [category, sort]);

  const seo = CATEGORY_SEO[category] ?? CATEGORY_SEO.Todos;
  useDynamicSeo({ title: seo.title, description: seo.description });

  const featured = PRODUCTS.find((p) => p.badge === "Best seller") ?? PRODUCTS[0];

  return (
    <PageShell>
      {/* Storefront hero */}
      <section className="relative overflow-hidden border-b border-border">
        <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary to-coral/40" />
        <div className="relative mx-auto max-w-7xl px-4 md:px-8 py-16 md:py-24 grid lg:grid-cols-2 gap-10 items-center text-primary-foreground">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary-foreground/15 border border-primary-foreground/20 text-xs font-bold uppercase tracking-wider">
              <Sparkles className="h-3.5 w-3.5 text-coral" /> Tienda oficial
            </div>
            <h1 className="mt-5 font-display text-4xl md:text-6xl font-black leading-[1.05]">{STORE.name}</h1>
            <p className="mt-4 text-lg md:text-xl opacity-90 max-w-xl">{STORE.tagline}. {STORE.description}</p>
            <div className="mt-8 flex flex-wrap gap-x-6 gap-y-3 text-sm opacity-90">
              <span className="inline-flex items-center gap-2"><MapPin className="h-4 w-4" /> {STORE.address}</span>
              <a href={`tel:${STORE.phone.replace(/\s/g, "")}`} className="inline-flex items-center gap-2 hover:text-coral"><Phone className="h-4 w-4" /> {STORE.phone}</a>
              <span className="inline-flex items-center gap-2"><Clock className="h-4 w-4" /> {STORE.hours}</span>
            </div>
            <div className="mt-8 flex flex-wrap gap-3">
              <a href="#catalogo" className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-coral text-coral-foreground font-semibold hover:opacity-90 transition">
                Ver catálogo <ArrowRight className="h-4 w-4" />
              </a>
              <Link to="/shopping/$slug" params={{ slug: featured.slug }} className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-primary-foreground/10 border border-primary-foreground/25 font-semibold hover:bg-primary-foreground/20 transition">
                Producto destacado
              </Link>
            </div>
          </div>
          <div className="relative">
            <div className="relative overflow-hidden rounded-3xl aspect-[4/5] shadow-2xl">
              <img src={featured.img} alt={featured.name} className="absolute inset-0 h-full w-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
              <div className="absolute top-4 left-4 inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-coral text-coral-foreground text-xs font-bold uppercase tracking-wider">
                <Tag className="h-3 w-3" /> {featured.badge ?? "Destacado"}
              </div>
              <div className="absolute bottom-0 p-6 text-white">
                <div className="text-xs opacity-80 uppercase tracking-wider">{featured.category}</div>
                <h3 className="mt-1 font-display text-2xl font-bold">{featured.name}</h3>
                <div className="mt-2 flex items-end gap-2">
                  <span className="text-coral font-bold text-2xl">{formatPrice(featured.price)}</span>
                  {featured.oldPrice && <span className="text-sm line-through opacity-70">{formatPrice(featured.oldPrice)}</span>}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust bar */}
      <section className="border-b border-border bg-secondary/40">
        <div className="mx-auto max-w-7xl px-4 md:px-8 py-6 grid gap-4 sm:grid-cols-3 text-sm">
          <div className="inline-flex items-center gap-3"><Truck className="h-5 w-5 text-coral" /> Envío gratis desde {formatPrice(STORE.freeShippingThreshold)}</div>
          <div className="inline-flex items-center gap-3"><ShieldCheck className="h-5 w-5 text-coral" /> Pago seguro · Devoluciones 14 días</div>
          <div className="inline-flex items-center gap-3"><Sparkles className="h-5 w-5 text-coral" /> 100% producto local del Camp de Tarragona</div>
        </div>
      </section>

      {/* Catalogue */}
      <section id="catalogo" className="mx-auto max-w-7xl px-4 md:px-8 py-14">
        <div className="flex flex-wrap items-end justify-between gap-4 mb-6">
          <div>
            <p className="text-coral text-sm font-bold uppercase tracking-widest">Catálogo</p>
            <h2 className="mt-2 font-display text-3xl md:text-4xl font-black">Nuestros productos</h2>
          </div>
          <label className="inline-flex items-center gap-2 text-sm">
            <span className="text-muted-foreground">Ordenar:</span>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as typeof sort)}
              className="px-3 py-2 rounded-full bg-card border border-border text-sm font-semibold"
            >
              <option value="relevancia">Relevancia</option>
              <option value="precio-asc">Precio: de menor a mayor</option>
              <option value="precio-desc">Precio: de mayor a menor</option>
            </select>
          </label>
        </div>

        <div className="flex gap-2 overflow-x-auto pb-2">
          {PRODUCT_CATEGORIES.map((c) => {
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
          {category !== "Todos" && (
            <button
              onClick={() => setCategory("Todos")}
              className="shrink-0 px-3 py-2 rounded-full text-sm font-semibold border border-border text-muted-foreground hover:border-coral hover:text-coral inline-flex items-center gap-1 transition"
            >
              <RotateCcw className="h-3.5 w-3.5" /> Limpiar
            </button>
          )}
        </div>

        {products.length === 0 ? (
          <div className="mt-8 rounded-3xl border border-dashed border-border p-12 text-center text-muted-foreground">
            No hay productos en esta categoría todavía.
          </div>
        ) : (
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {products.map((p) => (
              <Link
                key={p.slug}
                to="/shopping/$slug"
                params={{ slug: p.slug }}
                className="group rounded-2xl bg-card border border-border overflow-hidden hover:shadow-card transition-all hover:-translate-y-1"
              >
                <div className="relative aspect-square overflow-hidden bg-muted">
                  <img src={p.img} alt={p.name} loading="lazy" className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
                  {p.badge && (
                    <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-coral text-coral-foreground text-xs font-bold uppercase tracking-wider">
                      {p.badge}
                    </span>
                  )}
                </div>
                <div className="p-5">
                  <div className="text-xs font-bold uppercase tracking-wider text-coral">{p.category}</div>
                  <h3 className="mt-1 font-display text-lg font-bold group-hover:text-coral transition-colors">{p.name}</h3>
                  <p className="mt-1 text-sm text-muted-foreground line-clamp-2">{p.shortDescription}</p>
                  <div className="mt-3 flex items-end justify-between">
                    <div className="flex items-end gap-2">
                      <span className="font-display text-xl font-black">{formatPrice(p.price)}</span>
                      {p.oldPrice && <span className="text-sm line-through text-muted-foreground">{formatPrice(p.oldPrice)}</span>}
                    </div>
                    <span className="inline-flex items-center gap-1 text-sm text-coral font-semibold">Ver <ArrowRight className="h-3.5 w-3.5" /></span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </PageShell>
  );
}
