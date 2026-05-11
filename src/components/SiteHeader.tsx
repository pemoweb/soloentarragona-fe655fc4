import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { Menu, X } from "lucide-react";

const navLinks = [
  { to: "/noticias", label: "Noticias" },
  { to: "/marketplace", label: "Marketplace" },
  { to: "/directorio", label: "Directorio" },
  { to: "/clasificados", label: "Clasificados" },
  { to: "/shopping", label: "Shopping" },
  { to: "/servicios-publicos", label: "Servicios" },
] as const;

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/60 bg-background/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 md:px-8">
        <Link to="/" className="flex items-center gap-2 group">
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-coral text-coral-foreground font-display font-black text-lg shadow-glow transition-transform group-hover:scale-105">
            T
          </span>
          <span className="font-display text-xl font-bold tracking-tight">
            Solo en <span className="text-coral">Tarragona</span>
          </span>
        </Link>

        <nav className="hidden lg:flex items-center gap-1">
          {navLinks.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              className="px-3 py-2 text-sm font-medium text-muted-foreground rounded-lg hover:text-foreground hover:bg-muted transition-colors"
              activeProps={{ className: "px-3 py-2 text-sm font-semibold text-coral rounded-lg bg-coral/10" }}
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="hidden lg:flex items-center gap-2">
          <button className="px-4 py-2 text-sm font-medium text-foreground hover:text-coral transition-colors">
            Acceder
          </button>
          <Link
            to="/noticias/publicar"
            className="px-4 py-2 text-sm font-semibold rounded-full bg-foreground text-background hover:bg-coral transition-colors"
          >
            Publicar
          </Link>
        </div>

        <button className="lg:hidden p-2" onClick={() => setOpen(!open)} aria-label="Menú">
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {open && (
        <div className="lg:hidden border-t border-border bg-background">
          <nav className="flex flex-col p-4 gap-1">
            {navLinks.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                onClick={() => setOpen(false)}
                className="px-4 py-3 rounded-lg text-base font-medium hover:bg-muted"
              >
                {l.label}
              </Link>
            ))}
            <div className="flex gap-2 pt-3 border-t border-border mt-2">
              <button className="flex-1 px-4 py-2.5 rounded-full border border-border font-medium">Acceder</button>
              <Link
                to="/noticias/publicar"
                onClick={() => setOpen(false)}
                className="flex-1 px-4 py-2.5 rounded-full bg-foreground text-background font-semibold text-center"
              >
                Publicar
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
