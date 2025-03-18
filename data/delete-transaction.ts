import { authMiddleware } from "@/auth-middleware";
import { db } from "@/db";
import { transactionsTable } from "@/db/schema";
import { createServerFn } from "@tanstack/start";
import { and, eq } from "drizzle-orm";
import { z } from "zod";

const schema = z.object({
  id: z.number(),
});

export const deleteTransaction = createServerFn({
  method: "POST",
})
  .validator((data: z.infer<typeof schema>) => schema.parse(data))
  .middleware([authMiddleware])
  .handler(async ({ context, data }) => {
    await db
      .delete(transactionsTable)
      .where(
        and(
          eq(transactionsTable.id, data.id),
          eq(transactionsTable.userId, context.userId),
        ),
      );
  });
