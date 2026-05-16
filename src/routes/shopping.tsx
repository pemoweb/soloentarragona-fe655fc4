import { createFileRoute } from "@tanstack/react-router";
import { PageShell, PageHero } from "@/components/PageShell";
import { Tag, MapPin, Sparkles, Store } from "lucide-react";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";

export const Route = createFileRoute("/shopping")({
  head: () => ({
    meta: [
      { title: "Shopping local en Tarragona — Tiendas y promociones" },
      { name: "description", content: "Descubre las mejores tiendas locales de Tarragona y aprovecha ofertas y promociones de temporada." },
    ],
  }),
  component: ShoppingPage,
});

const featured = [
  { name: "La Botiga del Port", deal: "-30% en pescado fresco", category: "Alimentación", img: "https://images.unsplash.com/photo-1534723452862-4c874018d66d?w=900&q=80" },
  { name: "Moda Mediterrània", deal: "2x1 en colección verano", category: "Moda", img: "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=900&q=80" },
  { name: "Llibres del Carrer Major", deal: "20% libros catalanes", category: "Cultura", img: "https://images.unsplash.com/photo-1521587760476-6c12a4b040da?w=900&q=80" },
];

const shops = [
  { name: "Forn Sistaré", category: "Panadería", group: "Alimentación", location: "Carrer Major", img: "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=600&q=80" },
  { name: "Vins & Caves Tàrraco", category: "Vinoteca", group: "Alimentación", location: "Rambla Nova", img: "https://images.unsplash.com/photo-1506377247377-2a5b3b417ebb?w=600&q=80" },
  { name: "Floristeria Jardí", category: "Flores", group: "Especializadas", location: "Sant Pere", img: "https://images.unsplash.com/photo-1561181286-d3fee7d55364?w=600&q=80" },
  { name: "Joieria Mar", category: "Joyería", group: "Especializadas", location: "Centre", img: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=600&q=80" },
  { name: "Zapateria Costa", category: "Calzado", group: "Moda", location: "Eixample", img: "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=600&q=80" },
  { name: "Café Corsini", category: "Cafetería", group: "Alimentación", location: "Plaça Corsini", img: "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=600&q=80" },
];

const SHOP_FILTERS = ["Todas", "Alimentación", "Moda", "Hogar", "Cultura", "Belleza", "Especializadas"] as const;

function ShoppingPage() {
  const [selectedFeatured, setSelectedFeatured] = useState<typeof featured[0] | null>(null);
  const [selectedShop, setSelectedShop] = useState<typeof shops[0] | null>(null);
  const [shopFilter, setShopFilter] = useState<string>("Todas");
  const filteredShops = shopFilter === "Todas" ? shops : shops.filter((s) => s.group === shopFilter);

  return (
    <PageShell>
      <PageHero
        eyebrow="Shopping local"
        title="Compra local, vive Tarragona"
        subtitle="Las tiendas que hacen ciudad. Descubre comercios de barrio, promociones de temporada y experiencias únicas."
      />

      <section className="mx-auto max-w-7xl px-4 md:px-8 py-12">
        {/* Featured deals */}
        <div className="flex items-center gap-2 text-coral text-sm font-bold uppercase tracking-widest">
          <Sparkles className="h-4 w-4" /> Promociones destacadas
        </div>
        <div className="mt-4 grid gap-6 md:grid-cols-3">
          {featured.map((f) => (
            <article key={f.name} onClick={() => setSelectedFeatured(f)} className="group relative overflow-hidden rounded-3xl aspect-[4/5] cursor-pointer">
              <img src={f.img} alt={f.name} className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-110" />
              <div className="absolute inset-0 bg-gradient-to-t from-primary/95 via-primary/50 to-transparent" />
              <div className="absolute top-4 left-4 inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-coral text-coral-foreground text-xs font-bold uppercase tracking-wider">
                <Tag className="h-3 w-3" /> Oferta
              </div>
              <div className="absolute bottom-0 p-6 text-primary-foreground">
                <div className="text-xs opacity-80 uppercase tracking-wider">{f.category}</div>
                <h3 className="mt-1 font-display text-2xl font-bold">{f.name}</h3>
                <p className="mt-2 text-coral font-bold text-lg">{f.deal}</p>
              </div>
            </article>
          ))}
        </div>

        {/* All shops */}
        <h2 className="mt-20 font-display text-3xl md:text-4xl font-black">Tiendas de Tarragona</h2>
        <div className="mt-6 flex gap-2 overflow-x-auto pb-2">
          {SHOP_FILTERS.map((c) => {
            const active = c === shopFilter;
            return (
              <button
                key={c}
                onClick={() => setShopFilter(c)}
                className={`shrink-0 px-4 py-2 rounded-full text-sm font-semibold border transition ${
                  active ? "bg-foreground text-background border-foreground" : "bg-card text-muted-foreground border-border hover:border-coral hover:text-coral"
                }`}
              >
                {c}
              </button>
            );
          })}
        </div>

        {filteredShops.length === 0 && (
          <div className="mt-8 rounded-3xl border border-dashed border-border p-12 text-center text-muted-foreground">
            No hay tiendas en esta categoría todavía.
          </div>
        )}

        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {filteredShops.map((s) => (
            <article key={s.name} onClick={() => setSelectedShop(s)} className="group cursor-pointer rounded-2xl bg-card border border-border overflow-hidden hover:shadow-card transition-all hover:-translate-y-1">
              <div className="aspect-[16/10] overflow-hidden bg-muted">
                <img src={s.img} alt={s.name} loading="lazy" className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
              </div>
              <div className="p-5">
                <div className="text-xs font-bold uppercase tracking-wider text-coral">{s.category}</div>
                <h3 className="mt-1 font-display text-xl font-bold group-hover:text-coral transition-colors">{s.name}</h3>
                <div className="mt-2 flex items-center gap-1 text-sm text-muted-foreground">
                  <MapPin className="h-3 w-3" /> {s.location}
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* Featured Dialog */}
      <Dialog open={!!selectedFeatured} onOpenChange={(open) => !open && setSelectedFeatured(null)}>
        <DialogContent>
          {selectedFeatured && (
            <>
              <DialogHeader>
                <div className="flex items-center gap-2 mb-2 text-xs">
                  <span className="px-2.5 py-1 rounded-full bg-secondary text-secondary-foreground font-semibold uppercase tracking-wider">{selectedFeatured.category}</span>
                </div>
                <DialogTitle className="text-2xl">{selectedFeatured.name}</DialogTitle>
                <DialogDescription className="text-lg font-bold text-coral mt-1">
                  <Tag className="h-4 w-4 inline-block mr-1" /> {selectedFeatured.deal}
                </DialogDescription>
              </DialogHeader>
              <div className="aspect-[4/3] overflow-hidden rounded-xl bg-muted my-2">
                <img src={selectedFeatured.img} alt={selectedFeatured.name} className="w-full h-full object-cover" />
              </div>
              <div className="flex justify-end mt-4">
                <button className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 rounded-full bg-foreground text-background font-semibold hover:bg-coral transition">
                  <Store className="h-4 w-4" /> Visitar tienda
                </button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Shop Dialog */}
      <Dialog open={!!selectedShop} onOpenChange={(open) => !open && setSelectedShop(null)}>
        <DialogContent>
          {selectedShop && (
            <>
              <DialogHeader>
                <div className="flex items-center gap-2 mb-2 text-xs">
                  <span className="px-2.5 py-1 rounded-full bg-secondary text-secondary-foreground font-semibold uppercase tracking-wider">{selectedShop.category}</span>
                </div>
                <DialogTitle className="text-2xl">{selectedShop.name}</DialogTitle>
                <DialogDescription className="flex items-center gap-1 mt-2">
                  <MapPin className="h-4 w-4" /> {selectedShop.location}
                </DialogDescription>
              </DialogHeader>
              <div className="aspect-[16/10] overflow-hidden rounded-xl bg-muted my-2">
                <img src={selectedShop.img} alt={selectedShop.name} className="w-full h-full object-cover" />
              </div>
              <div className="flex justify-end mt-4">
                <button className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 rounded-full bg-foreground text-background font-semibold hover:bg-coral transition">
                  <Store className="h-4 w-4" /> Ver productos
                </button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

    </PageShell>
  );
}
