import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { PageShell } from "@/components/PageShell";
import { Star, MapPin, Phone, Mail, Globe, Clock, BadgeCheck, ArrowLeft, Instagram, Facebook, Users, Calendar, Share2, CheckCircle2 } from "lucide-react";
import { getBusiness, businesses } from "@/lib/directorio-data";
import { useDynamicSeo } from "@/lib/use-dynamic-seo";

export const Route = createFileRoute("/directorio/$slug")({
  loader: ({ params }) => {
    const b = getBusiness(params.slug);
    if (!b || !b.verified) throw notFound();
    return b;
  },
  component: BusinessDetail,
  notFoundComponent: () => (
    <PageShell>
      <div className="mx-auto max-w-3xl px-4 py-24 text-center">
        <h1 className="font-display text-4xl font-bold">Negocio no disponible</h1>
        <p className="mt-4 text-muted-foreground">La ficha PRO solo está disponible para negocios verificados.</p>
        <Link to="/directorio" className="mt-6 inline-flex items-center gap-2 text-coral font-semibold">
          <ArrowLeft className="h-4 w-4" /> Volver al directorio
        </Link>
      </div>
    </PageShell>
  ),
  errorComponent: () => (
    <PageShell>
      <div className="mx-auto max-w-3xl px-4 py-24 text-center">
        <h1 className="font-display text-4xl font-bold">Algo salió mal</h1>
        <Link to="/directorio" className="mt-6 inline-flex items-center gap-2 text-coral font-semibold">
          <ArrowLeft className="h-4 w-4" /> Volver al directorio
        </Link>
      </div>
    </PageShell>
  ),
});

