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
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Bar, BarChart, CartesianGrid, Legend, XAxis, YAxis } from "recharts";
import { format } from "date-fns";
import numeral from "numeral";

type CashflowProps = {
  cashflow: Awaited<ReturnType<typeof getAnnualCashflow>>;
  yearsRange: Awaited<ReturnType<typeof getTransactionYearsRange>>;
  year: number;
};

export function Cashflow({ cashflow, yearsRange, year }: CashflowProps) {
  const navigate = useNavigate();
  const totalAnnualIncome = cashflow.reduce((prev: number, { income }) => {
    return prev + income;
  }, 0);

  const totalAnnualExpenses = cashflow.reduce((prev: number, { expense }) => {
    return prev + expense;
  }, 0);

  const balance = totalAnnualIncome + totalAnnualExpenses;

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
      <CardContent className="grid grid-cols-[1fr_250px]">
        <div>
          <ChartContainer
            config={{
              income: {
                label: "Income",
                color: "#84cc16",
              },
              expense: {
                label: "Expense",
                color: "#f97316",
              },
            }}
            className="w-full h-[300px]"
          >
            <BarChart data={cashflow}>
              <CartesianGrid vertical={false} />
              <YAxis
                tickFormatter={(value) => {
                  return `$${numeral(value).format("0,0")}`;
                }}
              />
              <XAxis
                dataKey="month"
                tickFormatter={(value) => {
                  return format(new Date(year, value - 1, 1), "MMM");
                }}
              />
              <Legend align="right" verticalAlign="top" />
              <ChartTooltip
                content={
                  <ChartTooltipContent
                    labelFormatter={(value, payload) => {
                      return (
                        <div>
                          {format(
                            new Date(year, payload[0]?.payload?.month, -1, 1),
                            "MMM",
                          )}
                        </div>
                      );
                    }}
                  />
                }
              />
              <Bar dataKey={"income"} fill="var(--color-income)" radius={4} />
              <Bar dataKey={"expense"} fill="var(--color-expense)" radius={4} />
            </BarChart>
          </ChartContainer>
        </div>
        <div className="border-l px-4 flex flex-col gap-4 justify-center">
          <div>
            <span className="text-muted-foreground font-bold text-sm">
              Income
            </span>
            <h2 className="text-3xl">
              ${numeral(totalAnnualIncome).format("0,0[.]00")}
            </h2>
          </div>

          <div className="border-t" />

          <div>
            <span className="text-muted-foreground font-bold text-sm">
              Expenses
            </span>
            <h2 className="text-3xl">
              ${numeral(totalAnnualExpenses).format("0,0[.]00")}
            </h2>
          </div>

          <div>
            <span className="text-muted-foreground font-bold text-sm">
              Expenses
            </span>
            <h2 className="text-3xl">
              ${numeral(totalAnnualExpenses).format("0,0[.]00")}
            </h2>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
