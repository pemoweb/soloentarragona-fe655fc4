export interface Product {
  slug: string;
  name: string;
  category: string;
  price: number;
  oldPrice?: number;
  shortDescription: string;
  description: string;
  img: string;
  gallery?: string[];
  badge?: "Nuevo" | "Oferta" | "Edición limitada" | "Best seller";
  stock: number;
  origin: string;
}

export const STORE = {
  name: "La Botiga Solo en Tarragona",
  tagline: "Producto local, sabor mediterráneo",
  description:
    "Tienda oficial de Solo en Tarragona. Selección curada de artesanía, gastronomía y diseño hechos en el Camp de Tarragona. Envío a toda España en 24-72h.",
  address: "Rambla Nova 42, 43003 Tarragona",
  phone: "+34 977 00 11 22",
  hours: "Lun-Sáb 10:00 - 21:00 · Dom 11:00 - 14:00",
  shippingFrom: 4.9,
  freeShippingThreshold: 49,
} as const;

export const PRODUCT_CATEGORIES = [
  "Todos",
  "Gastronomía",
  "Vinos & Cavas",
  "Artesanía",
  "Hogar",
  "Moda",
] as const;

export const PRODUCTS: Product[] = [
  {
    slug: "aceite-arbequina-camp-tarragona",
    name: "Aceite Arbequina del Camp",
    category: "Gastronomía",
    price: 14.9,
    oldPrice: 18.5,
    shortDescription: "AOVE primera presión en frío, cosecha temprana 2025.",
    description:
      "Aceite de oliva virgen extra de variedad Arbequina cultivada en olivos centenarios del Camp de Tarragona. Recolección temprana a mano y molturación en frío en las primeras 6 horas. Aromas frutados intensos, ligero picor en boca y final almendrado. Botella de 500ml.",
    img: "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=900&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=1200&q=80",
      "https://images.unsplash.com/photo-1611171711791-b34b41b1f9bd?w=1200&q=80",
      "https://images.unsplash.com/photo-1601000938259-9e92002320b2?w=1200&q=80",
    ],
    badge: "Best seller",
    stock: 42,
    origin: "Les Borges del Camp",
  },
  {
    slug: "vermut-reserva-tarragona",
    name: "Vermut Reserva Tarragona 1L",
    category: "Vinos & Cavas",
    price: 16.5,
    shortDescription: "Receta tradicional con botánicos del Mediterráneo.",
    description:
      "Vermut elaborado con vino blanco de la DO Tarragona, macerado con más de 30 botánicos entre los que destacan el ajenjo, la genciana y la piel de naranja amarga. Color caoba, aroma especiado y final largo. Servir muy frío con una rodaja de naranja y aceituna.",
    img: "https://images.unsplash.com/photo-1568213816046-0ee1c42bd559?w=900&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1568213816046-0ee1c42bd559?w=1200&q=80",
      "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=1200&q=80",
    ],
    badge: "Edición limitada",
    stock: 18,
    origin: "Reus",
  },
  {
    slug: "cava-brut-nature-penedes",
    name: "Cava Brut Nature 18 meses",
    category: "Vinos & Cavas",
    price: 14.9,
    shortDescription: "Macabeu, xarel·lo i parellada, crianza 18 meses.",
    description:
      "Cava de coupage tradicional con larga crianza en rima. Burbuja fina y persistente, notas de bollería y fruta blanca. Ideal para aperitivo y maridajes con pescado.",
    img: "https://images.unsplash.com/photo-1547595628-c61a29f496f0?w=900&q=80",
    stock: 60,
    origin: "Penedès",
  },
  {
    slug: "vi-negre-priorat-criança",
    name: "Vi Negre Priorat Criança",
    category: "Vinos & Cavas",
    price: 22.9,
    oldPrice: 26.0,
    shortDescription: "Garnatxa i carinyena con 12 meses en barrica.",
    description:
      "Vino tinto de la DOQ Priorat, elaborado con uvas viejas de garnatxa y carinyena de viñedos en licorella. Crianza de 12 meses en barrica de roble francés. Estructurado, mineral y con larga persistencia.",
    img: "https://images.unsplash.com/photo-1474722883778-792e7990302f?w=900&q=80",
    badge: "Oferta",
    stock: 24,
    origin: "Priorat",
  },
  {
    slug: "cesta-recapte-mediterrania",
    name: "Cesta Recapte Mediterrània",
    category: "Gastronomía",
    price: 49.0,
    shortDescription: "Selección gourmet con 8 productos locales.",
    description:
      "Cesta de regalo con AOVE arbequina, vermut, conservas de la Costa Daurada, almendra marcona, miel del Montsant, chocolate artesano de Reus y dos copas de cava. Presentación en caja de madera reciclada con tarjeta personalizada.",
    img: "https://images.unsplash.com/photo-1607920591413-4ec007e70023?w=900&q=80",
    badge: "Nuevo",
    stock: 12,
    origin: "Tarragona",
  },
  {
    slug: "ceramica-artesana-cosi",
    name: "Plato cerámica artesana",
    category: "Artesanía",
    price: 28.0,
    shortDescription: "Pieza única torneada a mano en taller local.",
    description:
      "Plato hondo de cerámica artesana torneado a mano en taller de Valls. Esmaltes naturales en tonos azules y arena inspirados en el mar Mediterráneo. Cada pieza es única, apta para lavavajillas y microondas. Diámetro 26cm.",
    img: "https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?w=900&q=80",
    stock: 7,
    origin: "Valls",
  },
  {
    slug: "vela-soja-romani",
    name: "Vela de soja Romaní & Mar",
    category: "Hogar",
    price: 19.5,
    shortDescription: "Cera 100% vegetal, aroma a romero y salitre.",
    description:
      "Vela artesanal elaborada con cera de soja 100% vegetal y aceites esenciales naturales. Aroma envolvente a romero del Camp, sal y maderas marinas. 40 horas de combustión. Vaso de vidrio reciclado reutilizable.",
    img: "https://images.unsplash.com/photo-1602874801006-e26c4c5b5e58?w=900&q=80",
    stock: 30,
    origin: "Tarragona",
  },
  {
    slug: "tote-bag-castellers",
    name: "Tote bag Castellers",
    category: "Moda",
    price: 14.0,
    shortDescription: "Algodón orgánico con ilustración exclusiva.",
    description:
      "Bolsa de algodón orgánico 100% certificado GOTS con ilustración original inspirada en los castells de Tarragona. Serigrafía a una tinta hecha a mano. Asas largas, tamaño 38x42cm.",
    img: "https://images.unsplash.com/photo-1591561954557-26941169b49e?w=900&q=80",
    badge: "Nuevo",
    stock: 50,
    origin: "Tarragona",
  },
  {
    slug: "miel-montsant",
    name: "Miel cruda del Montsant 500g",
    category: "Gastronomía",
    price: 11.5,
    shortDescription: "Miel de romero y tomillo, sin filtrar.",
    description:
      "Miel cruda de romero y tomillo recolectada en la sierra del Montsant. Sin pasteurizar y sin filtrar para conservar todas sus propiedades. Tarro de vidrio 500g.",
    img: "https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=900&q=80",
    stock: 35,
    origin: "Montsant",
  },
];

export function getProduct(slug: string): Product | undefined {
  return PRODUCTS.find((p) => p.slug === slug);
}

export function formatPrice(value: number): string {
  return new Intl.NumberFormat("es-ES", { style: "currency", currency: "EUR" }).format(value);
}
