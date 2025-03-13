import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_auth/dashboard/transactions/_layout/")({
  component: RouteComponent,
});

function RouteComponent() {
  return <div>Hello "/_auth/dashboard/transactions/"!</div>;
}
