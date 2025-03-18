import { authMiddleware } from "@/auth-middleware";
import { db } from "@/db";
import { transactionsTable } from "@/db/schema";
import { createServerFn } from "@tanstack/start";
import { addDays } from "date-fns";
import { and, eq } from "drizzle-orm";
import { z } from "zod";

const schema = z.object({
  id: z.number(),
  categoryId: z.coerce.number().positive("Select a category"),
  date: z.string().refine((value) => {
    const parsedDate = new Date(value);
    return !isNaN(parsedDate.getTime()) && parsedDate <= addDays(parsedDate, 1);
  }),
  amount: z.coerce.number().positive("Amount is required"),
  description: z
    .string()
    .min(3, "At least 3 characters")
    .max(300, "Max 300 characters"),
});

export const updateTransaction = createServerFn({
  method: "POST",
})
  .middleware([authMiddleware])
  .validator((data: z.infer<typeof schema>) => schema.parse(data))
  .handler(async ({ context, data }) => {
    await db
      .update(transactionsTable)
      .set({
        amount: data.amount.toString(),
        description: data.description,
        categoryId: data.categoryId,
        transactionDate: data.date,
      })
      .where(
        and(
          eq(transactionsTable.id, data.id),
          eq(transactionsTable.userId, context.userId),
        ),
      );
  });
