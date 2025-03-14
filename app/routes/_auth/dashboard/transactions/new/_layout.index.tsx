import {
  TransactionForm,
  transactionFormSchema,
} from "@/components/transaction-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { createTransaction } from "@/data/create-transaction";
import { getCategories } from "@/data/get-categories";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { format } from "date-fns";
import { z } from "zod";
import { toast } from "sonner";
export const Route = createFileRoute(
  "/_auth/dashboard/transactions/new/_layout/",
)({
  component: RouteComponent,
  loader: async () => {
    const categories = await getCategories();
    return {
      categories,
    };
  },
});

function RouteComponent() {
  const { categories } = Route.useLoaderData();
  const navigate = useNavigate();

  const handleSubmit = async (data: z.infer<typeof transactionFormSchema>) => {
    const transaction = await createTransaction({
      data: {
        amount: data.amount,
        categoryId: data.categoryId,
        description: data.description,
        date: format(data.date, "yyyy-MM-dd"),
      },
    });

    toast.success("Transaction created");

    navigate({
      to: "/dashboard/transactions",
      search: {
        month: transaction.transactionDate.getMonth() + 1,
        year: transaction.transactionDate.getFullYear(),
      },
    });
  };

  return (
    <Card className="max-w-screen-md mt-4">
      <CardHeader>
        <CardTitle>New Transaction</CardTitle>
      </CardHeader>
      <CardContent>
        <TransactionForm categories={categories} onSubmit={handleSubmit} />
      </CardContent>
    </Card>
  );
}
