import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import {
  CheckCircle2,
  XCircle,
  Clock,
  ShieldCheck,
  Trash2,
  Lock,
  LogOut,
  Newspaper,
  ShoppingBag,
  Megaphone,
} from "lucide-react";
import { PageShell, PageHero } from "@/components/PageShell";
import {
  approveItem,
  deleteItem,
  isAdminUnlocked,
  lockAdmin,
  rejectItem,
  unlockAdmin,
  useModerationQueue,
  type ModerationItem,
  type ModerationKind,
  type ModerationStatus,
} from "@/lib/moderation";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Panel de administración — Solo en Tarragona" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: AdminPage,
});

const KIND_META: Record<ModerationKind, { label: string; icon: typeof Newspaper; color: string }> = {
  news: { label: "Noticia", icon: Newspaper, color: "bg-blue-500/10 text-blue-600" },
  marketplace: { label: "Marketplace", icon: ShoppingBag, color: "bg-emerald-500/10 text-emerald-600" },
  classified: { label: "Clasificado", icon: Megaphone, color: "bg-coral/10 text-coral" },
};

const STATUS_TABS: { value: ModerationStatus | "all"; label: string }[] = [
  { value: "pending", label: "Pendientes" },
  { value: "approved", label: "Aprobados" },
  { value: "rejected", label: "Rechazados" },
  { value: "all", label: "Todos" },
];

function AdminPage() {
  const [unlocked, setUnlocked] = useState(() => isAdminUnlocked());
  const [pin, setPin] = useState("");
  const [pinError, setPinError] = useState("");

  if (!unlocked) {
    return (
      <PageShell>
        <PageHero
          eyebrow="Administración"
          title="Acceso restringido"
          subtitle="Introduce el PIN de administrador para acceder al panel de moderación."
        />
        <section className="mx-auto max-w-md px-4 md:px-8 pb-20">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (unlockAdmin(pin)) {
                setUnlocked(true);
                setPinError("");
              } else {
                setPinError("PIN incorrecto");
              }
            }}
            className="rounded-3xl border border-border bg-card p-8 shadow-card space-y-4"
          >
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-coral/10 text-coral">
              <Lock className="h-7 w-7" />
            </div>
            <input
              type="password"
              inputMode="numeric"
              value={pin}
              onChange={(e) => setPin(e.target.value)}
              placeholder="PIN"
              className="w-full px-4 py-3 rounded-xl bg-background border border-border focus:outline-none focus:border-coral text-center text-lg font-semibold tracking-widest"
            />
            {pinError && <p className="text-sm text-red-500 text-center">{pinError}</p>}
            <button
              type="submit"
              className="w-full px-6 py-3 rounded-full bg-coral text-coral-foreground font-semibold hover:scale-[1.01] transition"
            >
              Acceder
            </button>
            <p className="text-xs text-center text-muted-foreground">
              Demo: el PIN por defecto es <span className="font-mono font-semibold">1234</span>.
            </p>
          </form>
        </section>
      </PageShell>
    );
  }

  return <AdminDashboard onLogout={() => { lockAdmin(); setUnlocked(false); }} />;
}

