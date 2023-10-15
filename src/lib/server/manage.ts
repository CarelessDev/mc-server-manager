import { ServerStatus } from "$lib/types";
import { spawn, type ChildProcessWithoutNullStreams } from "node:child_process";

export class MinecraftServer {
  stdout = "";
  stderr = "";
  status = ServerStatus.STOPPED;

  process: ChildProcessWithoutNullStreams | undefined;

  constructor(readonly folderPath: string) {}

  start() {
    try {
      this._start();
    } catch (err) {
      console.error(err);
      this.status = ServerStatus.ERROR;
    }
  }

  _start() {
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
      } else {
        this.afterStop();
      }
    });

    this.status = ServerStatus.RUNNING;
  }

  sendCommand(command: string) {
    this.process?.stdin.write(command + "\n");
  }

  stop() {
    this.status = ServerStatus.STOPPING;
    this.process?.stdin.write("stop\n");
  }

  async afterStop() {
    console.log(`Saving ${this.folderPath} to git...`);
    await new Promise((resolve) => {
      setTimeout(resolve, 5000);
    });
    console.log("Done!");

    this.status = ServerStatus.STOPPED;
  }
}
