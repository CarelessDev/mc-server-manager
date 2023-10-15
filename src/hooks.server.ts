import type { Handle } from "@sveltejs/kit";
import { config } from "$lib/server/config";

export const handle: Handle = async ({ event, resolve }) => {
  const auth = event.request.headers.get("Authorization");

  const [username, password] = atob(auth?.split(" ")[1] ?? "").split(":");

  if (
    !username ||
    !password ||
    !config.users.find(
      (user) => user.username === username && user.password === password,
    )
  ) {
    return new Response("Not authorized", {
      status: 401,
      headers: {
        "WWW-Authenticate": 'Basic realm="User Visible Realm", charset="UTF-8"',
      },
    });
  }

  return resolve(event);
};
