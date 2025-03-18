import {
  TransactionForm,
  transactionFormSchema,
} from "@/components/transaction-form";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { getCategories } from "@/data/get-categories";
import { getTransaction } from "@/data/get-transaction";
import { updateTransaction } from "@/data/update-transaction";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogTrigger,
  AlertDialogTitle,
  AlertDialogHeader,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
} from "components/ui/alert-dialog";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { format } from "date-fns";
import { toast } from "sonner";
import { z } from "zod";
import { Button } from "components/ui/button";
import { Trash2Icon } from "lucide-react";
import { deleteTransaction } from "@/data/delete-transaction";

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

  const handleDeleteConfirm = async () => {
    await deleteTransaction({
      data: {
        id: transaction.id,
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
        <CardTitle className="flex justify-between">
          <span>Edit Transaction</span>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" size="icon">
                <Trash2Icon />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone
                </AlertDialogDescription>
              </AlertDialogHeader>

              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <Button
                  variant="destructive"
                  onClick={() => handleDeleteConfirm()}
                >
                  Delete
                </Button>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </CardTitle>
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
