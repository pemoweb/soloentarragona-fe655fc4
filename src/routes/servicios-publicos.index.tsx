import { createFileRoute, Link } from "@tanstack/react-router";
import { PageShell, PageHero } from "@/components/PageShell";
import { Phone, Pill, Shield, Ambulance, Stethoscope, Flame, ArrowUpRight } from "lucide-react";
import { services } from "@/lib/services-data";

export const Route = createFileRoute("/servicios-publicos/")({
  component: ServiciosIndexPage,
});

const emergencyMeta: Record<string, { icon: typeof Shield; color: string }> = {
  "emergencias-112": { icon: Ambulance, color: "from-rose-500 to-red-500" },
  "policia-local-092": { icon: Shield, color: "from-blue-600 to-indigo-500" },
  "guardia-civil-062": { icon: Shield, color: "from-emerald-600 to-green-500" },
  "bombers-080": { icon: Flame, color: "from-orange-500 to-amber-500" },
};

function ServiciosIndexPage() {
  const emergencies = services.filter((s) => s.kind === "emergency");
  const pharmacies = services.filter((s) => s.kind === "pharmacy");
  const hospitals = services.filter((s) => s.kind === "hospital");

  return (
    <PageShell>
      <PageHero
        eyebrow="Servicios públicos"
        title="Toda la ayuda que puedas necesitar"
        subtitle="Teléfonos de emergencia, farmacias de guardia y hospitales de Tarragona. Pulsa una tarjeta para ver la ficha completa."
      />

      <section className="mx-auto max-w-7xl px-4 md:px-8 py-12">
        <h2 className="font-display text-3xl md:text-4xl font-black">Emergencias</h2>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {emergencies.map((e) => {
            const meta = emergencyMeta[e.slug] ?? { icon: Shield, color: "from-primary to-coral" };
            const Icon = meta.icon;
            return (
              <Link
                key={e.slug}
                to="/servicios-publicos/$slug"
                params={{ slug: e.slug }}
                className={`group relative overflow-hidden rounded-3xl p-6 bg-gradient-to-br ${meta.color} text-white shadow-card hover:shadow-glow transition-all hover:-translate-y-1`}
              >
                <Icon className="h-10 w-10" />
                <div className="mt-6 font-display text-5xl font-black tracking-tight">{e.phone}</div>
                <div className="mt-2 font-semibold opacity-90">{e.name}</div>
                <div className="absolute top-4 right-4 grid h-10 w-10 place-items-center rounded-full bg-white/20 backdrop-blur group-hover:bg-white/30 transition">
                  <ArrowUpRight className="h-4 w-4" />
                </div>
              </Link>
            );
          })}
        </div>

        <div className="mt-16 grid gap-8 lg:grid-cols-2">
          <div>
            <div className="flex items-center gap-3 mb-5">
              <div className="grid h-11 w-11 place-items-center rounded-xl bg-coral/10 text-coral">
                <Pill className="h-6 w-6" />
              </div>
              <h3 className="font-display text-2xl font-bold">Farmacias de guardia</h3>
            </div>
            <div className="rounded-2xl bg-card border border-border divide-y divide-border overflow-hidden">
              {pharmacies.map((f) => (
                <Link
                  key={f.slug}
                  to="/servicios-publicos/$slug"
                  params={{ slug: f.slug }}
                  className="p-5 flex items-center justify-between gap-4 hover:bg-secondary/40 transition"
                >
                  <div>
                    <div className="font-semibold">{f.name}</div>
                    <div className="text-sm text-muted-foreground">{f.address}</div>
                    <div className="mt-1 inline-block text-xs font-bold text-coral uppercase tracking-wider">
                      {f.hours}
                    </div>
                  </div>
                  <div className="grid h-11 w-11 place-items-center rounded-full bg-foreground text-background group-hover:bg-coral transition">
                    <ArrowUpRight className="h-4 w-4" />
                  </div>
                </Link>
              ))}
            </div>
          </div>

          <div>
            <div className="flex items-center gap-3 mb-5">
              <div className="grid h-11 w-11 place-items-center rounded-xl bg-coral/10 text-coral">
                <Stethoscope className="h-6 w-6" />
              </div>
              <h3 className="font-display text-2xl font-bold">Hospitales y urgencias</h3>
            </div>
            <div className="rounded-2xl bg-card border border-border divide-y divide-border overflow-hidden">
              {hospitals.map((h) => (
                <Link
                  key={h.slug}
                  to="/servicios-publicos/$slug"
                  params={{ slug: h.slug }}
                  className="p-5 flex items-center justify-between gap-4 hover:bg-secondary/40 transition"
                >
                  <div>
                    <div className="font-semibold">{h.name}</div>
                    <div className="text-sm text-muted-foreground">{h.address}</div>
                    <div className="mt-1 text-xs font-bold text-coral">{h.phone}</div>
                  </div>
                  <div className="grid h-11 w-11 place-items-center rounded-full bg-foreground text-background transition">
                    <Phone className="h-4 w-4" />
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>
    </PageShell>
  );
}
