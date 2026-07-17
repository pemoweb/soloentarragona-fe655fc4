import { createFileRoute, redirect } from "@tanstack/react-router";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { PageShell } from "@/components/PageShell";

// Minimal typed wrapper — `supabase.auth.oauth` namespace is beta and may not be
// present in the shipped TS types. Cast the client to access it.
type OAuthAuthorizationDetails = {
  client?: { name?: string; redirect_uri?: string; scope?: string } | null;
  redirect_url?: string;
  redirect_to?: string;
  scope?: string;
};

function oauth() {
  const client = supabase as unknown as {
    auth: {
      oauth: {
        getAuthorizationDetails: (
          id: string,
        ) => Promise<{ data: OAuthAuthorizationDetails | null; error: { message: string } | null }>;
        approveAuthorization: (
          id: string,
        ) => Promise<{ data: OAuthAuthorizationDetails | null; error: { message: string } | null }>;
        denyAuthorization: (
          id: string,
        ) => Promise<{ data: OAuthAuthorizationDetails | null; error: { message: string } | null }>;
      };
    };
  };
  return client.auth.oauth;
}

export const Route = createFileRoute("/.lovable/oauth/consent")({
  ssr: false,
  validateSearch: (s: Record<string, unknown>) => ({
    authorization_id:
      typeof s.authorization_id === "string" ? s.authorization_id : "",
  }),
  beforeLoad: async ({ search, location }) => {
    if (!search.authorization_id) throw new Error("Missing authorization_id");
    const { data } = await supabase.auth.getSession();
    if (!data.session) {
      const next = location.pathname + location.searchStr;
      throw redirect({ to: "/acceder", search: { next } });
    }
  },
  loader: async ({ location }) => {
    const authorizationId = new URLSearchParams(location.search).get(
      "authorization_id",
    )!;
    const { data, error } = await oauth().getAuthorizationDetails(authorizationId);
    if (error) throw new Error(error.message);
    const immediate = data?.redirect_url ?? data?.redirect_to;
    if (immediate && !data?.client) throw redirect({ href: immediate });
    return data;
  },
  component: Consent,
  errorComponent: ({ error }) => (
    <PageShell>
      <main className="mx-auto max-w-md px-4 py-16">
        <h1 className="font-display text-2xl font-black">
          No se pudo cargar la solicitud
        </h1>
        <p className="mt-3 text-sm text-muted-foreground">
          {String((error as Error)?.message ?? error)}
        </p>
      </main>
    </PageShell>
  ),
});

function Consent() {
  const details = Route.useLoaderData();
  const { authorization_id } = Route.useSearch();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function decide(approve: boolean) {
    setBusy(true);
    setError(null);
    const { data, error } = approve
      ? await oauth().approveAuthorization(authorization_id)
      : await oauth().denyAuthorization(authorization_id);
    if (error) {
      setBusy(false);
      setError(error.message);
      return;
    }
    const target = data?.redirect_url ?? data?.redirect_to;
    if (!target) {
      setBusy(false);
      setError("El servidor de autorización no devolvió una URL de retorno.");
      return;
    }
    window.location.href = target;
  }

  const clientName = details?.client?.name ?? "Una aplicación";

  return (
    <PageShell>
      <main className="mx-auto max-w-md px-4 py-16">
        <div className="rounded-3xl border border-border bg-card p-8 shadow-card">
          <h1 className="font-display text-2xl font-black">
            Conectar {clientName} a tu cuenta
          </h1>
          <p className="mt-3 text-sm text-muted-foreground">
            {clientName} podrá usar las herramientas de Solo en Tarragona en tu
            nombre mientras tengas la sesión iniciada. No se saltan las políticas
            de acceso de la app.
          </p>
          {details?.client?.redirect_uri && (
            <p className="mt-3 text-xs text-muted-foreground break-all">
              Redirección: {details.client.redirect_uri}
            </p>
          )}
          {error && (
            <p role="alert" className="mt-4 text-sm text-red-500">
              {error}
            </p>
          )}
          <div className="mt-6 flex gap-3">
            <button
              disabled={busy}
              onClick={() => decide(true)}
              className="flex-1 px-4 py-3 rounded-full bg-coral text-coral-foreground font-semibold text-sm shadow-glow hover:scale-[1.01] transition disabled:opacity-50"
            >
              Aprobar
            </button>
            <button
              disabled={busy}
              onClick={() => decide(false)}
              className="flex-1 px-4 py-3 rounded-full border border-border font-semibold text-sm hover:border-coral hover:text-coral transition disabled:opacity-50"
            >
              Rechazar
            </button>
          </div>
        </div>
      </main>
    </PageShell>
  );
}
