import amfiteatreImg from "@/assets/sitios/amfiteatre-roma.jpg";
import catedralImg from "@/assets/sitios/catedral-de-tarragona.jpg";
import balcoImg from "@/assets/sitios/balco-del-mediterrani.jpg";
import miracleImg from "@/assets/sitios/platja-del-miracle.jpg";
import museuImg from "@/assets/sitios/museu-nacional-arqueologic.jpg";
import pontImg from "@/assets/sitios/pont-del-diable.jpg";

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
  duration?: string;
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
    duration: "1–1,5 h",
    website: "https://www.tarragona.cat/patrimoni",
    img: amfiteatreImg,
    gallery: [amfiteatreImg],
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
    duration: "1–2 h",
    img: catedralImg,
    gallery: [catedralImg],
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
    duration: "30 min",
    img: balcoImg,
    gallery: [balcoImg],
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
    duration: "2–4 h",
    img: miracleImg,
    gallery: [miracleImg],
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
    duration: "1,5–2 h",
    img: museuImg,
    gallery: [museuImg],
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
    duration: "1,5–3 h",
    img: pontImg,
    gallery: [pontImg],
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
