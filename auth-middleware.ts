import { getAuth } from "@clerk/tanstack-start/server";
import { createMiddleware } from "@tanstack/start";
import { getWebRequest } from "vinxi/http";

export const authMiddleware = createMiddleware().server(async ({ next }) => {
  const user = await getAuth(getWebRequest());

  if (!user.userId) {
    throw new Error("Unauthorized");
  }

  const result = next({
    context: {
      userId: user.userId,
    },
  });
  return result;
});
