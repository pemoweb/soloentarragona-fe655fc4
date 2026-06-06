import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { PageShell } from "@/components/PageShell";
import {
  Phone,
  MapPin,
  Clock,
  Globe,
  Mail,
  ArrowLeft,
  Ambulance,
  Pill,
  Stethoscope,
  Share2,
} from "lucide-react";
import { getService, relatedServices, type Service, type ServiceKind } from "@/lib/services-data";
import { useDynamicSeo } from "@/lib/use-dynamic-seo";

export const Route = createFileRoute("/servicios-publicos/$slug")({
  loader: ({ params }): { service: Service; related: Service[] } => {
    const service = getService(params.slug);
    if (!service) throw notFound();
    return { service, related: relatedServices(params.slug) };
  },
  component: ServiceShow,
  notFoundComponent: () => (
    <PageShell>
      <div className="mx-auto max-w-3xl px-4 py-24 text-center">
        <h1 className="font-display text-4xl font-black">Servicio no encontrado</h1>
        <p className="mt-3 text-muted-foreground">
          El recurso que buscas no existe o ha sido retirado.
        </p>
        <Link
          to="/servicios-publicos"
          className="mt-8 inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-foreground text-background font-semibold"
        >
          <ArrowLeft className="h-4 w-4" /> Volver a Servicios
        </Link>
      </div>
    </PageShell>
  ),
});

const kindLabel: Record<ServiceKind, string> = {
  emergency: "Emergencia",
  pharmacy: "Farmacia",
  hospital: "Hospital",
};

const kindIcon = {
  emergency: Ambulance,
  pharmacy: Pill,
  hospital: Stethoscope,
} as const;

const kindGradient: Record<ServiceKind, string> = {
  emergency: "from-rose-500 via-red-500 to-orange-500",
  pharmacy: "from-emerald-500 via-teal-500 to-cyan-500",
  hospital: "from-blue-600 via-indigo-500 to-violet-500",
};

function ServiceShow() {
  const { service, related } = Route.useLoaderData();
  const Icon = kindIcon[service.kind];

  useDynamicSeo({
    title: `${service.name} — Servicios públicos Tarragona`,
    description: `${service.name}. Teléfono ${service.phone}.${service.address ? " " + service.address + "." : ""} ${service.description}`,
  });

  const telHref = `tel:${service.phone.replace(/\s/g, "")}`;
  const mapsHref = service.address
    ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(service.address)}`
    : null;

  return (
    <PageShell>
      <section className={`relative overflow-hidden border-b border-border bg-gradient-to-br ${kindGradient[service.kind]} text-white`}>
        <div className="absolute -top-32 -right-32 h-96 w-96 rounded-full bg-white/10 blur-3xl" />
        <div className="absolute -bottom-32 -left-32 h-96 w-96 rounded-full bg-black/20 blur-3xl" />
        <div className="relative mx-auto max-w-5xl px-4 md:px-8 py-12 md:py-20">
          <Link
            to="/servicios-publicos"
            className="inline-flex items-center gap-2 text-sm font-semibold opacity-80 hover:opacity-100 transition"
          >
            <ArrowLeft className="h-4 w-4" /> Servicios públicos
          </Link>

          <div className="mt-8 flex flex-wrap items-start gap-6">
            <div className="grid h-20 w-20 place-items-center rounded-3xl bg-white/15 backdrop-blur border border-white/20">
              <Icon className="h-10 w-10" />
            </div>
            <div className="flex-1 min-w-0">
              <span className="inline-block px-3 py-1 rounded-full bg-white/20 backdrop-blur text-xs font-semibold tracking-widest uppercase">
                {kindLabel[service.kind]}
              </span>
              <h1 className="mt-3 font-display text-4xl md:text-6xl font-black leading-[1.05] text-balance">
                {service.name}
              </h1>
              <p className="mt-4 max-w-2xl text-base md:text-lg opacity-90">
                {service.description}
              </p>
            </div>
          </div>

          <div className="mt-10 flex flex-wrap gap-3">
            <a
              href={telHref}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white text-foreground font-bold shadow-glow hover:scale-105 transition"
            >
              <Phone className="h-5 w-5" /> Llamar {service.phone}
            </a>
            {mapsHref && (
              <a
                href={mapsHref}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white/15 backdrop-blur border border-white/30 font-semibold hover:bg-white/25 transition"
              >
                <MapPin className="h-5 w-5" /> Cómo llegar
              </a>
            )}
            <button
              onClick={() => {
                if (typeof navigator !== "undefined" && navigator.share) {
                  navigator.share({ title: service.name, url: window.location.href }).catch(() => {});
                } else if (typeof navigator !== "undefined") {
                  navigator.clipboard?.writeText(window.location.href);
                }
              }}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white/15 backdrop-blur border border-white/30 font-semibold hover:bg-white/25 transition"
            >
              <Share2 className="h-5 w-5" /> Compartir
            </button>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-4 md:px-8 py-12 grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <div className="rounded-2xl border border-border bg-card p-6">
            <h2 className="font-display text-xl font-bold">Información de contacto</h2>
            <dl className="mt-5 divide-y divide-border">
              <Row icon={Phone} label="Teléfono" value={
                <a href={telHref} className="text-coral font-semibold hover:underline">{service.phone}</a>
              } />
              {service.address && (
                <Row icon={MapPin} label="Dirección" value={service.address} />
              )}
              {service.hours && (
                <Row icon={Clock} label="Horario" value={service.hours} />
              )}
              {service.website && (
                <Row icon={Globe} label="Web" value={
                  <a href={service.website} target="_blank" rel="noopener noreferrer" className="text-coral font-semibold hover:underline break-all">
                    {service.website.replace(/^https?:\/\//, "")}
                  </a>
                } />
              )}
              {service.email && (
                <Row icon={Mail} label="Email" value={
                  <a href={`mailto:${service.email}`} className="text-coral font-semibold hover:underline">{service.email}</a>
                } />
              )}
            </dl>
          </div>

          {service.address && (
            <div className="rounded-2xl border border-border bg-card overflow-hidden">
              <iframe
                title={`Mapa de ${service.name}`}
                src={`https://www.google.com/maps?q=${encodeURIComponent(service.address)}&output=embed`}
                className="w-full h-72 border-0"
                loading="lazy"
              />
            </div>
          )}
        </div>

        <aside className="space-y-4">
          <div className="rounded-2xl border border-border bg-card p-6">
            <h3 className="font-display text-lg font-bold">Otros {kindLabel[service.kind].toLowerCase()}s</h3>
            <ul className="mt-4 space-y-3">
              {related.length === 0 && (
                <li className="text-sm text-muted-foreground">No hay otros servicios relacionados.</li>
              )}
              {related.map((r) => (
                <li key={r.slug}>
                  <Link
                    to="/servicios-publicos/$slug"
                    params={{ slug: r.slug }}
                    className="block rounded-xl border border-border p-3 hover:bg-secondary/40 transition"
                  >
                    <div className="font-semibold text-sm">{r.name}</div>
                    <div className="text-xs text-muted-foreground mt-0.5">{r.phone}</div>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </aside>
      </section>
    </PageShell>
  );
}

function Row({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof Phone;
  label: string;
  value: React.ReactNode;
}) {
  return (
    <div className="py-3 flex items-start gap-4">
      <div className="grid h-9 w-9 place-items-center rounded-lg bg-muted text-muted-foreground shrink-0">
        <Icon className="h-4 w-4" />
      </div>
      <div className="min-w-0">
        <dt className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">{label}</dt>
        <dd className="mt-0.5 text-sm break-words">{value}</dd>
      </div>
    </div>
  );
}
