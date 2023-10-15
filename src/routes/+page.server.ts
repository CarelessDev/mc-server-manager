import type { PageServerLoad } from "./$types";

import { data } from "$lib/server/data";

export const load = (() => {
  return {
    servers: data.servers.map((server) => ({
      name: server.name,
      folderPath: server.folderPath,
      serverIP: server.serverIP,
      serverPort: server.serverPort,
      status: server.process.status,
    })),
  };
}) satisfies PageServerLoad;
