import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { z } from "zod";
import { ArrowLeft, Check, Send } from "lucide-react";
import { PageShell, PageHero } from "@/components/PageShell";
import {
  CLASSIFIED_CATEGORIES,
  TARRAGONA_ZONES,
  addClassified,
} from "@/lib/classifieds-data";

export const Route = createFileRoute("/clasificados/publicar")({
  head: () => ({
    meta: [
      { title: "Publicar clasificado gratis en Tarragona" },
      {
        name: "description",
        content:
          "Crea tu anuncio clasificado en Tarragona. Empleo, alquiler, venta o servicios. Gratis durante 7 días.",
      },
      {
        property: "og:title",
        content: "Publicar clasificado gratis en Tarragona",
      },
      {
        property: "og:description",
        content:
          "Publica tu anuncio clasificado gratis durante 7 días en Tarragona.",
      },
    ],
  }),
  component: PublicarClasificado,
});

const schema = z.object({
  cat: z.enum(["Empleo", "Alquiler", "Venta", "Servicios"]),
  title: z.string().trim().min(8, "Título demasiado corto").max(120),
  location: z.string().trim().min(2, "Indica una zona").max(60),
  description: z.string().trim().min(20, "Mínimo 20 caracteres").max(800),
  daysLeft: z.number().int().min(1).max(7),
  contact: z.string().trim().email("Email no válido").max(255),
});

const cats = CLASSIFIED_CATEGORIES.filter((c) => c !== "Todos");
const zones = TARRAGONA_ZONES.filter((z) => z !== "Todas");

function PublicarClasificado() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    cat: "Empleo" as "Empleo" | "Alquiler" | "Venta" | "Servicios",
    title: "",
    location: zones[0],
    description: "",
    daysLeft: 7,
    contact: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [done, setDone] = useState(false);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    const result = schema.safeParse(form);
    if (!result.success) {
      const fe: Record<string, string> = {};
      for (const i of result.error.issues) fe[i.path[0] as string] = i.message;
      setErrors(fe);
      return;
    }
    addClassified({
      cat: result.data.cat,
      title: result.data.title,
      location: result.data.location,
      description: result.data.description,
      daysLeft: result.data.daysLeft,
    });
    setDone(true);
  };

  return (
    <PageShell>
      <PageHero
        eyebrow="Publicar clasificado"
        title="Crea tu anuncio en un minuto"
        subtitle="Rellena los datos básicos. Tu anuncio se publica al instante y dura 7 días."
      />
      <section className="mx-auto max-w-2xl px-4 md:px-8 pb-20">
        <Link
          to="/clasificados"
          className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-coral transition mb-6"
        >
          <ArrowLeft className="h-4 w-4" /> Volver a clasificados
        </Link>

        {done ? (
          <div className="rounded-3xl border border-border bg-card p-10 text-center shadow-card">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-coral/10 text-coral mb-4">
              <Check className="h-7 w-7" />
            </div>
            <h2 className="font-display text-2xl font-black">
              ¡Anuncio publicado!
            </h2>
            <p className="mt-2 text-muted-foreground text-sm">
              Ya es visible en clasificados durante {form.daysLeft} días.
            </p>
            <div className="mt-6 flex justify-center gap-3">
              <button
                onClick={() => navigate({ to: "/clasificados" })}
                className="px-6 py-2.5 rounded-full bg-foreground text-background font-semibold text-sm hover:bg-coral transition"
              >
                Ver clasificados
              </button>
              <button
                onClick={() => {
                  setDone(false);
                  setForm({
                    cat: "Empleo",
                    title: "",
                    location: zones[0],
                    description: "",
                    daysLeft: 7,
                    contact: "",
                  });
                }}
                className="px-6 py-2.5 rounded-full border border-border font-semibold text-sm hover:border-coral hover:text-coral transition"
              >
                Publicar otro
              </button>
            </div>
          </div>
        ) : (
          <form
            onSubmit={onSubmit}
            noValidate
            className="rounded-3xl border border-border bg-card p-6 md:p-8 shadow-card space-y-4"
          >
            <Field label="Categoría" error={errors.cat}>
              <select
                value={form.cat}
                onChange={(e) =>
                  setForm({ ...form, cat: e.target.value as typeof form.cat })
                }
                className="w-full bg-transparent py-3 px-3 focus:outline-none"
              >
                {cats.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </Field>

            <Field label="Título" error={errors.title}>
              <input
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                placeholder="Ej. Camarero/a fines de semana"
                maxLength={120}
                className="w-full bg-transparent py-3 px-3 focus:outline-none"
              />
            </Field>

            <div className="grid gap-4 md:grid-cols-2">
              <Field label="Zona" error={errors.location}>
                <select
                  value={form.location}
                  onChange={(e) =>
                    setForm({ ...form, location: e.target.value })
                  }
                  className="w-full bg-transparent py-3 px-3 focus:outline-none"
                >
                  {zones.map((z) => (
                    <option key={z} value={z}>
                      {z}
                    </option>
                  ))}
                </select>
              </Field>

              <Field label="Duración (días)" error={errors.daysLeft}>
                <input
                  type="number"
                  min={1}
                  max={7}
                  value={form.daysLeft}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      daysLeft: Math.max(
                        1,
                        Math.min(7, Number(e.target.value) || 7),
                      ),
                    })
                  }
                  className="w-full bg-transparent py-3 px-3 focus:outline-none"
                />
              </Field>
            </div>

            <Field label="Descripción" error={errors.description}>
              <textarea
                value={form.description}
                onChange={(e) =>
                  setForm({ ...form, description: e.target.value })
                }
                placeholder="Detalles del anuncio…"
                rows={5}
                maxLength={800}
                className="w-full bg-transparent py-3 px-3 focus:outline-none resize-y"
              />
            </Field>

            <Field label="Email de contacto" error={errors.contact}>
              <input
                type="email"
                value={form.contact}
                onChange={(e) => setForm({ ...form, contact: e.target.value })}
                placeholder="tu@email.com"
                className="w-full bg-transparent py-3 px-3 focus:outline-none"
              />
            </Field>

            <button
              type="submit"
              className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-coral text-coral-foreground font-semibold shadow-glow hover:scale-[1.01] transition"
            >
              <Send className="h-4 w-4" /> Publicar anuncio
            </button>
          </form>
        )}
      </section>
    </PageShell>
  );
}

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
        {label}
      </span>
      <div
        className={`mt-1 rounded-xl border bg-background ${
          error ? "border-red-500" : "border-border focus-within:border-coral"
        }`}
      >
        {children}
      </div>
      {error && <span className="mt-1 block text-xs text-red-500">{error}</span>}
    </label>
  );
}
