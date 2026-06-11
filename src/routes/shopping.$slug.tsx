import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowLeft, ShoppingCart, Share2, Truck, ShieldCheck, RotateCcw, MapPin, Tag, Minus, Plus } from "lucide-react";
import { useState } from "react";
import { PageShell } from "@/components/PageShell";
import { getProduct, PRODUCTS, STORE, formatPrice, type Product } from "@/lib/shopping-data";

export const Route = createFileRoute("/shopping/$slug")({
  loader: ({ params }): Product => {
    const product = getProduct(params.slug);
    if (!product) throw notFound();
    return product;
  },
  head: ({ loaderData }) => {
    if (!loaderData) return { meta: [{ title: "Producto no encontrado — Solo en Tarragona" }] };
    const url = `/shopping/${loaderData.slug}`;
    return {
      meta: [
        { title: `${loaderData.name} — ${STORE.name}` },
        { name: "description", content: loaderData.shortDescription },
        { property: "og:type", content: "product" },
        { property: "og:title", content: loaderData.name },
        { property: "og:description", content: loaderData.shortDescription },
        { property: "og:image", content: loaderData.img },
        { property: "og:url", content: url },
        { property: "product:price:amount", content: String(loaderData.price) },
        { property: "product:price:currency", content: "EUR" },
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
        <p className="mt-4 text-muted-foreground">Este producto no existe o ya no está disponible.</p>
        <Link to="/shopping" className="inline-flex items-center gap-2 mt-8 px-6 py-3 rounded-full bg-coral text-coral-foreground font-semibold">
          <ArrowLeft className="h-4 w-4" /> Volver a la tienda
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
  component: ProductDetail,
});

function ProductDetail() {
  const product = Route.useLoaderData() as Product;
  const gallery = product.gallery && product.gallery.length > 0 ? product.gallery : [product.img];
  const [active, setActive] = useState(0);
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);

  const related = PRODUCTS.filter((p) => p.slug !== product.slug && p.category === product.category).slice(0, 3);
  const discount = product.oldPrice ? Math.round((1 - product.price / product.oldPrice) * 100) : 0;

  const handleAdd = () => {
    setAdded(true);
    setTimeout(() => setAdded(false), 1800);
  };

  const handleShare = () => {
    if (typeof navigator === "undefined") return;
    if (navigator.share) {
      navigator.share({ title: product.name, text: product.shortDescription, url: window.location.href }).catch(() => {});
    } else {
      navigator.clipboard?.writeText(window.location.href);
    }
  };

  return (
    <PageShell>
      <article className="mx-auto max-w-7xl px-4 md:px-8 py-10 md:py-14">
        <Link to="/shopping" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-coral">
          <ArrowLeft className="h-4 w-4" /> Volver a la tienda
        </Link>

        <div className="mt-6 grid gap-10 lg:grid-cols-2">
          {/* Gallery */}
          <div>
            <div className="relative aspect-square overflow-hidden rounded-3xl bg-muted border border-border">
              <img src={gallery[active]} alt={product.name} className="h-full w-full object-cover" />
              {product.badge && (
                <span className="absolute top-4 left-4 px-3 py-1.5 rounded-full bg-coral text-coral-foreground text-xs font-bold uppercase tracking-wider">
                  {product.badge}
                </span>
              )}
              {discount > 0 && (
                <span className="absolute top-4 right-4 px-3 py-1.5 rounded-full bg-foreground text-background text-xs font-bold uppercase tracking-wider inline-flex items-center gap-1">
                  <Tag className="h-3 w-3" /> -{discount}%
                </span>
              )}
            </div>
            {gallery.length > 1 && (
              <div className="mt-4 grid grid-cols-4 gap-3">
                {gallery.map((src, i) => (
                  <button
                    key={src}
                    onClick={() => setActive(i)}
                    className={`aspect-square overflow-hidden rounded-xl border-2 transition ${i === active ? "border-coral" : "border-border hover:border-foreground/40"}`}
                  >
                    <img src={src} alt={`${product.name} ${i + 1}`} className="h-full w-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Details */}
          <div>
            <div className="text-xs font-bold uppercase tracking-widest text-coral">{product.category}</div>
            <h1 className="mt-2 font-display text-3xl md:text-5xl font-black leading-[1.05]">{product.name}</h1>
            <p className="mt-3 text-muted-foreground inline-flex items-center gap-2 text-sm">
              <MapPin className="h-4 w-4" /> Origen: {product.origin}
            </p>

            <div className="mt-6 flex items-end gap-3">
              <span className="font-display text-4xl font-black">{formatPrice(product.price)}</span>
              {product.oldPrice && (
                <span className="text-lg line-through text-muted-foreground mb-1">{formatPrice(product.oldPrice)}</span>
              )}
            </div>
            <p className="mt-1 text-xs text-muted-foreground">IVA incluido · Envío desde {formatPrice(STORE.shippingFrom)}</p>

            <p className="mt-6 text-base leading-relaxed">{product.description}</p>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <div className="inline-flex items-center rounded-full border border-border bg-card">
                <button
                  onClick={() => setQty((q) => Math.max(1, q - 1))}
                  className="p-3 hover:text-coral disabled:opacity-40"
                  disabled={qty <= 1}
                  aria-label="Restar"
                >
                  <Minus className="h-4 w-4" />
                </button>
                <span className="w-10 text-center font-bold">{qty}</span>
                <button
                  onClick={() => setQty((q) => Math.min(product.stock, q + 1))}
                  className="p-3 hover:text-coral disabled:opacity-40"
                  disabled={qty >= product.stock}
                  aria-label="Sumar"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
              <button
                onClick={handleAdd}
                className="flex-1 min-w-[200px] inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full bg-coral text-coral-foreground font-bold hover:opacity-90 transition"
              >
                <ShoppingCart className="h-5 w-5" /> {added ? "¡Añadido!" : "Añadir al carrito"}
              </button>
              <button
                onClick={handleShare}
                className="inline-flex items-center gap-2 px-4 py-3.5 rounded-full bg-card border border-border font-semibold hover:border-coral hover:text-coral transition"
              >
                <Share2 className="h-4 w-4" />
              </button>
            </div>

            <p className="mt-3 text-sm">
              {product.stock > 10 ? (
                <span className="text-emerald-600 font-semibold">● En stock</span>
              ) : product.stock > 0 ? (
                <span className="text-coral font-semibold">● Últimas {product.stock} unidades</span>
              ) : (
                <span className="text-destructive font-semibold">● Agotado</span>
              )}
            </p>

            <ul className="mt-8 grid gap-3 text-sm">
              <li className="inline-flex items-center gap-3"><Truck className="h-4 w-4 text-coral" /> Envío gratis a partir de {formatPrice(STORE.freeShippingThreshold)}</li>
              <li className="inline-flex items-center gap-3"><RotateCcw className="h-4 w-4 text-coral" /> Devoluciones gratuitas durante 14 días</li>
              <li className="inline-flex items-center gap-3"><ShieldCheck className="h-4 w-4 text-coral" /> Pago seguro con cifrado SSL</li>
            </ul>
          </div>
        </div>

        {related.length > 0 && (
          <section className="mt-20">
            <h2 className="font-display text-3xl font-black mb-8">También te puede interesar</h2>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((p) => (
                <Link key={p.slug} to="/shopping/$slug" params={{ slug: p.slug }} className="group rounded-2xl bg-card border border-border overflow-hidden hover:shadow-card transition-all hover:-translate-y-1">
                  <div className="aspect-square overflow-hidden bg-muted">
                    <img src={p.img} alt={p.name} loading="lazy" className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
                  </div>
                  <div className="p-5">
                    <div className="text-xs font-bold uppercase tracking-wider text-coral">{p.category}</div>
                    <h3 className="mt-1 font-display text-lg font-bold group-hover:text-coral transition-colors">{p.name}</h3>
                    <div className="mt-2 font-display text-lg font-black">{formatPrice(p.price)}</div>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}
      </article>
    </PageShell>
  );
}
