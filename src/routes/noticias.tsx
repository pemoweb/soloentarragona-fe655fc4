import { createFileRoute } from "@tanstack/react-router";
import { PageShell, PageHero } from "@/components/PageShell";
import { Clock } from "lucide-react";

export const Route = createFileRoute("/noticias")({
  head: () => ({
    meta: [
      { title: "Noticias de Tarragona — Solo en Tarragona" },
      { name: "description", content: "Toda la actualidad, cultura, deportes y sucesos de Tarragona, actualizado a diario." },
    ],
  }),
  component: NewsPage,
});

const categories = ["Todas", "Actualidad", "Cultura", "Deportes", "Eventos", "Sucesos"];

const news = [
  { tag: "Cultura", title: "Santa Tecla 2026 ya tiene cartel: el Castell de Foc abrirá las fiestas", excerpt: "El cartel oficial recupera la estética modernista de los años 20...", img: "https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=900&q=80", time: "hace 1h" },
  { tag: "Actualidad", title: "Tarragona estrena el nuevo carril bici de la Rambla Nova", excerpt: "Conectará la Plaça Imperial Tàrraco con el Balcó del Mediterrani...", img: "https://images.unsplash.com/photo-1517649763962-0c623066013b?w=900&q=80", time: "hace 3h" },
  { tag: "Deportes", title: "El Nàstic golea en el Nou Estadi y se acerca al play-off", excerpt: "Tres goles de bandera y una afición entregada en una noche mágica.", img: "https://images.unsplash.com/photo-1551958219-acbc608c6377?w=900&q=80", time: "hace 6h" },
  { tag: "Eventos", title: "Vuelve el Tarraco Viva: cinco días de historia en vivo", excerpt: "Más de 80 actividades para revivir la Tarragona romana.", img: "https://images.unsplash.com/photo-1564594985645-4427056e22e2?w=900&q=80", time: "ayer" },
  { tag: "Sucesos", title: "Aparatoso accidente sin heridos en la N-340", excerpt: "El tráfico quedó cortado durante dos horas en sentido Valencia.", img: "https://images.unsplash.com/photo-1597007030739-6d2e7172ee6b?w=900&q=80", time: "ayer" },
  { tag: "Cultura", title: "El MNAT inaugura una muestra sobre mosaicos romanos", excerpt: "Piezas inéditas procedentes del yacimiento del fórum provincial.", img: "https://images.unsplash.com/photo-1565060169187-5284992ce2e8?w=900&q=80", time: "2 días" },
];

function NewsPage() {
  const [featured, ...rest] = news;
  return (
    <PageShell>
      <PageHero
        eyebrow="Noticias"
        title="La actualidad de Tarragona, sin filtros"
        subtitle="Todo lo que ocurre en la ciudad y su entorno, contado por la comunidad y verificado por el equipo editorial."
      />

      <section className="mx-auto max-w-7xl px-4 md:px-8 py-12">
        <div className="flex gap-2 overflow-x-auto pb-3 -mx-4 px-4">
          {categories.map((c, i) => (
            <button
              key={c}
              className={`shrink-0 px-4 py-2 rounded-full text-sm font-semibold border transition ${
                i === 0 ? "bg-foreground text-background border-foreground" : "bg-card text-muted-foreground border-border hover:border-coral hover:text-coral"
              }`}
            >
              {c}
            </button>
          ))}
        </div>

        {/* Featured */}
        <article className="mt-10 grid lg:grid-cols-2 gap-8 group cursor-pointer">
          <div className="aspect-[4/3] overflow-hidden rounded-3xl bg-muted">
            <img src={featured.img} alt={featured.title} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
          </div>
          <div className="flex flex-col justify-center">
            <div className="flex items-center gap-2 text-xs">
              <span className="px-2.5 py-1 rounded-full bg-coral/10 text-coral font-bold uppercase tracking-wider">{featured.tag}</span>
              <span className="text-muted-foreground inline-flex items-center gap-1"><Clock className="h-3 w-3" /> {featured.time}</span>
            </div>
            <h2 className="mt-4 font-display text-4xl md:text-5xl font-black leading-tight group-hover:text-coral transition-colors">
              {featured.title}
            </h2>
            <p className="mt-5 text-lg text-muted-foreground">{featured.excerpt}</p>
            <button className="mt-8 self-start px-6 py-3 rounded-full bg-foreground text-background font-semibold hover:bg-coral transition">
              Leer artículo
            </button>
          </div>
        </article>

        {/* Grid */}
        <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {rest.map((n) => (
            <article key={n.title} className="group cursor-pointer">
              <div className="aspect-[4/3] overflow-hidden rounded-2xl bg-muted">
                <img src={n.img} alt={n.title} loading="lazy" className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
              </div>
              <div className="mt-4 flex items-center gap-2 text-xs">
                <span className="px-2.5 py-1 rounded-full bg-coral/10 text-coral font-semibold uppercase tracking-wider">{n.tag}</span>
                <span className="text-muted-foreground">· {n.time}</span>
              </div>
              <h3 className="mt-3 font-display text-xl font-bold leading-snug group-hover:text-coral transition-colors">{n.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground line-clamp-2">{n.excerpt}</p>
            </article>
          ))}
        </div>
      </section>
    </PageShell>
  );
}
