import { useEffect, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { Eye, Phone, MessageCircle, RefreshCw, BarChart3 } from "lucide-react";
import { getAdStats, type AdStat } from "@/lib/ad-stats.functions";

export function AdStatsPanel() {
  const fetchStats = useServerFn(getAdStats);
  const [stats, setStats] = useState<AdStat[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      setStats(await fetchStats({ data: { pin: "1234" } }));
    } catch {
      setError("No se pudieron cargar las estadísticas.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const total = (k: "views" | "calls" | "whatsapp") => (stats ?? []).reduce((s, x) => s + x[k], 0);

  return (
    <div className="mt-10 rounded-2xl border border-border bg-card p-5">
      <div className="flex items-center justify-between gap-3">
        <h2 className="font-semibold inline-flex items-center gap-2"><BarChart3 className="h-4 w-4 text-coral" /> Estadísticas de anuncios (Marketplace)</h2>
        <button onClick={load} className="inline-flex items-center gap-1 rounded-full border border-border px-3 py-1.5 text-xs font-semibold hover:border-coral">
          <RefreshCw className={`h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`} /> Actualizar
        </button>
      </div>
      <div className="mt-4 grid grid-cols-3 gap-3 text-center">
        <div className="rounded-xl bg-secondary/50 p-3"><div className="font-display text-2xl font-black">{total("views")}</div><div className="text-xs text-muted-foreground">Visitas</div></div>
        <div className="rounded-xl bg-secondary/50 p-3"><div className="font-display text-2xl font-black">{total("calls")}</div><div className="text-xs text-muted-foreground">Llamadas</div></div>
        <div className="rounded-xl bg-secondary/50 p-3"><div className="font-display text-2xl font-black">{total("whatsapp")}</div><div className="text-xs text-muted-foreground">WhatsApp</div></div>
      </div>
      {error && <p className="mt-4 text-sm text-destructive">{error}</p>}
      {stats && stats.length === 0 && <p className="mt-4 text-sm text-muted-foreground">Aún no hay visitas registradas.</p>}
      {stats && stats.length > 0 && (
        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="text-left text-xs uppercase text-muted-foreground">
              <tr><th className="py-2">Anuncio</th><th className="py-2 text-right"><Eye className="inline h-3.5 w-3.5" /> Visitas</th><th className="py-2 text-right"><Phone className="inline h-3.5 w-3.5" /> Llamar</th><th className="py-2 text-right"><MessageCircle className="inline h-3.5 w-3.5" /> WhatsApp</th></tr>
            </thead>
            <tbody>
              {stats.map((s) => (
                <tr key={s.slug} className="border-t border-border">
                  <td className="py-2 pr-3 font-medium">{s.title || s.slug}</td>
                  <td className="py-2 text-right">{s.views}</td>
                  <td className="py-2 text-right">{s.calls}</td>
                  <td className="py-2 text-right">{s.whatsapp}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
