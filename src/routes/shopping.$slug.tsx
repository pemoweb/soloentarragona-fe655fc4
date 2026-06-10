import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowLeft, MapPin, Phone, Clock, Share2, Store } from "lucide-react";
import { PageShell } from "@/components/PageShell";
import { getShop, SHOPS, type Shop } from "@/lib/shopping-data";

export const Route = createFileRoute("/shopping/$slug")({
  loader: ({ params }): Shop => {
    const shop = getShop(params.slug);
    if (!shop) throw notFound();
    return shop;
  },
  head: ({ loaderData }) => {
    if (!loaderData) return { meta: [{ title: "Tienda no encontrada — Solo en Tarragona" }] };
    const url = `/shopping/${loaderData.slug}`;
    return {
      meta: [
        { title: `${loaderData.name} — Productos y tienda en Tarragona` },
        { name: "description", content: `${loaderData.description.slice(0, 155)}` },
        { property: "og:type", content: "website" },
        { property: "og:title", content: `${loaderData.name} en Tarragona` },
        { property: "og:description", content: loaderData.description },
        { property: "og:image", content: loaderData.img },
        { property: "og:url", content: url },
        { name: "twitter:card", content: "summary_large_image" },
        { name: "twitter:image", content: loaderData.img },
      ],
      links: [{ rel: "canonical", href: url }],
    };
  },
  notFoundComponent: () => (
    <PageShell>
      <div className="mx-auto max-w-3xl px-4 py-24 text-center">
        <h1 className="font-display text-5xl font-black">404</h1>
        <p className="mt-4 text-muted-foreground">Esta tienda no existe.</p>
        <Link
          to="/shopping"
          className="inline-flex items-center gap-2 mt-8 px-6 py-3 rounded-full bg-coral text-coral-foreground font-semibold"
        >
          <ArrowLeft className="h-4 w-4" /> Volver a Shopping
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
  component: ShopDetail,
});

function ShopDetail() {
  const shop = Route.useLoaderData() as Shop;
  const related = SHOPS.filter((s) => s.slug !== shop.slug && s.group === shop.group).slice(0, 3);

  return (
    <PageShell>
      <article>
        <header className="relative overflow-hidden border-b border-border">
          <img src={shop.img} alt={shop.name} className="absolute inset-0 h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-b from-primary/60 via-primary/75 to-background" />
          <div className="relative mx-auto max-w-5xl px-4 md:px-8 pt-16 pb-20 md:pt-20 md:pb-24 text-primary-foreground">
            <Link to="/shopping" className="inline-flex items-center gap-2 text-sm opacity-80 hover:opacity-100">
              <ArrowLeft className="h-4 w-4" /> Shopping
            </Link>
            <div className="mt-6 flex items-center gap-2 text-xs">
              <span className="px-2.5 py-1 rounded-full bg-coral text-coral-foreground font-bold uppercase tracking-wider">{shop.category}</span>
              <span className="px-2.5 py-1 rounded-full bg-primary-foreground/15 border border-primary-foreground/20 font-semibold uppercase tracking-wider">{shop.group}</span>
            </div>
            <h1 className="mt-4 font-display text-4xl md:text-6xl font-black leading-[1.05]">{shop.name}</h1>
            <p className="mt-5 max-w-2xl text-lg md:text-xl opacity-90">{shop.description}</p>
            <div className="mt-8 flex flex-wrap gap-x-6 gap-y-2 text-sm opacity-90">
              <span className="inline-flex items-center gap-2"><MapPin className="h-4 w-4" /> {shop.address}</span>
              <a href={`tel:${shop.phone.replace(/\s/g, "")}`} className="inline-flex items-center gap-2 hover:text-coral"><Phone className="h-4 w-4" /> {shop.phone}</a>
              <span className="inline-flex items-center gap-2"><Clock className="h-4 w-4" /> {shop.hours}</span>
            </div>
          </div>
        </header>

        <section className="mx-auto max-w-7xl px-4 md:px-8 py-14">
          <div className="flex items-end justify-between mb-8">
            <div>
              <p className="text-coral text-sm font-bold uppercase tracking-widest">Catálogo</p>
              <h2 className="mt-2 font-display text-3xl md:text-4xl font-black">Productos destacados</h2>
            </div>
            <button
              onClick={() => {
                if (typeof navigator !== "undefined" && navigator.share) {
                  navigator.share({ title: shop.name, text: shop.description, url: window.location.href }).catch(() => {});
                } else if (typeof navigator !== "undefined") {
                  navigator.clipboard?.writeText(window.location.href);
                }
              }}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-foreground text-background font-semibold hover:bg-coral transition"
            >
              <Share2 className="h-4 w-4" /> Compartir
            </button>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {shop.products.map((p) => (
              <article key={p.name} className="group rounded-2xl bg-card border border-border overflow-hidden hover:shadow-card transition-all hover:-translate-y-1">
                <div className="aspect-square overflow-hidden bg-muted">
                  <img src={p.img} alt={p.name} loading="lazy" className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
                </div>
                <div className="p-5">
                  <div className="flex items-start justify-between gap-3">
                    <h3 className="font-display text-lg font-bold leading-snug">{p.name}</h3>
                    <span className="shrink-0 px-2.5 py-1 rounded-full bg-coral/10 text-coral text-sm font-bold">{p.price}</span>
                  </div>
                  <p className="mt-2 text-sm text-muted-foreground">{p.description}</p>
                </div>
              </article>
            ))}
          </div>
        </section>

        {related.length > 0 && (
          <section className="bg-secondary/40 border-t border-border">
            <div className="mx-auto max-w-7xl px-4 md:px-8 py-16">
              <h2 className="font-display text-3xl font-black mb-8">Más tiendas de {shop.group}</h2>
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {related.map((s) => (
                  <Link key={s.slug} to="/shopping/$slug" params={{ slug: s.slug }} className="group rounded-2xl bg-card border border-border overflow-hidden hover:shadow-card transition-all hover:-translate-y-1">
                    <div className="aspect-[16/10] overflow-hidden bg-muted">
                      <img src={s.img} alt={s.name} loading="lazy" className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
                    </div>
                    <div className="p-5">
                      <div className="text-xs font-bold uppercase tracking-wider text-coral">{s.category}</div>
                      <h3 className="mt-1 font-display text-lg font-bold group-hover:text-coral transition-colors inline-flex items-center gap-2">
                        <Store className="h-4 w-4" /> {s.name}
                      </h3>
                    </div>
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
