import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { MapPin, Clock, Ticket, ArrowUpRight, RotateCcw } from "lucide-react";
import { PageShell, PageHero } from "@/components/PageShell";
import { sitios, siteCategories } from "@/lib/sitios-data";
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

function SitiosIndexPage() {
  const [cat, setCat] = useState<string>("Todos");
  const list = cat === "Todos" ? sitios : sitios.filter((s) => s.category === cat);

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

  return (
    <PageShell>
      <PageHero
        eyebrow="Sitios de interés"
        title="Lo imprescindible de Tarragona"
        subtitle="Patrimonio romano, playas urbanas, museos y miradores. Todo lo que hay que ver, con horarios y precios actualizados."
      />

      <section className="mx-auto max-w-7xl px-4 md:px-8 py-12">
        <div className="flex flex-wrap items-center gap-2">
          {["Todos", ...siteCategories].map((c) => (
            <button
              key={c}
              onClick={() => setCat(c)}
              className={
                c === cat
                  ? "px-4 py-2 rounded-full bg-foreground text-background text-sm font-semibold"
                  : "px-4 py-2 rounded-full border border-border text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
              }
            >
              {c}
            </button>
          ))}
          {cat !== "Todos" && (
            <button
              onClick={() => setCat("Todos")}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium text-coral hover:bg-coral/10 transition-colors"
            >
              <RotateCcw className="h-4 w-4" /> Limpiar filtros
            </button>
          )}
        </div>

        <p className="mt-6 text-sm text-muted-foreground">
          {list.length} {list.length === 1 ? "sitio" : "sitios"} encontrados
        </p>

        <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {list.map((s) => (
            <Link
              key={s.slug}
              to="/sitios-de-interes/$slug"
              params={{ slug: s.slug }}
              className="group overflow-hidden rounded-3xl bg-card border border-border shadow-card hover:shadow-glow transition-all hover:-translate-y-1"
            >
              <div className="aspect-[4/3] overflow-hidden bg-muted">
                <img
                  src={s.img}
                  alt={s.name}
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <div className="p-6">
                <span className="px-2.5 py-1 rounded-full bg-coral/10 text-coral text-xs font-semibold uppercase tracking-wider">
                  {s.category}
                </span>
                <h2 className="mt-3 font-display text-xl font-bold group-hover:text-coral transition-colors">
                  {s.name}
                </h2>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{s.short}</p>
                <div className="mt-4 space-y-1.5 text-xs text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-3.5 w-3.5" /> {s.address}
                  </div>
                  {s.hours && (
                    <div className="flex items-center gap-2">
                      <Clock className="h-3.5 w-3.5" /> {s.hours}
                    </div>
                  )}
                  {s.price && (
                    <div className="flex items-center gap-2">
                      <Ticket className="h-3.5 w-3.5" /> {s.price}
                    </div>
                  )}
                </div>
                <div className="mt-5 inline-flex items-center gap-1 text-sm font-semibold group-hover:text-coral transition-colors">
                  Ver ficha <ArrowUpRight className="h-4 w-4" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </PageShell>
  );
}
