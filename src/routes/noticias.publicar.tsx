import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useState } from "react";
import { z } from "zod";
import { ArrowLeft, ImagePlus, Send, Tag as TagIcon, X } from "lucide-react";
import { PageShell, PageHero } from "@/components/PageShell";
import {
  NEWS_CATEGORIES,
  POPULAR_TAGS,
  type NewsCategory,
} from "@/lib/news-data";
import { submitToModeration } from "@/lib/moderation";

export const Route = createFileRoute("/noticias/publicar")({
  head: () => ({
    meta: [
      { title: "Publicar noticia — Solo en Tarragona" },
      {
        name: "description",
        content:
          "Comparte una noticia, evento o aviso con la comunidad de Tarragona en menos de un minuto.",
      },
      { name: "robots", content: "noindex, follow" },
    ],
  }),
  component: PublishPage,
});

const schema = z.object({
  title: z.string().trim().min(8, "El titular es muy corto").max(140),
  excerpt: z.string().trim().min(20, "Añade un pequeño resumen").max(280),
  content: z.string().trim().min(50, "El cuerpo debe tener al menos 50 caracteres").max(10000),
  category: z.enum(NEWS_CATEGORIES as [NewsCategory, ...NewsCategory[]]),
  tags: z.array(z.string().min(1).max(40)).max(8),
  cover: z.string().trim().url("URL de imagen no válida").or(z.literal("")),
  author: z.string().trim().max(80).optional(),
});

