// Mock data layer for news. Persists user-created posts to localStorage.
// Seed posts are static (read from this module). User posts are merged in.

export type NewsCategory =
  | "Actualidad"
  | "Cultura"
  | "Deportes"
  | "Eventos"
  | "Sucesos"
  | "Opinión";

export const NEWS_CATEGORIES: NewsCategory[] = [
  "Actualidad",
  "Cultura",
  "Deportes",
  "Eventos",
  "Sucesos",
  "Opinión",
];

export const POPULAR_TAGS = [
  "Santa Tecla",
  "Tarraco Viva",
  "Nàstic",
  "Part Alta",
  "Playa",
  "Movilidad",
  "Gastronomía",
  "Castellers",
  "Patrimonio",
  "Música",
];

export interface NewsPost {
  slug: string;
  title: string;
  excerpt: string;
  content: string; // markdown-ish plain text with double line breaks
  category: NewsCategory;
  tags: string[];
  cover: string; // image URL
  author: string;
  publishedAt: string; // ISO date
  readingMinutes: number;
}

const STORAGE_KEY = "set:news:user-posts:v1";

export const SEED_POSTS: NewsPost[] = [
  {
    slug: "santa-tecla-2026-cartel-castell-de-foc",
    title: "Santa Tecla 2026 ya tiene cartel: el Castell de Foc abrirá las fiestas",
    excerpt: "El cartel oficial recupera la estética modernista de los años 20 y promete una edición histórica.",
    content:
      "El Ayuntamiento ha presentado esta mañana en el Saló de Plens el cartel oficial de las Fiestas de Santa Tecla 2026, una pieza firmada por la ilustradora local Marta Ribé que recupera la estética modernista de los años 20.\n\nLa programación incluirá más de 200 actos repartidos entre el 14 y el 24 de septiembre, con el tradicional Castell de Foc abriendo el pregón el viernes 18.\n\nLa concejalía de Cultura ha confirmado que este año se duplicará el presupuesto destinado al cicle de música en directo, con conciertos en la Plaça de la Font, el Camp de Mart y el Anfiteatro Romano.",
    category: "Cultura",
    tags: ["Santa Tecla", "Patrimonio", "Música"],
    cover: "https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=1200&q=80",
    author: "Redacción",
    publishedAt: "2026-05-10T08:30:00Z",
    readingMinutes: 4,
  },
  {
    slug: "tarragona-carril-bici-rambla-nova",
    title: "Tarragona estrena el nuevo carril bici de la Rambla Nova",
    excerpt: "Conectará la Plaça Imperial Tàrraco con el Balcó del Mediterrani en un trazado seguro y segregado.",
    content:
      "Las obras del nuevo carril bici de la Rambla Nova han concluido este lunes tras siete meses de trabajos. El trazado, de 1,4 kilómetros, conecta la Plaça Imperial Tàrraco con el Balcó del Mediterrani de forma totalmente segregada del tráfico rodado.\n\nLa actuación, financiada en parte por fondos europeos Next Generation, ha supuesto una inversión de 1,2 millones de euros e incluye nuevos puntos de aparcamiento para bicicletas y patinetes eléctricos.",
    category: "Actualidad",
    tags: ["Movilidad", "Patrimonio"],
    cover: "https://images.unsplash.com/photo-1517649763962-0c623066013b?w=1200&q=80",
    author: "Marc Vidal",
    publishedAt: "2026-05-09T14:00:00Z",
    readingMinutes: 3,
  },
  {
    slug: "nastic-golea-nou-estadi",
    title: "El Nàstic golea en el Nou Estadi y se acerca al play-off",
    excerpt: "Tres goles de bandera y una afición entregada en una noche mágica para el grana.",
    content:
      "El Gimnàstic de Tarragona ha firmado una de sus mejores noches de la temporada con una contundente victoria por 3-0 ante el Cornellà. Los goles llegaron en el primer tiempo y permitieron al conjunto grana acercarse a los puestos de play-off.\n\nLa grada respondió con un lleno casi absoluto, con más de 8.500 espectadores en el Nou Estadi.",
    category: "Deportes",
    tags: ["Nàstic"],
    cover: "https://images.unsplash.com/photo-1551958219-acbc608c6377?w=1200&q=80",
    author: "Pau Esteve",
    publishedAt: "2026-05-09T22:15:00Z",
    readingMinutes: 2,
  },
  {
    slug: "tarraco-viva-2026-programa",
    title: "Vuelve el Tarraco Viva: cinco días de historia en vivo",
    excerpt: "Más de 80 actividades para revivir la Tarragona romana en yacimientos y plazas del centro.",
    content:
      "Del 14 al 18 de mayo, Tarragona se convierte de nuevo en capital del mundo romano con una nueva edición del festival Tarraco Viva. La programación incluye recreaciones históricas, talleres familiares, gastronomía romana y visitas teatralizadas a los principales monumentos.",
    category: "Eventos",
    tags: ["Tarraco Viva", "Patrimonio"],
    cover: "https://images.unsplash.com/photo-1564594985645-4427056e22e2?w=1200&q=80",
    author: "Redacción",
    publishedAt: "2026-05-08T10:00:00Z",
    readingMinutes: 3,
  },
  {
    slug: "accidente-n340-sin-heridos",
    title: "Aparatoso accidente sin heridos en la N-340",
    excerpt: "El tráfico quedó cortado durante dos horas en sentido Valencia.",
    content:
      "Un camión articulado y dos turismos se vieron implicados esta madrugada en un accidente sin víctimas en el kilómetro 1.158 de la N-340. Los Mossos d'Esquadra cortaron la vía durante dos horas para retirar los vehículos.",
    category: "Sucesos",
    tags: [],
    cover: "https://images.unsplash.com/photo-1597007030739-6d2e7172ee6b?w=1200&q=80",
    author: "Redacción",
    publishedAt: "2026-05-08T06:30:00Z",
    readingMinutes: 1,
  },
  {
    slug: "mnat-mosaicos-romanos",
    title: "El MNAT inaugura una muestra sobre mosaicos romanos",
    excerpt: "Piezas inéditas procedentes del yacimiento del fórum provincial llegan al museo.",
    content:
      "El Museu Nacional Arqueològic de Tarragona presenta esta semana 'Tessellae', una muestra que reúne por primera vez piezas inéditas recuperadas en las últimas excavaciones del fórum provincial. La exposición podrá visitarse hasta diciembre.",
    category: "Cultura",
    tags: ["Patrimonio", "Tarraco Viva"],
    cover: "https://images.unsplash.com/photo-1565060169187-5284992ce2e8?w=1200&q=80",
    author: "Laia Fort",
    publishedAt: "2026-05-07T09:00:00Z",
    readingMinutes: 4,
  },
];

