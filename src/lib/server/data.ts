import { config } from "./config";
import { MinecraftServer } from "./manage";

type ServerState = (typeof config)["servers"][number] & {
  process: MinecraftServer;
};

export const data = {
  servers: config.servers.map((server) => ({
    ...server,
    process: new MinecraftServer(server.folderPath),
  })),
} satisfies { servers: ServerState[] };
