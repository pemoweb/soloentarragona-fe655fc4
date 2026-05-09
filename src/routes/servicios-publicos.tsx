import { createFileRoute } from "@tanstack/react-router";
import { PageShell, PageHero } from "@/components/PageShell";
import { Phone, Pill, Shield, Ambulance, Stethoscope, Flame, Search } from "lucide-react";

export const Route = createFileRoute("/servicios-publicos")({
  head: () => ({
    meta: [
      { title: "Servicios públicos de Tarragona — Teléfonos de urgencia" },
      { name: "description", content: "Farmacias de guardia, hospitales, policía local, Guardia Civil y emergencias en Tarragona. Contacto directo." },
    ],
  }),
  component: ServiciosPage,
});

const emergencies = [
  { name: "Emergencias generales", phone: "112", icon: Ambulance, color: "from-rose-500 to-red-500" },
  { name: "Policía Local", phone: "092", icon: Shield, color: "from-blue-600 to-indigo-500" },
  { name: "Guardia Civil", phone: "062", icon: Shield, color: "from-emerald-600 to-green-500" },
  { name: "Bomberos", phone: "080", icon: Flame, color: "from-orange-500 to-amber-500" },
];

const hospitals = [
  { name: "Hospital Universitari Joan XXIII", phone: "977 29 58 00", address: "Doctor Mallafrè Guasch, 4" },
  { name: "Hospital Santa Tecla", phone: "977 25 99 00", address: "Rambla Vella, 14" },
  { name: "Pius Hospital de Valls (referencia)", phone: "977 61 30 00", address: "Plaça Sant Francesc, 1" },
];

const farmacias = [
  { name: "Farmàcia Rambla Nova", address: "Rambla Nova, 102", hours: "24h hoy" },
  { name: "Farmàcia Sant Pere", address: "Av. Sant Pere i Sant Pau, 23", hours: "24h hoy" },
  { name: "Farmàcia Pla", address: "Carrer Pere Martell, 8", hours: "Hasta 22:00" },
];

function ServiciosPage() {
  return (
    <PageShell>
      <PageHero
        eyebrow="Servicios públicos"
        title="Toda la ayuda que puedas necesitar"
        subtitle="Teléfonos de emergencia, farmacias de guardia y hospitales de Tarragona. Click para llamar directamente."
      />

      <section className="mx-auto max-w-7xl px-4 md:px-8 py-12">
        {/* Emergency big buttons */}
        <h2 className="font-display text-3xl md:text-4xl font-black">Emergencias</h2>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {emergencies.map((e) => {
            const Icon = e.icon;
            return (
              <a key={e.name} href={`tel:${e.phone}`} className={`group relative overflow-hidden rounded-3xl p-6 bg-gradient-to-br ${e.color} text-white shadow-card hover:shadow-glow transition-all hover:-translate-y-1`}>
                <Icon className="h-10 w-10" />
                <div className="mt-6 font-display text-5xl font-black tracking-tight">{e.phone}</div>
                <div className="mt-2 font-semibold opacity-90">{e.name}</div>
                <div className="absolute top-4 right-4 grid h-10 w-10 place-items-center rounded-full bg-white/20 backdrop-blur group-hover:bg-white/30 transition">
                  <Phone className="h-4 w-4" />
                </div>
              </a>
            );
          })}
        </div>

        <div className="mt-16 grid gap-8 lg:grid-cols-2">
          {/* Pharmacies */}
          <div>
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-3">
                <div className="grid h-11 w-11 place-items-center rounded-xl bg-coral/10 text-coral"><Pill className="h-6 w-6" /></div>
                <h3 className="font-display text-2xl font-bold">Farmacias de guardia</h3>
              </div>
              <button className="text-sm font-semibold text-coral inline-flex items-center gap-1 hover:gap-2 transition-all">
                <Search className="h-4 w-4" /> Buscar
              </button>
            </div>
            <div className="rounded-2xl bg-card border border-border divide-y divide-border overflow-hidden">
              {farmacias.map((f) => (
                <div key={f.name} className="p-5 flex items-center justify-between gap-4 hover:bg-secondary/40 transition">
                  <div>
                    <div className="font-semibold">{f.name}</div>
                    <div className="text-sm text-muted-foreground">{f.address}</div>
                    <div className="mt-1 inline-block text-xs font-bold text-coral uppercase tracking-wider">{f.hours}</div>
                  </div>
                  <a href="tel:+34977000000" className="grid h-11 w-11 place-items-center rounded-full bg-foreground text-background hover:bg-coral transition">
                    <Phone className="h-4 w-4" />
                  </a>
                </div>
              ))}
            </div>
          </div>

          {/* Hospitals */}
          <div>
            <div className="flex items-center gap-3 mb-5">
              <div className="grid h-11 w-11 place-items-center rounded-xl bg-coral/10 text-coral"><Stethoscope className="h-6 w-6" /></div>
              <h3 className="font-display text-2xl font-bold">Hospitales y urgencias</h3>
            </div>
            <div className="rounded-2xl bg-card border border-border divide-y divide-border overflow-hidden">
              {hospitals.map((h) => (
                <div key={h.name} className="p-5 flex items-center justify-between gap-4 hover:bg-secondary/40 transition">
                  <div>
                    <div className="font-semibold">{h.name}</div>
                    <div className="text-sm text-muted-foreground">{h.address}</div>
                    <div className="mt-1 text-xs font-bold text-coral">{h.phone}</div>
                  </div>
                  <a href={`tel:${h.phone.replace(/\s/g, "")}`} className="grid h-11 w-11 place-items-center rounded-full bg-foreground text-background hover:bg-coral transition">
                    <Phone className="h-4 w-4" />
                  </a>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </PageShell>
  );
}