export function slugify(input: string): string {
  return input
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "")
    .slice(0, 80);
}

export function readingTime(text: string): number {
  const words = text.trim().split(/\s+/).length;
  return Math.max(1, Math.round(words / 200));
}

function readUserPosts(): NewsPost[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as NewsPost[]) : [];
  } catch {
    return [];
  }
}

function writeUserPosts(posts: NewsPost[]): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(posts));
}

export function getAllPosts(): NewsPost[] {
  const user = readUserPosts();
  // user posts first (newest first), then seed
  return [...user, ...SEED_POSTS].sort(
    (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime(),
  );
}

export function getPostBySlug(slug: string): NewsPost | null {
  return getAllPosts().find((p) => p.slug === slug) ?? null;
}

export function createPost(input: {
  title: string;
  excerpt: string;
  content: string;
  category: NewsCategory;
  tags: string[];
  cover: string;
  author: string;
}): NewsPost {
  const baseSlug = slugify(input.title) || `noticia-${Date.now()}`;
  const existing = new Set(getAllPosts().map((p) => p.slug));
  let slug = baseSlug;
  let i = 2;
  while (existing.has(slug)) {
    slug = `${baseSlug}-${i++}`;
  }
  const post: NewsPost = {
    slug,
    title: input.title.trim(),
    excerpt: input.excerpt.trim(),
    content: input.content.trim(),
    category: input.category,
    tags: input.tags.map((t) => t.trim()).filter(Boolean).slice(0, 8),
    cover:
      input.cover.trim() ||
      "https://images.unsplash.com/photo-1495020689067-958852a7765e?w=1200&q=80",
    author: input.author.trim() || "Vecino anónimo",
    publishedAt: new Date().toISOString(),
    readingMinutes: readingTime(input.content),
  };
  const next = [post, ...readUserPosts()];
  writeUserPosts(next);
  return post;
}

export function formatRelativeDate(iso: string): string {
  const then = new Date(iso).getTime();
  const diffMs = Date.now() - then;
  const min = Math.round(diffMs / 60000);
  if (min < 1) return "ahora";
  if (min < 60) return `hace ${min} min`;
  const h = Math.round(min / 60);
  if (h < 24) return `hace ${h} h`;
  const d = Math.round(h / 24);
  if (d < 7) return `hace ${d} d`;
  return new Date(iso).toLocaleDateString("es-ES", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}
