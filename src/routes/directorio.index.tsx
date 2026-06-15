import { createFileRoute, Link } from "@tanstack/react-router";
import { PageShell, PageHero } from "@/components/PageShell";
import { Star, MapPin, Phone, BadgeCheck, RotateCcw, ArrowRight } from "lucide-react";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { useDynamicSeo } from "@/lib/use-dynamic-seo";
import { businesses, type Business } from "@/lib/directorio-data";

const DIR_SEO: Record<string, { title: string; description: string }> = {
  Todos: {
    title: "Directorio profesional de Tarragona",
    description: "Encuentra empresas y profesionales verificados en Tarragona: restaurantes, salud, hogar, servicios.",
  },
  Restaurante: {
    title: "Restaurantes en Tarragona — Directorio local",
    description: "Los mejores restaurantes de Tarragona valorados por la comunidad. Reseñas, ubicación y contacto directo.",
  },
  Salud: {
    title: "Clínicas y profesionales de la Salud en Tarragona",
    description: "Dentistas, fisios, médicos y centros de salud verificados en Tarragona.",
  },
  Hogar: {
    title: "Reformas y servicios para el Hogar en Tarragona",
    description: "Profesionales para reformas, mudanzas y mantenimiento del hogar en Tarragona.",
  },
  Bienestar: {
    title: "Bienestar y deporte en Tarragona — Yoga, gimnasios, spa",
    description: "Centros de bienestar, yoga, pilates y deporte en Tarragona valorados por vecinos.",
  },
  Abogados: {
    title: "Abogados y servicios jurídicos en Tarragona",
    description: "Despachos y profesionales del derecho verificados en Tarragona.",
  },
  Servicios: {
    title: "Servicios profesionales en Tarragona — Directorio local",
    description: "Fotógrafos, diseñadores, asesores y otros profesionales en Tarragona.",
  },
};

export const Route = createFileRoute("/directorio/")({
  head: () => ({
    meta: [
      { title: "Directorio profesional de Tarragona" },
      { name: "description", content: "Encuentra empresas y profesionales verificados en Tarragona: restaurantes, salud, hogar, servicios." },
    ],
  }),
  component: DirectorioIndex,
});

function DirectorioIndex() {
  const [selectedBusiness, setSelectedBusiness] = useState<Business | null>(null);
  const [category, setCategory] = useState<string>("Todos");
  const categories = ["Todos", "Restaurante", "Salud", "Hogar", "Bienestar", "Abogados", "Servicios"];
  const filtered = category === "Todos" ? businesses : businesses.filter((b) => b.category === category);

  const seo = DIR_SEO[category] ?? DIR_SEO.Todos;
  useDynamicSeo({ title: seo.title, description: seo.description });

  return (
    <PageShell>
      <PageHero
        eyebrow="Directorio"
        title="Profesionales de confianza, cerca de ti"
        subtitle="Negocios y profesionales verificados de Tarragona. Reseñas reales, contacto directo, ubicación en mapa."
      />

      <section className="mx-auto max-w-7xl px-4 md:px-8 py-12">
        <div className="flex gap-2 overflow-x-auto pb-3">
          {categories.map((c) => {
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
              <RotateCcw className="h-3.5 w-3.5" /> Limpiar filtros
            </button>
          )}
        </div>

        {filtered.length === 0 && (
          <div className="mt-10 rounded-3xl border border-dashed border-border p-12 text-center text-muted-foreground">
            No hay negocios en esta categoría todavía.
          </div>
        )}

        <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filtered.map((b) => {
            const Card = (
              <article className="group h-full cursor-pointer rounded-3xl bg-card border border-border overflow-hidden hover:shadow-glow transition-all">
                <div className="aspect-[16/10] overflow-hidden bg-muted relative">
                  <img src={b.img} alt={b.name} loading="lazy" className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
                  {b.verified && (
                    <span className="absolute top-3 left-3 inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-foreground/90 backdrop-blur text-background text-xs font-semibold">
                      <BadgeCheck className="h-3.5 w-3.5 text-coral" /> PRO Verificado
                    </span>
                  )}
                </div>
                <div className="p-6">
                  <div className="flex items-center gap-2 text-xs">
                    <span className="px-2.5 py-1 rounded-full bg-secondary text-secondary-foreground font-semibold uppercase tracking-wider">{b.category}</span>
                  </div>
                  <h3 className="mt-3 font-display text-2xl font-bold group-hover:text-coral transition-colors">{b.name}</h3>
                  <div className="mt-2 flex items-center gap-1 text-sm">
                    <Star className="h-4 w-4 fill-coral text-coral" />
                    <span className="font-bold">{b.rating}</span>
                    <span className="text-muted-foreground">({b.reviews} reseñas)</span>
                  </div>
                  <div className="mt-3 flex items-center gap-1.5 text-sm text-muted-foreground">
                    <MapPin className="h-4 w-4 shrink-0" /> {b.address}
                  </div>
                  <div className="mt-5 w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-full bg-foreground text-background font-semibold text-sm group-hover:bg-coral transition">
                    {b.verified ? (<>Ver ficha PRO <ArrowRight className="h-4 w-4" /></>) : (<><Phone className="h-4 w-4" /> Ver contacto</>)}
                  </div>
                </div>
              </article>
            );

            return b.verified ? (
              <Link key={b.slug} to="/directorio/$slug" params={{ slug: b.slug }} className="block">
                {Card}
              </Link>
            ) : (
              <div key={b.slug} onClick={() => setSelectedBusiness(b)}>
                {Card}
              </div>
            );
          })}
        </div>
      </section>

      <Dialog open={!!selectedBusiness} onOpenChange={(open) => !open && setSelectedBusiness(null)}>
        <DialogContent>
          {selectedBusiness && (
            <>
              <DialogHeader>
                <div className="flex items-center gap-2 mb-2 text-xs">
                  <span className="px-2.5 py-1 rounded-full bg-secondary text-secondary-foreground font-semibold uppercase tracking-wider">{selectedBusiness.category}</span>
                </div>
                <DialogTitle className="text-2xl">{selectedBusiness.name}</DialogTitle>
                <DialogDescription className="flex items-center gap-1 mt-2">
                  <MapPin className="h-4 w-4" /> {selectedBusiness.address}
                </DialogDescription>
              </DialogHeader>
              <div className="aspect-[16/10] overflow-hidden rounded-xl bg-muted my-2">
                <img src={selectedBusiness.img} alt={selectedBusiness.name} className="w-full h-full object-cover" />
              </div>
              <div className="flex items-center gap-1 text-sm mb-4">
                <Star className="h-4 w-4 fill-coral text-coral" />
                <span className="font-bold">{selectedBusiness.rating}</span>
                <span className="text-muted-foreground">({selectedBusiness.reviews} reseñas)</span>
              </div>
              <div className="rounded-xl border border-dashed border-border p-4 text-xs text-muted-foreground">
                Este negocio aún no es <span className="font-semibold text-foreground">PRO Verificado</span>. Solo mostramos su información básica.
              </div>
              <div className="flex justify-end mt-2">
                <button className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 rounded-full bg-foreground text-background font-semibold hover:bg-coral transition">
                  <Phone className="h-4 w-4" /> Contactar
                </button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </PageShell>
  );
}
