import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ArrowLeft, MapPin, Clock, Phone, MessageCircle, Mail, Lock } from "lucide-react";
import { PageShell } from "@/components/PageShell";
import { CLASSIFIEDS_SEED, getClassified, type Classified } from "@/lib/classifieds-data";
import { classifiedAdImage } from "@/lib/clasificados-images";
import { telHref, whatsappHref } from "@/lib/contact-links";
import { supabase } from "@/integrations/supabase/client";

const SITE = "https://soloentarragona.lovable.app";
const abs = (src: string) => (src.startsWith("https://") ? src : src.startsWith("/") ? `${SITE}${src}` : undefined);

export const Route = createFileRoute("/clasificados_/$id")({
  loader: ({ params }): Classified | null => {
    const ad = getClassified(params.id);
    if (!ad) return null;
    // No exponer datos de contacto en el HTML público
    const { contact: _c, ...pub } = ad;
    return pub;
  },
  head: ({ params, loaderData }) => {
    if (!loaderData) return { meta: [{ title: "Anuncio no disponible — Clasificados Tarragona" }, { name: "robots", content: "noindex" }] };
    const title = `${loaderData.title} — ${loaderData.cat} en ${loaderData.location}, Tarragona`.slice(0, 70);
    const description = (loaderData.description ?? `${loaderData.cat} en ${loaderData.location}, Tarragona.`).slice(0, 155);
    const url = `${SITE}/clasificados/${params.id}`;
    const image = abs(classifiedAdImage(loaderData));
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:type", content: "article" },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:url", content: url },
        { name: "twitter:card", content: "summary_large_image" },
        ...(image ? [{ property: "og:image", content: image }, { name: "twitter:image", content: image }] : []),
      ],
      links: [{ rel: "canonical", href: url }],
      scripts: [
        {
          type: "application/ld+json",
          children: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "ClassifiedAd",
            name: loaderData.title,
            description,
            url,
            category: loaderData.cat,
            ...(image ? { image } : {}),
            contentLocation: { "@type": "Place", name: `${loaderData.location}, Tarragona` },
          }),
        },
      ],
    };
  },
  component: ClassifiedDetail,
});

function NotFound() {
  return (
    <PageShell>
      <div className="mx-auto max-w-3xl px-4 py-24 text-center">
        <h1 className="font-display text-4xl font-black">Anuncio no disponible</h1>
        <p className="mt-4 text-muted-foreground">Puede que haya caducado o se haya retirado.</p>
        <Link to="/clasificados" className="inline-flex items-center gap-2 mt-8 px-6 py-3 rounded-full bg-coral text-coral-foreground font-semibold">
          <ArrowLeft className="h-4 w-4" /> Volver a Clasificados
        </Link>
      </div>
    </PageShell>
  );
}

function ClassifiedDetail() {
  const loaded = Route.useLoaderData() as Classified | null;
  const { id } = Route.useParams();
  const [ad, setAd] = useState<Classified | null>(loaded);
  const [signedIn, setSignedIn] = useState(false);

  useEffect(() => {
    setAd(getClassified(id) ?? null);
    supabase.auth.getSession().then(({ data }) => setSignedIn(!!data.session));
  }, [id]);

  if (!ad) return <NotFound />;
  const tel = telHref(ad.contact?.phone);
  const wa = whatsappHref(ad.contact?.phone, `Hola, he visto tu anuncio "${ad.title}" en Solo en Tarragona.`);
  const related = CLASSIFIEDS_SEED.filter((c) => c.id !== ad.id && c.cat === ad.cat).slice(0, 3);

  return (
    <PageShell>
      <article className="mx-auto max-w-4xl px-4 md:px-8 py-10 md:py-14">
        <Link to="/clasificados" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-coral">
          <ArrowLeft className="h-4 w-4" /> Volver a Clasificados
        </Link>
        <div className="mt-6 text-xs font-bold uppercase tracking-widest text-coral">{ad.cat}</div>
        <h1 className="mt-2 font-display text-3xl md:text-5xl font-black leading-[1.05]">{ad.title}</h1>
        <div className="mt-3 flex flex-wrap gap-x-5 gap-y-2 text-sm text-muted-foreground">
          <span className="inline-flex items-center gap-1.5"><MapPin className="h-4 w-4" /> {ad.location}, Tarragona</span>
          <span className="inline-flex items-center gap-1.5"><Clock className="h-4 w-4" /> {ad.time}</span>
        </div>
        <img src={classifiedAdImage(ad)} alt={ad.title} className="mt-8 w-full aspect-[16/9] object-cover rounded-3xl border border-border" />
        {ad.description && <p className="mt-8 text-base md:text-lg leading-relaxed">{ad.description}</p>}

        <div className="mt-8 rounded-2xl border border-border bg-card p-5">
          <h2 className="font-display text-lg font-bold">Contacto</h2>
          {signedIn && ad.contact ? (
            <div className="mt-3 space-y-3">
              {ad.contact.name && <p className="font-semibold">{ad.contact.name}</p>}
              <div className="flex flex-wrap gap-2">
                {tel && <a href={tel} className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-coral text-coral-foreground font-semibold"><Phone className="h-4 w-4" /> Llamar</a>}
                {wa && <a href={wa} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-border font-semibold hover:border-coral"><MessageCircle className="h-4 w-4" /> WhatsApp</a>}
                {ad.contact.email && <a href={`mailto:${ad.contact.email}`} className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-border font-semibold hover:border-coral"><Mail className="h-4 w-4" /> Email</a>}
              </div>
            </div>
          ) : (
            <p className="mt-3 text-sm text-muted-foreground inline-flex items-center gap-2">
              <Lock className="h-4 w-4" /> <Link to="/acceder" className="text-coral font-semibold hover:underline">Accede</Link> para ver los datos de contacto.
            </p>
          )}
        </div>

        {related.length > 0 && (
          <section className="mt-14">
            <h2 className="font-display text-2xl font-black mb-4">Más anuncios de {ad.cat}</h2>
            <ul className="space-y-3">
              {related.map((r) => (
                <li key={r.id}>
                  <Link to="/clasificados/$id" params={{ id: r.id }} className="block rounded-2xl border border-border bg-card p-4 hover:border-coral">
                    <div className="font-semibold">{r.title}</div>
                    <div className="text-sm text-muted-foreground">{r.location} · {r.time}</div>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        )}
      </article>
    </PageShell>
  );
}
