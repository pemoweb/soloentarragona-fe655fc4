import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowLeft, Clock, Share2, User } from "lucide-react";
import { PageShell } from "@/components/PageShell";
import { formatRelativeDate, getAllPosts, getPostBySlug, type NewsPost } from "@/lib/news-data";

export const Route = createFileRoute("/noticias/$slug")({
  // Loader runs on client (we use localStorage). Return the post data for head().
  loader: ({ params }): NewsPost => {
    const post = getPostBySlug(params.slug);
    if (!post) throw notFound();
    return post;
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return { meta: [{ title: "Noticia no encontrada — Solo en Tarragona" }] };
    }
    const url = `/noticias/${loaderData.slug}`;
    return {
      meta: [
        { title: `${loaderData.title} — Solo en Tarragona` },
        { name: "description", content: loaderData.excerpt },
        { name: "author", content: loaderData.author },
        { name: "keywords", content: loaderData.tags.join(", ") },
        { property: "og:type", content: "article" },
        { property: "og:title", content: loaderData.title },
        { property: "og:description", content: loaderData.excerpt },
        { property: "og:image", content: loaderData.cover },
        { property: "og:url", content: url },
        { property: "article:published_time", content: loaderData.publishedAt },
        { property: "article:section", content: loaderData.category },
        { name: "twitter:card", content: "summary_large_image" },
        { name: "twitter:title", content: loaderData.title },
        { name: "twitter:description", content: loaderData.excerpt },
        { name: "twitter:image", content: loaderData.cover },
      ],
      links: [{ rel: "canonical", href: url }],
      scripts: [
        {
          type: "application/ld+json",
          children: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "NewsArticle",
            headline: loaderData.title,
            description: loaderData.excerpt,
            image: [loaderData.cover],
            datePublished: loaderData.publishedAt,
            author: { "@type": "Person", name: loaderData.author },
            articleSection: loaderData.category,
            keywords: loaderData.tags.join(", "),
          }),
        },
      ],
    };
  },
  notFoundComponent: () => (
    <PageShell>
      <div className="mx-auto max-w-3xl px-4 py-24 text-center">
        <h1 className="font-display text-5xl font-black">404</h1>
        <p className="mt-4 text-muted-foreground">Esta noticia no existe o fue retirada.</p>
        <Link
          to="/noticias"
          className="inline-flex items-center gap-2 mt-8 px-6 py-3 rounded-full bg-coral text-coral-foreground font-semibold"
        >
          <ArrowLeft className="h-4 w-4" /> Volver a noticias
        </Link>
      </div>
    </PageShell>
  ),
  errorComponent: ({ error }) => (
    <PageShell>
      <div className="mx-auto max-w-3xl px-4 py-24 text-center">
        <h1 className="font-display text-3xl font-black">Algo ha fallado</h1>
        <p className="mt-4 text-muted-foreground">{error.message}</p>
      </div>
    </PageShell>
  ),
  component: NewsDetail,
});

function NewsDetail() {
  const post = Route.useLoaderData() as NewsPost;
  const all = getAllPosts();
  const related = all
    .filter((p) => p.slug !== post.slug && p.category === post.category)
    .slice(0, 3);

  const paragraphs = post.content.split(/\n\s*\n/);

  return (
    <PageShell>
      <article>
        {/* Hero */}
        <header className="relative overflow-hidden border-b border-border">
          <img
            src={post.cover}
            alt={post.title}
            className="absolute inset-0 h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-primary/60 via-primary/70 to-background" />
          <div className="relative mx-auto max-w-4xl px-4 md:px-8 pt-16 pb-20 md:pt-24 md:pb-28 text-primary-foreground">
            <Link
              to="/noticias"
              className="inline-flex items-center gap-2 text-sm opacity-80 hover:opacity-100"
            >
              <ArrowLeft className="h-4 w-4" /> Noticias
            </Link>
            <span className="mt-6 inline-block px-3 py-1 rounded-full bg-coral text-coral-foreground text-xs font-bold uppercase tracking-widest">
              {post.category}
            </span>
            <h1 className="mt-5 font-display text-4xl md:text-6xl font-black leading-[1.05] text-balance max-w-3xl">
              {post.title}
            </h1>
            <p className="mt-5 text-lg md:text-xl opacity-90 max-w-2xl">{post.excerpt}</p>
            <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm opacity-85">
              <span className="inline-flex items-center gap-2">
                <User className="h-4 w-4" /> {post.author}
              </span>
              <span className="inline-flex items-center gap-2">
                <Clock className="h-4 w-4" /> {formatRelativeDate(post.publishedAt)} ·{" "}
                {post.readingMinutes} min lectura
              </span>
            </div>
          </div>
        </header>

        {/* Body */}
        <div className="mx-auto max-w-3xl px-4 md:px-8 py-12 md:py-16">
          <div className="prose prose-lg max-w-none">
            {paragraphs.map((p, i) => (
              <p
                key={i}
                className="text-lg leading-relaxed text-foreground/90 mb-6 first:text-xl first:font-medium first:text-foreground"
              >
                {p}
              </p>
            ))}
          </div>

          {post.tags.length > 0 && (
            <div className="mt-10 pt-8 border-t border-border flex flex-wrap items-center gap-2">
              <span className="text-sm font-semibold text-muted-foreground mr-2">Etiquetas:</span>
              {post.tags.map((t) => (
                <span
                  key={t}
                  className="px-3 py-1 rounded-full bg-muted text-sm font-medium text-foreground"
                >
                  #{t}
                </span>
              ))}
            </div>
          )}

          <div className="mt-8 flex items-center justify-between gap-4 p-5 rounded-2xl bg-secondary/40 border border-border">
            <div>
              <p className="font-display text-lg font-bold">¿Te ha gustado este artículo?</p>
              <p className="text-sm text-muted-foreground">Compártelo con tu vecindario.</p>
            </div>
            <button
              onClick={() => {
                if (typeof navigator !== "undefined" && navigator.share) {
                  navigator
                    .share({ title: post.title, text: post.excerpt, url: window.location.href })
                    .catch(() => {});
                } else if (typeof navigator !== "undefined") {
                  navigator.clipboard?.writeText(window.location.href);
                }
              }}
              className="inline-flex items-center gap-2 px-5 py-3 rounded-full bg-foreground text-background font-semibold hover:bg-coral transition"
            >
              <Share2 className="h-4 w-4" /> Compartir
            </button>
          </div>
        </div>

        {/* Related */}
        {related.length > 0 && (
          <section className="bg-secondary/40 border-t border-border">
            <div className="mx-auto max-w-7xl px-4 md:px-8 py-16">
              <h2 className="font-display text-3xl md:text-4xl font-black mb-8">
                También en {post.category}
              </h2>
              <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
                {related.map((n) => (
                  <Link
                    key={n.slug}
                    to="/noticias/$slug"
                    params={{ slug: n.slug }}
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
                    <h3 className="mt-3 font-display text-lg font-bold leading-snug group-hover:text-coral transition-colors">
                      {n.title}
                    </h3>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {formatRelativeDate(n.publishedAt)}
                    </p>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}
      </article>
    </PageShell>
  );
}
