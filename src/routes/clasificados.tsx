import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Briefcase,
  Home,
  Wrench,
  ShoppingBag,
  Clock,
  MapPin,
  Send,
  AlertTriangle,
  Check,
  Heart,
  Search,
  RotateCcw,
  PlusCircle,
  ArrowUpDown,
} from "lucide-react";
import { useMemo, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { PageShell, PageHero } from "@/components/PageShell";
import {
  CLASSIFIED_CATEGORIES,
  TARRAGONA_ZONES,
  SORT_OPTIONS,
  SortOption,
  Classified,
  classifiedsSeo,
  useAllClassifieds,
  useFavorites,
} from "@/lib/classifieds-data";
import { useDynamicSeo } from "@/lib/use-dynamic-seo";

export const Route = createFileRoute("/clasificados")({
  head: () => ({
    meta: [
      { title: "Clasificados gratis en Tarragona — 7 días" },
      {
        name: "description",
        content:
          "Publica tu anuncio gratis durante 7 días: empleo, alquiler, venta y servicios en Tarragona.",
      },
      {
        property: "og:title",
        content: "Clasificados gratis en Tarragona",
      },
      {
        property: "og:description",
        content:
          "Empleo, alquiler, venta y servicios entre vecinos de Tarragona.",
      },
    ],
  }),
  component: ClasificadosPage,
});

const catMeta: Record<
  string,
  { icon: typeof Briefcase; color: string }
> = {
  Empleo: { icon: Briefcase, color: "from-blue-500 to-cyan-400" },
  Alquiler: { icon: Home, color: "from-emerald-500 to-teal-400" },
  Venta: { icon: ShoppingBag, color: "from-coral to-orange-400" },
  Servicios: { icon: Wrench, color: "from-violet-500 to-fuchsia-400" },
};

function ClasificadosPage() {
  const ads = useAllClassifieds();
  const { favs, toggle } = useFavorites();

  const [selectedAd, setSelectedAd] = useState<Classified | null>(null);
  const [isReporting, setIsReporting] = useState(false);
  const [reportReason, setReportReason] = useState("");
  const [reportSubmitted, setReportSubmitted] = useState(false);

  const [category, setCategory] = useState<string>("Todos");
  const [zone, setZone] = useState<string>("Todas");
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<SortOption>("recent");
  const [onlyFavs, setOnlyFavs] = useState(false);

  const seo = classifiedsSeo(category, zone);
  useDynamicSeo({ title: seo.title, description: seo.description });

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      setSelectedAd(null);
      setTimeout(() => {
        setIsReporting(false);
        setReportReason("");
        setReportSubmitted(false);
      }, 300);
    }
  };

  const filtered = useMemo(() => {
    let list = ads.filter((a) => {
      if (category !== "Todos" && a.cat !== category) return false;
      if (zone !== "Todas" && a.location !== zone) return false;
      if (onlyFavs && !favs.has(a.id)) return false;
      if (query.trim()) {
        const q = query.trim().toLowerCase();
        if (
          !a.title.toLowerCase().includes(q) &&
          !(a.description ?? "").toLowerCase().includes(q)
        )
          return false;
      }
      return true;
    });
    if (sort === "expiring") list = [...list].sort((a, b) => a.daysLeft - b.daysLeft);
    else if (sort === "category")
      list = [...list].sort((a, b) => a.cat.localeCompare(b.cat));
    return list;
  }, [ads, category, zone, query, sort, onlyFavs, favs]);

  const hasFilters =
    category !== "Todos" ||
    zone !== "Todas" ||
    query.trim() !== "" ||
    sort !== "recent" ||
    onlyFavs;

  const catCounts: Record<string, number> = ads.reduce(
    (acc, a) => {
      acc[a.cat] = (acc[a.cat] ?? 0) + 1;
      return acc;
    },
    {} as Record<string, number>,
  );

  return (
    <PageShell>
      <PageHero
        eyebrow="Clasificados"
        title={
          category === "Todos"
            ? "Publica gratis durante 7 días"
            : `${category}${zone !== "Todas" ? ` en ${zone}` : " en Tarragona"}`
        }
        subtitle="Empleo, alquiler, venta o servicios. Sin comisiones, sin intermediarios. Renueva o destaca tu anuncio cuando quieras."
      />

      <section className="mx-auto max-w-7xl px-4 md:px-8 py-12">
        {/* CTA */}
        <div className="rounded-3xl bg-gradient-coral p-8 md:p-12 text-coral-foreground flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <h2 className="font-display text-3xl md:text-4xl font-black">
              ¿Tienes algo que anunciar?
            </h2>
            <p className="mt-2 opacity-90 max-w-md">
              Crea tu anuncio en menos de un minuto y llega a miles de vecinos.
            </p>
          </div>
          <Link
            to="/clasificados/publicar"
            className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-foreground text-background font-bold text-sm hover:scale-105 transition"
          >
            <PlusCircle className="h-4 w-4" /> Publicar gratis
          </Link>
        </div>

        {/* Categories cards */}
        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {(["Empleo", "Alquiler", "Venta", "Servicios"] as const).map((label) => {
            const meta = catMeta[label];
            const Icon = meta.icon;
            const active = category === label;
            return (
              <button
                key={label}
                onClick={() => setCategory(active ? "Todos" : label)}
                className={`group p-6 rounded-2xl border text-left hover:shadow-card transition-all hover:-translate-y-1 ${
                  active
                    ? "bg-foreground text-background border-foreground"
                    : "bg-card border-border"
                }`}
              >
                <div
                  className={`inline-grid h-12 w-12 place-items-center rounded-xl bg-gradient-to-br ${meta.color} text-white`}
                >
                  <Icon className="h-6 w-6" />
                </div>
                <div className="mt-4 font-display text-xl font-bold">
                  {label}
                </div>
                <div
                  className={`text-sm ${active ? "opacity-80" : "text-muted-foreground"}`}
                >
                  {catCounts[label] ?? 0} anuncios activos
                </div>
              </button>
            );
          })}
        </div>

        {/* Filters bar */}
        <div className="mt-10 rounded-2xl bg-card border border-border p-4 flex flex-col gap-3">
          <div className="flex flex-col md:flex-row gap-3">
            <div className="flex-1 flex items-center gap-2 px-3 rounded-xl border border-border bg-background">
              <Search className="h-4 w-4 text-muted-foreground" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Buscar en clasificados…"
                className="flex-1 bg-transparent py-2.5 text-sm focus:outline-none"
              />
            </div>
            <div className="flex items-center gap-2 px-3 rounded-xl border border-border bg-background">
              <MapPin className="h-4 w-4 text-muted-foreground" />
              <select
                value={zone}
                onChange={(e) => setZone(e.target.value)}
                className="bg-transparent py-2.5 text-sm focus:outline-none"
              >
                {TARRAGONA_ZONES.map((z) => (
                  <option key={z} value={z}>
                    {z}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex items-center gap-2 px-3 rounded-xl border border-border bg-background">
              <ArrowUpDown className="h-4 w-4 text-muted-foreground" />
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value as SortOption)}
                className="bg-transparent py-2.5 text-sm focus:outline-none"
              >
                {SORT_OPTIONS.map((s) => (
                  <option key={s.value} value={s.value}>
                    {s.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {CLASSIFIED_CATEGORIES.map((c) => {
              const active = c === category;
              return (
                <button
                  key={c}
                  onClick={() => setCategory(c)}
                  className={`shrink-0 px-3.5 py-1.5 rounded-full text-xs font-semibold border transition ${
                    active
                      ? "bg-foreground text-background border-foreground"
                      : "bg-card text-muted-foreground border-border hover:border-coral hover:text-coral"
                  }`}
                >
                  {c}
                </button>
              );
            })}
            <button
              onClick={() => setOnlyFavs((v) => !v)}
              className={`shrink-0 px-3.5 py-1.5 rounded-full text-xs font-semibold border inline-flex items-center gap-1 transition ${
                onlyFavs
                  ? "bg-coral text-coral-foreground border-coral"
                  : "bg-card text-muted-foreground border-border hover:border-coral hover:text-coral"
              }`}
            >
              <Heart className={`h-3.5 w-3.5 ${onlyFavs ? "fill-current" : ""}`} />
              Favoritos ({favs.size})
            </button>
            {hasFilters && (
              <button
                onClick={() => {
                  setCategory("Todos");
                  setZone("Todas");
                  setQuery("");
                  setSort("recent");
                  setOnlyFavs(false);
                }}
                className="shrink-0 px-3 py-1.5 rounded-full text-xs font-semibold border border-border text-muted-foreground hover:border-coral hover:text-coral inline-flex items-center gap-1 transition"
              >
                <RotateCcw className="h-3 w-3" /> Limpiar filtros
              </button>
            )}
          </div>
        </div>

        {/* List */}
        <h2 className="mt-12 font-display text-3xl md:text-4xl font-black">
          {filtered.length} {filtered.length === 1 ? "anuncio" : "anuncios"}
        </h2>
        {filtered.length === 0 ? (
          <div className="mt-6 rounded-3xl border border-dashed border-border p-12 text-center text-muted-foreground">
            No hay anuncios con estos filtros.
          </div>
        ) : (
          <div className="mt-6 divide-y divide-border rounded-2xl bg-card border border-border overflow-hidden">
            {filtered.map((a) => {
              const isFav = favs.has(a.id);
              return (
                <article
                  key={a.id}
                  onClick={() => setSelectedAd(a)}
                  className="group p-6 flex items-start justify-between gap-4 hover:bg-secondary/40 cursor-pointer transition"
                >
                  <div className="flex-1">
                    <span className="text-xs font-bold uppercase tracking-wider text-coral">
                      {a.cat}
                    </span>
                    <h3 className="mt-1 font-semibold text-lg group-hover:text-coral transition-colors">
                      {a.title}
                    </h3>
                    <div className="mt-2 flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
                      <span className="inline-flex items-center gap-1">
                        <MapPin className="h-3 w-3" /> {a.location}
                      </span>
                      <span className="inline-flex items-center gap-1">
                        <Clock className="h-3 w-3" /> {a.time}
                      </span>
                    </div>
                  </div>
                  <div className="shrink-0 flex items-center gap-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggle(a.id);
                      }}
                      aria-label={isFav ? "Quitar de favoritos" : "Guardar"}
                      className={`grid h-9 w-9 place-items-center rounded-full border transition ${
                        isFav
                          ? "bg-coral text-coral-foreground border-coral"
                          : "border-border hover:border-coral hover:text-coral"
                      }`}
                    >
                      <Heart className={`h-4 w-4 ${isFav ? "fill-current" : ""}`} />
                    </button>
                    <button className="px-4 py-2 rounded-full text-sm font-semibold border border-border hover:border-coral hover:text-coral transition">
                      Ver
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>

      <Dialog open={!!selectedAd} onOpenChange={handleOpenChange}>
        <DialogContent>
          {selectedAd && (
            <>
              <DialogHeader>
                <div className="flex items-center gap-2 mb-2 text-xs">
                  <span className="px-2.5 py-1 rounded-full bg-secondary text-secondary-foreground font-semibold uppercase tracking-wider">
                    {selectedAd.cat}
                  </span>
                </div>
                <DialogTitle className="text-2xl">{selectedAd.title}</DialogTitle>
                <DialogDescription className="flex items-center gap-4 mt-2">
                  <span className="inline-flex items-center gap-1">
                    <MapPin className="h-4 w-4" /> {selectedAd.location}
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <Clock className="h-4 w-4" /> {selectedAd.time}
                  </span>
                </DialogDescription>
              </DialogHeader>

              {isReporting ? (
                reportSubmitted ? (
                  <div className="py-8 text-center">
                    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100 text-green-600 mb-4">
                      <Check className="h-6 w-6" />
                    </div>
                    <h3 className="text-xl font-bold">Denuncia enviada</h3>
                    <p className="text-muted-foreground mt-2 text-sm">
                      Gracias por ayudarnos a mantener la comunidad segura.
                    </p>
                    <button
                      onClick={() => handleOpenChange(false)}
                      className="mt-6 px-6 py-2.5 rounded-full bg-secondary text-secondary-foreground font-semibold text-sm hover:bg-secondary/80 transition"
                    >
                      Cerrar
                    </button>
                  </div>
                ) : (
                  <div className="py-2 mt-4">
                    <p className="text-sm text-muted-foreground mb-4">
                      Por favor, indícanos el motivo por el que denuncias este
                      anuncio para que podamos revisarlo.
                    </p>
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
                  {selectedAd.description && (
                    <div className="mt-4 p-4 rounded-xl bg-muted/50 border border-border">
                      <p className="text-sm text-foreground/80">
                        {selectedAd.description}
                      </p>
                    </div>
                  )}
                  <div className="flex flex-col sm:flex-row gap-2 mt-4">
                    <button
                      onClick={() => toggle(selectedAd.id)}
                      className={`inline-flex items-center justify-center gap-2 px-4 py-3 rounded-full border font-semibold transition ${
                        favs.has(selectedAd.id)
                          ? "bg-coral text-coral-foreground border-coral"
                          : "border-border hover:border-coral hover:text-coral"
                      }`}
                    >
                      <Heart
                        className={`h-4 w-4 ${favs.has(selectedAd.id) ? "fill-current" : ""}`}
                      />
                      {favs.has(selectedAd.id) ? "Guardado" : "Guardar"}
                    </button>
                    <button className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-3 rounded-full bg-foreground text-background font-semibold hover:bg-coral transition">
                      <Send className="h-4 w-4" /> Enviar mensaje
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
