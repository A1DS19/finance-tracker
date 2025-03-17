import { authMiddleware } from "@/auth-middleware";
import { db } from "@/db";
import { transactionsTable } from "@/db/schema";
import { createServerFn } from "@tanstack/start";
import { and, eq } from "drizzle-orm";
import { z } from "zod";

const schema = z.object({
  transactionId: z.number(),
});

export const getTransaction = createServerFn({
  method: "GET",
})
  .validator((data: z.infer<typeof schema>) => schema.parse(data))
  .middleware([authMiddleware])
  .handler(async ({ data: { transactionId }, context: { userId } }) => {
    const [transaction] = await db
      .select()
      .from(transactionsTable)
      .where(
        and(
          eq(transactionsTable.id, transactionId),
          eq(transactionsTable.userId, userId),
        ),
      );

    if (!transaction) {
      throw new Error("Transaction not found");
    }

    return {
      ...transaction,
      transactionDate: new Date(transaction.transactionDate),
      amount: Number(transaction.amount),
    };
  });
