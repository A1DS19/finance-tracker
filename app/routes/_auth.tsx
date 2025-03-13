import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/_auth")({
  component: RouteComponent,
  beforeLoad: ({ context }) => {
    if (!context.userId) {
      redirect({
        to: "/",
        throw: true,
      });
    }
  },
});

function RouteComponent() {
  return <Outlet />;
}
