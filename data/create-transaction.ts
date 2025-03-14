import { authMiddleware } from "@/auth-middleware";
import { db } from "@/db";
import { transactionsTable } from "@/db/schema";
import { createServerFn } from "@tanstack/start";
import { addDays } from "date-fns";
import { z } from "zod";

const transactionFormSchema = z.object({
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

export const createTransaction = createServerFn({
  method: "POST",
})
  .middleware([authMiddleware])
  .validator((data: z.infer<typeof transactionFormSchema>) => {
    return transactionFormSchema.parse(data);
  })
  .handler(async ({ data, context }) => {
    const transaction = await db
      .insert(transactionsTable)
      .values({
        userId: context.userId,
        amount: data.amount.toString(),
        description: data.description,
        categoryId: data.categoryId,
        transactionDate: data.date,
      })
      .returning();

    return transaction.map((trn) => {
      return {
        ...trn,
        transactionDate: new Date(trn.transactionDate),
      };
    })[0];
  });
