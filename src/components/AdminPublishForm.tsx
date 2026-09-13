import { useRef, useState } from "react";
import { Check, ImagePlus, Megaphone, ShoppingBag, Upload, X } from "lucide-react";
import { addMarketplaceItem, MARKETPLACE_CATEGORIES } from "@/lib/marketplace-data";
import { addClassified } from "@/lib/classifieds-data";

type Kind = "marketplace" | "classified";

const MP_CATS = MARKETPLACE_CATEGORIES.filter((c) => c !== "Todo");
const CL_CATS = ["Empleo", "Alquiler", "Venta", "Servicios"] as const;

const EMPTY = {
  title: "",
  price: "",
  location: "Centre",
  category: "Hogar",
  condition: "Buen estado",
  description: "",
  img: "",
  sellerName: "",
  sellerPhone: "",
  daysLeft: "7",
  contactEmail: "",
  seoTitle: "",
  seoDescription: "",
  seoImage: "",
};

export function AdminPublishForm() {
  const [kind, setKind] = useState<Kind>("marketplace");
  const [form, setForm] = useState({ ...EMPTY });
  const [error, setError] = useState("");
  const [okMsg, setOkMsg] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  const set = (patch: Partial<typeof EMPTY>) => setForm((f) => ({ ...f, ...patch }));

  const switchKind = (k: Kind) => {
    setKind(k);
    setError("");
    setOkMsg("");
    set({ category: k === "marketplace" ? "Hogar" : "Venta" });
  };

  const onFile = (file: File | undefined) => {
    if (!file) return;
    if (file.size > 3_000_000) {
      setError("La foto no puede superar 3 MB.");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => set({ img: String(reader.result) });
    reader.readAsDataURL(file);
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setOkMsg("");
    if (form.title.trim().length < 5) return setError("El título necesita al menos 5 caracteres.");
    if (form.description.trim().length < 20)
      return setError("La descripción necesita al menos 20 caracteres.");
    if (!form.location.trim()) return setError("Indica la ubicación.");

    if (kind === "marketplace") {
      const price = Number(form.price);
      if (!Number.isFinite(price) || price < 0) return setError("Introduce un precio válido.");
      const item = addMarketplaceItem({
        title: form.title.trim(),
        price,
        location: form.location.trim(),
        category: form.category,
        condition: form.condition,
        description: form.description.trim(),
        img: form.img.trim(),
        sellerName: form.sellerName.trim(),
        sellerPhone: form.sellerPhone.trim(),
        seoTitle: form.seoTitle.trim(),
        seoDescription: form.seoDescription.trim(),
        seoImage: form.seoImage.trim() || form.img.trim(),
      });
      setOkMsg(`Publicado en Marketplace: ${item.title}`);
    } else {
      const daysLeft = Math.max(1, Math.min(60, Number(form.daysLeft) || 7));
      addClassified({
        cat: form.category as (typeof CL_CATS)[number],
        title: form.title.trim(),
        location: form.location.trim(),
        description: form.description.trim(),
        img: form.img.trim() || undefined,
        daysLeft,
        contact: form.contactEmail.trim() ? { email: form.contactEmail.trim() } : undefined,
      });
      setOkMsg(`Publicado en Clasificados: ${form.title.trim()}`);
    }

    setError("");
    setForm({ ...EMPTY, category: kind === "marketplace" ? "Hogar" : "Venta" });
    if (fileRef.current) fileRef.current.value = "";
  };

  const cats = kind === "marketplace" ? MP_CATS : CL_CATS;

  return (
    <div className="mb-10 rounded-3xl border border-border bg-card p-6 shadow-card">
      <div className="mb-5 flex items-center gap-2">
        <span className="grid h-9 w-9 place-items-center rounded-full bg-coral/10 text-coral">
          <ImagePlus className="h-4 w-4" />
        </span>
        <div>
          <h2 className="font-semibold">Publicar anuncio</h2>
          <p className="text-xs text-muted-foreground">
            Publica directamente en Marketplace o Clasificados, con foto, precio y ubicación.
          </p>
        </div>
      </div>

      <div className="mb-5 flex gap-2">
        {(
          [
            { k: "marketplace" as Kind, label: "Marketplace", icon: ShoppingBag },
            { k: "classified" as Kind, label: "Clasificado", icon: Megaphone },
          ]
        ).map(({ k, label, icon: I }) => (
          <button
            key={k}
            type="button"
            onClick={() => switchKind(k)}
            className={`inline-flex items-center gap-1.5 rounded-full border px-4 py-2 text-sm font-semibold transition ${
              kind === k
                ? "bg-foreground text-background border-foreground"
                : "bg-card text-muted-foreground border-border hover:border-coral hover:text-coral"
            }`}
          >
            <I className="h-4 w-4" /> {label}
          </button>
        ))}
      </div>

      <form onSubmit={submit} noValidate className="space-y-4">
        <Field label="Título">
          <input
            value={form.title}
            onChange={(e) => set({ title: e.target.value })}
            maxLength={120}
            placeholder="Ej. Bicicleta urbana Orbea"
            className="w-full bg-transparent px-3 py-3 focus:outline-none"
          />
        </Field>

        <div className="grid gap-4 md:grid-cols-2">
          <Field label="Categoría">
            <select
              value={form.category}
              onChange={(e) => set({ category: e.target.value })}
              className="w-full bg-transparent px-3 py-3 focus:outline-none"
            >
              {cats.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Ubicación">
            <input
              value={form.location}
              onChange={(e) => set({ location: e.target.value })}
              placeholder="Ej. Part Alta"
              className="w-full bg-transparent px-3 py-3 focus:outline-none"
            />
          </Field>
        </div>

        {kind === "marketplace" ? (
          <div className="grid gap-4 md:grid-cols-2">
            <Field label="Precio (€)">
              <input
                type="number"
                min={0}
                value={form.price}
                onChange={(e) => set({ price: e.target.value })}
                placeholder="0"
                className="w-full bg-transparent px-3 py-3 focus:outline-none"
              />
            </Field>
            <Field label="Estado">
              <select
                value={form.condition}
                onChange={(e) => set({ condition: e.target.value })}
                className="w-full bg-transparent px-3 py-3 focus:outline-none"
              >
                {["Como nuevo", "Muy buen estado", "Buen estado", "Con uso"].map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </Field>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            <Field label="Días de vigencia">
              <input
                type="number"
                min={1}
                max={60}
                value={form.daysLeft}
                onChange={(e) => set({ daysLeft: e.target.value })}
                className="w-full bg-transparent px-3 py-3 focus:outline-none"
              />
            </Field>
            <Field label="Email de contacto (opcional)">
              <input
                type="email"
                value={form.contactEmail}
                onChange={(e) => set({ contactEmail: e.target.value })}
                placeholder="contacto@email.com"
                className="w-full bg-transparent px-3 py-3 focus:outline-none"
              />
            </Field>
          </div>
        )}

        {kind === "marketplace" && (
          <div className="grid gap-4 md:grid-cols-2">
            <Field label="Vendedor">
              <input
                value={form.sellerName}
                onChange={(e) => set({ sellerName: e.target.value })}
                placeholder="Nombre visible"
                className="w-full bg-transparent px-3 py-3 focus:outline-none"
              />
            </Field>
            <Field label="Teléfono">
              <input
                value={form.sellerPhone}
                onChange={(e) => set({ sellerPhone: e.target.value })}
                placeholder="+34 600 000 000"
                className="w-full bg-transparent px-3 py-3 focus:outline-none"
              />
            </Field>
          </div>
        )}

        <Field label="Descripción">
          <textarea
            value={form.description}
            onChange={(e) => set({ description: e.target.value })}
            rows={4}
            maxLength={1200}
            placeholder="Detalles, estado, condiciones..."
            className="w-full resize-y bg-transparent px-3 py-3 focus:outline-none"
          />
        </Field>

        <div className="rounded-2xl border border-border p-4">
          <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Foto
          </span>
          <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-start">
            <div className="relative h-28 w-28 shrink-0 overflow-hidden rounded-xl bg-muted">
              {form.img ? (
                <>
                  <img src={form.img} alt="Vista previa" className="h-full w-full object-cover" />
                  <button
                    type="button"
                    onClick={() => {
                      set({ img: "" });
                      if (fileRef.current) fileRef.current.value = "";
                    }}
                    aria-label="Quitar foto"
                    className="absolute right-1 top-1 grid h-6 w-6 place-items-center rounded-full bg-background/90 text-foreground"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </>
              ) : (
                <div className="grid h-full w-full place-items-center text-muted-foreground">
                  <ImagePlus className="h-6 w-6" />
                </div>
              )}
            </div>
            <div className="flex-1 space-y-3">
              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                onChange={(e) => onFile(e.target.files?.[0])}
                className="block w-full text-sm text-muted-foreground file:mr-3 file:rounded-full file:border-0 file:bg-secondary file:px-4 file:py-2 file:text-sm file:font-semibold"
              />
              <input
                value={form.img.startsWith("data:") ? "" : form.img}
                onChange={(e) => set({ img: e.target.value })}
                placeholder="…o pega una URL de imagen (https://…)"
                className="w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm focus:border-coral focus:outline-none"
              />
            </div>
          </div>
        </div>

        {error && <p className="text-sm text-red-500">{error}</p>}
        {okMsg && (
          <p className="inline-flex items-center gap-1.5 text-sm font-semibold text-emerald-600">
            <Check className="h-4 w-4" /> {okMsg}
          </p>
        )}

        <button
          type="submit"
          className="inline-flex items-center gap-2 rounded-full bg-coral px-6 py-3 font-semibold text-coral-foreground shadow-glow transition hover:scale-[1.01]"
        >
          <Upload className="h-4 w-4" /> Publicar ahora
        </button>
      </form>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        {label}
      </span>
      <div className="mt-1 rounded-xl border border-border bg-background focus-within:border-coral">
        {children}
      </div>
    </label>
  );
}
