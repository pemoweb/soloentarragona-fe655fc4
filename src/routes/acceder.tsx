import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { z } from "zod";
import { Mail, Lock, User, Check, ArrowRight } from "lucide-react";
import { PageShell } from "@/components/PageShell";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/acceder")({
  validateSearch: (s: Record<string, unknown>) => ({
    next: typeof s.next === "string" ? s.next : "",
  }),
  head: () => ({
    meta: [
      { title: "Acceder — Solo en Tarragona" },
      {
        name: "description",
        content:
          "Inicia sesión o crea tu cuenta en Solo en Tarragona para publicar noticias, anuncios y guardar tus favoritos.",
      },
      { property: "og:title", content: "Acceder — Solo en Tarragona" },
      {
        property: "og:description",
        content: "Inicia sesión o crea tu cuenta en Solo en Tarragona.",
      },
    ],
  }),
  component: AccederPage,
});

const loginSchema = z.object({
  email: z.string().trim().email("Email no válido").max(255),
  password: z.string().min(6, "Mínimo 6 caracteres").max(120),
});
const registerSchema = loginSchema.extend({
  name: z.string().trim().min(2, "Nombre demasiado corto").max(80),
});

// Only accept same-origin relative paths as post-auth return targets.
function safeNext(raw: string): string | null {
  if (!raw) return null;
  if (!raw.startsWith("/") || raw.startsWith("//")) return null;
  return raw;
}

function AccederPage() {
  const { next } = Route.useSearch();
  const navigate = useNavigate();
  const [mode, setMode] = useState<"login" | "register">("login");
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const nextPath = safeNext(next);

  function goNext() {
    if (nextPath) {
      window.location.href = nextPath;
    } else {
      navigate({ to: "/" });
    }
  }

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setAuthError(null);
    const schema = mode === "login" ? loginSchema : registerSchema;
    const result = schema.safeParse(form);
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      for (const issue of result.error.issues) {
        fieldErrors[issue.path[0] as string] = issue.message;
      }
      setErrors(fieldErrors);
      return;
    }
    setBusy(true);
    try {
      if (mode === "login") {
        const { error } = await supabase.auth.signInWithPassword({
          email: form.email,
          password: form.password,
        });
        if (error) throw error;
        if (nextPath) {
          window.location.href = nextPath;
          return;
        }
        setSubmitted(true);
      } else {
        const emailRedirectTo = nextPath
          ? `${window.location.origin}${nextPath}`
          : `${window.location.origin}/`;
        const { error } = await supabase.auth.signUp({
          email: form.email,
          password: form.password,
          options: {
            data: { name: form.name },
            emailRedirectTo,
          },
        });
        if (error) throw error;
        setSubmitted(true);
      }
    } catch (err) {
      setAuthError((err as Error).message ?? "Error de autenticación");
    } finally {
      setBusy(false);
    }
  };

  const onGoogle = async () => {
    setAuthError(null);
    const redirectTo = nextPath
      ? `${window.location.origin}${nextPath}`
      : `${window.location.origin}/`;
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo },
    });
    if (error) setAuthError(error.message);
  };

  return (
    <PageShell>
      <section className="mx-auto max-w-md px-4 md:px-8 py-16">
        <div className="rounded-3xl border border-border bg-card p-8 md:p-10 shadow-card">
          {submitted ? (
            <div className="text-center py-8">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-coral/10 text-coral mb-4">
                <Check className="h-7 w-7" />
              </div>
              <h1 className="font-display text-2xl font-black">
                {mode === "login" ? "¡Sesión iniciada!" : "Cuenta creada"}
              </h1>
              <p className="mt-2 text-muted-foreground text-sm">
                {mode === "register"
                  ? "Revisa tu correo para confirmar la cuenta y luego vuelve para continuar."
                  : "Bienvenido de vuelta."}
              </p>
              <button
                onClick={goNext}
                className="mt-6 inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-foreground text-background font-semibold text-sm hover:bg-coral transition"
              >
                Continuar <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          ) : (
            <>
              <h1 className="font-display text-3xl md:text-4xl font-black">
                {mode === "login" ? "Accede a tu cuenta" : "Crea tu cuenta"}
              </h1>
              <p className="mt-2 text-muted-foreground text-sm">
                {mode === "login"
                  ? "Bienvenido de vuelta a Solo en Tarragona."
                  : "Únete y empieza a publicar en menos de un minuto."}
              </p>

              <div className="mt-6 grid grid-cols-2 gap-1 p-1 rounded-full bg-muted">
                <button
                  type="button"
                  onClick={() => setMode("login")}
                  className={`py-2 rounded-full text-sm font-semibold transition ${
                    mode === "login"
                      ? "bg-background shadow-sm"
                      : "text-muted-foreground"
                  }`}
                >
                  Entrar
                </button>
                <button
                  type="button"
                  onClick={() => setMode("register")}
                  className={`py-2 rounded-full text-sm font-semibold transition ${
                    mode === "register"
                      ? "bg-background shadow-sm"
                      : "text-muted-foreground"
                  }`}
                >
                  Registrarme
                </button>
              </div>

              <button
                type="button"
                onClick={onGoogle}
                className="mt-6 w-full inline-flex items-center justify-center gap-2 px-4 py-3 rounded-full border border-border font-semibold text-sm hover:border-coral hover:text-coral transition"
              >
                <GoogleIcon /> Continuar con Google
              </button>

              <div className="my-5 flex items-center gap-3 text-xs text-muted-foreground">
                <span className="flex-1 h-px bg-border" /> o con email
                <span className="flex-1 h-px bg-border" />
              </div>

              <form onSubmit={onSubmit} className="space-y-3" noValidate>
                {mode === "register" && (
                  <Field
                    icon={User}
                    label="Nombre"
                    type="text"
                    autoComplete="name"
                    value={form.name}
                    onChange={(v) => setForm({ ...form, name: v })}
                    error={errors.name}
                    placeholder="Tu nombre"
                  />
                )}
                <Field
                  icon={Mail}
                  label="Email"
                  type="email"
                  autoComplete="email"
                  value={form.email}
                  onChange={(v) => setForm({ ...form, email: v })}
                  error={errors.email}
                  placeholder="tu@email.com"
                />
                <Field
                  icon={Lock}
                  label="Contraseña"
                  type="password"
                  autoComplete={
                    mode === "login" ? "current-password" : "new-password"
                  }
                  value={form.password}
                  onChange={(v) => setForm({ ...form, password: v })}
                  error={errors.password}
                  placeholder="••••••••"
                />

                {authError && (
                  <p className="text-xs text-red-500">{authError}</p>
                )}

                <button
                  type="submit"
                  disabled={busy}
                  className="w-full px-4 py-3 rounded-full bg-coral text-coral-foreground font-semibold text-sm shadow-glow hover:scale-[1.01] transition disabled:opacity-60"
                >
                  {busy
                    ? "..."
                    : mode === "login"
                      ? "Entrar"
                      : "Crear cuenta"}
                </button>
              </form>

              <p className="mt-5 text-xs text-muted-foreground text-center">
                Al continuar aceptas los{" "}
                <Link to="/terminos" className="underline">
                  Términos
                </Link>{" "}
                y la{" "}
                <Link to="/privacidad" className="underline">
                  Política de privacidad
                </Link>
                .
              </p>
            </>
          )}
        </div>
      </section>
    </PageShell>
  );
}

