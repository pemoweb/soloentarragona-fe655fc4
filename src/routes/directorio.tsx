import { createFileRoute } from "@tanstack/react-router";
import { PageShell, PageHero } from "@/components/PageShell";
import { Star, MapPin, Phone, BadgeCheck, RotateCcw } from "lucide-react";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";

export const Route = createFileRoute("/directorio")({
  head: () => ({
    meta: [
      { title: "Directorio profesional de Tarragona" },
      { name: "description", content: "Encuentra empresas y profesionales verificados en Tarragona: restaurantes, salud, hogar, servicios." },
    ],
  }),
  component: DirectorioPage,
});

const businesses = [
  { name: "El Terrat de Sant Magí", category: "Restaurante", rating: 4.8, reviews: 312, address: "Carrer de Sant Magí, 14", img: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&q=80", verified: true },
  { name: "Clínica Dental Tàrraco", category: "Salud", rating: 4.9, reviews: 156, address: "Rambla Nova, 88", img: "https://images.unsplash.com/photo-1629909613654-28e377c37b09?w=800&q=80", verified: true },
  { name: "Reformas Costa Daurada", category: "Hogar", rating: 4.7, reviews: 89, address: "Av. Catalunya, 22", img: "https://images.unsplash.com/photo-1581094288338-2314dddb7ece?w=800&q=80", verified: true },
  { name: "Estudio Yoga Mediterrània", category: "Bienestar", rating: 5.0, reviews: 204, address: "Carrer Major, 31", img: "https://images.unsplash.com/photo-1545205597-3d9d02c29597?w=800&q=80", verified: true },
  { name: "Tarragona Legal", category: "Abogados", rating: 4.6, reviews: 67, address: "Plaça Corsini, 5", img: "https://images.unsplash.com/photo-1589994965851-a8f479c573a9?w=800&q=80", verified: false },
  { name: "Fotografía Marc Vidal", category: "Servicios", rating: 4.9, reviews: 142, address: "Carrer Reial, 8", img: "https://images.unsplash.com/photo-1554048612-b6a482bc67e5?w=800&q=80", verified: true },
];

function DirectorioPage() {
  const [selectedBusiness, setSelectedBusiness] = useState<typeof businesses[0] | null>(null);
  const [category, setCategory] = useState<string>("Todos");
  const categories = ["Todos", "Restaurante", "Salud", "Hogar", "Bienestar", "Abogados", "Servicios"];
  const filtered = category === "Todos" ? businesses : businesses.filter((b) => b.category === category);

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
          {filtered.map((b) => (
            <article key={b.name} onClick={() => setSelectedBusiness(b)} className="group cursor-pointer rounded-3xl bg-card border border-border overflow-hidden hover:shadow-glow transition-all">
              <div className="aspect-[16/10] overflow-hidden bg-muted">
                <img src={b.img} alt={b.name} loading="lazy" className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
              </div>
              <div className="p-6">
                <div className="flex items-center gap-2 text-xs">
                  <span className="px-2.5 py-1 rounded-full bg-secondary text-secondary-foreground font-semibold uppercase tracking-wider">{b.category}</span>
                  {b.verified && <span className="inline-flex items-center gap-1 text-coral font-semibold"><BadgeCheck className="h-4 w-4" /> Verificado</span>}
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
                <button className="mt-5 w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-full bg-foreground text-background font-semibold text-sm hover:bg-coral transition">
                  <Phone className="h-4 w-4" /> Contactar
                </button>
              </div>
            </article>
          ))}
        </div>
      </section>

      <Dialog open={!!selectedBusiness} onOpenChange={(open) => !open && setSelectedBusiness(null)}>
        <DialogContent>
          {selectedBusiness && (
            <>
              <DialogHeader>
                <div className="flex items-center gap-2 mb-2 text-xs">
                  <span className="px-2.5 py-1 rounded-full bg-secondary text-secondary-foreground font-semibold uppercase tracking-wider">{selectedBusiness.category}</span>
                  {selectedBusiness.verified && <span className="inline-flex items-center gap-1 text-coral font-semibold"><BadgeCheck className="h-4 w-4" /> Verificado</span>}
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
              <div className="flex justify-end mt-2">
                <button className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 rounded-full bg-foreground text-background font-semibold hover:bg-coral transition">
                  <Phone className="h-4 w-4" /> Contactar ahora
                </button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </PageShell>
  );
}
