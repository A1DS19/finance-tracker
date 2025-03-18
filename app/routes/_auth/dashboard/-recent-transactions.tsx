import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getRecentTransactions } from "@/data/get-recent-transactions";
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
import { Button } from "components/ui/button";
import { Link } from "@tanstack/react-router";

type RecentTransactionsProps = {
  transactions: Awaited<ReturnType<typeof getRecentTransactions>>;
};

export function RecentTransactions({ transactions }: RecentTransactionsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex justify-between">
          <span>Recent Transactions</span>
          <div className="flex gap-2">
            <Button asChild variant="outline">
              <Link to="/dashboard/transactions">View All</Link>
            </Button>
            <Button asChild>
              <Link to="/dashboard/transactions/new">New</Link>
            </Button>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
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