function PublishPage() {
  const navigate = useNavigate();
  const [submitted, setSubmitted] = useState(false);
  const [title, setTitle] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState<NewsCategory>("Actualidad");
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");
  const [cover, setCover] = useState("");
  const [author, setAuthor] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);

  const addTag = (raw: string) => {
    const t = raw.trim().replace(/^#/, "");
    if (!t) return;
    if (tags.includes(t) || tags.length >= 8) return;
    setTags([...tags, t]);
    setTagInput("");
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = schema.safeParse({
      title,
      excerpt,
      content,
      category,
      tags,
      cover,
      author,
    });
    if (!parsed.success) {
      const errs: Record<string, string> = {};
      for (const issue of parsed.error.issues) {
        errs[issue.path[0] as string] = issue.message;
      }
      setErrors(errs);
      return;
    }
    setErrors({});
    setSubmitting(true);
    submitToModeration("news", {
      title: parsed.data.title,
      excerpt: parsed.data.excerpt,
      content: parsed.data.content,
      category: parsed.data.category,
      tags: parsed.data.tags,
      cover: parsed.data.cover,
      author: parsed.data.author ?? "",
    });
    setSubmitted(true);
    setSubmitting(false);
  };

  if (submitted) {
    return (
      <PageShell>
        <PageHero eyebrow="Publicar" title="¡Noticia enviada!" subtitle="Tu noticia está en la cola de moderación." />
        <section className="mx-auto max-w-2xl px-4 md:px-8 pb-20 text-center">
          <div className="rounded-3xl border border-border bg-card p-10 shadow-card">
            <p className="text-muted-foreground">
              El equipo editorial la revisará antes de publicarla. Recibirás novedades por email cuando esté aprobada.
            </p>
            <div className="mt-6 flex justify-center gap-3">
              <button onClick={() => navigate({ to: "/noticias" })} className="px-6 py-2.5 rounded-full bg-foreground text-background font-semibold text-sm hover:bg-coral transition">
                Volver a noticias
              </button>
              <button onClick={() => { setSubmitted(false); setTitle(""); setExcerpt(""); setContent(""); setTags([]); setCover(""); setAuthor(""); }} className="px-6 py-2.5 rounded-full border border-border font-semibold text-sm hover:border-coral hover:text-coral transition">
                Publicar otra
              </button>
            </div>
          </div>
        </section>
      </PageShell>
    );
  }

  return (
    <PageShell>
      <PageHero
        eyebrow="Publicar"
        title="Cuenta lo que pasa en tu barrio"
        subtitle="Eventos, denuncias vecinales, recomendaciones, cultura local. Comparte con miles de vecinos en un minuto."
      />

      <section className="mx-auto max-w-3xl px-4 md:px-8 py-12">
        <Link
          to="/noticias"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-coral mb-6"
        >
          <ArrowLeft className="h-4 w-4" /> Volver a noticias
        </Link>

        <form onSubmit={onSubmit} className="space-y-6 rounded-3xl bg-card border border-border p-6 md:p-10 shadow-card">
          {/* Title */}
          <div>
            <label className="block text-sm font-semibold mb-2">Titular *</label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              maxLength={140}
              placeholder="Un titular claro y directo"
              className="w-full px-4 py-3 rounded-xl bg-background border border-border focus:outline-none focus:border-coral font-display text-xl"
            />
            {errors.title && <p className="mt-1 text-sm text-destructive">{errors.title}</p>}
            <p className="mt-1 text-xs text-muted-foreground">{title.length}/140</p>
          </div>

          {/* Excerpt */}
          <div>
            <label className="block text-sm font-semibold mb-2">Resumen *</label>
            <textarea
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value)}
              maxLength={280}
              rows={2}
              placeholder="Una o dos frases que enganchen al lector"
              className="w-full px-4 py-3 rounded-xl bg-background border border-border focus:outline-none focus:border-coral resize-none"
            />
            {errors.excerpt && <p className="mt-1 text-sm text-destructive">{errors.excerpt}</p>}
            <p className="mt-1 text-xs text-muted-foreground">{excerpt.length}/280</p>
          </div>

          {/* Content */}
          <div>
            <label className="block text-sm font-semibold mb-2">Cuerpo de la noticia *</label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              maxLength={10000}
              rows={10}
              placeholder="Cuenta la historia. Separa los párrafos con una línea en blanco."
              className="w-full px-4 py-3 rounded-xl bg-background border border-border focus:outline-none focus:border-coral leading-relaxed"
            />
            {errors.content && <p className="mt-1 text-sm text-destructive">{errors.content}</p>}
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-semibold mb-2">Categoría *</label>
            <div className="flex flex-wrap gap-2">
              {NEWS_CATEGORIES.map((c) => (
                <button
                  type="button"
                  key={c}
                  onClick={() => setCategory(c)}
                  className={`px-4 py-2 rounded-full text-sm font-semibold border transition ${
                    category === c
                      ? "bg-foreground text-background border-foreground"
                      : "bg-background text-muted-foreground border-border hover:border-coral hover:text-coral"
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>

          {/* Tags */}
          <div>
            <label className="block text-sm font-semibold mb-2">
              Etiquetas <span className="text-muted-foreground font-normal">(hasta 8)</span>
            </label>
            <div className="flex flex-wrap gap-2 mb-2">
              {tags.map((t) => (
                <span
                  key={t}
                  className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-coral/10 text-coral text-sm font-semibold"
                >
                  #{t}
                  <button
                    type="button"
                    onClick={() => setTags(tags.filter((x) => x !== t))}
                    aria-label={`Quitar ${t}`}
                  >
                    <X className="h-3 w-3" />
                  </button>
                </span>
              ))}
            </div>
            <div className="flex gap-2">
              <div className="flex-1 flex items-center gap-2 px-3 rounded-xl bg-background border border-border focus-within:border-coral">
                <TagIcon className="h-4 w-4 text-muted-foreground" />
                <input
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === ",") {
                      e.preventDefault();
                      addTag(tagInput);
                    }
                  }}
                  placeholder="Escribe y pulsa Enter"
                  className="flex-1 py-3 bg-transparent focus:outline-none text-sm"
                />
              </div>
              <button
                type="button"
                onClick={() => addTag(tagInput)}
                className="px-4 py-3 rounded-xl border border-border font-semibold text-sm hover:border-coral hover:text-coral"
              >
                Añadir
              </button>
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              <span className="text-xs text-muted-foreground self-center">Sugerencias:</span>
              {POPULAR_TAGS.filter((t) => !tags.includes(t))
                .slice(0, 6)
                .map((t) => (
                  <button
                    type="button"
                    key={t}
                    onClick={() => addTag(t)}
                    className="px-2.5 py-1 rounded-full text-xs border border-dashed border-border text-muted-foreground hover:border-coral hover:text-coral"
                  >
                    + {t}
                  </button>
                ))}
            </div>
          </div>

          {/* Cover */}
          <div>
            <label className="block text-sm font-semibold mb-2">
              Imagen de portada <span className="text-muted-foreground font-normal">(URL)</span>
            </label>
            <div className="flex items-center gap-2 px-3 rounded-xl bg-background border border-border focus-within:border-coral">
              <ImagePlus className="h-4 w-4 text-muted-foreground" />
              <input
                value={cover}
                onChange={(e) => setCover(e.target.value)}
                placeholder="https://..."
                className="flex-1 py-3 bg-transparent focus:outline-none text-sm"
              />
            </div>
            {errors.cover && <p className="mt-1 text-sm text-destructive">{errors.cover}</p>}
            {cover && !errors.cover && (
              <div className="mt-3 aspect-[16/9] rounded-xl overflow-hidden bg-muted">
                <img src={cover} alt="Vista previa de portada" className="h-full w-full object-cover" />
              </div>
            )}
          </div>

          {/* Author */}
          <div>
            <label className="block text-sm font-semibold mb-2">Tu nombre o seudónimo</label>
            <input
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              maxLength={80}
              placeholder="Vecino anónimo"
              className="w-full px-4 py-3 rounded-xl bg-background border border-border focus:outline-none focus:border-coral"
            />
          </div>

          {/* Submit */}
          <div className="flex items-center justify-between gap-3 pt-4 border-t border-border">
            <p className="text-xs text-muted-foreground max-w-sm">
              Al publicar aceptas las normas de la comunidad. Las publicaciones serán revisadas por
              moderación.
            </p>
            <button
              type="submit"
              disabled={submitting}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-coral text-coral-foreground font-semibold shadow-glow hover:scale-[1.02] transition disabled:opacity-50"
            >
              <Send className="h-4 w-4" />
              {submitting ? "Publicando..." : "Publicar"}
            </button>
          </div>
        </form>
      </section>
    </PageShell>
  );
}
