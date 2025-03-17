import {
  TransactionForm,
  transactionFormSchema,
} from "@/components/transaction-form";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { getCategories } from "@/data/get-categories";
import { getTransaction } from "@/data/get-transaction";
import { updateTransaction } from "@/data/update-transaction";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { format } from "date-fns";
import { toast } from "sonner";
import { z } from "zod";

export const Route = createFileRoute(
  "/_auth/dashboard/transactions/$transactionId/_layout/",
)({
  component: RouteComponent,
  errorComponent: ({ error }) => {
    // error.message
    return (
      <div className="text-3xl text-muted-foreground p-2">
        Oops transaction not found
      </div>
    );
  },
  loader: async ({ params: { transactionId } }) => {
    const [categories, transaction] = await Promise.all([
      getCategories(),
      getTransaction({
        data: {
          transactionId: Number(transactionId),
        },
      }),
    ]);

    return {
      categories,
      transaction,
    };
  },
});

function RouteComponent() {
  const { categories, transaction } = Route.useLoaderData();
  const navigate = useNavigate();

  const handleSubmit = async (data: z.infer<typeof transactionFormSchema>) => {
    await updateTransaction({
      data: {
        id: transaction.id,
        date: format(data.date, "yyyy-MM-dd"),
        description: data.description,
        categoryId: data.categoryId,
        amount: data.amount,
      },
    });
    toast.success("Transaction updated");
    navigate({
      to: "/dashboard/transactions",
      search: {
        month: data.date.getMonth() + 1,
        year: data.date.getFullYear(),
      },
    });
  };

  return (
    <Card className="max-w-screen-md mt-4">
      <CardHeader>
        <CardTitle>New Transaction</CardTitle>
      </CardHeader>
      <CardContent>
        <TransactionForm
          categories={categories}
          onSubmit={handleSubmit}
          defaultValues={transaction}
        />
      </CardContent>
    </Card>
  );
}
