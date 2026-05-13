import { createFileRoute } from "@tanstack/react-router";
import { PageShell, PageHero } from "@/components/PageShell";
import { Briefcase, Home, Wrench, ShoppingBag, Clock, MapPin, Send } from "lucide-react";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";

export const Route = createFileRoute("/clasificados")({
  head: () => ({
    meta: [
      { title: "Clasificados gratis en Tarragona — 7 días" },
      { name: "description", content: "Publica tu anuncio gratis durante 7 días: empleo, alquiler, venta y servicios en Tarragona." },
    ],
  }),
  component: ClasificadosPage,
});

const cats = [
  { icon: Briefcase, label: "Empleo", count: 234, color: "from-blue-500 to-cyan-400" },
  { icon: Home, label: "Alquiler", count: 187, color: "from-emerald-500 to-teal-400" },
  { icon: ShoppingBag, label: "Venta", count: 412, color: "from-coral to-orange-400" },
  { icon: Wrench, label: "Servicios", count: 156, color: "from-violet-500 to-fuchsia-400" },
];

const ads = [
  { cat: "Empleo", title: "Camarero/a fines de semana — Restaurante Part Alta", location: "Part Alta", time: "5 días restantes" },
  { cat: "Alquiler", title: "Habitación en piso compartido cerca URV — 350€/mes", location: "Sant Pere i Sant Pau", time: "6 días restantes" },
  { cat: "Servicios", title: "Clases particulares matemáticas ESO y Bachillerato", location: "Eixample", time: "3 días restantes" },
  { cat: "Venta", title: "Mudanza completa: muebles, electrodomésticos, deco", location: "Bonavista", time: "1 día restante" },
  { cat: "Empleo", title: "Buscamos peluquera con experiencia — incorporación inmediata", location: "Centre", time: "7 días restantes" },
  { cat: "Alquiler", title: "Plaza de parking Rambla Nova — 80€/mes", location: "Rambla Nova", time: "4 días restantes" },
];

function ClasificadosPage() {
  const [selectedAd, setSelectedAd] = useState<typeof ads[0] | null>(null);

  return (
    <PageShell>
      <PageHero
        eyebrow="Clasificados"
        title="Publica gratis durante 7 días"
        subtitle="Empleo, alquiler, venta o servicios. Sin comisiones, sin intermediarios. Renueva o destaca tu anuncio cuando quieras."
      />

      <section className="mx-auto max-w-7xl px-4 md:px-8 py-12">
        {/* CTA */}
        <div className="rounded-3xl bg-gradient-coral p-8 md:p-12 text-coral-foreground flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <h2 className="font-display text-3xl md:text-4xl font-black">¿Tienes algo que anunciar?</h2>
            <p className="mt-2 opacity-90 max-w-md">Crea tu anuncio en menos de un minuto y llega a miles de vecinos.</p>
          </div>
          <button className="px-7 py-3.5 rounded-full bg-foreground text-background font-bold text-sm hover:scale-105 transition">
            Publicar gratis
          </button>
        </div>

        {/* Categories */}
        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {cats.map((c) => {
            const Icon = c.icon;
            return (
              <button key={c.label} className="group p-6 rounded-2xl bg-card border border-border text-left hover:shadow-card transition-all hover:-translate-y-1">
                <div className={`inline-grid h-12 w-12 place-items-center rounded-xl bg-gradient-to-br ${c.color} text-white`}>
                  <Icon className="h-6 w-6" />
                </div>
                <div className="mt-4 font-display text-xl font-bold">{c.label}</div>
                <div className="text-sm text-muted-foreground">{c.count} anuncios activos</div>
              </button>
            );
          })}
        </div>

        {/* List */}
        <h2 className="mt-16 font-display text-3xl md:text-4xl font-black">Anuncios recientes</h2>
        <div className="mt-6 divide-y divide-border rounded-2xl bg-card border border-border overflow-hidden">
          {ads.map((a) => (
            <article key={a.title} onClick={() => setSelectedAd(a)} className="group p-6 flex items-start justify-between gap-4 hover:bg-secondary/40 cursor-pointer transition">
              <div className="flex-1">
                <span className="text-xs font-bold uppercase tracking-wider text-coral">{a.cat}</span>
                <h3 className="mt-1 font-semibold text-lg group-hover:text-coral transition-colors">{a.title}</h3>
                <div className="mt-2 flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
                  <span className="inline-flex items-center gap-1"><MapPin className="h-3 w-3" /> {a.location}</span>
                  <span className="inline-flex items-center gap-1"><Clock className="h-3 w-3" /> {a.time}</span>
                </div>
              </div>
              <button className="shrink-0 px-4 py-2 rounded-full text-sm font-semibold border border-border hover:border-coral hover:text-coral transition">Ver</button>
            </article>
          ))}
        </div>
      </section>
    </PageShell>
  );
}
