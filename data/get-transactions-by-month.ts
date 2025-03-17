import { authMiddleware } from "@/auth-middleware";
import { db } from "@/db";
import { categoriesTable, transactionsTable } from "@/db/schema";
import { createServerFn } from "@tanstack/start";
import { format } from "date-fns";
import { and, desc, eq, gt, gte, lte } from "drizzle-orm";
import { z } from "zod";

const today = new Date();
const schema = z.object({
  month: z
    .number()
    .min(1)
    .max(12)
    .catch(today.getMonth() + 1),
  year: z
    .number()
    .min(today.getFullYear() - 100)
    .max(today.getFullYear())
    .catch(today.getFullYear()),
});

export const getTransactionsByMonth = createServerFn({
  method: "GET",
})
  .middleware([authMiddleware])
  .validator((data: z.infer<typeof schema>) => schema.parse(data))
  .handler(async ({ context, data }) => {
    const earliestDate = new Date(data.year, data.month - 1, 1);
    const latestDate = new Date(data.year, data.month, 0);

    const transactions = await db
      .select({
        id: transactionsTable.id,
        description: transactionsTable.description,
        amount: transactionsTable.amount,
        transactionDate: transactionsTable.transactionDate,
        category: categoriesTable.name,
        transactionType: categoriesTable.type,
      })
      .from(transactionsTable)
      .where(
        and(
          eq(transactionsTable.userId, context.userId),
          gte(
            transactionsTable.transactionDate,
            format(earliestDate, "yyyy-MM-dd"),
          ),
          lte(
            transactionsTable.transactionDate,
            format(latestDate, "yyyy-MM-dd"),
          ),
        ),
      )
      .orderBy(desc(transactionsTable.transactionDate))
      .leftJoin(
        categoriesTable,
        eq(transactionsTable.categoryId, categoriesTable.id),
      );

    return transactions;
  });
