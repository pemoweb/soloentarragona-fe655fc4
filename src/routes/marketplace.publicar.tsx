import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { z } from "zod";
import { ArrowLeft, Check, Send } from "lucide-react";
import { PageShell, PageHero } from "@/components/PageShell";
import { submitToModeration } from "@/lib/moderation";

export const Route = createFileRoute("/marketplace/publicar")({
  head: () => ({
    meta: [
      { title: "Publicar producto en Marketplace — Tarragona" },
      {
        name: "description",
        content:
          "Publica un producto en el Marketplace de Tarragona. Tu anuncio pasará por moderación antes de aparecer.",
      },
      { name: "robots", content: "noindex, follow" },
    ],
  }),
  component: PublishMarketplace,
});

const CATEGORIES = [
  "Electrónica",
  "Hogar",
  "Moda",
  "Deporte",
  "Vehículos",
  "Niños",
  "Coleccionismo",
] as const;

const schema = z.object({
  title: z.string().trim().min(5, "Título demasiado corto").max(120),
  price: z.number().min(0).max(1_000_000),
  location: z.string().trim().min(2).max(60),
  category: z.enum(CATEGORIES),
  description: z.string().trim().min(20, "Mínimo 20 caracteres").max(1000),
  img: z.string().trim().url("URL de imagen no válida").or(z.literal("")),
  contact: z.string().trim().email("Email no válido").max(255),
});

function PublishMarketplace() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    title: "",
    price: 0,
    location: "Centre",
    category: "Hogar" as (typeof CATEGORIES)[number],
    description: "",
    img: "",
    contact: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [done, setDone] = useState(false);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const res = schema.safeParse(form);
    if (!res.success) {
      const fe: Record<string, string> = {};
      for (const i of res.error.issues) fe[i.path[0] as string] = i.message;
      setErrors(fe);
      return;
    }
    setErrors({});
    submitToModeration("marketplace", res.data);
    setDone(true);
  };

  return (
    <PageShell>
      <PageHero
        eyebrow="Publicar en Marketplace"
        title="Vende a tus vecinos en minutos"
        subtitle="Rellena los datos del producto. Tu anuncio será revisado por moderación antes de publicarse."
      />
      <section className="mx-auto max-w-2xl px-4 md:px-8 pb-20">
        <Link
          to="/marketplace"
          className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-coral transition mb-6"
        >
          <ArrowLeft className="h-4 w-4" /> Volver a Marketplace
        </Link>

        {done ? (
          <div className="rounded-3xl border border-border bg-card p-10 text-center shadow-card">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-coral/10 text-coral mb-4">
              <Check className="h-7 w-7" />
            </div>
            <h2 className="font-display text-2xl font-black">¡Enviado a moderación!</h2>
            <p className="mt-2 text-muted-foreground text-sm">
              Tu producto está en la cola de revisión. Te avisaremos cuando esté publicado.
            </p>
            <div className="mt-6 flex justify-center gap-3">
              <button
                onClick={() => navigate({ to: "/marketplace" })}
                className="px-6 py-2.5 rounded-full bg-foreground text-background font-semibold text-sm hover:bg-coral transition"
              >
                Ver Marketplace
              </button>
              <button
                onClick={() => setDone(false)}
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
            <Field label="Título" error={errors.title}>
              <input
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                placeholder="Ej. Bicicleta urbana como nueva"
                maxLength={120}
                className="w-full bg-transparent py-3 px-3 focus:outline-none"
              />
            </Field>

            <div className="grid gap-4 md:grid-cols-2">
              <Field label="Precio (€)" error={errors.price}>
                <input
                  type="number"
                  min={0}
                  value={form.price}
                  onChange={(e) =>
                    setForm({ ...form, price: Math.max(0, Number(e.target.value) || 0) })
                  }
                  className="w-full bg-transparent py-3 px-3 focus:outline-none"
                />
              </Field>
              <Field label="Categoría" error={errors.category}>
                <select
                  value={form.category}
                  onChange={(e) =>
                    setForm({ ...form, category: e.target.value as (typeof CATEGORIES)[number] })
                  }
                  className="w-full bg-transparent py-3 px-3 focus:outline-none"
                >
                  {CATEGORIES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </Field>
            </div>

            <Field label="Ubicación" error={errors.location}>
              <input
                value={form.location}
                onChange={(e) => setForm({ ...form, location: e.target.value })}
                placeholder="Ej. Part Alta"
                className="w-full bg-transparent py-3 px-3 focus:outline-none"
              />
            </Field>

            <Field label="Descripción" error={errors.description}>
              <textarea
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                placeholder="Estado, detalles, motivo de venta..."
                rows={5}
                maxLength={1000}
                className="w-full bg-transparent py-3 px-3 focus:outline-none resize-y"
              />
            </Field>

            <Field label="Imagen (URL)" error={errors.img}>
              <input
                value={form.img}
                onChange={(e) => setForm({ ...form, img: e.target.value })}
                placeholder="https://..."
                className="w-full bg-transparent py-3 px-3 focus:outline-none"
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
              <Send className="h-4 w-4" /> Enviar a moderación
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
