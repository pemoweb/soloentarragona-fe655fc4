import { Link } from "@tanstack/react-router";
import { openCookiePreferences } from "@/components/CookieBanner";

export function SiteFooter() {
  return (
    <footer className="mt-24 border-t border-border bg-primary text-primary-foreground">
      <div className="mx-auto max-w-7xl px-4 md:px-8 py-16 grid gap-12 md:grid-cols-4">
        <div className="md:col-span-2">
          <div className="flex items-center gap-2">
            <span className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-coral text-coral-foreground font-display font-black text-lg">T</span>
            <span className="font-display text-2xl font-bold">Solo en Tarragona</span>
          </div>
          <p className="mt-4 max-w-md text-sm opacity-70">
            El portal digital que conecta a Tarragona. Noticias, comercio, servicios y comunidad en un solo lugar.
          </p>
        </div>
        <div>
          <h4 className="font-display text-base font-semibold mb-4">Explorar</h4>
          <ul className="space-y-2 text-sm opacity-80">
            <li><Link to="/noticias">Noticias</Link></li>
            <li><Link to="/marketplace">Marketplace</Link></li>
            <li><Link to="/directorio">Directorio</Link></li>
            <li><Link to="/clasificados">Clasificados</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="font-display text-base font-semibold mb-4">Ciudad</h4>
          <ul className="space-y-2 text-sm opacity-80">
            <li><Link to="/servicios-publicos">Servicios públicos</Link></li>
            <li><Link to="/shopping">Tiendas locales</Link></li>
            <li><Link to="/privacidad">Privacidad</Link></li>
            <li><Link to="/terminos">Términos</Link></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-primary-foreground/10 py-6 flex flex-col md:flex-row items-center justify-center gap-2 md:gap-4 text-center text-xs opacity-60">
        <span>© {new Date().getFullYear()} Solo en Tarragona · Hecho con ❤ en la Costa Daurada</span>
        <span className="hidden md:inline">·</span>
        <Link to="/privacidad" className="hover:opacity-100 hover:underline">Privacidad</Link>
        <Link to="/terminos" className="hover:opacity-100 hover:underline">Términos</Link>
        <button
          type="button"
          onClick={openCookiePreferences}
          className="hover:opacity-100 hover:underline"
        >
          Preferencias de cookies
        </button>
      </div>
    </footer>
  );
}
