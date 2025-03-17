import { authMiddleware } from "@/auth-middleware";
import { db } from "@/db";
import { transactionsTable } from "@/db/schema";
import { createServerFn } from "@tanstack/start";
import { asc, desc, eq } from "drizzle-orm";

export const getTransactionYearsRange = createServerFn({
  method: "GET",
})
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    const userId = context.userId;
    const today = new Date();
    const [earliestTransaction] = await db
      .select()
      .from(transactionsTable)
      .where(eq(transactionsTable.userId, userId))
      .orderBy(asc(transactionsTable.transactionDate))
      .limit(1);

    const earliestYear = earliestTransaction
      ? new Date(earliestTransaction.transactionDate).getFullYear()
      : today.getFullYear();

    const years = Array.from({
      length: today.getFullYear() - earliestYear + 1,
    }).map((_, i) => {
      return today.getFullYear() - i;
    });

    return years;
  });
