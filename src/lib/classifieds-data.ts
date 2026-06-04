import { useEffect, useState } from "react";

export type Classified = {
  id: string;
  cat: "Empleo" | "Alquiler" | "Venta" | "Servicios";
  title: string;
  location: string;
  time: string;
  description?: string;
  daysLeft: number;
};

export const CLASSIFIED_CATEGORIES = [
  "Todos",
  "Empleo",
  "Alquiler",
  "Venta",
  "Servicios",
] as const;

export const TARRAGONA_ZONES = [
  "Todas",
  "Part Alta",
  "Centre",
  "Eixample",
  "Sant Pere i Sant Pau",
  "Bonavista",
  "Torreforta",
  "Serrallo",
  "Rambla Nova",
] as const;

export const SORT_OPTIONS = [
  { value: "recent", label: "Más recientes" },
  { value: "expiring", label: "Caducan antes" },
  { value: "category", label: "Por categoría" },
] as const;

export type SortOption = (typeof SORT_OPTIONS)[number]["value"];

export const CLASSIFIEDS_SEED: Classified[] = [
  {
    id: "c1",
    cat: "Empleo",
    title: "Camarero/a fines de semana — Restaurante Part Alta",
    location: "Part Alta",
    time: "5 días restantes",
    daysLeft: 5,
    description:
      "Buscamos camarero/a con experiencia para servicio de fin de semana en restaurante de la Part Alta. Buen ambiente, propinas compartidas.",
  },
  {
    id: "c2",
    cat: "Alquiler",
    title: "Habitación en piso compartido cerca URV — 350€/mes",
    location: "Sant Pere i Sant Pau",
    time: "6 días restantes",
    daysLeft: 6,
    description:
      "Habitación luminosa en piso de 4 con estudiantes. Gastos incluidos, fianza un mes. Wifi fibra.",
  },
  {
    id: "c3",
    cat: "Servicios",
    title: "Clases particulares matemáticas ESO y Bachillerato",
    location: "Eixample",
    time: "3 días restantes",
    daysLeft: 3,
    description:
      "Ingeniero con 5 años de experiencia. Clases a domicilio u online. Material incluido. 15€/h.",
  },
  {
    id: "c4",
    cat: "Venta",
    title: "Mudanza completa: muebles, electrodomésticos, deco",
    location: "Bonavista",
    time: "1 día restante",
    daysLeft: 1,
    description:
      "Liquidación por mudanza. Todo en buen estado. Precios a convenir, hay que retirarlo antes del domingo.",
  },
  {
    id: "c5",
    cat: "Empleo",
    title: "Buscamos peluquera con experiencia — incorporación inmediata",
    location: "Centre",
    time: "7 días restantes",
    daysLeft: 7,
    description:
      "Salón en el centro busca peluquera con mínimo 2 años de experiencia. Jornada completa, contrato indefinido.",
  },
  {
    id: "c6",
    cat: "Alquiler",
    title: "Plaza de parking Rambla Nova — 80€/mes",
    location: "Rambla Nova",
    time: "4 días restantes",
    daysLeft: 4,
    description:
      "Plaza amplia, fácil acceso, 24h con tarjeta. Disponible desde el día 1 del próximo mes.",
  },
];

const STORAGE_KEY = "set_classifieds_user_v1";

function loadUserClassifieds(): Classified[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "[]");
  } catch {
    return [];
  }
}

function saveUserClassifieds(items: Classified[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    window.dispatchEvent(new CustomEvent("classifieds-changed"));
  } catch {
    /* ignore */
  }
}

export function addClassified(c: Omit<Classified, "id" | "time">) {
  const item: Classified = {
    ...c,
    id: `u${Date.now()}`,
    time: `${c.daysLeft} días restantes`,
  };
  const items = [item, ...loadUserClassifieds()];
  saveUserClassifieds(items);
  return item;
}

export function useAllClassifieds() {
  const [items, setItems] = useState<Classified[]>(CLASSIFIEDS_SEED);
  useEffect(() => {
    const sync = () =>
      setItems([...loadUserClassifieds(), ...CLASSIFIEDS_SEED]);
    sync();
    window.addEventListener("classifieds-changed", sync);
    return () => window.removeEventListener("classifieds-changed", sync);
  }, []);
  return items;
}

// Favorites
const FAV_KEY = "set_classifieds_favs_v1";

export function useFavorites() {
  const [favs, setFavs] = useState<Set<string>>(new Set());
  useEffect(() => {
    try {
      const raw = localStorage.getItem(FAV_KEY);
      setFavs(new Set(raw ? JSON.parse(raw) : []));
    } catch {
      /* ignore */
    }
    const sync = () => {
      try {
        const raw = localStorage.getItem(FAV_KEY);
        setFavs(new Set(raw ? JSON.parse(raw) : []));
      } catch {
        /* ignore */
      }
    };
    window.addEventListener("classifieds-favs-changed", sync);
    return () => window.removeEventListener("classifieds-favs-changed", sync);
  }, []);

  const toggle = (id: string) => {
    setFavs((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      try {
        localStorage.setItem(FAV_KEY, JSON.stringify([...next]));
        window.dispatchEvent(new CustomEvent("classifieds-favs-changed"));
      } catch {
        /* ignore */
      }
      return next;
    });
  };
  return { favs, toggle };
}

// Dynamic SEO copy per category
export function classifiedsSeo(
  category: string,
  zone: string,
): { title: string; description: string } {
  const inZone = zone && zone !== "Todas" ? ` en ${zone}` : " en Tarragona";
  switch (category) {
    case "Empleo":
      return {
        title: `Ofertas de Empleo${inZone} — Clasificados gratis`,
        description: `Encuentra trabajo${inZone}: hostelería, comercio, oficinas y más. Anuncios verificados, publica gratis 7 días.`,
      };
    case "Alquiler":
      return {
        title: `Pisos y habitaciones en Alquiler${inZone}`,
        description: `Alquiler de pisos, habitaciones y plazas de parking${inZone}. Sin comisiones, contacto directo entre vecinos.`,
      };
    case "Venta":
      return {
        title: `Anuncios de Venta de segunda mano${inZone}`,
        description: `Compra y vende muebles, electrónica y mucho más${inZone}. Anuncios gratis durante 7 días.`,
      };
    case "Servicios":
      return {
        title: `Servicios profesionales${inZone} — Clases, reformas, cuidados`,
        description: `Profesionales y particulares ofrecen sus servicios${inZone}: clases, reformas, cuidados y mucho más.`,
      };
    default:
      return {
        title: `Clasificados gratis${inZone} — Empleo, alquiler, venta y servicios`,
        description: `Publica tu anuncio gratis durante 7 días${inZone}. Empleo, alquiler, venta y servicios entre vecinos.`,
      };
  }
}
