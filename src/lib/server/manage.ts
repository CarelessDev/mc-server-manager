import { ServerStatus } from "$lib/types";
import { spawn, type ChildProcessWithoutNullStreams } from "node:child_process";

export class MinecraftServer {
  stdout = "";
  stderr = "";
  status = ServerStatus.STOPPED;

  process: ChildProcessWithoutNullStreams | undefined;

  constructor(readonly folderPath: string) {}

  start() {
    this.process = spawn(this.folderPath + "/bedrock_server", {
      stdio: ["pipe", "pipe", "pipe"],
    });

    this.process.stdin.setDefaultEncoding("utf-8");

    this.process.stdout.on("data", (data) => {
      this.stdout += data.toString();
    });

    this.process.stderr.on("data", (data) => {
      this.stderr += data.toString();
    });

    this.process.on("exit", (code) => {
      if (code !== 0) {
        this.status = ServerStatus.ERROR;
      }
    });

    this.status = ServerStatus.RUNNING;
  }

  sendCommand(command: string) {
    this.process?.stdin.write(command + "\n");
  }

  async stop() {
    this.process?.stdin.write("stop\n");
  }
}
