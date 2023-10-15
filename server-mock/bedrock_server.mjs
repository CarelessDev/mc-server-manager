import { createInterface } from "node:readline";
import { stdin as input, stdout as output } from "node:process";

const rl = createInterface({ input, output });

console.log("Starting Mock Minecraft Server");

rl.on("line", async (line) => {
  if (line === "stop") {
    console.log("Stopping");

    await new Promise((resolve) => setTimeout(resolve, 5000));

    console.log("Server stopped successfully");
    process.exit(0);
  }

  if (line === "bomb") {
    console.log("oops");
    process.exit(1);
  }

  console.log(`Unknown command: ${line}`);
});
