export interface ShopProduct {
  name: string;
  price: string;
  description: string;
  img: string;
}

export interface Shop {
  slug: string;
  name: string;
  category: string;
  group: string;
  location: string;
  address: string;
  phone: string;
  hours: string;
  description: string;
  img: string;
  products: ShopProduct[];
}

export const SHOPS: Shop[] = [
  {
    slug: "forn-sistare",
    name: "Forn Sistaré",
    category: "Panadería",
    group: "Alimentación",
    location: "Carrer Major",
    address: "Carrer Major 23, 43003 Tarragona",
    phone: "+34 977 21 34 56",
    hours: "Lun-Sáb: 7:00 - 14:00 · 17:00 - 20:00",
    description:
      "Panadería artesana familiar desde 1952. Pan de masa madre, coca de recapte y bollería tradicional horneada cada día con harinas ecológicas del Camp de Tarragona.",
    img: "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=600&q=80",
    products: [
      { name: "Pan de masa madre", price: "3,80 €", description: "Hogaza de 800g, fermentación 24h.", img: "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=600&q=80" },
      { name: "Coca de recapte", price: "4,50 €", description: "Coca tradicional con escalivada y arenques.", img: "https://images.unsplash.com/photo-1571197119282-7c4ef4d0e1f4?w=600&q=80" },
      { name: "Ensaimada artesana", price: "2,20 €", description: "Hojaldre mallorquín individual.", img: "https://images.unsplash.com/photo-1509365465985-25d11c17e812?w=600&q=80" },
      { name: "Croissant de mantequilla", price: "1,80 €", description: "Mantequilla francesa AOP.", img: "https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=600&q=80" },
    ],
  },
  {
    slug: "vins-caves-tarraco",
    name: "Vins & Caves Tàrraco",
    category: "Vinoteca",
    group: "Alimentación",
    location: "Rambla Nova",
    address: "Rambla Nova 78, 43003 Tarragona",
    phone: "+34 977 24 56 78",
    hours: "Lun-Sáb: 10:00 - 14:00 · 17:00 - 21:00",
    description:
      "Vinoteca especializada en DO Tarragona, Priorat y Montsant. Catas semanales y selección de cavas del Penedès.",
    img: "https://images.unsplash.com/photo-1506377247377-2a5b3b417ebb?w=600&q=80",
    products: [
      { name: "Vi negre Priorat", price: "18,90 €", description: "Garnatxa i carinyena, criança 12 meses.", img: "https://images.unsplash.com/photo-1474722883778-792e7990302f?w=600&q=80" },
      { name: "Cava Brut Nature", price: "14,50 €", description: "Macabeu, xarel·lo i parellada, 18 meses.", img: "https://images.unsplash.com/photo-1547595628-c61a29f496f0?w=600&q=80" },
      { name: "Vermut artesano", price: "12,00 €", description: "Receta tradicional reusenca, 1L.", img: "https://images.unsplash.com/photo-1568213816046-0ee1c42bd559?w=600&q=80" },
    ],
  },
  {
    slug: "floristeria-jardi",
    name: "Floristeria Jardí",
    category: "Flores",
    group: "Especializadas",
    location: "Sant Pere",
    address: "Carrer Sant Pere 12, 43004 Tarragona",
    phone: "+34 977 22 11 33",
    hours: "Lun-Sáb: 9:00 - 14:00 · 16:30 - 20:00",
    description:
      "Floristería de barrio con flor de temporada cultivada en el Camp de Tarragona. Ramos a medida y decoración para eventos.",
    img: "https://images.unsplash.com/photo-1561181286-d3fee7d55364?w=600&q=80",
    products: [
      { name: "Ramo de temporada", price: "25,00 €", description: "Composición con flor fresca del día.", img: "https://images.unsplash.com/photo-1487530811176-3780de880c2d?w=600&q=80" },
      { name: "Orquídea Phalaenopsis", price: "18,00 €", description: "Maceta cerámica incluida.", img: "https://images.unsplash.com/photo-1567203308233-1e3331c45a4e?w=600&q=80" },
      { name: "Centro de mesa", price: "45,00 €", description: "Composición para eventos y bodas.", img: "https://images.unsplash.com/photo-1519378058457-4c29a0a2efac?w=600&q=80" },
    ],
  },
  {
    slug: "joieria-mar",
    name: "Joieria Mar",
    category: "Joyería",
    group: "Especializadas",
    location: "Centre",
    address: "Plaça de la Font 8, 43003 Tarragona",
    phone: "+34 977 23 45 67",
    hours: "Lun-Sáb: 10:00 - 13:30 · 17:00 - 20:30",
    description:
      "Joyería de autor con piezas inspiradas en el mar Mediterráneo. Diseño propio y reparación de joyas tradicionales.",
    img: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=600&q=80",
    products: [
      { name: "Colgante de plata 'Onada'", price: "65,00 €", description: "Diseño exclusivo inspirado en las olas.", img: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=600&q=80" },
      { name: "Pendientes oro 18k", price: "180,00 €", description: "Aros pequeños, fabricación artesanal.", img: "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=600&q=80" },
      { name: "Anillo con perla", price: "95,00 €", description: "Plata 925 y perla cultivada.", img: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=600&q=80" },
    ],
  },
  {
    slug: "zapateria-costa",
    name: "Zapateria Costa",
    category: "Calzado",
    group: "Moda",
    location: "Eixample",
    address: "Avinguda Catalunya 45, 43002 Tarragona",
    phone: "+34 977 25 67 89",
    hours: "Lun-Sáb: 10:00 - 14:00 · 17:00 - 20:30",
    description:
      "Zapatería familiar con calzado nacional. Marcas españolas, cuero genuino y horma anatómica para uso diario.",
    img: "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=600&q=80",
    products: [
      { name: "Botín piel mujer", price: "89,00 €", description: "Fabricación española, piel napa.", img: "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=600&q=80" },
      { name: "Mocasín hombre", price: "75,00 €", description: "Estilo clásico, suela de goma.", img: "https://images.unsplash.com/photo-1614252369475-531eba835eb1?w=600&q=80" },
      { name: "Zapatilla casual", price: "55,00 €", description: "Lona y suela ligera, varios colores.", img: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&q=80" },
    ],
  },
  {
    slug: "cafe-corsini",
    name: "Café Corsini",
    category: "Cafetería",
    group: "Alimentación",
    location: "Plaça Corsini",
    address: "Plaça Corsini 4, 43001 Tarragona",
    phone: "+34 977 22 33 44",
    hours: "Todos los días: 7:30 - 21:00",
    description:
      "Cafetería de especialidad con tostadores propios. Café de origen, brunch y dulces caseros frente al mercado.",
    img: "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=600&q=80",
    products: [
      { name: "Café de especialidad 250g", price: "9,50 €", description: "Tueste claro, origen Etiopía.", img: "https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=600&q=80" },
      { name: "Brunch completo", price: "14,90 €", description: "Café, zumo, tostada y huevos.", img: "https://images.unsplash.com/photo-1525351484163-7529414344d8?w=600&q=80" },
      { name: "Tarta de zanahoria", price: "4,50 €", description: "Receta casera, ración individual.", img: "https://images.unsplash.com/photo-1571115177098-24ec42ed204d?w=600&q=80" },
    ],
  },
];

export const SHOP_GROUPS = [
  "Todas",
  "Alimentación",
  "Moda",
  "Hogar",
  "Cultura",
  "Belleza",
  "Especializadas",
] as const;

export function getShop(slug: string): Shop | undefined {
  return SHOPS.find((s) => s.slug === slug);
}
