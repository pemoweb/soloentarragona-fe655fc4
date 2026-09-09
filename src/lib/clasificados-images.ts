import imgEmpleo from "@/assets/clasificados/empleo.jpg";
import imgAlquiler from "@/assets/clasificados/alquiler.jpg";
import imgVenta from "@/assets/clasificados/venta.jpg";
import imgServicios from "@/assets/clasificados/servicios.jpg";
import imgC1 from "@/assets/clasificados/anuncios/c1.jpg";
import imgC2 from "@/assets/clasificados/anuncios/c2.jpg";
import imgC3 from "@/assets/clasificados/anuncios/c3.jpg";
import imgC4 from "@/assets/clasificados/anuncios/c4.jpg";
import imgC5 from "@/assets/clasificados/anuncios/c5.jpg";
import imgC6 from "@/assets/clasificados/anuncios/c6.jpg";

export const CLASSIFIED_IMAGES: Record<string, string> = {
  Empleo: imgEmpleo,
  Alquiler: imgAlquiler,
  Venta: imgVenta,
  Servicios: imgServicios,
};

/** Foto real por anuncio de la semilla. */
export const CLASSIFIED_AD_IMAGES: Record<string, string> = {
  c1: imgC1,
  c2: imgC2,
  c3: imgC3,
  c4: imgC4,
  c5: imgC5,
  c6: imgC6,
};

export function classifiedImage(cat: string) {
  return CLASSIFIED_IMAGES[cat] ?? imgVenta;
}

/** Imagen del anuncio: propia > semilla por id > categoría. */
export function classifiedAdImage(ad: { id: string; cat: string; img?: string }) {
  return ad.img || CLASSIFIED_AD_IMAGES[ad.id] || classifiedImage(ad.cat);
}
