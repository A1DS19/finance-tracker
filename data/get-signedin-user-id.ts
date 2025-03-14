import { getAuth } from "@clerk/tanstack-start/server";
import { getWebRequest } from "vinxi/http";
import { createServerFn } from "@tanstack/start";

export const getSignedInUserId = createServerFn({ method: "GET" }).handler(
  async () => {
    const user = await getAuth(getWebRequest());
    return user.userId;
  },
);
