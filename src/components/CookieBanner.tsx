import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { Cookie, X } from "lucide-react";

const STORAGE_KEY = "set_cookie_consent_v1";

export function CookieBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    try {
      if (!localStorage.getItem(STORAGE_KEY)) setVisible(true);
    } catch {
      setVisible(true);
    }
  }, []);

  const decide = (value: "accepted" | "rejected") => {
    try {
      localStorage.setItem(STORAGE_KEY, value);
    } catch {
      /* ignore */
    }
    setVisible(false);
  };

  if (!visible) return null;

  return (
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
            Usamos cookies propias y de terceros para mejorar tu experiencia, analizar el tráfico y personalizar contenido.{" "}
            <Link to="/privacidad" className="underline font-semibold text-foreground hover:text-coral">
              Política de privacidad
            </Link>
            .
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => decide("rejected")}
            className="px-4 py-2.5 rounded-full text-sm font-semibold border border-border hover:border-coral hover:text-coral transition"
          >
            Rechazar
          </button>
          <button
            onClick={() => decide("accepted")}
            className="px-5 py-2.5 rounded-full bg-coral text-coral-foreground font-semibold text-sm shadow-glow hover:scale-[1.02] transition"
          >
            Aceptar todas
          </button>
          <button
            aria-label="Cerrar"
            onClick={() => decide("rejected")}
            className="grid h-9 w-9 place-items-center rounded-full hover:bg-secondary md:hidden"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
