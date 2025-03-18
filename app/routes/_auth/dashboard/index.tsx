import { createFileRoute } from "@tanstack/react-router";
import { RecentTransactions } from "./-recent-transactions";
import { getRecentTransactions } from "@/data/get-recent-transactions";

export const Route = createFileRoute("/_auth/dashboard/")({
  component: RouteComponent,
  loader: async () => {
    const recentTransactions = await getRecentTransactions();

    return {
      recentTransactions,
    };
  },
});

function RouteComponent() {
  const { recentTransactions } = Route.useLoaderData();
  return (
    <div className="max-w-screen-xl mx-auto py-5">
      <h1 className="text-4xl font-semibold pb-5">Dashboard</h1>

      <RecentTransactions transactions={recentTransactions} />
    </div>
  );
}
