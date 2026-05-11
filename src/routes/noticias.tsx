import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Clock, PenSquare, Tag } from "lucide-react";
import { PageShell, PageHero } from "@/components/PageShell";
import {
  NEWS_CATEGORIES,
  POPULAR_TAGS,
  formatRelativeDate,
  getAllPosts,
} from "@/lib/news-data";

export const Route = createFileRoute("/noticias")({
  head: () => ({
    meta: [
      { title: "Noticias de Tarragona — Solo en Tarragona" },
      {
        name: "description",
        content:
          "Toda la actualidad, cultura, deportes y sucesos de Tarragona, actualizado a diario.",
      },
      { property: "og:title", content: "Noticias de Tarragona" },
      {
        property: "og:description",
        content: "Lo último de la ciudad, contado por la comunidad.",
      },
    ],
  }),
  component: NewsPage,
});

const ALL = "Todas" as const;

function NewsPage() {
  const [category, setCategory] = useState<string>(ALL);
  const [tag, setTag] = useState<string | null>(null);

  // Re-evaluate on every render so newly created posts appear immediately.
  const posts = getAllPosts();

  const filtered = useMemo(() => {
    return posts.filter((p) => {
      if (category !== ALL && p.category !== category) return false;
      if (tag && !p.tags.includes(tag)) return false;
      return true;
    });
  }, [posts, category, tag]);

  const [featured, ...rest] = filtered;

  return (
    <PageShell>
      <PageHero
        eyebrow="Noticias"
        title="La actualidad de Tarragona, sin filtros"
        subtitle="Todo lo que ocurre en la ciudad y su entorno, contado por la comunidad y verificado por el equipo editorial."
      />

      <section className="mx-auto max-w-7xl px-4 md:px-8 py-12">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <div className="flex gap-2 overflow-x-auto pb-1">
            {[ALL, ...NEWS_CATEGORIES].map((c) => (
              <button
                key={c}
                onClick={() => setCategory(c)}
                className={`shrink-0 px-4 py-2 rounded-full text-sm font-semibold border transition ${
                  category === c
                    ? "bg-foreground text-background border-foreground"
                    : "bg-card text-muted-foreground border-border hover:border-coral hover:text-coral"
                }`}
              >
                {c}
              </button>
            ))}
          </div>
          <Link
            to="/noticias/publicar"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-coral text-coral-foreground font-semibold shadow-glow hover:scale-[1.02] transition"
          >
            <PenSquare className="h-4 w-4" /> Publicar noticia
          </Link>
        </div>

        {/* Tag chips */}
        <div className="flex flex-wrap items-center gap-2 mb-10 text-xs">
          <span className="inline-flex items-center gap-1 text-muted-foreground font-semibold uppercase tracking-wider">
            <Tag className="h-3 w-3" /> Etiquetas:
          </span>
          {POPULAR_TAGS.map((t) => {
            const active = tag === t;
            return (
              <button
                key={t}
                onClick={() => setTag(active ? null : t)}
                className={`px-3 py-1 rounded-full border transition ${
                  active
                    ? "bg-coral text-coral-foreground border-coral"
                    : "bg-card border-border text-muted-foreground hover:border-coral hover:text-coral"
                }`}
              >
                #{t}
              </button>
            );
          })}
          {tag && (
            <button
              onClick={() => setTag(null)}
              className="px-3 py-1 rounded-full text-muted-foreground underline"
            >
              limpiar
            </button>
          )}
        </div>

        {filtered.length === 0 && (
          <div className="rounded-3xl border border-dashed border-border p-12 text-center text-muted-foreground">
            No hay noticias con estos filtros todavía.
          </div>
        )}

        {/* Featured */}
        {featured && (
          <Link
            to="/noticias/$slug"
            params={{ slug: featured.slug }}
            className="grid lg:grid-cols-2 gap-8 group"
          >
            <div className="aspect-[4/3] overflow-hidden rounded-3xl bg-muted">
              <img
                src={featured.cover}
                alt={featured.title}
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
            </div>
            <div className="flex flex-col justify-center">
              <div className="flex items-center gap-2 text-xs">
                <span className="px-2.5 py-1 rounded-full bg-coral/10 text-coral font-bold uppercase tracking-wider">
                  {featured.category}
                </span>
                <span className="text-muted-foreground inline-flex items-center gap-1">
                  <Clock className="h-3 w-3" /> {formatRelativeDate(featured.publishedAt)}
                </span>
              </div>
              <h2 className="mt-4 font-display text-4xl md:text-5xl font-black leading-tight group-hover:text-coral transition-colors">
                {featured.title}
              </h2>
              <p className="mt-5 text-lg text-muted-foreground">{featured.excerpt}</p>
              <span className="mt-8 self-start px-6 py-3 rounded-full bg-foreground text-background font-semibold group-hover:bg-coral transition">
                Leer artículo
              </span>
            </div>
          </Link>
        )}

        {/* Grid */}
        {rest.length > 0 && (
          <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {rest.map((n) => (
              <Link
                to="/noticias/$slug"
                params={{ slug: n.slug }}
                key={n.slug}
                className="group"
              >
                <div className="aspect-[4/3] overflow-hidden rounded-2xl bg-muted">
                  <img
                    src={n.cover}
                    alt={n.title}
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <div className="mt-4 flex items-center gap-2 text-xs">
                  <span className="px-2.5 py-1 rounded-full bg-coral/10 text-coral font-semibold uppercase tracking-wider">
                    {n.category}
                  </span>
                  <span className="text-muted-foreground">
                    · {formatRelativeDate(n.publishedAt)}
                  </span>
                </div>
                <h3 className="mt-3 font-display text-xl font-bold leading-snug group-hover:text-coral transition-colors">
                  {n.title}
                </h3>
                <p className="mt-2 text-sm text-muted-foreground line-clamp-2">{n.excerpt}</p>
              </Link>
            ))}
          </div>
        )}
      </section>
    </PageShell>
  );
}