function Field({
  icon: Icon,
  label,
  error,
  value,
  onChange,
  ...props
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  error?: string;
  value: string;
  onChange: (v: string) => void;
} & Omit<React.InputHTMLAttributes<HTMLInputElement>, "value" | "onChange">) {
  return (
    <label className="block">
      <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
        {label}
      </span>
      <div
        className={`mt-1 flex items-center gap-2 rounded-xl border bg-background px-3 ${
          error ? "border-red-500" : "border-border focus-within:border-coral"
        }`}
      >
        <Icon className="h-4 w-4 text-muted-foreground" />
        <input
          {...props}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="flex-1 bg-transparent py-3 text-sm focus:outline-none"
        />
      </div>
      {error && <span className="mt-1 block text-xs text-red-500">{error}</span>}
    </label>
  );
}

function GoogleIcon() {
  return (
    <svg className="h-4 w-4" viewBox="0 0 24 24" aria-hidden>
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.75h3.57c2.08-1.92 3.28-4.74 3.28-8.07z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.75c-.99.66-2.25 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84A11 11 0 0 0 12 23z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.12A6.6 6.6 0 0 1 5.5 12c0-.74.13-1.46.34-2.12V7.04H2.18A11 11 0 0 0 1 12c0 1.78.43 3.46 1.18 4.96l3.66-2.84z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.07.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.04l3.66 2.84C6.71 7.31 9.14 5.38 12 5.38z"
      />
    </svg>
  );
}