function AdminDashboard({ onLogout }: { onLogout: () => void }) {
  const items = useModerationQueue();
  const [status, setStatus] = useState<ModerationStatus | "all">("pending");
  const [kind, setKind] = useState<ModerationKind | "all">("all");
  const [rejectingId, setRejectingId] = useState<string | null>(null);
  const [reason, setReason] = useState("");

  const filtered = useMemo(() => {
    return items.filter((i) => {
      if (status !== "all" && i.status !== status) return false;
      if (kind !== "all" && i.kind !== kind) return false;
      return true;
    });
  }, [items, status, kind]);

  const counts = useMemo(() => {
    return {
      pending: items.filter((i) => i.status === "pending").length,
      approved: items.filter((i) => i.status === "approved").length,
      rejected: items.filter((i) => i.status === "rejected").length,
    };
  }, [items]);

  return (
    <PageShell>
      <PageHero
        eyebrow="Administración"
        title="Cola de moderación"
        subtitle="Revisa, aprueba o rechaza las publicaciones enviadas por la comunidad."
      />
      <section className="mx-auto max-w-6xl px-4 md:px-8 pb-20">
        <div className="grid gap-4 sm:grid-cols-3 mb-8">
          <StatCard label="Pendientes" value={counts.pending} icon={Clock} tone="bg-yellow-500/10 text-yellow-600" />
          <StatCard label="Aprobados" value={counts.approved} icon={CheckCircle2} tone="bg-emerald-500/10 text-emerald-600" />
          <StatCard label="Rechazados" value={counts.rejected} icon={XCircle} tone="bg-red-500/10 text-red-600" />
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
          <div className="flex flex-wrap gap-2">
            {STATUS_TABS.map((t) => (
              <button
                key={t.value}
                onClick={() => setStatus(t.value)}
                className={`px-4 py-2 rounded-full text-sm font-semibold border transition ${
                  status === t.value
                    ? "bg-foreground text-background border-foreground"
                    : "bg-card text-muted-foreground border-border hover:border-coral hover:text-coral"
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-2">
            <select
              value={kind}
              onChange={(e) => setKind(e.target.value as ModerationKind | "all")}
              className="px-3 py-2 rounded-full text-sm font-semibold border border-border bg-card focus:outline-none"
            >
              <option value="all">Todos los tipos</option>
              <option value="news">Noticias</option>
              <option value="marketplace">Marketplace</option>
              <option value="classified">Clasificados</option>
            </select>
            <button
              onClick={onLogout}
              className="inline-flex items-center gap-1 px-3 py-2 rounded-full text-sm font-semibold border border-border hover:border-red-500 hover:text-red-500 transition"
            >
              <LogOut className="h-3.5 w-3.5" /> Cerrar sesión
            </button>
          </div>
        </div>

        {filtered.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-border p-12 text-center text-muted-foreground">
            <ShieldCheck className="h-10 w-10 mx-auto mb-3 text-muted-foreground/50" />
            No hay publicaciones en esta vista.
          </div>
        ) : (
          <div className="space-y-4">
            {filtered.map((item) => (
              <ModerationCard
                key={item.id}
                item={item}
                rejecting={rejectingId === item.id}
                reason={reason}
                onStartReject={() => {
                  setRejectingId(item.id);
                  setReason("");
                }}
                onCancelReject={() => setRejectingId(null)}
                onReasonChange={setReason}
                onConfirmReject={() => {
                  rejectItem(item.id, reason.trim() || "Sin motivo");
                  setRejectingId(null);
                  setReason("");
                }}
                onApprove={() => approveItem(item.id)}
                onDelete={() => deleteItem(item.id)}
              />
            ))}
          </div>
        )}
      </section>
    </PageShell>
  );
}

function StatCard({
  label,
  value,
  icon: Icon,
  tone,
}: {
  label: string;
  value: number;
  icon: typeof Clock;
  tone: string;
}) {
  return (
    <div className="rounded-2xl border border-border bg-card p-5 flex items-center gap-4">
      <div className={`grid h-12 w-12 place-items-center rounded-xl ${tone}`}>
        <Icon className="h-6 w-6" />
      </div>
      <div>
        <div className="font-display text-3xl font-black">{value}</div>
        <div className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">
          {label}
        </div>
      </div>
    </div>
  );
}

function ModerationCard({
  item,
  rejecting,
  reason,
  onStartReject,
  onCancelReject,
  onReasonChange,
  onConfirmReject,
  onApprove,
  onDelete,
}: {
  item: ModerationItem;
  rejecting: boolean;
  reason: string;
  onStartReject: () => void;
  onCancelReject: () => void;
  onReasonChange: (v: string) => void;
  onConfirmReject: () => void;
  onApprove: () => void;
  onDelete: () => void;
}) {
  const meta = KIND_META[item.kind];
  const Icon = meta.icon;

  return (
    <article className="rounded-2xl border border-border bg-card p-5 md:p-6 shadow-card">
      <header className="flex flex-wrap items-start justify-between gap-3 mb-4">
        <div className="flex items-center gap-3">
          <div className={`grid h-10 w-10 place-items-center rounded-xl ${meta.color}`}>
            <Icon className="h-5 w-5" />
          </div>
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              {meta.label}
            </div>
            <h3 className="font-semibold text-lg leading-tight">
              {"title" in item.payload ? item.payload.title : "—"}
            </h3>
          </div>
        </div>
        <StatusBadge status={item.status} />
      </header>

      <PayloadPreview item={item} />

      <footer className="mt-4 pt-4 border-t border-border flex flex-wrap items-center justify-between gap-3">
        <span className="text-xs text-muted-foreground">
          Enviado el {new Date(item.createdAt).toLocaleString("es-ES")}
          {item.reviewedAt && ` · Revisado el ${new Date(item.reviewedAt).toLocaleString("es-ES")}`}
        </span>
        <div className="flex flex-wrap gap-2">
          {item.status === "pending" && !rejecting && (
            <>
              <button
                onClick={onApprove}
                className="inline-flex items-center gap-1 px-4 py-2 rounded-full bg-emerald-500 text-white font-semibold text-sm hover:bg-emerald-600 transition"
              >
                <CheckCircle2 className="h-4 w-4" /> Aprobar
              </button>
              <button
                onClick={onStartReject}
                className="inline-flex items-center gap-1 px-4 py-2 rounded-full bg-red-500 text-white font-semibold text-sm hover:bg-red-600 transition"
              >
                <XCircle className="h-4 w-4" /> Rechazar
              </button>
            </>
          )}
          <button
            onClick={onDelete}
            className="inline-flex items-center gap-1 px-3 py-2 rounded-full border border-border text-muted-foreground hover:border-red-500 hover:text-red-500 text-sm transition"
            aria-label="Eliminar de la cola"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        </div>
      </footer>

      {rejecting && (
        <div className="mt-4 p-4 rounded-xl bg-red-500/5 border border-red-500/30">
          <textarea
            value={reason}
            onChange={(e) => onReasonChange(e.target.value)}
            placeholder="Motivo del rechazo (opcional)"
            rows={2}
            className="w-full bg-background border border-border rounded-lg p-3 text-sm focus:outline-none focus:border-red-500 resize-none"
          />
          <div className="mt-3 flex justify-end gap-2">
            <button
              onClick={onCancelReject}
              className="px-4 py-2 rounded-full text-sm font-semibold hover:bg-secondary transition"
            >
              Cancelar
            </button>
            <button
              onClick={onConfirmReject}
              className="px-4 py-2 rounded-full bg-red-500 text-white font-semibold text-sm hover:bg-red-600 transition"
            >
              Confirmar rechazo
            </button>
          </div>
        </div>
      )}

      {item.status === "rejected" && item.rejectReason && (
        <div className="mt-4 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-sm">
          <span className="font-semibold text-red-600">Motivo: </span>
          <span className="text-foreground/80">{item.rejectReason}</span>
        </div>
      )}
    </article>
  );
}

function StatusBadge({ status }: { status: ModerationStatus }) {
  const map: Record<ModerationStatus, { label: string; cls: string; icon: typeof Clock }> = {
    pending: { label: "Pendiente", cls: "bg-yellow-500/10 text-yellow-700", icon: Clock },
    approved: { label: "Aprobado", cls: "bg-emerald-500/10 text-emerald-700", icon: CheckCircle2 },
    rejected: { label: "Rechazado", cls: "bg-red-500/10 text-red-700", icon: XCircle },
  };
  const m = map[status];
  const I = m.icon;
  return (
    <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${m.cls}`}>
      <I className="h-3 w-3" /> {m.label}
    </span>
  );
}

function PayloadPreview({ item }: { item: ModerationItem }) {
  if (item.kind === "news") {
    return (
      <div className="grid gap-3 sm:grid-cols-[120px_1fr]">
        {item.payload.cover && (
          <div className="aspect-video sm:aspect-square rounded-xl overflow-hidden bg-muted">
            <img src={item.payload.cover} alt="" className="w-full h-full object-cover" />
          </div>
        )}
        <div className="text-sm text-muted-foreground">
          <div className="text-xs"><span className="font-semibold">Categoría:</span> {item.payload.category}</div>
          <div className="text-xs"><span className="font-semibold">Autor:</span> {item.payload.author || "Anónimo"}</div>
          <p className="mt-2 line-clamp-3">{item.payload.excerpt}</p>
        </div>
      </div>
    );
  }
  if (item.kind === "marketplace") {
    return (
      <div className="grid gap-3 sm:grid-cols-[120px_1fr]">
        {item.payload.img && (
          <div className="aspect-square rounded-xl overflow-hidden bg-muted">
            <img src={item.payload.img} alt="" className="w-full h-full object-cover" />
          </div>
        )}
        <div className="text-sm text-muted-foreground">
          <div className="font-display text-coral text-xl font-black">{item.payload.price} €</div>
          <div className="text-xs"><span className="font-semibold">Categoría:</span> {item.payload.category} · <span className="font-semibold">Zona:</span> {item.payload.location}</div>
          <div className="text-xs"><span className="font-semibold">Contacto:</span> {item.payload.contact}</div>
          <p className="mt-2 line-clamp-3">{item.payload.description}</p>
        </div>
      </div>
    );
  }
  // classified
  return (
    <div className="text-sm text-muted-foreground">
      <div className="text-xs">
        <span className="font-semibold">{item.payload.cat}</span> · {item.payload.location} · {item.payload.daysLeft} días
      </div>
      <div className="text-xs"><span className="font-semibold">Contacto:</span> {item.payload.contact}</div>
      <p className="mt-2 line-clamp-3">{item.payload.description}</p>
    </div>
  );
}
