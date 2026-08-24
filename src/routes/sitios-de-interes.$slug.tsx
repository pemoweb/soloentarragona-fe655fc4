import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { MapPin, Clock, Ticket, Globe, ArrowLeft, Check } from "lucide-react";
import { PageShell } from "@/components/PageShell";
import { MiniCarousel } from "@/components/MiniCarousel";
import { getSitio, sitios } from "@/lib/sitios-data";

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
        { property: "og:image", content: sitio.img },
        { name: "twitter:card", content: "summary_large_image" },
        { name: "twitter:image", content: sitio.img },
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
          className="mt-8 inline-flex px-6 py-3 rounded-full bg-foreground text-background font-semibold"
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

  return (
    <PageShell>
      <article className="mx-auto max-w-6xl px-4 md:px-8 py-10">
        <Link
          to="/sitios-de-interes"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-coral transition-colors"
        >
          <ArrowLeft className="h-4 w-4" /> Sitios de interés
        </Link>

        <div className="mt-6 grid gap-10 lg:grid-cols-[1.4fr_1fr]">
          <div>
            <MiniCarousel
              images={sitio.gallery}
              alt={sitio.name}
              className="aspect-[16/10]"
              rounded="rounded-3xl"
              showThumbs
            />
            <span className="mt-6 inline-block px-2.5 py-1 rounded-full bg-coral/10 text-coral text-xs font-semibold uppercase tracking-wider">
              {sitio.category}
            </span>
            <h1 className="mt-3 font-display text-4xl md:text-5xl font-black text-balance">{sitio.name}</h1>
            <p className="mt-5 text-lg text-muted-foreground leading-relaxed">{sitio.description}</p>

            <h2 className="mt-10 font-display text-2xl font-bold">Destacados</h2>
            <ul className="mt-4 grid gap-2 sm:grid-cols-2">
              {sitio.highlights.map((h) => (
                <li key={h} className="flex items-center gap-2 text-sm">
                  <span className="grid h-6 w-6 place-items-center rounded-full bg-coral/10 text-coral">
                    <Check className="h-3.5 w-3.5" />
                  </span>
                  {h}
                </li>
              ))}
            </ul>
          </div>

          <aside className="space-y-4">
            <div className="rounded-3xl border border-border bg-card p-6 shadow-card space-y-4 text-sm">
              <h2 className="font-display text-xl font-bold">Información práctica</h2>
              <div className="flex gap-3">
                <MapPin className="h-4 w-4 mt-0.5 text-coral shrink-0" />
                <span>{sitio.address}</span>
              </div>
              {sitio.hours && (
                <div className="flex gap-3">
                  <Clock className="h-4 w-4 mt-0.5 text-coral shrink-0" />
                  <span>{sitio.hours}</span>
                </div>
              )}
              {sitio.price && (
                <div className="flex gap-3">
                  <Ticket className="h-4 w-4 mt-0.5 text-coral shrink-0" />
                  <span>{sitio.price}</span>
                </div>
              )}
              {sitio.website && (
                <div className="flex gap-3">
                  <Globe className="h-4 w-4 mt-0.5 text-coral shrink-0" />
                  <a href={sitio.website} target="_blank" rel="noreferrer" className="text-coral hover:underline break-all">
                    {sitio.website.replace(/^https?:\/\//, "")}
                  </a>
                </div>
              )}
              <a
                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${sitio.name}, Tarragona`)}`}
                target="_blank"
                rel="noreferrer"
                className="block text-center px-5 py-3 rounded-full bg-foreground text-background font-semibold hover:bg-coral transition-colors"
              >
                Cómo llegar
              </a>
            </div>

            {sitio.coords && (
              <div className="overflow-hidden rounded-3xl border border-border">
                <iframe
                  title={`Mapa de ${sitio.name}`}
                  loading="lazy"
                  className="h-64 w-full"
                  src={`https://www.google.com/maps?q=${sitio.coords.lat},${sitio.coords.lng}&z=15&output=embed`}
                />
              </div>
            )}
          </aside>
        </div>

        {related.length > 0 && (
          <section className="mt-20">
            <h2 className="font-display text-3xl font-black">También te puede interesar</h2>
            <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((r) => (
                <Link
                  key={r.slug}
                  to="/sitios-de-interes/$slug"
                  params={{ slug: r.slug }}
                  className="group overflow-hidden rounded-3xl bg-card border border-border shadow-card hover:shadow-glow transition-all hover:-translate-y-1"
                >
                  <div className="aspect-[4/3] overflow-hidden bg-muted">
                    <img src={r.img} alt={r.name} loading="lazy" className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
                  </div>
                  <div className="p-5">
                    <h3 className="font-display text-lg font-bold group-hover:text-coral transition-colors">{r.name}</h3>
                    <p className="mt-2 text-sm text-muted-foreground">{r.short}</p>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}
      </article>
    </PageShell>
  );
}
