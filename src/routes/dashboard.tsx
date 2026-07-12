import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import {
  User, Store, Building2, Newspaper, Heart, Clock, CheckCircle2, XCircle,
  Mail, Phone, MapPin, Pencil, LogOut, LayoutDashboard, Save, Camera, Star,
  Pause, Play, Trash2, Eye, PauseCircle,
} from "lucide-react";
import { PageShell } from "@/components/PageShell";
import {
  useModerationQueue, pauseItem, resumeItem, deleteItem, updateItem,
  type ModerationItem, type ModerationStatus,
} from "@/lib/moderation";
import { useAllClassifieds, useFavorites } from "@/lib/classifieds-data";
import { businesses } from "@/lib/directorio-data";
import { loadProfile, saveProfile, useDirectorioFavs, useDirectorioPaused, type UserProfile } from "@/lib/profile-data";

export const Route = createFileRoute("/dashboard")({
  head: () => ({
    meta: [
      { title: "Mi Panel — Solo en Tarragona" },
      { name: "description", content: "Panel del cliente: gestiona tus anuncios de Marketplace, favoritos del Directorio, Clasificados y tu perfil personal en Solo en Tarragona." },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: DashboardPage,
});

type Tab = "resumen" | "marketplace" | "directorio" | "clasificados" | "perfil";

const TABS: { id: Tab; label: string; icon: typeof User }[] = [
  { id: "resumen", label: "Resumen", icon: LayoutDashboard },
  { id: "marketplace", label: "Marketplace", icon: Store },
  { id: "directorio", label: "Directorio", icon: Building2 },
  { id: "clasificados", label: "Clasificados", icon: Newspaper },
  { id: "perfil", label: "Mi perfil", icon: User },
];

function DashboardPage() {
  const [tab, setTab] = useState<Tab>("resumen");
  const profile = loadProfile();
  const queue = useModerationQueue();
  const classifieds = useAllClassifieds();
  const { favs: classifiedFavs } = useFavorites();
  const { favs: dirFavs, remove: removeDirFav } = useDirectorioFavs();
  const { paused: dirPaused, toggle: toggleDirPaused } = useDirectorioPaused();

  const myMarketplace = useMemo(
    () => queue.filter((i) => i.kind === "marketplace"),
    [queue]
  );
  const myClassifieds = useMemo(
    () => queue.filter((i) => i.kind === "classified"),
    [queue]
  );
  const myFavClassifieds = classifieds.filter((c) => classifiedFavs.has(c.id));
  const myFavBusinesses = businesses.filter((b) => dirFavs.has(b.slug));

  return (
    <PageShell>
      <section className="border-b border-border bg-gradient-to-br from-primary via-primary to-accent">
        <div className="mx-auto max-w-7xl px-4 md:px-8 py-10 md:py-14 text-primary-foreground">
          <div className="flex flex-col md:flex-row md:items-center gap-6">
            <img
              src={profile.avatar}
              alt={profile.name}
              className="h-20 w-20 md:h-24 md:w-24 rounded-2xl object-cover ring-4 ring-white/20"
            />
            <div className="flex-1">
              <span className="inline-block px-3 py-1 rounded-full bg-coral/20 text-coral border border-coral/30 text-xs font-semibold tracking-widest uppercase">
                Mi panel
              </span>
              <h1 className="mt-3 font-display text-4xl md:text-5xl font-black leading-tight">
                Hola, {profile.name.split(" ")[0]}
              </h1>
              <p className="mt-2 text-white/80 max-w-xl">
                Gestiona tus anuncios, favoritos y datos personales en un solo lugar.
              </p>
            </div>
            <button
              onClick={() => setTab("perfil")}
              className="hidden md:inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 text-sm font-medium transition-colors"
            >
              <Pencil className="h-4 w-4" /> Editar perfil
            </button>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 md:px-8 py-8">
        <div className="flex gap-2 overflow-x-auto pb-2 mb-8 border-b border-border">
          {TABS.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setTab(id)}
              className={`flex items-center gap-2 px-4 py-3 rounded-t-lg text-sm font-medium whitespace-nowrap transition-colors ${
                tab === id
                  ? "bg-coral/10 text-coral border-b-2 border-coral"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted"
              }`}
            >
              <Icon className="h-4 w-4" /> {label}
            </button>
          ))}
        </div>

        {tab === "resumen" && (
          <ResumenView
            marketCount={myMarketplace.length}
            classifiedCount={myClassifieds.length}
            favBusinessCount={myFavBusinesses.length}
            favClassifiedCount={myFavClassifieds.length}
            recent={queue.slice(0, 5)}
            onGo={setTab}
          />
        )}
        {tab === "marketplace" && (
          <MarketplaceView items={myMarketplace} />
        )}
        {tab === "directorio" && (
          <DirectorioView
            businesses={myFavBusinesses}
            paused={dirPaused}
            onTogglePause={toggleDirPaused}
            onRemove={removeDirFav}
          />
        )}
        {tab === "clasificados" && (
          <ClasificadosView items={myClassifieds} favs={myFavClassifieds} />
        )}
        {tab === "perfil" && <PerfilView />}
      </div>
    </PageShell>
  );
}

