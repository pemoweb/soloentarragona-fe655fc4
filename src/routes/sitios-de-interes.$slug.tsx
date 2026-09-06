import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useState } from "react";
import {
  MapPin,
  Clock,
  Ticket,
  Globe,
  ArrowLeft,
  ArrowUpRight,
  Check,
  Navigation,
  Hourglass,
  Map,
} from "lucide-react";
import { PageShell } from "@/components/PageShell";
import { SitiosMap } from "@/components/SitiosMap";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { getSitio, sitios } from "@/lib/sitios-data";
import { categoryIcons } from "./sitios-de-interes.index";


export const Route = createFileRoute("/sitios-de-interes/$slug")({
  loader: ({ params }) => {
    const sitio = getSitio(params.slug);
    if (!sitio) throw notFound();
    return { sitio };
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return { meta: [{ title: "Sitio no encontrado" }, { name: "robots", content: "noindex" }] };
    }
    const { sitio } = loaderData;
    const title = `${sitio.name} — Sitios de Interés en Tarragona`;
    return {
      meta: [
        { title },
        { name: "description", content: sitio.short },
        { property: "og:title", content: title },
        { property: "og:description", content: sitio.short },
        { property: "og:type", content: "article" },
        { name: "twitter:card", content: "summary" },
      ],
    };
  },
  notFoundComponent: SitioNotFound,
  component: SitioDetailPage,
});

function SitioNotFound() {
  return (
    <PageShell>
      <div className="mx-auto max-w-3xl px-4 py-32 text-center">
        <h1 className="font-display text-4xl font-black">Sitio no encontrado</h1>
        <p className="mt-4 text-muted-foreground">Este lugar ya no está disponible.</p>
        <Link
          to="/sitios-de-interes"
          className="mt-8 inline-flex px-6 py-3 rounded-full bg-primary text-primary-foreground font-semibold"
        >
          Ver todos los sitios
        </Link>
      </div>
    </PageShell>
  );
}

