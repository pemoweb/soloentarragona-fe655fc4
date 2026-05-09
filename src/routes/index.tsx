import { createFileRoute, Link } from "@tanstack/react-router";
import { Search, Newspaper, ShoppingBag, Briefcase, Megaphone, Store, Building2, MapPin, ArrowUpRight, Sparkles } from "lucide-react";
import heroImg from "@/assets/hero-tarragona.jpg";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Solo en Tarragona — Tu ciudad, en un solo clic" },
      { name: "description", content: "Descubre noticias, comercios, clasificados y servicios de Tarragona. El portal digital local más completo." },
    ],
  }),
  component: HomePage,
});

const modules = [
  { to: "/noticias", icon: Newspaper, title: "Noticias", desc: "Actualidad, cultura, deportes y sucesos de la ciudad.", color: "from-coral to-orange-400" },
  { to: "/marketplace", icon: ShoppingBag, title: "Marketplace", desc: "Compra y vende productos cerca de ti.", color: "from-blue-500 to-cyan-400" },
  { to: "/directorio", icon: Briefcase, title: "Directorio", desc: "Empresas y profesionales verificados.", color: "from-violet-500 to-fuchsia-400" },
  { to: "/clasificados", icon: Megaphone, title: "Clasificados", desc: "Empleo, alquiler, servicios. Gratis 7 días.", color: "from-emerald-500 to-teal-400" },
  { to: "/shopping", icon: Store, title: "Shopping", desc: "Las mejores tiendas y promos locales.", color: "from-amber-500 to-yellow-400" },
  { to: "/servicios-publicos", icon: Building2, title: "Servicios", desc: "Farmacias, urgencias, policía y más.", color: "from-rose-500 to-pink-400" },
] as const;

const featuredNews = [
  { tag: "Cultura", title: "Las Fiestas de Santa Tecla baten récord de visitantes", time: "hace 2h", img: "https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=800&q=80" },
  { tag: "Actualidad", title: "Nueva línea de bus eléctrico conectará el Serrallo con el centro", time: "hace 5h", img: "https://images.unsplash.com/photo-1570125909232-eb263c188f7e?w=800&q=80" },
  { tag: "Deportes", title: "El Nàstic vuelve a la victoria en el Nou Estadi", time: "ayer", img: "https://images.unsplash.com/photo-1551958219-acbc608c6377?w=800&q=80" },
];

