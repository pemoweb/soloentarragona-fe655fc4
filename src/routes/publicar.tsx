import { createFileRoute, Link } from "@tanstack/react-router";
import { Newspaper, ShoppingBag, Megaphone, ArrowRight } from "lucide-react";
import { PageShell, PageHero } from "@/components/PageShell";

export const Route = createFileRoute("/publicar")({
  head: () => ({
    meta: [
      { title: "Publicar en Solo en Tarragona — Elige qué quieres publicar" },
      {
        name: "description",
        content:
          "Publica una noticia, un anuncio de marketplace o un clasificado gratuito en Tarragona. Llega a miles de vecinos en minutos.",
      },
      {
        property: "og:title",
        content: "Publicar en Solo en Tarragona",
      },
      {
        property: "og:description",
        content:
          "Noticias, marketplace y clasificados. Publica gratis en minutos.",
      },
    ],
  }),
  component: PublicarHub,
});

const OPTIONS = [
  {
    to: "/noticias/publicar",
    icon: Newspaper,
    title: "Noticia",
    desc: "Comparte lo que pasa en tu barrio. Revisamos antes de publicar para mantener la calidad.",
    badge: "Editorial",
    color: "from-blue-500 to-cyan-400",
  },
  {
    to: "/clasificados/publicar",
    icon: Megaphone,
    title: "Clasificado",
    desc: "Empleo, alquiler, servicios o venta. Visible durante 7 días, sin comisiones.",
    badge: "Gratis 7 días",
    color: "from-coral to-orange-400",
  },
  {
    to: "/marketplace",
    icon: ShoppingBag,
    title: "Producto en Marketplace",
    desc: "Vende tus cosas a vecinos cerca de ti. Próximamente con publicación directa.",
    badge: "Próximamente",
    color: "from-emerald-500 to-teal-400",
  },
] as const;

function PublicarHub() {
  return (
    <PageShell>
      <PageHero
        eyebrow="Publicar"
        title="¿Qué quieres publicar hoy?"
        subtitle="Elige el formato que mejor encaja con tu mensaje. Todo es gratuito y llega directo a la comunidad de Tarragona."
      />
      <section className="mx-auto max-w-6xl px-4 md:px-8 pb-20">
        <div className="grid gap-6 md:grid-cols-3">
          {OPTIONS.map((o) => {
            const Icon = o.icon;
            return (
              <Link
                key={o.to}
                to={o.to}
                className="group p-7 rounded-3xl bg-card border border-border hover:shadow-glow hover:-translate-y-1 transition-all flex flex-col"
              >
                <div
                  className={`inline-grid h-14 w-14 place-items-center rounded-2xl bg-gradient-to-br ${o.color} text-white shadow-glow`}
                >
                  <Icon className="h-7 w-7" />
                </div>
                <span className="mt-5 text-xs font-bold uppercase tracking-wider text-coral">
                  {o.badge}
                </span>
                <h2 className="mt-1 font-display text-2xl font-bold">
                  {o.title}
                </h2>
                <p className="mt-2 text-sm text-muted-foreground flex-1">
                  {o.desc}
                </p>
                <span className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-foreground group-hover:text-coral transition">
                  Empezar <ArrowRight className="h-4 w-4" />
                </span>
              </Link>
            );
          })}
        </div>
      </section>
    </PageShell>
  );
}
