import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { Cookie, X, Settings2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import {
  readConsent,
  writeConsent,
  DEFAULT_CONSENT,
} from "@/lib/cookie-consent";

export function CookieBanner() {
  const [visible, setVisible] = useState(false);
  const [showPrefs, setShowPrefs] = useState(false);
  const [analytics, setAnalytics] = useState(DEFAULT_CONSENT.analytics);
  const [marketing, setMarketing] = useState(DEFAULT_CONSENT.marketing);

  useEffect(() => {
    const existing = readConsent();
    if (!existing) {
      setVisible(true);
    } else {
      setAnalytics(existing.analytics);
      setMarketing(existing.marketing);
    }
    const onOpen = () => {
      const c = readConsent();
      if (c) {
        setAnalytics(c.analytics);
        setMarketing(c.marketing);
      }
      setShowPrefs(true);
      setVisible(true);
    };
    window.addEventListener("open-cookie-preferences", onOpen);
    return () => window.removeEventListener("open-cookie-preferences", onOpen);
  }, []);

  const acceptAll = () => {
    writeConsent({ analytics: true, marketing: true });
    setVisible(false);
    setShowPrefs(false);
  };
  const rejectAll = () => {
    writeConsent({ analytics: false, marketing: false });
    setVisible(false);
    setShowPrefs(false);
  };
  const saveCustom = () => {
    writeConsent({ analytics, marketing });
    setVisible(false);
    setShowPrefs(false);
  };

  return (
    <>
      {visible && !showPrefs && (
        <div className="fixed inset-x-0 bottom-0 z-50 px-4 pb-4 md:px-6 md:pb-6 pointer-events-none">
          <div
            role="dialog"
            aria-live="polite"
            aria-label="Aviso de cookies"
            className="pointer-events-auto mx-auto max-w-4xl rounded-2xl border border-border bg-card/95 backdrop-blur shadow-glow p-5 md:p-6 flex flex-col md:flex-row md:items-center gap-4"
          >
            <div className="flex items-start gap-3 flex-1">
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-coral/10 text-coral">
                <Cookie className="h-5 w-5" />
              </span>
              <div className="text-sm text-foreground/80 leading-relaxed">
                Usamos cookies propias y de terceros para mejorar tu
                experiencia, analizar el tráfico y mostrar publicidad
                relevante. Puedes aceptar todas, rechazar las opcionales o
                configurar tus preferencias.{" "}
                <Link
                  to="/privacidad"
                  className="underline font-semibold text-foreground hover:text-coral"
                >
                  Más información
                </Link>
                .
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-2 shrink-0">
              <button
                onClick={() => setShowPrefs(true)}
                className="px-4 py-2.5 rounded-full text-sm font-semibold border border-border hover:border-coral hover:text-coral transition inline-flex items-center gap-1.5"
              >
                <Settings2 className="h-4 w-4" /> Preferencias
              </button>
              <button
                onClick={rejectAll}
                className="px-4 py-2.5 rounded-full text-sm font-semibold border border-border hover:border-coral hover:text-coral transition"
              >
                Rechazar
              </button>
              <button
                onClick={acceptAll}
                className="px-5 py-2.5 rounded-full bg-coral text-coral-foreground font-semibold text-sm shadow-glow hover:scale-[1.02] transition"
              >
                Aceptar todas
              </button>
              <button
                aria-label="Cerrar"
                onClick={rejectAll}
                className="grid h-9 w-9 place-items-center rounded-full hover:bg-secondary md:hidden"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      <Dialog
        open={showPrefs}
        onOpenChange={(open) => {
          setShowPrefs(open);
          if (!open && !readConsent()) setVisible(true);
        }}
      >
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Cookie className="h-5 w-5 text-coral" /> Preferencias de cookies
            </DialogTitle>
            <DialogDescription>
              Elige qué tipos de cookies quieres permitir. Puedes cambiar esto
              en cualquier momento desde el pie de página.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3 mt-2">
            <div className="rounded-xl border border-border p-4 flex items-start justify-between gap-4 bg-muted/30">
              <div>
                <div className="font-semibold">Necesarias</div>
                <p className="text-sm text-muted-foreground mt-1">
                  Imprescindibles para que la web funcione (sesión, seguridad,
                  consentimiento). No se pueden desactivar.
                </p>
              </div>
              <Switch checked disabled aria-label="Cookies necesarias" />
            </div>

            <div className="rounded-xl border border-border p-4 flex items-start justify-between gap-4">
              <div>
                <div className="font-semibold">Analíticas</div>
                <p className="text-sm text-muted-foreground mt-1">
                  Nos ayudan a entender qué secciones se usan más y mejorar el
                  contenido. Datos agregados y anónimos.
                </p>
              </div>
              <Switch
                checked={analytics}
                onCheckedChange={setAnalytics}
                aria-label="Cookies analíticas"
              />
            </div>

            <div className="rounded-xl border border-border p-4 flex items-start justify-between gap-4">
              <div>
                <div className="font-semibold">Marketing</div>
                <p className="text-sm text-muted-foreground mt-1">
                  Permiten mostrar publicidad relevante y medir la efectividad
                  de las campañas locales.
                </p>
              </div>
              <Switch
                checked={marketing}
                onCheckedChange={setMarketing}
                aria-label="Cookies de marketing"
              />
            </div>
          </div>

          <div className="flex flex-col-reverse sm:flex-row justify-end gap-2 mt-4">
            <button
              onClick={rejectAll}
              className="px-4 py-2.5 rounded-full text-sm font-semibold border border-border hover:border-coral hover:text-coral transition"
            >
              Rechazar opcionales
            </button>
            <button
              onClick={saveCustom}
              className="px-4 py-2.5 rounded-full text-sm font-semibold border border-border hover:border-coral hover:text-coral transition"
            >
              Guardar selección
            </button>
            <button
              onClick={acceptAll}
              className="px-5 py-2.5 rounded-full bg-coral text-coral-foreground font-semibold text-sm shadow-glow hover:scale-[1.02] transition"
            >
              Aceptar todas
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

/** Trigger from anywhere (e.g. footer "Cookies" link) */
export function openCookiePreferences() {
  window.dispatchEvent(new CustomEvent("open-cookie-preferences"));
}
