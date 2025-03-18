import { authMiddleware } from "@/auth-middleware";
import { db } from "@/db";
import { categoriesTable, transactionsTable } from "@/db/schema";
import { createServerFn } from "@tanstack/start";
import { and, eq, sql } from "drizzle-orm";
import { z } from "zod";

const schema = z.object({
  year: z.number(),
});

export const getAnnualCashflow = createServerFn({
  method: "GET",
})
  .middleware([authMiddleware])
  .validator((data: z.infer<typeof schema>) => schema.parse(data))
  .handler(async ({ context, data }) => {
    const cashflow = await db
      .select({
        month: sql<string>`extract(month from ${transactionsTable.transactionDate})`,
        totalIncome: sql<string>`sum(case when ${categoriesTable.type} = 'income' then ${transactionsTable.amount} else 0 end)`,
        totalExpenses: sql<string>`sum(case when ${categoriesTable.type} = 'expense' then ${transactionsTable.amount} else 0 end)`,
      })
      .from(transactionsTable)
      .leftJoin(
        categoriesTable,
        eq(categoriesTable.id, transactionsTable.categoryId),
      )
      .where(
        and(
          eq(transactionsTable.userId, context.userId),
          eq(
            sql`extract(year from ${transactionsTable.transactionDate})`,
            data.year,
          ),
        ),
      )
      .groupBy(sql`extract(month from ${transactionsTable.transactionDate})`)
      .orderBy(sql`extract(month from ${transactionsTable.transactionDate})`);

    const annualCashflow: { month: number; income: number; expense: number }[] =
      [];

    for (let i = 1; i <= 12; i++) {
      const monthlyCashflow = cashflow.find((cf) => Number(cf.month) == i);

      annualCashflow.push({
        month: i,
        income: Number(monthlyCashflow?.totalIncome ?? 0),
        expense: Number(monthlyCashflow?.totalExpenses ?? 0),
      });
    }

    return annualCashflow;
  });
