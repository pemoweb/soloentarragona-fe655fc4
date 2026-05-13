import { createFileRoute } from "@tanstack/react-router";
import { PageShell, PageHero } from "@/components/PageShell";
import { Star, MapPin, Phone, BadgeCheck } from "lucide-react";
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

  return (
    <PageShell>
      <PageHero
        eyebrow="Directorio"
        title="Profesionales de confianza, cerca de ti"
        subtitle="Negocios y profesionales verificados de Tarragona. Reseñas reales, contacto directo, ubicación en mapa."
      />

      <section className="mx-auto max-w-7xl px-4 md:px-8 py-12">
        <div className="flex gap-2 overflow-x-auto pb-3">
          {["Todos", "Restaurantes", "Salud", "Hogar", "Bienestar", "Abogados", "Educación", "Servicios"].map((c, i) => (
            <button key={c} className={`shrink-0 px-4 py-2 rounded-full text-sm font-semibold border transition ${
              i === 0 ? "bg-foreground text-background border-foreground" : "bg-card text-muted-foreground border-border hover:border-coral hover:text-coral"
            }`}>{c}</button>
          ))}
        </div>

        <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {businesses.map((b) => (
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
    </PageShell>
  );
}
