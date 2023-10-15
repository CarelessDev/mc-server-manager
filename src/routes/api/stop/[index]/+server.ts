import { error, json, type RequestHandler } from "@sveltejs/kit";

import { data } from "$lib/server/data";
import { ServerStatus } from "$lib/types";

export const POST = (async ({ params }) => {
  const server = data.servers[+params.index!];

  if (!server) {
    throw error(404, "Not Found");
  }

  if (server.process.status === ServerStatus.STOPPING) {
    throw error(400, "Server is stopping");
  }

  if (server.process.status === ServerStatus.STOPPED) {
    throw error(400, "Server is already stopped");
  }

  server.process.stop();

  return json({ message: "ok" });
}) satisfies RequestHandler;
