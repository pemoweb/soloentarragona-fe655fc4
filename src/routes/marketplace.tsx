import { createFileRoute } from "@tanstack/react-router";
import { PageShell, PageHero } from "@/components/PageShell";
import { Search, MapPin, Heart, Filter, AlertTriangle, Check, RotateCcw } from "lucide-react";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";

export const Route = createFileRoute("/marketplace")({
  head: () => ({
    meta: [
      { title: "Marketplace de Tarragona — Compra y vende cerca de ti" },
      { name: "description", content: "Compra y vende productos de segunda mano y nuevos en Tarragona y alrededores." },
    ],
  }),
  component: MarketplacePage,
});

const products = [
  { title: "Bicicleta urbana Orbea", price: 280, location: "Part Alta", category: "Deporte", img: "https://images.unsplash.com/photo-1532298229144-0ec0c57515c7?w=600&q=80", featured: true },
  { title: "Sofá nórdico 3 plazas", price: 420, location: "Sant Pere", category: "Hogar", img: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600&q=80" },
  { title: "iPhone 13 128GB como nuevo", price: 450, location: "Eixample", category: "Electrónica", img: "https://images.unsplash.com/photo-1592286927505-1def25115558?w=600&q=80", featured: true },
  { title: "Mesa comedor madera maciza", price: 180, location: "Bonavista", category: "Hogar", img: "https://images.unsplash.com/photo-1577140917170-285929fb55b7?w=600&q=80" },
  { title: "Cámara Sony A6000", price: 320, location: "Centre", category: "Electrónica", img: "https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=600&q=80" },
  { title: "Tabla de surf 6'2", price: 150, location: "Platja Llarga", category: "Deporte", img: "https://images.unsplash.com/photo-1502680390469-be75c86b636f?w=600&q=80" },
  { title: "PlayStation 5 + 2 mandos", price: 380, location: "Torreforta", category: "Electrónica", img: "https://images.unsplash.com/photo-1606813907291-d86efa9b94db?w=600&q=80" },
  { title: "Estantería industrial", price: 95, location: "Serrallo", category: "Hogar", img: "https://images.unsplash.com/photo-1594620302200-9a762244a156?w=600&q=80" },
];

const CATEGORIES = ["Todo", "Electrónica", "Hogar", "Moda", "Deporte", "Vehículos", "Niños", "Coleccionismo"] as const;

function MarketplacePage() {
  const [selectedItem, setSelectedItem] = useState<typeof products[0] | null>(null);
  const [isReporting, setIsReporting] = useState(false);
  const [reportReason, setReportReason] = useState("");
  const [reportSubmitted, setReportSubmitted] = useState(false);
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<string>("Todo");

  const filtered = products.filter((p) => {
    if (category !== "Todo" && p.category !== category) return false;
    if (query.trim() && !p.title.toLowerCase().includes(query.trim().toLowerCase())) return false;
    return true;
  });

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      setSelectedItem(null);
      setTimeout(() => {
        setIsReporting(false);
        setReportReason("");
        setReportSubmitted(false);
      }, 300);
    }
  };

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
          {CATEGORIES.map((c) => {
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
            <article key={p.title} onClick={() => setSelectedItem(p)} className="group cursor-pointer rounded-2xl bg-card border border-border overflow-hidden hover:shadow-glow transition-all hover:-translate-y-1">
              <div className="relative aspect-square overflow-hidden bg-muted">
                <img src={p.img} alt={p.title} loading="lazy" className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110" />
                {p.featured && (
                  <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-coral text-coral-foreground text-xs font-bold uppercase tracking-wider shadow-lg">Destacado</span>
                )}
                <button className="absolute top-3 right-3 grid h-9 w-9 place-items-center rounded-full bg-background/90 backdrop-blur hover:bg-coral hover:text-coral-foreground transition">
                  <Heart className="h-4 w-4" />
                </button>
              </div>
              <div className="p-4">
                <div className="font-display text-2xl font-black text-coral">{p.price} €</div>
                <h3 className="mt-1 font-semibold leading-tight line-clamp-2">{p.title}</h3>
                <div className="mt-2 flex items-center gap-1 text-xs text-muted-foreground">
                  <MapPin className="h-3 w-3" /> {p.location}
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      <Dialog open={!!selectedItem} onOpenChange={handleOpenChange}>
        <DialogContent>
          {selectedItem && (
            <>
              <DialogHeader>
                <DialogTitle>{selectedItem.title}</DialogTitle>
                <DialogDescription className="flex items-center gap-1">
                  <MapPin className="h-3 w-3" /> {selectedItem.location}
                </DialogDescription>
              </DialogHeader>

              {isReporting ? (
                reportSubmitted ? (
                  <div className="py-8 text-center">
                    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100 text-green-600 mb-4">
                      <Check className="h-6 w-6" />
                    </div>
                    <h3 className="text-xl font-bold">Denuncia enviada</h3>
                    <p className="text-muted-foreground mt-2 text-sm">Gracias por ayudarnos a mantener la comunidad segura.</p>
                    <button 
                      onClick={() => handleOpenChange(false)} 
                      className="mt-6 px-6 py-2.5 rounded-full bg-secondary text-secondary-foreground font-semibold text-sm hover:bg-secondary/80 transition"
                    >
                      Cerrar
                    </button>
                  </div>
                ) : (
                  <div className="py-2">
                    <p className="text-sm text-muted-foreground mb-4">Por favor, indícanos el motivo por el que denuncias este anuncio para que podamos revisarlo.</p>
                    <textarea 
                      value={reportReason}
                      onChange={(e) => setReportReason(e.target.value)}
                      placeholder="Motivo (ej. spam, falso, ofensivo...)"
                      className="w-full min-h-[100px] p-3 rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-coral/50 mb-4 resize-none text-sm"
                    />
                    <div className="flex justify-end gap-2">
                      <button 
                        onClick={() => setIsReporting(false)} 
                        className="px-4 py-2 rounded-full font-semibold text-sm hover:bg-secondary transition"
                      >
                        Cancelar
                      </button>
                      <button 
                        disabled={!reportReason.trim()}
                        onClick={() => setReportSubmitted(true)} 
                        className="px-4 py-2 rounded-full bg-red-500 text-white font-semibold text-sm hover:bg-red-600 transition disabled:opacity-50"
                      >
                        Enviar denuncia
                      </button>
                    </div>
                  </div>
                )
              ) : (
                <>
                  <div className="aspect-square overflow-hidden rounded-xl bg-muted my-4">
                    <img src={selectedItem.img} alt={selectedItem.title} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="font-display text-3xl font-black text-coral">{selectedItem.price} €</div>
                    <button className="px-6 py-3 rounded-xl bg-foreground text-background font-semibold">
                      Contactar al vendedor
                    </button>
                  </div>
                  <div className="mt-4 pt-4 border-t border-border flex justify-end">
                    <button 
                      onClick={() => setIsReporting(true)}
                      className="text-xs text-muted-foreground hover:text-red-500 flex items-center gap-1 transition font-medium"
                    >
                      <AlertTriangle className="h-3.5 w-3.5" /> Denunciar anuncio
                    </button>
                  </div>
                </>
              )}
            </>
          )}
        </DialogContent>
      </Dialog>
    </PageShell>
  );
}
