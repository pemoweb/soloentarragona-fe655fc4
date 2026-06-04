import { useEffect, useState } from "react";

export type CookieConsent = {
  necessary: true;
  analytics: boolean;
  marketing: boolean;
  decidedAt: string;
};

const STORAGE_KEY = "set_cookie_consent_v2";

export const DEFAULT_CONSENT: Omit<CookieConsent, "decidedAt"> = {
  necessary: true,
  analytics: false,
  marketing: false,
};

export function readConsent(): CookieConsent | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    return { ...DEFAULT_CONSENT, ...parsed, necessary: true };
  } catch {
    return null;
  }
}

export function writeConsent(
  partial: Partial<Omit<CookieConsent, "decidedAt" | "necessary">>,
): CookieConsent {
  const next: CookieConsent = {
    necessary: true,
    analytics: !!partial.analytics,
    marketing: !!partial.marketing,
    decidedAt: new Date().toISOString(),
  };
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    window.dispatchEvent(new CustomEvent("cookie-consent-changed"));
  } catch {
    /* ignore */
  }
  return next;
}

export function clearConsent() {
  try {
    localStorage.removeItem(STORAGE_KEY);
    window.dispatchEvent(new CustomEvent("cookie-consent-changed"));
  } catch {
    /* ignore */
  }
}

export function useCookieConsent() {
  const [consent, setConsent] = useState<CookieConsent | null>(null);

  useEffect(() => {
    setConsent(readConsent());
    const onChange = () => setConsent(readConsent());
    window.addEventListener("cookie-consent-changed", onChange);
    return () => window.removeEventListener("cookie-consent-changed", onChange);
  }, []);

  return consent;
}
