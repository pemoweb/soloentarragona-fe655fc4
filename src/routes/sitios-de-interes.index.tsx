import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import {
  MapPin,
  ArrowUpRight,
  RotateCcw,
  Landmark,
  Umbrella,
  Building2,
  TreePine,
  Binoculars,
  LayoutGrid,
  Sparkles,
  type LucideIcon,
} from "lucide-react";
import { PageShell } from "@/components/PageShell";
import { sitios, siteCategories, type SiteCategory, type Sitio } from "@/lib/sitios-data";
import { useDynamicSeo } from "@/lib/use-dynamic-seo";

export const Route = createFileRoute("/sitios-de-interes/")({
  head: () => ({
    meta: [
      { title: "Sitios de Interés en Tarragona — Qué ver y visitar" },
      {
        name: "description",
        content:
          "Guía de los sitios de interés de Tarragona: patrimonio romano, playas, museos, miradores y naturaleza, con horarios, precios y cómo llegar.",
      },
      { property: "og:title", content: "Sitios de Interés en Tarragona — Qué ver y visitar" },
      {
        property: "og:description",
        content:
          "Patrimonio UNESCO, playas urbanas, museos y miradores: descubre los lugares imprescindibles de Tarragona.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: SitiosIndexPage,
});

export const categoryIcons: Record<string, LucideIcon> = {
  Todos: LayoutGrid,
  Patrimonio: Landmark,
  Playas: Umbrella,
  Museos: Building2,
  Naturaleza: TreePine,
  Miradores: Binoculars,
};

function FeaturedSitioCard({ sitio }: { sitio: Sitio }) {
  const Icon = categoryIcons[sitio.category] ?? Landmark;
  return (
    <Link
      to="/sitios-de-interes/$slug"
      params={{ slug: sitio.slug }}
      className="group relative flex flex-col overflow-hidden rounded-3xl bg-card border border-border shadow-card transition-all duration-300 hover:-translate-y-1.5 hover:shadow-glow sm:col-span-2 lg:col-span-3"
    >
      <div className="relative overflow-hidden bg-muted aspect-[16/9] md:aspect-[16/6]">
        <img
          src={sitio.img}
          alt={sitio.name}
          loading="lazy"
          width={1536}
          height={1024}
          className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-primary/80 via-primary/20 to-transparent" />
        <span className="absolute left-4 top-4 inline-flex items-center gap-1.5 rounded-full bg-background/90 px-3 py-1.5 text-xs font-semibold uppercase tracking-wider text-foreground backdrop-blur">
          <Icon className="h-3.5 w-3.5 text-coral" />
          {sitio.category}
        </span>
        {sitio.price && (
          <span className="absolute right-4 top-4 rounded-full bg-coral px-3 py-1.5 text-xs font-bold text-coral-foreground shadow-glow">
            {sitio.price.split("·")[0].trim()}
          </span>
        )}
        <div className="absolute inset-x-0 bottom-0 p-6 md:p-10">
          <h2 className="font-display font-black text-primary-foreground text-balance leading-tight text-3xl md:text-5xl">
            {sitio.name}
          </h2>
          <p className="mt-3 max-w-2xl text-sm md:text-lg text-primary-foreground/80 line-clamp-2">
            {sitio.short}
          </p>
        </div>
      </div>
    </Link>
  );
}

function SitioListCard({ sitio }: { sitio: Sitio }) {
  const Icon = categoryIcons[sitio.category] ?? Landmark;
  return (
    <Link
      to="/sitios-de-interes/$slug"
      params={{ slug: sitio.slug }}
      className="group flex gap-4 sm:block"
    >
      <div className="relative aspect-[4/3] w-32 shrink-0 overflow-hidden rounded-2xl bg-muted sm:w-auto">
        <img
          src={sitio.img}
          alt={sitio.name}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <span className="absolute left-2 top-2 inline-flex items-center gap-1 rounded-full bg-background/90 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-foreground backdrop-blur sm:hidden">
          <Icon className="h-3 w-3 text-coral" />
          {sitio.category}
        </span>
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2 text-xs sm:mt-4">
          <span className="hidden sm:inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-coral/10 text-coral font-semibold uppercase tracking-wider">
            <Icon className="h-3 w-3" />
            {sitio.category}
          </span>
          {sitio.price && (
            <span className="text-muted-foreground">· {sitio.price.split("·")[0].trim()}</span>
          )}
        </div>
        <h3 className="mt-2 font-display text-lg sm:text-xl font-bold leading-snug group-hover:text-coral transition-colors line-clamp-2">
          {sitio.name}
        </h3>
        <p className="mt-2 text-sm text-muted-foreground line-clamp-2">{sitio.short}</p>
        <div className="mt-2 flex items-center gap-1.5 text-xs text-muted-foreground">
          <MapPin className="h-3 w-3 shrink-0 text-coral" />
          <span className="truncate">{sitio.address}</span>
        </div>
        <span className="mt-2 hidden sm:inline-flex items-center gap-1.5 text-sm font-semibold text-foreground transition-colors group-hover:text-coral">
          Ver ficha
          <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </span>
      </div>
    </Link>
  );
}

function SitiosIndexPage() {
  const [cat, setCat] = useState<string>("Todos");
  const list = cat === "Todos" ? sitios : sitios.filter((s) => s.category === cat);
  const [featured, ...rest] = list;

  useDynamicSeo({
    title:
      cat === "Todos"
        ? "Sitios de Interés en Tarragona — Qué ver y visitar"
        : `${cat} en Tarragona — Sitios de Interés`,
    description:
      cat === "Todos"
        ? "Guía de los sitios de interés de Tarragona: patrimonio, playas, museos, miradores y naturaleza."
        : `Descubre los mejores sitios de ${cat.toLowerCase()} en Tarragona con horarios, precios y ubicación.`,
  });

  const countFor = (c: string) =>
    c === "Todos" ? sitios.length : sitios.filter((s) => s.category === (c as SiteCategory)).length;

  return (
    <PageShell>
      {/* Hero editorial */}
      <section className="relative overflow-hidden border-b border-border">
        <div className="absolute inset-0 bg-gradient-sea opacity-95" />
        <div className="absolute -top-24 -right-24 h-[28rem] w-[28rem] rounded-full bg-coral/30 blur-3xl" />
        <div className="absolute -bottom-40 -left-24 h-[28rem] w-[28rem] rounded-full bg-accent/25 blur-3xl" />
        <div
          className="absolute inset-0 opacity-[0.06]"
          style={{
            backgroundImage:
              "radial-gradient(circle at 1px 1px, currentColor 1px, transparent 0)",
            backgroundSize: "28px 28px",
          }}
        />
        <div className="relative mx-auto max-w-7xl px-4 md:px-8 py-20 md:py-28 text-primary-foreground">
          <span className="inline-flex items-center gap-2 rounded-full border border-coral/40 bg-coral/15 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-coral">
            <Sparkles className="h-3.5 w-3.5" />
            Guía imprescindible
          </span>
          <h1 className="mt-6 font-display text-5xl md:text-7xl font-black leading-[0.95] text-balance">
            Sitios de interés
            <span className="block italic font-medium text-coral">de Tarragona</span>
          </h1>
          <p className="mt-6 max-w-2xl text-lg md:text-xl opacity-80 text-balance">
            Patrimonio romano, playas urbanas, museos y miradores. Todo lo que hay que ver,
            con horarios y precios actualizados.
          </p>
          <dl className="mt-10 flex flex-wrap gap-x-10 gap-y-4">
            {[
              [`${sitios.length}`, "lugares"],
              [`${siteCategories.length}`, "categorías"],
              ["UNESCO", "Patrimonio Mundial"],
            ].map(([value, label]) => (
              <div key={label}>
                <dt className="font-display text-3xl font-black text-coral">{value}</dt>
                <dd className="mt-1 text-xs uppercase tracking-widest opacity-70">{label}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 md:px-8 py-12">
        {/* Filtros */}
        <div className="flex flex-wrap items-center gap-2">
          {["Todos", ...siteCategories].map((c) => {
            const Icon = categoryIcons[c] ?? LayoutGrid;
            const active = c === cat;
            return (
              <button
                key={c}
                onClick={() => setCat(c)}
                className={
                  active
                    ? "inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow-card"
                    : "inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:border-coral/50 hover:text-foreground"
                }
              >
                <Icon className={`h-4 w-4 ${active ? "text-coral" : "text-coral/70"}`} />
                {c}
                <span
                  className={`rounded-full px-1.5 text-xs font-bold ${
                    active ? "bg-coral text-coral-foreground" : "bg-muted text-muted-foreground"
                  }`}
                >
                  {countFor(c)}
                </span>
              </button>
            );
          })}
          {cat !== "Todos" && (
            <button
              onClick={() => setCat("Todos")}
              className="inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-medium text-coral transition-colors hover:bg-coral/10"
            >
              <RotateCcw className="h-4 w-4" /> Limpiar filtros
            </button>
          )}
        </div>

        <p className="mt-6 text-sm text-muted-foreground">
          {list.length} {list.length === 1 ? "sitio" : "sitios"} encontrados
        </p>

        {/* Destacado */}
        {featured && (
          <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <FeaturedSitioCard sitio={featured} />
          </div>
        )}

        {/* Resto: lista en móvil, cuadrícula en escritorio */}
        {rest.length > 0 && (
          <div className="mt-10 flex flex-col gap-5 sm:grid sm:gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {rest.map((s) => (
              <SitioListCard key={s.slug} sitio={s} />
            ))}
          </div>
        )}
      </section>
    </PageShell>
  );
}
