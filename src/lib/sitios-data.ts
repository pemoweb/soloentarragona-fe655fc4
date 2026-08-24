export type SiteCategory = "Patrimonio" | "Playas" | "Museos" | "Naturaleza" | "Miradores";

export interface Sitio {
  slug: string;
  name: string;
  category: SiteCategory;
  short: string;
  description: string;
  address: string;
  hours?: string;
  price?: string;
  website?: string;
  img: string;
  gallery: string[];
  highlights: string[];
  coords?: { lat: number; lng: number };
}

export const sitios: Sitio[] = [
  {
    slug: "amfiteatre-roma",
    name: "Amfiteatre Romà",
    category: "Patrimonio",
    short: "Anfiteatro del siglo II frente al mar Mediterráneo.",
    description:
      "Construido en el siglo II d.C. junto al mar, el anfiteatro de Tàrraco acogía luchas de gladiadores y ejecuciones públicas. Declarado Patrimonio de la Humanidad por la UNESCO, conserva restos de una basílica visigótica y una iglesia románica en su interior.",
    address: "Parc de l'Amfiteatre Romà, Tarragona",
    hours: "Mar–Sáb 09:30–19:00 · Dom 10:00–15:00",
    price: "3,30 € · Gratis con Tarraco Card",
    website: "https://www.tarragona.cat/patrimoni",
    img: "https://images.unsplash.com/photo-1595520407624-66b384b2265f?w=1600&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1595520407624-66b384b2265f?w=1600&q=80",
      "https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=1600&q=80",
      "https://images.unsplash.com/photo-1523531294919-4bcd7c65e216?w=1600&q=80",
    ],
    highlights: ["Patrimonio UNESCO", "Vistas al mar", "Visitas guiadas", "Accesible"],
    coords: { lat: 41.1148, lng: 1.2597 },
  },
  {
    slug: "catedral-de-tarragona",
    name: "Catedral de Santa Maria",
    category: "Patrimonio",
    short: "Joya del románico y gótico en el punto más alto de la ciudad.",
    description:
      "La catedral de Tarragona se levanta sobre el antiguo templo de Augusto y combina románico y gótico. Su claustro, el retablo de Santa Tecla y el Museu Diocesà la convierten en la visita imprescindible de la Part Alta.",
    address: "Pla de la Seu, Tarragona",
    hours: "Lun–Sáb 10:00–19:00",
    price: "11 € · Reducida 9 €",
    img: "https://images.unsplash.com/photo-1548013146-72479768bada?w=1600&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1548013146-72479768bada?w=1600&q=80",
      "https://images.unsplash.com/photo-1519677100203-a0e668c92439?w=1600&q=80",
    ],
    highlights: ["Claustro románico", "Museu Diocesà", "Part Alta"],
    coords: { lat: 41.1191, lng: 1.2585 },
  },
  {
    slug: "balco-del-mediterrani",
    name: "Balcó del Mediterrani",
    category: "Miradores",
    short: "El mirador más famoso de la ciudad: toca el hierro y pide un deseo.",
    description:
      "Al final de la Rambla Nova, el Balcó del Mediterrani ofrece la panorámica clásica de Tarragona: el anfiteatro, el puerto y la playa del Miracle. La tradición manda 'tocar ferro' en su barandilla.",
    address: "Rambla Nova, Tarragona",
    hours: "Acceso libre 24h",
    price: "Gratis",
    img: "https://images.unsplash.com/photo-1533106418989-88406c7cc8ca?w=1600&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1533106418989-88406c7cc8ca?w=1600&q=80",
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1600&q=80",
    ],
    highlights: ["Atardeceres", "Gratis", "Céntrico"],
    coords: { lat: 41.1153, lng: 1.2557 },
  },
  {
    slug: "platja-del-miracle",
    name: "Platja del Miracle",
    category: "Playas",
    short: "Playa urbana de arena dorada a pie del centro histórico.",
    description:
      "La playa más céntrica de Tarragona, con más de 500 metros de arena fina, servicios completos, chiringuitos y bandera azul. Ideal para un baño rápido entre visitas al patrimonio romano.",
    address: "Baixada del Miracle, Tarragona",
    hours: "Socorrista de junio a septiembre, 10:00–19:00",
    price: "Gratis",
    img: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1600&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1600&q=80",
      "https://images.unsplash.com/photo-1519046904884-53103b34b206?w=1600&q=80",
    ],
    highlights: ["Bandera azul", "Chiringuitos", "Accesible", "A 5 min del centro"],
    coords: { lat: 41.1128, lng: 1.2617 },
  },
  {
    slug: "museu-nacional-arqueologic",
    name: "Museu Nacional Arqueològic",
    category: "Museos",
    short: "La mejor colección romana de Cataluña.",
    description:
      "El MNAT reúne mosaicos, esculturas y objetos cotidianos de la antigua Tàrraco, incluyendo el célebre mosaico de la Medusa. Un recorrido imprescindible para entender la ciudad romana.",
    address: "Plaça del Rei, 5, Tarragona",
    hours: "Mar–Sáb 09:30–18:00 · Dom 10:00–14:00",
    price: "4,50 €",
    img: "https://images.unsplash.com/photo-1554907984-15263bfd63bd?w=1600&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1554907984-15263bfd63bd?w=1600&q=80",
      "https://images.unsplash.com/photo-1566127444979-b3d2b654e3d7?w=1600&q=80",
    ],
    highlights: ["Mosaico de la Medusa", "Visitas escolares", "Tienda del museo"],
    coords: { lat: 41.1163, lng: 1.2589 },
  },
  {
    slug: "pont-del-diable",
    name: "Pont del Diable (Aqüeducte de les Ferreres)",
    category: "Naturaleza",
    short: "Acueducto romano de 217 metros rodeado de bosque mediterráneo.",
    description:
      "A 4 km del centro, el acueducto de les Ferreres cruza el barranco con dos pisos de arcos perfectos. El entorno natural del Parc Ecohistòric permite pasear, hacer pícnic y cruzar el canal superior.",
    address: "Parc Ecohistòric del Pont del Diable, N-240",
    hours: "Todos los días 09:00–20:30",
    price: "Gratis",
    img: "https://images.unsplash.com/photo-1558642084-fd07fae5282e?w=1600&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1558642084-fd07fae5282e?w=1600&q=80",
      "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=1600&q=80",
    ],
    highlights: ["Rutas de senderismo", "Área de pícnic", "Aparcamiento gratuito"],
    coords: { lat: 41.1494, lng: 1.2438 },
  },
];

export const siteCategories: SiteCategory[] = [
  "Patrimonio",
  "Playas",
  "Museos",
  "Naturaleza",
  "Miradores",
];

export function getSitio(slug: string) {
  return sitios.find((s) => s.slug === slug);
}
