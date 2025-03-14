import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { format } from "date-fns";

type allTransactionsProps = {
  month: number;
  year: number;
};

export function AllTransactions({ month, year }: allTransactionsProps) {
  const selectedDate = new Date(year, month - 1, 1);

  return (
    <Card className="mt-4">
      <CardHeader>
        <CardTitle>{format(selectedDate, "MMM yyyy")} Transactions</CardTitle>
      </CardHeader>
    </Card>
  );
}
