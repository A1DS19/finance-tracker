import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";
import { AllTransactions } from "./-all-transactions";

const today = new Date();

const searchSchema = z.object({
  month: z
    .number()
    .min(1)
    .max(12)
    .catch(today.getMonth() + 1)
    .optional(),
  year: z
    .number()
    .min(today.getFullYear() - 100)
    .max(today.getFullYear())
    .catch(today.getFullYear())
    .optional(),
});

export const Route = createFileRoute("/_auth/dashboard/transactions/_layout/")({
  component: RouteComponent,
  validateSearch: searchSchema,
  loaderDeps({ search }) {
    return {
      month: search.month ?? today.getMonth() + 1,
      year: search.year ?? today.getFullYear(),
    };
  },
  loader: async ({ deps }) => {
    return {
      ...deps,
    };
  },
});

function RouteComponent() {
  const { month, year } = Route.useLoaderDeps();
  return <AllTransactions month={month} year={year} />;
}
