import { error, json, type RequestHandler } from "@sveltejs/kit";

import { data } from "$lib/server/data";
import { ServerStatus } from "$lib/types";
import { MinecraftServer } from "$lib/server/manage";

export const POST = (async ({ params }) => {
  const server = data.servers[+params.index!];

  if (!server) {
    throw error(404, "Not Found");
  }

  if (server.process.status !== ServerStatus.STOPPED) {
    throw error(400, "Server is already running");
  }

  server.process = new MinecraftServer(server.folderPath);
  server.process.start();

  return json({ message: "ok" });
}) satisfies RequestHandler;
