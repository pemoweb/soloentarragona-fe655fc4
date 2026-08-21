// Registro de denuncias (abuso) de anuncios para revisión de moderación.
// Persiste en localStorage y notifica a los paneles suscritos.

import { useEffect, useState } from "react";

export type ReportTarget = "classified" | "marketplace";
export type ReportStatus = "open" | "reviewed" | "dismissed";

export const REPORT_REASONS = [
  "Spam o publicidad",
  "Anuncio falso o engañoso",
  "Contenido ofensivo",
  "Estafa o fraude",
  "Producto o servicio prohibido",
  "Otro motivo",
] as const;

export type ReportReason = (typeof REPORT_REASONS)[number];

export type Report = {
  id: string;
  target: ReportTarget;
  itemId: string;
  itemTitle: string;
  reason: string;
  details?: string;
  status: ReportStatus;
  createdAt: string;
  reviewedAt?: string;
};

const KEY = "set:reports:v1";
const EVT = "reports-changed";

function read(): Report[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(KEY) ?? "[]");
  } catch {
    return [];
  }
}

function write(items: Report[]) {
  try {
    localStorage.setItem(KEY, JSON.stringify(items));
    window.dispatchEvent(new CustomEvent(EVT));
  } catch {
    /* ignore */
  }
}

export function submitReport(input: {
  target: ReportTarget;
  itemId: string;
  itemTitle: string;
  reason: string;
  details?: string;
}): Report {
  const report: Report = {
    id: `r_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
    status: "open",
    createdAt: new Date().toISOString(),
    ...input,
  };
  write([report, ...read()]);
  return report;
}

export function setReportStatus(id: string, status: ReportStatus) {
  const items = read();
  const idx = items.findIndex((r) => r.id === id);
  if (idx === -1) return;
  items[idx] = { ...items[idx], status, reviewedAt: new Date().toISOString() };
  write(items);
}

export function deleteReport(id: string) {
  write(read().filter((r) => r.id !== id));
}

export function useReports() {
  const [items, setItems] = useState<Report[]>([]);
  useEffect(() => {
    const sync = () => setItems(read());
    sync();
    window.addEventListener(EVT, sync);
    return () => window.removeEventListener(EVT, sync);
  }, []);
  return items;
}