function BusinessDetail() {
  const b = Route.useLoaderData();
  useDynamicSeo({
    title: `${b.name} — ${b.category} verificado en Tarragona`,
    description: b.description ?? `${b.name}, ${b.category.toLowerCase()} verificado en Tarragona.`,
    image: b.img,
  });

  const related = businesses.filter((x) => x.verified && x.category === b.category && x.slug !== b.slug).slice(0, 3);

  const handleShare = async () => {
    if (navigator.share) {
      try { await navigator.share({ title: b.name, text: b.description, url: window.location.href }); } catch {}
    } else {
      navigator.clipboard.writeText(window.location.href);
    }
  };

  return (
    <PageShell>
      {/* Hero */}
      <section className="relative">
        <div className="aspect-[21/9] md:aspect-[21/7] w-full overflow-hidden bg-muted">
          <img src={b.img} alt={b.name} className="h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
        </div>

        <div className="mx-auto max-w-7xl px-4 md:px-8 -mt-32 md:-mt-40 relative">
          <Link to="/directorio" className="inline-flex items-center gap-1 text-sm font-semibold text-background/90 mb-4 hover:text-coral">
            <ArrowLeft className="h-4 w-4" /> Directorio
          </Link>
          <div className="rounded-3xl bg-card border border-border p-6 md:p-10 shadow-glow">
            <div className="flex flex-wrap items-center gap-2 text-xs">
              <span className="px-2.5 py-1 rounded-full bg-secondary text-secondary-foreground font-semibold uppercase tracking-wider">{b.category}</span>
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-coral/10 text-coral font-semibold">
                <BadgeCheck className="h-3.5 w-3.5" /> PRO Verificado
              </span>
            </div>
            <div className="mt-4 flex flex-col md:flex-row md:items-end md:justify-between gap-4">
              <div>
                <h1 className="font-display text-4xl md:text-5xl font-bold tracking-tight">{b.name}</h1>
                <div className="mt-3 flex flex-wrap items-center gap-4 text-sm">
                  <span className="inline-flex items-center gap-1">
                    <Star className="h-4 w-4 fill-coral text-coral" />
                    <span className="font-bold">{b.rating}</span>
                    <span className="text-muted-foreground">({b.reviews} reseñas)</span>
                  </span>
                  <span className="inline-flex items-center gap-1 text-muted-foreground">
                    <MapPin className="h-4 w-4" /> {b.address}
                  </span>
                </div>
              </div>
              <div className="flex gap-2">
                <button onClick={handleShare} className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-secondary text-secondary-foreground font-semibold text-sm hover:bg-muted transition">
                  <Share2 className="h-4 w-4" /> Compartir
                </button>
                {b.phone && (
                  <a href={`tel:${b.phone}`} className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-foreground text-background font-semibold text-sm hover:bg-coral transition">
                    <Phone className="h-4 w-4" /> Llamar
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="mx-auto max-w-7xl px-4 md:px-8 py-12 grid gap-10 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-10">
          {b.description && (
            <div>
              <h2 className="font-display text-2xl font-bold mb-3">Sobre {b.name}</h2>
              <p className="text-muted-foreground leading-relaxed">{b.description}</p>
            </div>
          )}

          {b.services && b.services.length > 0 && (
            <div>
              <h2 className="font-display text-2xl font-bold mb-4">Servicios destacados</h2>
              <div className="grid sm:grid-cols-2 gap-3">
                {b.services.map((s) => (
                  <div key={s} className="flex items-start gap-2 p-3 rounded-xl bg-card border border-border">
                    <CheckCircle2 className="h-5 w-5 text-coral shrink-0 mt-0.5" />
                    <span className="text-sm font-medium">{s}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {b.gallery && b.gallery.length > 0 && (
            <div>
              <h2 className="font-display text-2xl font-bold mb-4">Galería</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {b.gallery.map((g, i) => (
                  <div key={i} className="aspect-square overflow-hidden rounded-2xl bg-muted">
                    <img src={g} alt={`${b.name} ${i + 1}`} loading="lazy" className="h-full w-full object-cover hover:scale-105 transition-transform duration-500" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {(b.yearFounded || b.team) && (
            <div className="grid sm:grid-cols-2 gap-4">
              {b.yearFounded && (
                <div className="rounded-2xl bg-card border border-border p-5">
                  <Calendar className="h-5 w-5 text-coral mb-2" />
                  <div className="text-2xl font-bold font-display">{new Date().getFullYear() - b.yearFounded}+ años</div>
                  <div className="text-xs text-muted-foreground uppercase tracking-wider mt-1">Desde {b.yearFounded}</div>
                </div>
              )}
              {b.team && (
                <div className="rounded-2xl bg-card border border-border p-5">
                  <Users className="h-5 w-5 text-coral mb-2" />
                  <div className="text-2xl font-bold font-display">{b.team} profesionales</div>
                  <div className="text-xs text-muted-foreground uppercase tracking-wider mt-1">En su equipo</div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Sidebar */}
        <aside className="space-y-4">
          <div className="rounded-3xl bg-card border border-border p-6 sticky top-24">
            <h3 className="font-display text-lg font-bold mb-4">Contacto directo</h3>
            <ul className="space-y-3 text-sm">
              {b.phone && (
                <li className="flex items-start gap-3">
                  <Phone className="h-4 w-4 text-coral mt-0.5 shrink-0" />
                  <a href={`tel:${b.phone}`} className="hover:text-coral break-all">{b.phone}</a>
                </li>
              )}
              {b.email && (
                <li className="flex items-start gap-3">
                  <Mail className="h-4 w-4 text-coral mt-0.5 shrink-0" />
                  <a href={`mailto:${b.email}`} className="hover:text-coral break-all">{b.email}</a>
                </li>
              )}
              {b.website && (
                <li className="flex items-start gap-3">
                  <Globe className="h-4 w-4 text-coral mt-0.5 shrink-0" />
                  <a href={b.website} target="_blank" rel="noreferrer" className="hover:text-coral break-all">{b.website.replace(/^https?:\/\//, "")}</a>
                </li>
              )}
              <li className="flex items-start gap-3">
                <MapPin className="h-4 w-4 text-coral mt-0.5 shrink-0" />
                <span>{b.address}</span>
              </li>
              {b.hours && (
                <li className="flex items-start gap-3">
                  <Clock className="h-4 w-4 text-coral mt-0.5 shrink-0" />
                  <span>{b.hours}</span>
                </li>
              )}
            </ul>

            {b.social && (b.social.instagram || b.social.facebook) && (
              <div className="mt-5 pt-5 border-t border-border flex gap-2">
                {b.social.instagram && (
                  <a href={`https://instagram.com/${b.social.instagram.replace("@", "")}`} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full bg-secondary hover:bg-muted">
                    <Instagram className="h-3.5 w-3.5" /> {b.social.instagram}
                  </a>
                )}
                {b.social.facebook && (
                  <a href={`https://facebook.com/${b.social.facebook}`} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full bg-secondary hover:bg-muted">
                    <Facebook className="h-3.5 w-3.5" /> Facebook
                  </a>
                )}
              </div>
            )}

            {b.phone && (
              <a href={`tel:${b.phone}`} className="mt-5 w-full inline-flex items-center justify-center gap-2 px-4 py-3 rounded-full bg-foreground text-background font-semibold hover:bg-coral transition">
                <Phone className="h-4 w-4" /> Contactar ahora
              </a>
            )}
          </div>
        </aside>
      </section>

      {related.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 md:px-8 pb-16">
          <h2 className="font-display text-2xl font-bold mb-6">Otros {b.category.toLowerCase()} verificados</h2>
          <div className="grid gap-6 md:grid-cols-3">
            {related.map((r) => (
              <Link key={r.slug} to="/directorio/$slug" params={{ slug: r.slug }} className="group rounded-3xl bg-card border border-border overflow-hidden hover:shadow-glow transition">
                <div className="aspect-[16/10] overflow-hidden bg-muted">
                  <img src={r.img} alt={r.name} loading="lazy" className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500" />
                </div>
                <div className="p-5">
                  <h3 className="font-display text-lg font-bold group-hover:text-coral transition">{r.name}</h3>
                  <div className="mt-1 flex items-center gap-1 text-sm">
                    <Star className="h-3.5 w-3.5 fill-coral text-coral" />
                    <span className="font-bold">{r.rating}</span>
                    <span className="text-muted-foreground">({r.reviews})</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}
    </PageShell>
  );
}
