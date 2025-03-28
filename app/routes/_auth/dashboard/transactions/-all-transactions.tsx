import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "components/ui/select";
import { Badge } from "components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "components/ui/table";
import numeral from "numeral";
import { format } from "date-fns";
import { useState } from "react";
import { Button } from "components/ui/button";
import { Link, useRouter } from "@tanstack/react-router";
import { getTransactionsByMonth } from "@/data/get-transactions-by-month";
import { Pencil } from "lucide-react";

type allTransactionsProps = {
  month: number;
  year: number;
  yearsRange: number[];
  transactions: Awaited<ReturnType<typeof getTransactionsByMonth>>;
};

export function AllTransactions({
  month,
  year,
  yearsRange,
  transactions,
}: allTransactionsProps) {
  const selectedDate = new Date(year, month - 1, 1);
  const [selectedYear, setSelectedYear] = useState(year);
  const [selectedMonth, setSelectedMonth] = useState(month);
  const router = useRouter();

  return (
    <Card className="mt-4">
      <CardHeader>
        <CardTitle className="flex justify-between">
          <span>{format(selectedDate, "MMM yyyy")} Transactions</span>

          <div className="flex gap-1">
            <Select
              value={selectedMonth.toString()}
              onValueChange={(value) => setSelectedMonth(Number(value))}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Array.from({ length: 12 }).map((_, i) => (
                  <SelectItem value={`${i + 1}`} key={i}>
                    {format(new Date(selectedDate.getFullYear(), i, 1), "MMM")}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select
              value={selectedYear.toString()}
              onValueChange={(value) => setSelectedYear(Number(value))}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {yearsRange.map((year) => (
                  <SelectItem value={year.toString()} key={year}>
                    {year}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Button asChild>
              <Link
                to="/dashboard/transactions"
                search={{
                  month: selectedMonth,
                  year: selectedYear,
                }}
              >
                Go
              </Link>
            </Button>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Button asChild>
          <Link to="/dashboard/transactions/new">New transaction</Link>
        </Button>
        {!transactions.length ? (
          <p className="text-center py-10">
            There are no transactions for this month
          </p>
        ) : (
          <Table className="mt-4">
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead />
              </TableRow>
            </TableHeader>
            <TableBody>
              {transactions.map((transaction) => {
                return (
                  <TableRow key={transaction.id}>
                    <TableCell>
                      {format(transaction.transactionDate, "do MMM yyyy")}
                    </TableCell>
                    <TableCell>{transaction.description}</TableCell>
                    <TableCell>
                      <Badge
                        className={`${transaction.transactionType == "income" ? "bg-green-500" : transaction.transactionType === "expense" ? "bg-red-500" : ""}`}
                      >
                        {transaction.transactionType}
                      </Badge>
                    </TableCell>
                    <TableCell>{transaction.category}</TableCell>
                    <TableCell>
                      {numeral(transaction.amount).format("0,0[.]00")}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button asChild variant="outline">
                        <Link
                          onClick={() => {
                            router.clearCache({
                              filter: (route) =>
                                route.pathname !=
                                `/dashboard/transactions${transaction.id}`,
                            });
                          }}
                          to={`/dashboard/transactions/${transaction.id}`}
                        >
                          <Pencil />
                        </Link>
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}
