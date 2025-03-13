import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_auth/dashboard/")({
  component: RouteComponent,
});

function RouteComponent() {
  return <h1>Hello "/dashboard/"!</h1>;
}
