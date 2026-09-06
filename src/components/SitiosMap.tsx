import { useEffect, useRef } from "react";
import "leaflet/dist/leaflet.css";
import type { Sitio } from "@/lib/sitios-data";

interface SitiosMapProps {
  sitios: Sitio[];
  activeSlug?: string;
  className?: string;
}

/**
 * Mapa interactivo (OpenStreetMap + Leaflet) con un marcador por sitio.
 * Leaflet se carga dinámicamente en el cliente para no romper el SSR.
 */
export function SitiosMap({ sitios, activeSlug, className = "h-[420px]" }: SitiosMapProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    let map: import("leaflet").Map | null = null;
    let cancelled = false;

    (async () => {
      const L = await import("leaflet");
      if (cancelled || !containerRef.current) return;

      const points = sitios.filter((s) => s.coords);
      const active = points.find((s) => s.slug === activeSlug);
      const center = active?.coords ?? { lat: 41.1167, lng: 1.2546 };

      map = L.map(containerRef.current, {
        center: [center.lat, center.lng],
        zoom: active ? 15 : 13,
        scrollWheelZoom: false,
      });

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        maxZoom: 19,
      }).addTo(map);

      points.forEach((s) => {
        const isActive = s.slug === activeSlug;
        const icon = L.divIcon({
          className: "",
          html: `<span style="display:grid;place-items:center;width:2rem;height:2rem;border-radius:9999px;border:2px solid #fff;box-shadow:0 4px 12px rgba(0,0,0,.3);background:${
            isActive ? "#ff6b5b" : "#123a5e"
          };color:#fff;font-weight:700;font-size:12px">${isActive ? "★" : "●"}</span>`,
          iconSize: [32, 32],
          iconAnchor: [16, 16],
          popupAnchor: [0, -18],
        });

        L.marker([s.coords!.lat, s.coords!.lng], { icon, title: s.name })
          .addTo(map!)
          .bindPopup(
            `<strong style="font-size:14px">${s.name}</strong><br/><span style="color:#555">${s.category}</span><br/>` +
              `<a href="/sitios-de-interes/${s.slug}" style="color:#e2523f;font-weight:600">Ver ficha</a>`,
          );
      });

      if (!active && points.length > 1) {
        map.fitBounds(
          points.map((s) => [s.coords!.lat, s.coords!.lng] as [number, number]),
          { padding: [40, 40] },
        );
      }
    })();

    return () => {
      cancelled = true;
      map?.remove();
    };
  }, [sitios, activeSlug]);

  return (
    <div
      ref={containerRef}
      role="application"
      aria-label="Mapa de sitios de interés de Tarragona"
      className={`w-full overflow-hidden rounded-3xl border border-border shadow-card ${className}`}
    />
  );
}
