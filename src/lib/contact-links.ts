/** Normaliza un teléfono español a formato internacional sin símbolos. */
export function normalizePhone(phone?: string) {
  if (!phone) return "";
  const digits = phone.replace(/[^\d+]/g, "");
  if (!digits) return "";
  if (digits.startsWith("+")) return digits;
  if (digits.startsWith("34")) return `+${digits}`;
  return `+34${digits}`;
}

export function telHref(phone?: string) {
  const p = normalizePhone(phone);
  return p ? `tel:${p}` : undefined;
}

export function whatsappHref(phone?: string, message?: string) {
  const p = normalizePhone(phone).replace("+", "");
  if (!p) return undefined;
  const text = message ? `?text=${encodeURIComponent(message)}` : "";
  return `https://wa.me/${p}${text}`;
}