function SitioDetailPage() {
  const { sitio } = Route.useLoaderData();
  const related = sitios.filter((s) => s.slug !== sitio.slug && s.category === sitio.category).slice(0, 3);
  const Icon = categoryIcons[sitio.category] ?? MapPin;
  const [mapOpen, setMapOpen] = useState(false);


  return (
    <PageShell>
      <article>
        {/* Hero inmersivo */}
        <section className="relative overflow-hidden">
          <img
            src={sitio.img}
            alt={sitio.name}
            width={1536}
            height={1024}
            className="absolute inset-0 h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-primary via-primary/45 to-primary/15" />
          <div className="relative mx-auto max-w-6xl px-4 md:px-8 pt-10 pb-24 md:pb-28">
            <Link
              to="/sitios-de-interes"
              className="inline-flex items-center gap-1.5 rounded-full bg-background/15 px-4 py-2 text-sm font-medium text-primary-foreground backdrop-blur transition-colors hover:bg-background/25"
            >
              <ArrowLeft className="h-4 w-4" /> Sitios de interés
            </Link>

            <div className="mt-24 md:mt-32 text-primary-foreground">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-coral px-3.5 py-1.5 text-xs font-semibold uppercase tracking-widest text-coral-foreground shadow-glow">
                <Icon className="h-3.5 w-3.5" />
                {sitio.category}
              </span>
              <h1 className="mt-4 max-w-3xl font-display text-4xl md:text-6xl font-black leading-[0.95] text-balance">
                {sitio.name}
              </h1>
              <p className="mt-4 max-w-2xl text-lg opacity-85 text-balance">{sitio.short}</p>

              <div className="mt-8 flex flex-wrap gap-3">
                {[
                  { icon: MapPin, label: sitio.address },
                  sitio.hours ? { icon: Clock, label: sitio.hours } : null,
                  sitio.price ? { icon: Ticket, label: sitio.price } : null,
                ]
                  .filter(Boolean)
                  .map((item) => {
                    const MetaIcon = (item as { icon: typeof MapPin; label: string }).icon;
                    const label = (item as { label: string }).label;
                    return (
                      <span
                        key={label}
                        className="inline-flex items-center gap-2 rounded-full border border-primary-foreground/25 bg-primary-foreground/10 px-4 py-2 text-sm font-medium backdrop-blur"
                      >
                        <MetaIcon className="h-4 w-4 text-coral" />
                        {label}
                      </span>
                    );
                  })}
              </div>
            </div>
          </div>
        </section>

        {/* Contenido */}
        <div className="mx-auto max-w-6xl px-4 md:px-8 py-14">
          <div className="grid gap-12 lg:grid-cols-[1.5fr_1fr]">
            <div>
              <h2 className="font-display text-3xl font-black">Sobre este lugar</h2>
              <p className="mt-5 text-lg leading-relaxed text-muted-foreground first-letter:float-left first-letter:mr-3 first-letter:font-display first-letter:text-6xl first-letter:font-black first-letter:leading-[0.8] first-letter:text-coral">
                {sitio.description}
              </p>

              <h2 className="mt-12 font-display text-3xl font-black">Destacados</h2>
              <ul className="mt-5 grid gap-3 sm:grid-cols-2">
                {sitio.highlights.map((h) => (
                  <li
                    key={h}
                    className="flex items-center gap-3 rounded-2xl border border-border bg-card p-4 shadow-card"
                  >
                    <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-coral/10 text-coral">
                      <Check className="h-4 w-4" />
                    </span>
                    <span className="text-sm font-medium">{h}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Sidebar sticky */}
            <aside className="space-y-5 lg:sticky lg:top-24 self-start">
              <div className="rounded-3xl border border-border bg-card p-6 shadow-card space-y-4 text-sm">
                <h2 className="font-display text-xl font-bold">Información práctica</h2>
                <div className="flex gap-3">
                  <MapPin className="h-4 w-4 mt-0.5 shrink-0 text-coral" />
                  <span>{sitio.address}</span>
                </div>
                {sitio.hours && (
                  <div className="flex gap-3">
                    <Clock className="h-4 w-4 mt-0.5 shrink-0 text-coral" />
                    <span>{sitio.hours}</span>
                  </div>
                )}
                {sitio.price && (
                  <div className="flex gap-3">
                    <Ticket className="h-4 w-4 mt-0.5 shrink-0 text-coral" />
                    <span>{sitio.price}</span>
                  </div>
                )}
                {sitio.duration && (
                  <div className="flex gap-3">
                    <Hourglass className="h-4 w-4 mt-0.5 shrink-0 text-coral" />
                    <span>Visita recomendada: {sitio.duration}</span>
                  </div>
                )}
                {sitio.website && (
                  <div className="flex gap-3">
                    <Globe className="h-4 w-4 mt-0.5 shrink-0 text-coral" />
                    <a
                      href={sitio.website}
                      target="_blank"
                      rel="noreferrer"
                      className="break-all text-coral hover:underline"
                    >
                      {sitio.website.replace(/^https?:\/\//, "")}
                    </a>
                  </div>
                )}
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${sitio.name}, Tarragona`)}`}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-center gap-2 rounded-full bg-gradient-coral px-5 py-3 font-semibold text-coral-foreground transition-transform hover:scale-[1.02]"
                >
                  <Navigation className="h-4 w-4" /> Cómo llegar
                </a>
              </div>

              {sitio.coords && (
                <>
                  <button
                    type="button"
                    onClick={() => setMapOpen(true)}
                    className="flex w-full items-center justify-center gap-2 rounded-3xl border border-border bg-card px-5 py-4 font-semibold shadow-card transition-colors hover:border-coral/60 hover:text-coral"
                  >
                    <Map className="h-4 w-4 text-coral" /> Ver en el mapa interactivo
                  </button>

                  <Dialog open={mapOpen} onOpenChange={setMapOpen}>
                    <DialogContent className="max-w-3xl">
                      <DialogHeader>
                        <DialogTitle className="font-display text-2xl font-black">
                          {sitio.name} en el mapa
                        </DialogTitle>
                        <DialogDescription>
                          Marcador coral: este lugar. Pulsa cualquier otro marcador para ver su ficha.
                        </DialogDescription>
                      </DialogHeader>
                      <SitiosMap
                        sitios={sitios}
                        activeSlug={sitio.slug}
                        className="h-[300px] md:h-[440px]"
                      />
                    </DialogContent>
                  </Dialog>

                  <div className="overflow-hidden rounded-3xl border border-border shadow-card">
                    <iframe
                      title={`Mapa de ${sitio.name}`}
                      loading="lazy"
                      className="h-64 w-full"
                      src={`https://www.google.com/maps?q=${sitio.coords.lat},${sitio.coords.lng}&z=15&output=embed`}
                    />
                  </div>
                </>
              )}

            </aside>
          </div>

          {/* Relacionados */}
          {related.length > 0 && (
            <section className="mt-20">
              <div className="flex items-end justify-between gap-4">
                <h2 className="font-display text-3xl font-black">También te puede interesar</h2>
                <Link
                  to="/sitios-de-interes"
                  className="hidden sm:inline-flex items-center gap-1.5 text-sm font-semibold text-coral hover:underline"
                >
                  Ver todos <ArrowUpRight className="h-4 w-4" />
                </Link>
              </div>
              <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {related.map((r) => {
                  const RIcon = categoryIcons[r.category] ?? MapPin;
                  return (
                    <Link
                      key={r.slug}
                      to="/sitios-de-interes/$slug"
                      params={{ slug: r.slug }}
                      className="group relative overflow-hidden rounded-3xl border border-border bg-card shadow-card transition-all duration-300 hover:-translate-y-1.5 hover:shadow-glow"
                    >
                      <div className="relative aspect-[4/3] overflow-hidden bg-muted">
                        <img
                          src={r.img}
                          alt={r.name}
                          loading="lazy"
                          width={1536}
                          height={1024}
                          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-primary/70 via-primary/10 to-transparent" />
                        <span className="absolute left-4 top-4 inline-flex items-center gap-1.5 rounded-full bg-background/90 px-3 py-1.5 text-xs font-semibold uppercase tracking-wider backdrop-blur">
                          <RIcon className="h-3.5 w-3.5 text-coral" />
                          {r.category}
                        </span>
                        <h3 className="absolute inset-x-0 bottom-0 p-5 font-display text-xl font-bold text-primary-foreground">
                          {r.name}
                        </h3>
                      </div>
                      <div className="p-5">
                        <p className="text-sm text-muted-foreground">{r.short}</p>
                        <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold transition-colors group-hover:text-coral">
                          Ver ficha <ArrowUpRight className="h-4 w-4" />
                        </span>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </section>
          )}
        </div>
      </article>
    </PageShell>
  );
}
