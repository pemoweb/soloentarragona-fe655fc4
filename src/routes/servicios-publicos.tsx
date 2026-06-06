import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/servicios-publicos")({
  head: () => ({
    meta: [
      { title: "Servicios públicos de Tarragona — Teléfonos de urgencia" },
      {
        name: "description",
        content:
          "Farmacias de guardia, hospitales, policía local, Guardia Civil y emergencias en Tarragona. Contacto directo.",
      },
    ],
  }),
  component: () => <Outlet />,
});
