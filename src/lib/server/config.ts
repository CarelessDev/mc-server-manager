import * as fs from "node:fs/promises";
import yaml from "js-yaml";
import { z } from "zod";

const rawConfig = yaml.load(await fs.readFile("./config.yml", "utf8"));

const configSchema = z.object({
  users: z.array(
    z.object({
      username: z.string().regex(/^[a-z0-9]+$/),
      password: z.string(),
    }),
  ),
  servers: z.array(
    z.object({
      name: z.string(),
      folderPath: z.string(),
      serverIP: z.string(),
      serverPort: z.number(),
    }),
  ),
});

export const config = configSchema.parse(rawConfig);