function HomePage() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <SiteHeader />
      <main className="flex-1">
        {/* HERO */}
        <section className="relative overflow-hidden">
          <img
            src={heroImg}
            alt="Anfiteatro romano de Tarragona al atardecer"
            width={1920}
            height={1280}
            className="absolute inset-0 h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-primary/70 via-primary/60 to-background" />
          <div className="absolute inset-0 bg-gradient-to-r from-primary/80 via-transparent to-coral/40" />

          <div className="relative mx-auto max-w-7xl px-4 md:px-8 pt-20 pb-32 md:pt-32 md:pb-44 text-primary-foreground">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-semibold tracking-widest uppercase">
              <span className="h-2 w-2 rounded-full bg-coral animate-pulse" /> En directo desde la Costa Daurada
            </div>
            <h1 className="mt-6 font-display text-5xl md:text-7xl lg:text-8xl font-black leading-[0.9] text-balance max-w-5xl">
              Tu ciudad,
              <br />
              <span className="text-coral italic">en un solo clic.</span>
            </h1>
            <p className="mt-6 max-w-xl text-lg md:text-xl opacity-90 text-balance">
              Noticias, comercios, clasificados y servicios. Todo lo que pasa en Tarragona, ahora en un solo lugar.
            </p>

            {/* GLOBAL SEARCH */}
            <div className="mt-10 max-w-2xl">
              <div className="group flex items-center gap-2 p-2 rounded-2xl bg-background/95 backdrop-blur-md shadow-glow border border-white/30">
                <div className="pl-3 text-muted-foreground"><Search className="h-5 w-5" /></div>
                <input
                  type="text"
                  placeholder="Buscar noticias, comercios, anuncios..."
                  className="flex-1 bg-transparent py-3 px-2 text-foreground placeholder:text-muted-foreground focus:outline-none text-base"
                />
                <button className="px-5 md:px-6 py-3 rounded-xl bg-gradient-coral text-coral-foreground font-semibold text-sm hover:opacity-90 transition shadow-glow">
                  Buscar
                </button>
              </div>
              <div className="mt-4 flex flex-wrap gap-2 text-sm">
                <span className="opacity-70">Popular:</span>
                {["Restaurantes", "Pisos alquiler", "Farmacias guardia", "Eventos hoy"].map((t) => (
                  <button key={t} className="px-3 py-1 rounded-full bg-white/10 backdrop-blur border border-white/20 hover:bg-white/20 transition text-xs font-medium">
                    {t}
                  </button>
                ))}
              </div>
            </div>

            {/* STATS */}
            <div className="mt-16 grid grid-cols-3 gap-4 md:gap-12 max-w-2xl">
              {[
                { n: "12k+", l: "Vecinos activos" },
                { n: "850", l: "Comercios locales" },
                { n: "Diario", l: "Nuevas noticias" },
              ].map((s) => (
                <div key={s.l}>
                  <div className="font-display text-3xl md:text-5xl font-black text-coral">{s.n}</div>
                  <div className="text-xs md:text-sm opacity-75 mt-1">{s.l}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* MODULES GRID */}
        <section className="mx-auto max-w-7xl px-4 md:px-8 py-20 md:py-28">
          <div className="flex items-end justify-between flex-wrap gap-4 mb-12">
            <div>
              <span className="inline-flex items-center gap-2 text-coral text-sm font-semibold tracking-widest uppercase">
                <Sparkles className="h-4 w-4" /> Explora la ciudad
              </span>
              <h2 className="mt-3 font-display text-4xl md:text-6xl font-black text-balance max-w-2xl">
                Seis formas de vivir <span className="text-coral italic">Tarragona</span>
              </h2>
            </div>
            <p className="max-w-sm text-muted-foreground">
              Un ecosistema digital pensado para vecinos, visitantes y negocios locales.
            </p>
          </div>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {modules.map((m) => {
              const Icon = m.icon;
              return (
                <Link
                  key={m.to}
                  to={m.to}
                  className="group relative overflow-hidden rounded-3xl bg-card border border-border p-7 shadow-card hover:shadow-glow transition-all hover:-translate-y-1"
                >
                  <div className={`inline-grid h-14 w-14 place-items-center rounded-2xl bg-gradient-to-br ${m.color} text-white shadow-lg`}>
                    <Icon className="h-7 w-7" />
                  </div>
                  <h3 className="mt-5 font-display text-2xl font-bold">{m.title}</h3>
                  <p className="mt-2 text-muted-foreground text-sm leading-relaxed">{m.desc}</p>
                  <div className="mt-6 inline-flex items-center gap-1 text-sm font-semibold text-foreground group-hover:text-coral transition-colors">
                    Entrar <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </div>
                  <div className="absolute -bottom-12 -right-12 h-40 w-40 rounded-full bg-gradient-to-br opacity-0 group-hover:opacity-10 transition-opacity blur-2xl from-coral to-primary" />
                </Link>
              );
            })}
          </div>
        </section>

        {/* FEATURED NEWS */}
        <section className="bg-secondary/40 border-y border-border">
          <div className="mx-auto max-w-7xl px-4 md:px-8 py-20 md:py-24">
            <div className="flex items-end justify-between flex-wrap gap-4 mb-10">
              <h2 className="font-display text-4xl md:text-5xl font-black">Lo último de la ciudad</h2>
              <Link to="/noticias" className="inline-flex items-center gap-1 text-coral font-semibold hover:gap-2 transition-all">
                Ver todas las noticias <ArrowUpRight className="h-4 w-4" />
              </Link>
            </div>
            <div className="grid gap-6 md:grid-cols-3">
              {featuredNews.map((n) => (
                <article key={n.title} className="group cursor-pointer">
                  <div className="aspect-[4/3] overflow-hidden rounded-2xl bg-muted">
                    <img src={n.img} alt={n.title} loading="lazy" className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
                  </div>
                  <div className="mt-4 flex items-center gap-2 text-xs">
                    <span className="px-2.5 py-1 rounded-full bg-coral/10 text-coral font-semibold uppercase tracking-wider">{n.tag}</span>
                    <span className="text-muted-foreground">· {n.time}</span>
                  </div>
                  <h3 className="mt-3 font-display text-xl font-bold leading-snug group-hover:text-coral transition-colors">
                    {n.title}
                  </h3>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="mx-auto max-w-7xl px-4 md:px-8 py-20 md:py-28">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-hero p-10 md:p-16 text-primary-foreground">
            <div className="absolute -top-20 -right-20 h-80 w-80 rounded-full bg-coral/40 blur-3xl" />
            <div className="relative max-w-2xl">
              <MapPin className="h-10 w-10 text-coral" />
              <h2 className="mt-4 font-display text-4xl md:text-6xl font-black text-balance">
                ¿Tienes un negocio en Tarragona?
              </h2>
              <p className="mt-4 text-lg opacity-85 max-w-lg">
                Date de alta gratis en el directorio y llega a miles de vecinos cada día.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <button className="px-6 py-3 rounded-full bg-coral text-coral-foreground font-semibold shadow-glow hover:scale-105 transition">
                  Registrar mi negocio
                </button>
                <button className="px-6 py-3 rounded-full bg-white/10 backdrop-blur border border-white/30 font-semibold hover:bg-white/20 transition">
                  Ver planes premium
                </button>
              </div>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
