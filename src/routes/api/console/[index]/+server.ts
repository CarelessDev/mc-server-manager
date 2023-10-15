import { error, json, type RequestHandler } from "@sveltejs/kit";

import { data } from "$lib/server/data";
import { ServerStatus } from "$lib/types";

export const GET = (async ({ params }) => {
  const server = data.servers[+params.index!];

  if (!server) {
    throw error(404, "Not Found");
  }

  if (server.process.status === ServerStatus.STOPPED) {
    throw error(400, "Server is not running");
  }

  const stdout = server.process.stdout.slice(-10000);
  const stderr = server.process.stderr.slice(-10000);

  return json({ stdout, stderr });
}) satisfies RequestHandler;

export const POST = (async ({ params, request }) => {
  const server = data.servers[+params.index!];

  if (!server) {
    throw error(404, "Not Found");
  }

  if (server.process.status === ServerStatus.STOPPED) {
    throw error(400, "Server is not running");
  }

  const body = await request.json();

  const command = body?.command;

  if (!command) {
    throw error(400, "Command is not provided");
  }

  server.process.sendCommand(command);

  return json({ message: "ok" });
}) satisfies RequestHandler;
