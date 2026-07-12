// Mock moderation queue for News, Marketplace and Classifieds.
// Submissions land as "pending" and an admin can approve or reject.
// On approval, items commit into the live stores (news/classifieds) or are
// marked approved (marketplace, which is read-only in the mock data layer).

import { useEffect, useState } from "react";
import { createPost, type NewsCategory } from "./news-data";
import { addClassified } from "./classifieds-data";

export type ModerationKind = "news" | "marketplace" | "classified";
export type ModerationStatus = "pending" | "approved" | "rejected" | "paused";

export type NewsPayload = {
  title: string;
  excerpt: string;
  content: string;
  category: NewsCategory;
  tags: string[];
  cover: string;
  author: string;
};

export type MarketplacePayload = {
  title: string;
  price: number;
  location: string;
  category: string;
  description: string;
  img: string;
  contact: string;
};

export type ClassifiedPayload = {
  cat: "Empleo" | "Alquiler" | "Venta" | "Servicios";
  title: string;
  location: string;
  description: string;
  daysLeft: number;
  contact: string;
};

export type ModerationItem =
  | { id: string; kind: "news"; status: ModerationStatus; createdAt: string; reviewedAt?: string; rejectReason?: string; payload: NewsPayload }
  | { id: string; kind: "marketplace"; status: ModerationStatus; createdAt: string; reviewedAt?: string; rejectReason?: string; payload: MarketplacePayload }
  | { id: string; kind: "classified"; status: ModerationStatus; createdAt: string; reviewedAt?: string; rejectReason?: string; payload: ClassifiedPayload };

const KEY = "set:moderation:queue:v1";
const EVT = "moderation-changed";

function read(): ModerationItem[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(KEY) ?? "[]");
  } catch {
    return [];
  }
}

function write(items: ModerationItem[]) {
  try {
    localStorage.setItem(KEY, JSON.stringify(items));
    window.dispatchEvent(new CustomEvent(EVT));
  } catch {
    /* ignore */
  }
}

export function submitToModeration<K extends ModerationKind>(
  kind: K,
  payload: K extends "news" ? NewsPayload : K extends "marketplace" ? MarketplacePayload : ClassifiedPayload,
): ModerationItem {
  const item = {
    id: `m_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
    kind,
    status: "pending" as const,
    createdAt: new Date().toISOString(),
    payload,
  } as ModerationItem;
  write([item, ...read()]);
  return item;
}

export function approveItem(id: string) {
  const items = read();
  const idx = items.findIndex((i) => i.id === id);
  if (idx === -1) return;
  const it = items[idx];
  if (it.status !== "pending") return;
  // Commit side-effects per kind
  if (it.kind === "news") {
    createPost(it.payload);
  } else if (it.kind === "classified") {
    addClassified({
      cat: it.payload.cat,
      title: it.payload.title,
      location: it.payload.location,
      description: it.payload.description,
      daysLeft: it.payload.daysLeft,
    });
  }
  // marketplace: just mark approved (mock storefront is static)
  items[idx] = { ...it, status: "approved", reviewedAt: new Date().toISOString() };
  write(items);
}

export function rejectItem(id: string, reason: string) {
  const items = read();
  const idx = items.findIndex((i) => i.id === id);
  if (idx === -1) return;
  const it = items[idx];
  if (it.status !== "pending") return;
  items[idx] = { ...it, status: "rejected", reviewedAt: new Date().toISOString(), rejectReason: reason };
  write(items);
}

export function deleteItem(id: string) {
  write(read().filter((i) => i.id !== id));
}

// Pause an approved/pending item so it's hidden from public listings.
export function pauseItem(id: string) {
  const items = read();
  const idx = items.findIndex((i) => i.id === id);
  if (idx === -1) return;
  items[idx] = { ...items[idx], status: "paused" };
  write(items);
}

// Resume a previously paused item back to pending review.
export function resumeItem(id: string) {
  const items = read();
  const idx = items.findIndex((i) => i.id === id);
  if (idx === -1) return;
  if (items[idx].status !== "paused") return;
  items[idx] = { ...items[idx], status: "pending", reviewedAt: undefined, rejectReason: undefined };
  write(items);
}

// Update payload of an item (edit). Sends it back to pending unless already rejected.
export function updateItem(id: string, patch: Partial<MarketplacePayload & ClassifiedPayload & NewsPayload>) {
  const items = read();
  const idx = items.findIndex((i) => i.id === id);
  if (idx === -1) return;
  const it = items[idx];
  const nextStatus: ModerationStatus = it.status === "rejected" ? "pending" : it.status === "approved" ? "pending" : it.status;
  items[idx] = {
    ...it,
    payload: { ...(it.payload as object), ...patch } as typeof it.payload,
    status: nextStatus,
    rejectReason: undefined,
  } as ModerationItem;
  write(items);
}

export function useModerationQueue() {
  const [items, setItems] = useState<ModerationItem[]>([]);
  useEffect(() => {
    const sync = () => setItems(read());
    sync();
    window.addEventListener(EVT, sync);
    return () => window.removeEventListener(EVT, sync);
  }, []);
  return items;
}

// Simple admin gate (mock). In a real app this would be auth-based.
const ADMIN_KEY = "set:admin:unlocked:v1";
export const ADMIN_PIN = "1234";

export function isAdminUnlocked(): boolean {
  if (typeof window === "undefined") return false;
  return localStorage.getItem(ADMIN_KEY) === "1";
}

export function unlockAdmin(pin: string): boolean {
  if (pin === ADMIN_PIN) {
    localStorage.setItem(ADMIN_KEY, "1");
    return true;
  }
  return false;
}

export function lockAdmin() {
  localStorage.removeItem(ADMIN_KEY);
}
