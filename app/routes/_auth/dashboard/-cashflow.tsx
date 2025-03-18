import { getAnnualCashflow } from "@/data/get-annual-cashflow";
import { getTransactionYearsRange } from "data/get-transactions-years-range";
import { Button } from "components/ui/button";
import { Link, useNavigate } from "@tanstack/react-router";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "components/ui/select";

type CashflowProps = {
  cashflow: Awaited<ReturnType<typeof getAnnualCashflow>>;
  yearsRange: Awaited<ReturnType<typeof getTransactionYearsRange>>;
  year: number;
};

export function Cashflow({ cashflow, yearsRange, year }: CashflowProps) {
  const navigate = useNavigate();

  return (
    <Card className="mb-5">
      <CardHeader>
        <CardTitle className="flex justify-between">
          <span>Cashflow</span>
          <div className="flex gap-2">
            <Select
              defaultValue={year.toString()}
              onValueChange={(value) => {
                navigate({
                  to: "/dashboard",
                  search: {
                    year: Number(value),
                  },
                });
              }}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {yearsRange.map((year) => (
                  <SelectItem key={year} value={year.toString()}>
                    {year}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {!cashflow.length ? (
          <p className="text-center py-10">There has been no cashflow</p>
        ) : (
          <div>cash</div>
        )}
      </CardContent>
    </Card>
  );
}
