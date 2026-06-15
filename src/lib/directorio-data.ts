export interface Business {
  slug: string;
  name: string;
  category: string;
  rating: number;
  reviews: number;
  address: string;
  img: string;
  verified: boolean;
  phone?: string;
  email?: string;
  website?: string;
  hours?: string;
  description?: string;
  services?: string[];
  gallery?: string[];
  social?: { instagram?: string; facebook?: string };
  yearFounded?: number;
  team?: number;
}

export const businesses: Business[] = [
  {
    slug: "el-terrat-de-sant-magi",
    name: "El Terrat de Sant Magí",
    category: "Restaurante",
    rating: 4.8,
    reviews: 312,
    address: "Carrer de Sant Magí, 14",
    img: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1600&q=80",
    verified: true,
    phone: "+34 977 123 456",
    email: "hola@elterrat.cat",
    website: "https://elterrat.cat",
    hours: "Mar–Dom 13:00–16:00 · 20:00–23:30",
    description:
      "Cocina mediterránea de mercado en pleno casco antiguo de Tarragona. Producto local, vinos del Priorat y una terraza con vistas únicas a la ciudad.",
    services: ["Terraza con vistas", "Menú degustación", "Reservas online", "Eventos privados", "Maridaje de vinos"],
    gallery: [
      "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1600&q=80",
      "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1600&q=80",
      "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=1600&q=80",
    ],
    social: { instagram: "@elterrattgn", facebook: "elterratdesantmagi" },
    yearFounded: 2014,
    team: 12,
  },
  {
    slug: "clinica-dental-tarraco",
    name: "Clínica Dental Tàrraco",
    category: "Salud",
    rating: 4.9,
    reviews: 156,
    address: "Rambla Nova, 88",
    img: "https://images.unsplash.com/photo-1629909613654-28e377c37b09?w=1600&q=80",
    verified: true,
    phone: "+34 977 224 567",
    email: "info@dentaltarraco.cat",
    website: "https://dentaltarraco.cat",
    hours: "Lun–Vie 09:00–20:00",
    description:
      "Clínica dental de referencia en Tarragona con más de 20 años cuidando la salud bucodental de las familias. Tecnología 3D, ortodoncia invisible e implantología avanzada.",
    services: ["Ortodoncia invisible", "Implantología", "Estética dental", "Odontopediatría", "Urgencias 24h"],
    gallery: [
      "https://images.unsplash.com/photo-1629909613654-28e377c37b09?w=1600&q=80",
      "https://images.unsplash.com/photo-1606811971618-4486d14f3f99?w=1600&q=80",
      "https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?w=1600&q=80",
    ],
    social: { instagram: "@dentaltarraco" },
    yearFounded: 2003,
    team: 8,
  },
  {
    slug: "reformas-costa-daurada",
    name: "Reformas Costa Daurada",
    category: "Hogar",
    rating: 4.7,
    reviews: 89,
    address: "Av. Catalunya, 22",
    img: "https://images.unsplash.com/photo-1581094288338-2314dddb7ece?w=1600&q=80",
    verified: true,
    phone: "+34 977 334 765",
    email: "contacto@reformascostadaurada.es",
    website: "https://reformascostadaurada.es",
    hours: "Lun–Vie 08:00–18:00",
    description:
      "Reformas integrales de viviendas, cocinas y baños en Tarragona y comarca. Presupuesto cerrado, plazos garantizados y acabados de primera calidad.",
    services: ["Reformas integrales", "Cocinas y baños", "Pladur y pintura", "Fontanería y electricidad", "Proyecto 3D gratis"],
    gallery: [
      "https://images.unsplash.com/photo-1581094288338-2314dddb7ece?w=1600&q=80",
      "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=1600&q=80",
      "https://images.unsplash.com/photo-1556909172-54557c7e4fb7?w=1600&q=80",
    ],
    social: { instagram: "@reformascostadaurada", facebook: "reformascostadaurada" },
    yearFounded: 2010,
    team: 15,
  },
  {
    slug: "estudio-yoga-mediterrania",
    name: "Estudio Yoga Mediterrània",
    category: "Bienestar",
    rating: 5.0,
    reviews: 204,
    address: "Carrer Major, 31",
    img: "https://images.unsplash.com/photo-1545205597-3d9d02c29597?w=1600&q=80",
    verified: true,
    phone: "+34 977 445 998",
    email: "namaste@yogamediterrania.cat",
    website: "https://yogamediterrania.cat",
    hours: "Lun–Sáb 07:00–21:30",
    description:
      "Estudio boutique de yoga y meditación en el corazón de Tarragona. Clases para todos los niveles, retiros y formación de profesores certificada por Yoga Alliance.",
    services: ["Vinyasa & Hatha", "Yin yoga", "Meditación guiada", "Retiros fin de semana", "Bono primer mes"],
    gallery: [
      "https://images.unsplash.com/photo-1545205597-3d9d02c29597?w=1600&q=80",
      "https://images.unsplash.com/photo-1599447421416-3414500d18a5?w=1600&q=80",
      "https://images.unsplash.com/photo-1593810450967-f9c42742e326?w=1600&q=80",
    ],
    social: { instagram: "@yogamediterrania" },
    yearFounded: 2017,
    team: 6,
  },
  {
    slug: "tarragona-legal",
    name: "Tarragona Legal",
    category: "Abogados",
    rating: 4.6,
    reviews: 67,
    address: "Plaça Corsini, 5",
    img: "https://images.unsplash.com/photo-1589994965851-a8f479c573a9?w=800&q=80",
    verified: false,
  },
  {
    slug: "fotografia-marc-vidal",
    name: "Fotografía Marc Vidal",
    category: "Servicios",
    rating: 4.9,
    reviews: 142,
    address: "Carrer Reial, 8",
    img: "https://images.unsplash.com/photo-1554048612-b6a482bc67e5?w=1600&q=80",
    verified: true,
    phone: "+34 633 887 221",
    email: "hola@marcvidal.photo",
    website: "https://marcvidal.photo",
    hours: "Bajo cita previa",
    description:
      "Fotógrafo profesional especializado en bodas, retrato y reportaje editorial en Tarragona y Costa Daurada. Estilo natural, luminoso y atemporal.",
    services: ["Bodas y eventos", "Retrato editorial", "Branding personal", "Fotografía de producto", "Álbumes premium"],
    gallery: [
      "https://images.unsplash.com/photo-1554048612-b6a482bc67e5?w=1600&q=80",
      "https://images.unsplash.com/photo-1519741497674-611481863552?w=1600&q=80",
      "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=1600&q=80",
    ],
    social: { instagram: "@marcvidal.photo" },
    yearFounded: 2016,
    team: 2,
  },
];

export function getBusiness(slug: string) {
  return businesses.find((b) => b.slug === slug);
}
