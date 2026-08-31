import imgEmpleo from "@/assets/clasificados/empleo.jpg";
import imgAlquiler from "@/assets/clasificados/alquiler.jpg";
import imgVenta from "@/assets/clasificados/venta.jpg";
import imgServicios from "@/assets/clasificados/servicios.jpg";

export const CLASSIFIED_IMAGES: Record<string, string> = {
  Empleo: imgEmpleo,
  Alquiler: imgAlquiler,
  Venta: imgVenta,
  Servicios: imgServicios,
};

export function classifiedImage(cat: string) {
  return CLASSIFIED_IMAGES[cat] ?? imgVenta;
}
