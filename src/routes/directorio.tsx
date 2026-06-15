import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/directorio")({
  component: () => <Outlet />,
});
