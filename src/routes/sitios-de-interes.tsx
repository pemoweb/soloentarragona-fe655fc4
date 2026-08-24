import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/sitios-de-interes")({
  component: () => <Outlet />,
});
