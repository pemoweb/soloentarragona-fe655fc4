export type ServiceKind = "emergency" | "pharmacy" | "hospital";

export type Service = {
  slug: string;
  kind: ServiceKind;
  name: string;
  phone: string;
  address?: string;
  hours?: string;
  description: string;
  website?: string;
  email?: string;
  coords?: { lat: number; lng: number };
};

export const services: Service[] = [
  {
    slug: "emergencias-112",
    kind: "emergency",
    name: "Emergencias generales",
    phone: "112",
    description:
      "Número único europeo de emergencias. Coordina policía, bomberos y servicios sanitarios. Atención 24h en catalán, castellano e inglés.",
    hours: "24 horas, todos los días",
  },
  {
    slug: "policia-local-092",
    kind: "emergency",
    name: "Policía Local de Tarragona",
    phone: "092",
    address: "Carrer Joan Baptista Plana, 31, Tarragona",
    description:
      "Cuerpo de policía municipal. Seguridad ciudadana, tráfico urbano y atención al vecino.",
    hours: "24 horas",
    website: "https://www.tarragona.cat/seguretat",
  },
  {
    slug: "guardia-civil-062",
    kind: "emergency",
    name: "Guardia Civil",
    phone: "062",
    description:
      "Atención de emergencias e incidencias en zonas rurales, carreteras y costa.",
    hours: "24 horas",
  },
  {
    slug: "bombers-080",
    kind: "emergency",
    name: "Bombers de la Generalitat",
    phone: "080",
    description:
      "Servicio de extinción de incendios y rescate. Cobertura urbana e industrial (Camp de Tarragona).",
    hours: "24 horas",
  },
  {
    slug: "farmacia-rambla-nova",
    kind: "pharmacy",
    name: "Farmàcia Rambla Nova",
    phone: "977 23 45 67",
    address: "Rambla Nova, 102, Tarragona",
    hours: "24h hoy (guardia)",
    description:
      "Farmacia de guardia en pleno centro. Servicio nocturno y atención farmacéutica continuada.",
  },
  {
    slug: "farmacia-sant-pere",
    kind: "pharmacy",
    name: "Farmàcia Sant Pere",
    phone: "977 54 32 10",
    address: "Av. Sant Pere i Sant Pau, 23, Tarragona",
    hours: "24h hoy (guardia)",
    description:
      "Farmacia de barrio con servicio de guardia, parafarmacia y atención a recetas electrónicas.",
  },
  {
    slug: "farmacia-pla",
    kind: "pharmacy",
    name: "Farmàcia Pla",
    phone: "977 21 09 88",
    address: "Carrer Pere Martell, 8, Tarragona",
    hours: "Lunes a sábado, 09:00 – 22:00",
    description:
      "Farmacia con horario extendido cerca de la estación. Ortopedia y dermofarmacia.",
  },
  {
    slug: "hospital-joan-xxiii",
    kind: "hospital",
    name: "Hospital Universitari Joan XXIII",
    phone: "977 29 58 00",
    address: "Carrer Doctor Mallafrè Guasch, 4, Tarragona",
    hours: "Urgencias 24h",
    description:
      "Hospital de referencia del Camp de Tarragona. Urgencias, hospitalización, consultas externas y especialidades.",
    website: "https://www.icscampdetarragona.cat",
  },
  {
    slug: "hospital-santa-tecla",
    kind: "hospital",
    name: "Hospital Santa Tecla",
    phone: "977 25 99 00",
    address: "Rambla Vella, 14, Tarragona",
    hours: "Urgencias 24h",
    description:
      "Hospital histórico en el centro de Tarragona. Atención general, urgencias y especialidades médicas.",
  },
  {
    slug: "pius-hospital-valls",
    kind: "hospital",
    name: "Pius Hospital de Valls",
    phone: "977 61 30 00",
    address: "Plaça Sant Francesc, 1, Valls",
    hours: "Urgencias 24h",
    description:
      "Hospital de referencia comarcal en l'Alt Camp. Atendido por la red sanitaria pública.",
  },
];

export function getService(slug: string) {
  return services.find((s) => s.slug === slug);
}

export function relatedServices(slug: string) {
  const s = getService(slug);
  if (!s) return [];
  return services.filter((x) => x.kind === s.kind && x.slug !== slug).slice(0, 3);
}
