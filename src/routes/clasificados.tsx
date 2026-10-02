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
  Phone,
  MessageCircle,
} from "lucide-react";
import { telHref, whatsappHref } from "@/lib/contact-links";
import { useMemo, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { PageShell } from "@/components/PageShell";
import { classifiedAdImage } from "@/lib/clasificados-images";
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
import { REPORT_REASONS, submitReport } from "@/lib/reports";


export const Route = createFileRoute("/clasificados")({
  head: () => ({
    meta: [
      { title: "Clasificados en Tarragona: empleo, alquiler, venta y servicios" },
      {
        name: "description",
        content:
          "Anuncios clasificados de Tarragona: ofertas de empleo, pisos de alquiler, compraventa de segunda mano y servicios por barrios. Publica gratis 7 días.",
      },
      {
        name: "keywords",
        content:
          "clasificados Tarragona, anuncios Tarragona, empleo Tarragona, alquiler Tarragona, segunda mano Tarragona, servicios Tarragona",
      },
      { property: "og:type", content: "website" },
      {
        property: "og:title",
        content: "Clasificados en Tarragona: empleo, alquiler, venta y servicios",
      },
      {
        property: "og:description",
        content:
          "Empleo, alquiler, segunda mano y servicios entre vecinos de Tarragona, por barrios y con contacto directo.",
      },
      { property: "og:url", content: "https://soloentarragona.lovable.app/clasificados" },
      { property: "og:locale", content: "es_ES" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "geo.placename", content: "Tarragona, Catalunya, España" },
      { name: "geo.region", content: "ES-T" },
    ],
    links: [{ rel: "canonical", href: "https://soloentarragona.lovable.app/clasificados" }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          name: "Clasificados en Tarragona",
          description:
            "Anuncios clasificados de empleo, alquiler, venta de segunda mano y servicios en Tarragona.",
          url: "https://soloentarragona.lovable.app/clasificados",
          inLanguage: "es-ES",
          about: { "@type": "City", name: "Tarragona", address: { "@type": "PostalAddress", addressLocality: "Tarragona", addressRegion: "Catalunya", addressCountry: "ES" } },
        }),
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
  const [reportCategory, setReportCategory] = useState<string>(REPORT_REASONS[0]);
  const [reportReason, setReportReason] = useState("");
  const [reportSubmitted, setReportSubmitted] = useState(false);

  const [category, setCategory] = useState<string>("Todos");
  const [zone, setZone] = useState<string>("Todas");
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<SortOption>("recent");
  const [onlyFavs, setOnlyFavs] = useState(false);

  const seo = classifiedsSeo(category, zone);
  useDynamicSeo({ title: seo.title, description: seo.description });

  const sendReport = () => {
    if (!selectedAd) return;
    submitReport({
      target: "classified",
      itemId: selectedAd.id,
      itemTitle: selectedAd.title,
      reason: reportCategory,
      details: reportReason.trim() || undefined,
    });
    setReportSubmitted(true);
  };

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      setSelectedAd(null);
      setTimeout(() => {
        setIsReporting(false);
        setReportCategory(REPORT_REASONS[0]);
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
      <section className="relative overflow-hidden bg-gradient-sea text-primary-foreground">
        <div className="absolute inset-0 opacity-15 [background-image:radial-gradient(circle_at_15%_25%,white,transparent_45%),radial-gradient(circle_at_85%_15%,white,transparent_40%)]" />
        <div className="relative mx-auto max-w-7xl px-4 md:px-8 py-16 md:py-24">
          <p className="text-xs font-bold uppercase tracking-[0.25em] opacity-80">Clasificados de Tarragona</p>
          <h1 className="mt-4 max-w-3xl font-display text-4xl md:text-6xl font-black leading-[1.05]">
            {category === "Todos"
              ? "Publica gratis durante 7 días"
              : `${category}${zone !== "Todas" ? ` en ${zone}` : " en Tarragona"}`}
          </h1>
          <p className="mt-5 max-w-xl text-base md:text-lg opacity-90">
            Empleo, alquiler, venta o servicios. Sin comisiones, sin intermediarios. Renueva o destaca tu anuncio cuando quieras.
          </p>
          <div className="mt-8 flex flex-wrap gap-6 text-sm">
            <div>
              <div className="font-display text-3xl font-black">{ads.length}</div>
              <div className="opacity-80">anuncios vivos</div>
            </div>
            <div>
              <div className="font-display text-3xl font-black">7</div>
              <div className="opacity-80">días gratis</div>
            </div>
            <div>
              <div className="font-display text-3xl font-black">0€</div>
              <div className="opacity-80">comisiones</div>
            </div>
          </div>
        </div>
      </section>

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
          <div className="mt-6 flex flex-col gap-2.5 sm:gap-4">
            {filtered.map((a) => {
              const isFav = favs.has(a.id);
              const Icon = catMeta[a.cat]?.icon ?? ShoppingBag;
              const tel = telHref(a.contact?.phone);
              const wa = whatsappHref(
                a.contact?.phone,
                `Hola, te escribo por el anuncio "${a.title}" de Solo en Tarragona.`,
              );

              return (
                <article
                  key={a.id}
                  onClick={() => setSelectedAd(a)}
                  className="group relative flex cursor-pointer items-start gap-3 rounded-xl border border-border bg-card p-3 transition-all hover:shadow-card sm:gap-4 sm:rounded-2xl sm:p-5 sm:hover:-translate-y-0.5"
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <span className="inline-flex items-center gap-1.5 text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-coral">
                        <Icon className="h-3.5 w-3.5 sm:hidden" /> {a.cat}
                      </span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggle(a.id);
                        }}
                        aria-label={isFav ? "Quitar de favoritos" : "Guardar"}
                        className={`grid h-7 w-7 sm:h-8 sm:w-8 shrink-0 place-items-center rounded-full border transition ${
                          isFav
                            ? "bg-coral text-coral-foreground border-coral"
                            : "border-border text-muted-foreground hover:border-coral hover:text-coral"
                        }`}
                      >
                        <Heart className={`h-3.5 w-3.5 sm:h-4 sm:w-4 ${isFav ? "fill-current" : ""}`} />
                      </button>
                    </div>
                    <h3 className="mt-1 font-display text-sm sm:text-lg font-bold leading-tight line-clamp-2 sm:line-clamp-1">
                      {a.title}
                    </h3>
                    {a.description && (
                      <p className="mt-1 hidden text-sm text-muted-foreground line-clamp-2 sm:block">{a.description}</p>
                    )}
                    <div className="mt-1.5 sm:mt-3 flex flex-wrap items-center justify-between gap-x-2 gap-y-1 text-[11px] sm:text-xs text-muted-foreground">
                      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 sm:gap-x-4">
                        <span className="inline-flex items-center gap-1">
                          <MapPin className="h-3 w-3" /> {a.location}
                        </span>
                        <span className="inline-flex items-center gap-1">
                          <Clock className="h-3 w-3" /> {a.time}
                        </span>
                        <span className="hidden text-[11px] font-semibold uppercase tracking-wider sm:inline">
                          Caduca en {a.daysLeft} días
                        </span>
                      </div>
                      <span className="hidden text-sm font-semibold text-coral whitespace-nowrap sm:inline">Ver anuncio</span>
                    </div>

                    {(tel || wa) && (
                      <div className="mt-2 flex gap-1.5">
                        {tel && (
                          <a
                            href={tel}
                            onClick={(e) => e.stopPropagation()}
                            aria-label={`Llamar por el anuncio ${a.title}`}
                            className="inline-flex items-center justify-center gap-1 rounded-full border border-border px-3 py-1.5 text-[11px] font-semibold transition hover:border-coral hover:text-coral"
                          >
                            <Phone className="h-3.5 w-3.5" /> Llamar
                          </a>
                        )}
                        {wa && (
                          <a
                            href={wa}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            aria-label={`Escribir por WhatsApp sobre ${a.title}`}
                            className="inline-flex items-center justify-center gap-1 rounded-full bg-emerald-600 px-3 py-1.5 text-[11px] font-semibold text-white transition hover:opacity-90"
                          >
                            <MessageCircle className="h-3.5 w-3.5" /> WhatsApp
                          </a>
                        )}
                      </div>
                    )}
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
              <div className="relative -mx-6 -mt-6 aspect-[16/9] overflow-hidden">
                <img
                  src={classifiedAdImage(selectedAd)}
                  alt={selectedAd.cat}
                  className="h-full w-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/20 to-transparent" />
              </div>
              <DialogHeader>
                <div className="flex items-center gap-2 -mt-2 text-xs">
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
                    <h3 className="text-xl font-bold">Denuncia registrada</h3>
                    <p className="text-muted-foreground mt-2 text-sm">
                      Nuestro equipo de moderación revisará este anuncio. Gracias
                      por ayudarnos a mantener la comunidad segura.
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
                      Indícanos el motivo por el que denuncias este anuncio. La
                      denuncia queda registrada para su moderación.
                    </p>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">
                      Motivo
                    </label>
                    <select
                      value={reportCategory}
                      onChange={(e) => setReportCategory(e.target.value)}
                      className="w-full p-3 rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-coral/50 mb-4 text-sm"
                    >
                      {REPORT_REASONS.map((r) => (
                        <option key={r} value={r}>
                          {r}
                        </option>
                      ))}
                    </select>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">
                      Detalles (opcional)
                    </label>
                    <textarea
                      value={reportReason}
                      onChange={(e) => setReportReason(e.target.value)}
                      placeholder="Cuéntanos qué ocurre con este anuncio..."
                      className="w-full min-h-[90px] p-3 rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-coral/50 mb-4 resize-none text-sm"
                    />
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => setIsReporting(false)}
                        className="px-4 py-2 rounded-full font-semibold text-sm hover:bg-secondary transition"
                      >
                        Cancelar
                      </button>
                      <button
                        onClick={sendReport}
                        className="px-4 py-2 rounded-full bg-red-500 text-white font-semibold text-sm hover:bg-red-600 transition"
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