/* ---------- Resumen ---------- */

function ResumenView({
  marketCount, classifiedCount, favBusinessCount, favClassifiedCount, recent, onGo,
}: {
  marketCount: number;
  classifiedCount: number;
  favBusinessCount: number;
  favClassifiedCount: number;
  recent: ModerationItem[];
  onGo: (t: Tab) => void;
}) {
  const stats = [
    { label: "Anuncios Marketplace", value: marketCount, icon: Store, cls: "bg-coral/10 text-coral", tab: "marketplace" as Tab },
    { label: "Anuncios Clasificados", value: classifiedCount, icon: Newspaper, cls: "bg-primary/10 text-primary", tab: "clasificados" as Tab },
    { label: "Negocios favoritos", value: favBusinessCount, icon: Building2, cls: "bg-accent/20 text-accent-foreground", tab: "directorio" as Tab },
    { label: "Clasificados guardados", value: favClassifiedCount, icon: Heart, cls: "bg-coral/10 text-coral", tab: "clasificados" as Tab },
  ];
  return (
    <div className="space-y-8">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s) => (
          <button
            key={s.label}
            onClick={() => onGo(s.tab)}
            className="text-left rounded-2xl border border-border bg-card p-5 hover:shadow-lg hover:-translate-y-0.5 transition-all"
          >
            <div className={`inline-grid h-10 w-10 place-items-center rounded-xl ${s.cls}`}>
              <s.icon className="h-5 w-5" />
            </div>
            <div className="mt-3 font-display text-3xl font-black">{s.value}</div>
            <div className="text-sm text-muted-foreground">{s.label}</div>
          </button>
        ))}
      </div>

      <div className="rounded-2xl border border-border bg-card p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-display text-xl font-bold">Actividad reciente</h2>
          <Link to="/publicar" className="text-sm text-coral font-medium hover:underline">
            Publicar nuevo →
          </Link>
        </div>
        {recent.length === 0 ? (
          <p className="text-sm text-muted-foreground py-8 text-center">
            Aún no has publicado nada. Empieza en <Link to="/publicar" className="text-coral underline">Publicar</Link>.
          </p>
        ) : (
          <ul className="divide-y divide-border">
            {recent.map((it) => (
              <li key={it.id} className="py-3 flex items-center gap-3">
                <StatusPill status={it.status} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{it.payload.title}</p>
                  <p className="text-xs text-muted-foreground capitalize">
                    {it.kind} · {new Date(it.createdAt).toLocaleDateString("es-ES")}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

/* ---------- Marketplace ---------- */

function MarketplaceView({ items }: { items: ModerationItem[] }) {
  return (
    <SectionHeader
      title="Mis anuncios en Marketplace"
      subtitle="Estado de tus publicaciones y anuncios pendientes de revisión."
      cta={{ to: "/marketplace/publicar", label: "Nuevo anuncio" }}
    >
      {items.length === 0 ? (
        <EmptyState
          icon={Store}
          label="Aún no has publicado ningún artículo en Marketplace."
          cta={{ to: "/marketplace/publicar", label: "Publicar artículo" }}
        />
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {items.map((it) => it.kind === "marketplace" && (
            <article key={it.id} className="rounded-2xl border border-border bg-card overflow-hidden hover:shadow-lg transition-shadow">
              <div className="aspect-video bg-muted overflow-hidden">
                {it.payload.img ? (
                  <img src={it.payload.img} alt={it.payload.title} className="h-full w-full object-cover" />
                ) : (
                  <div className="h-full w-full grid place-items-center text-muted-foreground">
                    <Store className="h-10 w-10" />
                  </div>
                )}
              </div>
              <div className="p-4 space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="font-semibold leading-tight">{it.payload.title}</h3>
                  <StatusPill status={it.status} />
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="font-bold text-coral">{it.payload.price}€</span>
                  <span className="text-muted-foreground">{it.payload.location}</span>
                </div>
                <p className="text-xs text-muted-foreground">
                  Enviado el {new Date(it.createdAt).toLocaleDateString("es-ES")}
                </p>
              </div>
            </article>
          ))}
        </div>
      )}
    </SectionHeader>
  );
}

/* ---------- Directorio ---------- */

function DirectorioView({ businesses: favs }: { businesses: typeof businesses }) {
  return (
    <SectionHeader
      title="Mis negocios favoritos"
      subtitle="Directorio local guardado para consultar rápido."
      cta={{ to: "/directorio", label: "Explorar directorio" }}
    >
      {favs.length === 0 ? (
        <EmptyState
          icon={Building2}
          label="Todavía no has guardado ningún negocio."
          cta={{ to: "/directorio", label: "Ver directorio" }}
        />
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {favs.map((b) => (
            <article key={b.slug} className="rounded-2xl border border-border bg-card overflow-hidden hover:shadow-lg transition-shadow">
              <div className="aspect-video bg-muted overflow-hidden">
                <img src={b.img} alt={b.name} className="h-full w-full object-cover" />
              </div>
              <div className="p-4 space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">{b.category}</span>
                  {b.verified && (
                    <span className="inline-flex items-center gap-1 text-xs text-coral font-semibold">
                      <CheckCircle2 className="h-3.5 w-3.5" /> Verificado
                    </span>
                  )}
                </div>
                <h3 className="font-semibold">{b.name}</h3>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Star className="h-3.5 w-3.5 fill-coral text-coral" />
                  <span>{b.rating}</span>
                  <span>·</span>
                  <span className="truncate">{b.address}</span>
                </div>
                {b.verified ? (
                  <Link
                    to="/directorio/$slug"
                    params={{ slug: b.slug }}
                    className="inline-block text-sm text-coral font-medium hover:underline"
                  >
                    Ver ficha PRO →
                  </Link>
                ) : (
                  <Link to="/directorio" className="inline-block text-sm text-coral font-medium hover:underline">
                    Ver en directorio →
                  </Link>
                )}
              </div>
            </article>
          ))}
        </div>
      )}
    </SectionHeader>
  );
}

/* ---------- Clasificados ---------- */

function ClasificadosView({
  items, favs,
}: {
  items: ModerationItem[];
  favs: ReturnType<typeof useAllClassifieds>;
}) {
  return (
    <div className="space-y-10">
      <SectionHeader
        title="Mis clasificados"
        subtitle="Anuncios que has publicado y su estado de moderación."
        cta={{ to: "/clasificados/publicar", label: "Nuevo clasificado" }}
      >
        {items.length === 0 ? (
          <EmptyState
            icon={Newspaper}
            label="Aún no has publicado clasificados."
            cta={{ to: "/clasificados/publicar", label: "Publicar clasificado" }}
          />
        ) : (
          <ul className="divide-y divide-border rounded-2xl border border-border bg-card">
            {items.map((it) => it.kind === "classified" && (
              <li key={it.id} className="p-4 flex items-center gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs px-2 py-0.5 rounded-full bg-muted font-medium">{it.payload.cat}</span>
                    <span className="text-xs text-muted-foreground">{it.payload.location}</span>
                  </div>
                  <p className="font-semibold truncate">{it.payload.title}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {it.payload.daysLeft} días · Enviado {new Date(it.createdAt).toLocaleDateString("es-ES")}
                  </p>
                </div>
                <StatusPill status={it.status} />
              </li>
            ))}
          </ul>
        )}
      </SectionHeader>

      <div>
        <h3 className="font-display text-lg font-bold mb-3 flex items-center gap-2">
          <Heart className="h-4 w-4 text-coral" /> Guardados
        </h3>
        {favs.length === 0 ? (
          <p className="text-sm text-muted-foreground rounded-xl border border-dashed border-border p-6 text-center">
            No has guardado ningún clasificado todavía.
          </p>
        ) : (
          <ul className="divide-y divide-border rounded-2xl border border-border bg-card">
            {favs.map((c) => (
              <li key={c.id} className="p-4 flex items-center gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs px-2 py-0.5 rounded-full bg-muted font-medium">{c.cat}</span>
                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                      <MapPin className="h-3 w-3" /> {c.location}
                    </span>
                  </div>
                  <p className="font-medium truncate">{c.title}</p>
                </div>
                <span className="text-xs text-muted-foreground whitespace-nowrap flex items-center gap-1">
                  <Clock className="h-3 w-3" /> {c.time}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

/* ---------- Perfil ---------- */

function PerfilView() {
  const [form, setForm] = useState<UserProfile>(() => loadProfile());
  const [saved, setSaved] = useState(false);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    saveProfile(form);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="grid lg:grid-cols-[280px_1fr] gap-8">
      <aside className="space-y-4">
        <div className="rounded-2xl border border-border bg-card p-5 text-center">
          <div className="relative inline-block">
            <img src={form.avatar} alt={form.name} className="h-24 w-24 rounded-2xl object-cover mx-auto" />
            <button
              type="button"
              className="absolute -bottom-1 -right-1 h-8 w-8 grid place-items-center rounded-full bg-coral text-coral-foreground shadow-lg"
              title="Cambiar foto"
              onClick={() => {
                const url = prompt("URL de la nueva foto:", form.avatar);
                if (url) setForm({ ...form, avatar: url });
              }}
            >
              <Camera className="h-4 w-4" />
            </button>
          </div>
          <h3 className="mt-3 font-semibold">{form.name}</h3>
          <p className="text-xs text-muted-foreground">
            Miembro desde {new Date(form.memberSince).toLocaleDateString("es-ES", { month: "long", year: "numeric" })}
          </p>
          <div className="mt-4 space-y-2 text-left text-sm">
            <p className="flex items-center gap-2 text-muted-foreground"><Mail className="h-3.5 w-3.5" /> {form.email}</p>
            <p className="flex items-center gap-2 text-muted-foreground"><Phone className="h-3.5 w-3.5" /> {form.phone}</p>
            <p className="flex items-center gap-2 text-muted-foreground"><MapPin className="h-3.5 w-3.5" /> {form.city}</p>
          </div>
        </div>
        <Link
          to="/acceder"
          className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-border text-sm font-medium hover:bg-muted transition-colors"
        >
          <LogOut className="h-4 w-4" /> Cerrar sesión
        </Link>
      </aside>

      <form onSubmit={onSubmit} className="rounded-2xl border border-border bg-card p-6 space-y-5">
        <div>
          <h2 className="font-display text-xl font-bold">Datos personales</h2>
          <p className="text-sm text-muted-foreground">Actualiza tu información pública y de contacto.</p>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <Field label="Nombre completo">
            <input
              className="w-full px-3 py-2.5 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-coral/40" value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
          </Field>
          <Field label="Correo electrónico">
            <input
              type="email" className="w-full px-3 py-2.5 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-coral/40" value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
          </Field>
          <Field label="Teléfono">
            <input
              className="w-full px-3 py-2.5 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-coral/40" value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
            />
          </Field>
          <Field label="Barrio / Ciudad">
            <input
              className="w-full px-3 py-2.5 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-coral/40" value={form.city}
              onChange={(e) => setForm({ ...form, city: e.target.value })}
            />
          </Field>
        </div>

        <Field label="Sobre mí">
          <textarea
            rows={4} className="w-full px-3 py-2.5 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-coral/40"
            value={form.bio}
            onChange={(e) => setForm({ ...form, bio: e.target.value })}
          />
        </Field>

        <div className="flex items-center gap-3 pt-2">
          <button
            type="submit"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-coral text-coral-foreground font-semibold hover:opacity-90 transition-opacity"
          >
            <Save className="h-4 w-4" /> Guardar cambios
          </button>
          {saved && (
            <span className="text-sm text-emerald-600 flex items-center gap-1">
              <CheckCircle2 className="h-4 w-4" /> Guardado
            </span>
          )}
        </div>
      </form>
    </div>
  );
}

/* ---------- Shared bits ---------- */

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="block text-sm font-medium mb-1.5">{label}</span>
      {children}
    </label>
  );
}

function StatusPill({ status }: { status: ModerationStatus }) {
  const map = {
    pending: { label: "Pendiente", cls: "bg-amber-100 text-amber-800", Icon: Clock },
    approved: { label: "Publicado", cls: "bg-emerald-100 text-emerald-800", Icon: CheckCircle2 },
    rejected: { label: "Rechazado", cls: "bg-rose-100 text-rose-800", Icon: XCircle },
    paused: { label: "Pausado", cls: "bg-muted text-muted-foreground", Icon: PauseCircle },
  } as const;
  const { label, cls, Icon } = map[status];
  return (
    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold ${cls}`}>
      <Icon className="h-3 w-3" /> {label}
    </span>
  );
}

function SectionHeader({
  title, subtitle, cta, children,
}: {
  title: string;
  subtitle?: string;
  cta?: { to: string; label: string };
  children: React.ReactNode;
}) {
  return (
    <section className="space-y-5">
      <div className="flex items-end justify-between gap-4 flex-wrap">
        <div>
          <h2 className="font-display text-2xl font-bold">{title}</h2>
          {subtitle && <p className="text-sm text-muted-foreground mt-1">{subtitle}</p>}
        </div>
        {cta && (
          <Link
            to={cta.to}
            className="px-4 py-2 rounded-full bg-foreground text-background text-sm font-semibold hover:bg-coral transition-colors"
          >
            {cta.label}
          </Link>
        )}
      </div>
      {children}
    </section>
  );
}

function EmptyState({
  icon: Icon, label, cta,
}: {
  icon: typeof User;
  label: string;
  cta: { to: string; label: string };
}) {
  return (
    <div className="rounded-2xl border border-dashed border-border p-10 text-center">
      <Icon className="h-10 w-10 mx-auto text-muted-foreground/60" />
      <p className="mt-3 text-sm text-muted-foreground">{label}</p>
      <Link
        to={cta.to}
        className="inline-block mt-4 px-4 py-2 rounded-full bg-coral text-coral-foreground text-sm font-semibold hover:opacity-90 transition-opacity"
      >
        {cta.label}
      </Link>
    </div>
  );
}
