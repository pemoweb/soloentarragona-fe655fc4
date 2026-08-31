import imgBicicletaUrbanaOrbea from "@/assets/marketplace/bicicleta-urbana-orbea.jpg";
import imgSofaNordico3Plazas from "@/assets/marketplace/sofa-nordico-3-plazas.jpg";
import imgIphone13128gb from "@/assets/marketplace/iphone-13-128gb.jpg";
import imgMesaComedorMaderaMaciza from "@/assets/marketplace/mesa-comedor-madera-maciza.jpg";
import imgCamaraSonyA6000 from "@/assets/marketplace/camara-sony-a6000.jpg";
import imgTablaSurf62 from "@/assets/marketplace/tabla-surf-62.jpg";
import imgPlaystation5DosMandos from "@/assets/marketplace/playstation-5-dos-mandos.jpg";
import imgEstanteriaIndustrial from "@/assets/marketplace/estanteria-industrial.jpg";

export type MarketplaceItem = {
  slug: string;
  title: string;
  price: number;
  oldPrice?: number;
  location: string;
  category: string;
  featured?: boolean;
  condition: string;
  publishedAgo: string;
  description: string;
  gallery: string[];
  seller: { name: string; since: string; rating: number; phone: string };
};

export const MARKETPLACE_CATEGORIES = [
  "Todo",
  "Electrónica",
  "Hogar",
  "Moda",
  "Deporte",
  "Vehículos",
  "Niños",
  "Coleccionismo",
] as const;

export const MARKETPLACE_ITEMS: MarketplaceItem[] = [
  {
    slug: "bicicleta-urbana-orbea",
    title: "Bicicleta urbana Orbea",
    price: 280,
    oldPrice: 340,
    location: "Part Alta",
    category: "Deporte",
    featured: true,
    condition: "Muy buen estado",
    publishedAgo: "hace 2 días",
    description:
      "Bicicleta urbana Orbea talla M, usada durante dos temporadas por el centro de Tarragona. Cambio Shimano revisado, ruedas nuevas y frenos ajustados. Incluye luces y candado.",
    gallery: [imgBicicletaUrbanaOrbea],
    seller: { name: "Marc Ferré", since: "2023", rating: 4.8, phone: "+34 655 120 340" },
  },
  {
    slug: "sofa-nordico-3-plazas",
    title: "Sofá nórdico 3 plazas",
    price: 420,
    location: "Sant Pere",
    category: "Hogar",
    condition: "Como nuevo",
    publishedAgo: "hace 5 días",
    description:
      "Sofá nórdico de tres plazas en tejido gris claro, patas de madera de haya. Sin manchas ni roturas, procede de un piso de no fumadores. Recogida en Sant Pere i Sant Pau.",
    gallery: [imgSofaNordico3Plazas],
    seller: { name: "Laia Bosch", since: "2022", rating: 4.9, phone: "+34 690 887 112" },
  },
  {
    slug: "iphone-13-128gb",
    title: "iPhone 13 128GB como nuevo",
    price: 450,
    oldPrice: 520,
    location: "Eixample",
    category: "Electrónica",
    featured: true,
    condition: "Como nuevo",
    publishedAgo: "hace 1 día",
    description:
      "iPhone 13 de 128 GB en color medianoche, batería al 92%. Siempre con funda y cristal templado. Se entrega con caja, cable y factura de compra.",
    gallery: [imgIphone13128gb],
    seller: { name: "Sergi Roca", since: "2021", rating: 4.7, phone: "+34 622 405 918" },
  },
  {
    slug: "mesa-comedor-madera-maciza",
    title: "Mesa comedor madera maciza",
    price: 180,
    location: "Bonavista",
    category: "Hogar",
    condition: "Buen estado",
    publishedAgo: "hace 1 semana",
    description:
      "Mesa de comedor de pino macizo para seis comensales, 160x90 cm. Marcas de uso mínimas en la superficie. Se puede desmontar para el transporte.",
    gallery: [imgMesaComedorMaderaMaciza],
    seller: { name: "Nuria Gil", since: "2024", rating: 4.5, phone: "+34 671 233 004" },
  },
  {
    slug: "camara-sony-a6000",
    title: "Cámara Sony A6000",
    price: 320,
    location: "Centre",
    category: "Electrónica",
    condition: "Muy buen estado",
    publishedAgo: "hace 3 días",
    description:
      "Sony Alpha A6000 con objetivo 16-50 mm, 8.400 disparos. Incluye dos baterías, cargador, correa y bolsa de transporte. Ideal para iniciarse en fotografía.",
    gallery: [imgCamaraSonyA6000],
    seller: { name: "Aina Puig", since: "2023", rating: 5, phone: "+34 634 771 260" },
  },
  {
    slug: "tabla-surf-62",
    title: "Tabla de surf 6'2",
    price: 150,
    location: "Platja Llarga",
    category: "Deporte",
    condition: "Buen estado",
    publishedAgo: "hace 4 días",
    description:
      "Tabla de surf 6'2 tipo funboard, perfecta para las olas de la Costa Daurada. Un par de reparaciones bien resueltas en el canto. Incluye quillas y funda.",
    gallery: [imgTablaSurf62],
    seller: { name: "Pau Vidal", since: "2022", rating: 4.6, phone: "+34 688 190 553" },
  },
  {
    slug: "playstation-5-dos-mandos",
    title: "PlayStation 5 + 2 mandos",
    price: 380,
    location: "Torreforta",
    category: "Electrónica",
    condition: "Muy buen estado",
    publishedAgo: "hace 6 días",
    description:
      "PlayStation 5 edición con lector de discos, dos mandos DualSense y tres juegos incluidos. Funciona perfectamente y se entrega con todos los cables.",
    gallery: [imgPlaystation5DosMandos],
    seller: { name: "Iván Márquez", since: "2021", rating: 4.4, phone: "+34 611 502 447" },
  },
  {
    slug: "estanteria-industrial",
    title: "Estantería industrial",
    price: 95,
    location: "Serrallo",
    category: "Hogar",
    condition: "Buen estado",
    publishedAgo: "hace 2 semanas",
    description:
      "Estantería de estilo industrial con estructura metálica negra y cinco estantes de madera. Medidas 180x80x35 cm. Muy estable, ideal para salón o despacho.",
    gallery: [imgEstanteriaIndustrial],
    seller: { name: "Clara Solé", since: "2024", rating: 4.8, phone: "+34 699 044 781" },
  },
];

export function getMarketplaceItem(slug: string) {
  return MARKETPLACE_ITEMS.find((i) => i.slug === slug);
}

export function formatEuro(value: number) {
  return `${value} €`;
}
