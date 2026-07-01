import { useEffect, useState } from "react";

export type UserProfile = {
  name: string;
  email: string;
  phone: string;
  city: string;
  bio: string;
  avatar: string;
  memberSince: string;
};

const KEY = "set:profile:v1";
const EVT = "profile-changed";

const DEFAULT: UserProfile = {
  name: "Marta Puig",
  email: "marta.puig@example.com",
  phone: "+34 655 887 221",
  city: "Tarragona · Part Alta",
  bio: "Vecina de Tarragona. Me encanta el mar, los mercados de proximidad y descubrir negocios locales.",
  avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&q=80",
  memberSince: "2024-05-14",
};

export function loadProfile(): UserProfile {
  if (typeof window === "undefined") return DEFAULT;
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? { ...DEFAULT, ...JSON.parse(raw) } : DEFAULT;
  } catch {
    return DEFAULT;
  }
}

export function saveProfile(p: UserProfile) {
  try {
    localStorage.setItem(KEY, JSON.stringify(p));
    window.dispatchEvent(new CustomEvent(EVT));
  } catch {
    /* ignore */
  }
}

export function useProfile() {
  const [p, setP] = useState<UserProfile>(DEFAULT);
  useEffect(() => {
    setP(loadProfile());
    const sync = () => setP(loadProfile());
    window.addEventListener(EVT, sync);
    return () => window.removeEventListener(EVT, sync);
  }, []);
  return p;
}

// Favorited directory businesses (by slug)
const DIR_FAV_KEY = "set:directorio:favs:v1";
const DIR_FAV_EVT = "directorio-favs-changed";

export function useDirectorioFavs() {
  const [favs, setFavs] = useState<Set<string>>(new Set());
  useEffect(() => {
    const read = () => {
      try {
        const raw = localStorage.getItem(DIR_FAV_KEY);
        setFavs(new Set(raw ? JSON.parse(raw) : ["el-terrat-de-sant-magi", "estudio-yoga-mediterrania"]));
      } catch {
        setFavs(new Set());
      }
    };
    read();
    window.addEventListener(DIR_FAV_EVT, read);
    return () => window.removeEventListener(DIR_FAV_EVT, read);
  }, []);
  const toggle = (slug: string) => {
    setFavs((prev) => {
      const next = new Set(prev);
      if (next.has(slug)) next.delete(slug);
      else next.add(slug);
      try {
        localStorage.setItem(DIR_FAV_KEY, JSON.stringify([...next]));
        window.dispatchEvent(new CustomEvent(DIR_FAV_EVT));
      } catch {
        /* ignore */
      }
      return next;
    });
  };
  return { favs, toggle };
}
