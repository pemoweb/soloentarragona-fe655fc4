import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { Loader2, Sparkles, X } from "lucide-react";
import type { Classified } from "@/lib/classifieds-data";
import { aiSearchClassifieds, type AiMatch } from "@/lib/ai-classifieds.functions";

export function AiClassifiedSearch({ ads, onSelect }: { ads: Classified[]; onSelect: (a: Classified) => void }) {
  const search = useServerFn(aiSearchClassifieds);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [matches, setMatches] = useState<AiMatch[] | null>(null);

  const run = async () => {
    if (text.trim().length < 3 || loading) return;
    setLoading(true);
    setError(null);
    try {
      const res = await search({
        data: {
          query: text.trim(),
          ads: ads.slice(0, 200).map((a) => ({
            id: a.id,
            cat: a.cat,
            title: a.title,
            location: a.location,
            description: a.description?.slice(0, 1000),
          })),
        },
      });
      if (res.ok) setMatches(res.matches);
      else setError(res.message);
    } catch {
      setError("No se pudo completar la búsqueda. Inténtalo más tarde.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="mt-10 rounded-3xl border border-border bg-card p-5 md:p-7">
      <div className="flex items-center gap-2 text-coral font-semibold text-sm">
        <Sparkles className="h-4 w-4" /> Búsqueda inteligente
      </div>
      <h2 className="mt-2 font-display text-2xl md:text-3xl font-black">Cuéntanos qué buscas</h2>
      <form
        className="mt-4 flex flex-col sm:flex-row gap-3"
        onSubmit={(e) => {
          e.preventDefault();
          run();
        }}
      >
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          maxLength={500}
          placeholder="Ej.: habitación barata cerca de la Rambla para estudiante"
          className="flex-1 rounded-full border border-border bg-background px-5 py-3 text-sm outline-none focus:border-coral"
        />
        <button
          type="submit"
          disabled={loading || text.trim().length < 3}
          className="rounded-full bg-primary text-primary-foreground px-6 py-3 text-sm font-semibold inline-flex items-center justify-center gap-2 disabled:opacity-50"
        >
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
          {loading ? "Buscando…" : "Buscar con IA"}
        </button>
      </form>
      {error && <p className="mt-4 text-sm text-destructive">{error}</p>}
      {matches && !loading && (
        <div className="mt-5">
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              {matches.length ? `${matches.length} anuncios recomendados` : "No encontramos anuncios que encajen."}
            </p>
            <button onClick={() => setMatches(null)} className="text-xs text-muted-foreground hover:text-coral inline-flex items-center gap-1">
              <X className="h-3 w-3" /> Cerrar
            </button>
          </div>
          <ul className="mt-3 grid gap-3 md:grid-cols-2">
            {matches.map((m) => {
              const ad = ads.find((a) => a.id === m.id);
              if (!ad) return null;
              return (
                <li key={m.id}>
                  <button
                    onClick={() => onSelect(ad)}
                    className="w-full text-left rounded-2xl border border-border bg-background p-4 hover:border-coral transition"
                  >
                    <div className="text-xs font-semibold text-coral">{ad.cat} · {ad.location}</div>
                    <div className="mt-1 font-semibold">{ad.title}</div>
                    <div className="mt-1 text-xs text-muted-foreground">{m.reason}</div>
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </section>
  );
}
