import { useEffect } from "react";

/**
 * Update <title> and <meta name="description"> in response to client state
 * (e.g. selected category in a listing). Restores previous values on unmount.
 *
 * head() in TanStack Start runs once per route match — this complements it
 * for filter-driven SEO on the same route.
 */
export function useDynamicSeo({
  title,
  description,
}: {
  title?: string;
  description?: string;
}) {
  useEffect(() => {
    if (typeof document === "undefined") return;

    const prevTitle = document.title;
    if (title) document.title = title;

    const metaDesc = document.querySelector(
      'meta[name="description"]',
    ) as HTMLMetaElement | null;
    const metaOgTitle = document.querySelector(
      'meta[property="og:title"]',
    ) as HTMLMetaElement | null;
    const metaOgDesc = document.querySelector(
      'meta[property="og:description"]',
    ) as HTMLMetaElement | null;

    const prevDesc = metaDesc?.getAttribute("content") ?? null;
    const prevOgTitle = metaOgTitle?.getAttribute("content") ?? null;
    const prevOgDesc = metaOgDesc?.getAttribute("content") ?? null;

    if (description && metaDesc) metaDesc.setAttribute("content", description);
    if (title && metaOgTitle) metaOgTitle.setAttribute("content", title);
    if (description && metaOgDesc)
      metaOgDesc.setAttribute("content", description);

    return () => {
      document.title = prevTitle;
      if (metaDesc && prevDesc !== null)
        metaDesc.setAttribute("content", prevDesc);
      if (metaOgTitle && prevOgTitle !== null)
        metaOgTitle.setAttribute("content", prevOgTitle);
      if (metaOgDesc && prevOgDesc !== null)
        metaOgDesc.setAttribute("content", prevOgDesc);
    };
  }, [title, description]);
}
