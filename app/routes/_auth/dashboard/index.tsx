import { createFileRoute } from "@tanstack/react-router";
import { RecentTransactions } from "./-recent-transactions";
import { getRecentTransactions } from "@/data/get-recent-transactions";
import { getAnnualCashflow } from "@/data/get-annual-cashflow";
import { Cashflow } from "./-cashflow";
import { getTransactionYearsRange } from "@/data/get-transactions-years-range";
import { z } from "zod";
import { LoadingSkeleton } from "@/components/loading-skeleton";

const today = new Date();
const searchSchema = z.object({
  year: z
    .number()
    .min(today.getFullYear() - 100)
    .max(today.getFullYear())
    .catch(today.getFullYear())
    .default(today.getFullYear()),
});

export const Route = createFileRoute("/_auth/dashboard/")({
  component: RouteComponent,
  validateSearch: searchSchema,
  pendingComponent: () => <LoadingSkeleton />,
  loaderDeps: ({ search }) => {
    return {
      year: search.year,
    };
  },
  loader: async ({ deps }) => {
    const [recentTransactions, cashflow, yearsRange] = await Promise.all([
      getRecentTransactions(),
      getAnnualCashflow({ data: { year: deps.year } }),
      getTransactionYearsRange(),
    ]);

    return {
      recentTransactions,
      cashflow,
      yearsRange,
    };
  },
});

function RouteComponent() {
  const { recentTransactions, cashflow, yearsRange } = Route.useLoaderData();
  const { year } = Route.useLoaderDeps();

  return (
    <div className="max-w-screen-xl mx-auto py-5">
      <h1 className="text-4xl font-semibold pb-5">Dashboard</h1>
      <Cashflow cashflow={cashflow} yearsRange={yearsRange} year={year} />
      <RecentTransactions transactions={recentTransactions} />
    </div>
  );
}
