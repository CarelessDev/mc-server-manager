<script lang="ts">
  import { onMount } from "svelte";
  import type { PageData } from "./$types";

  export let data: PageData;

  let consoleOutput = "";
  let consoleError = "";
  let commandInput = "";

  function sendCommand() {
    fetch(`/api/console/${data.params.index}`, {
      method: "POST",
      body: JSON.stringify({ command: commandInput }),
    });

    commandInput = "";
  }

  async function syncInput() {
    const res = await fetch(`/api/console/${data.params.index}`);

    if (!res.ok) {
      consoleError = await res.text();
      return;
    }

    const { stdout, stderr } = await res.json();

    consoleOutput = stdout;
    consoleError = stderr;
  }

  onMount(() => {
    const interval = setInterval(() => syncInput(), 2000);

    syncInput();

    return () => clearInterval(interval);
  });
</script>

<main class="flex h-full flex-col gap-2 p-4">
  <label for="console-output" class="block font-bold"> Console Output: </label>
  <textarea
    id="console-output"
    class="flex-grow rounded-lg bg-gray-900 p-2 font-mono text-white"
    readonly
    rows={consoleOutput.split("\n").length}
  >
    {consoleOutput}
  </textarea>

  {#if consoleError}
    <label for="console-error" class="block font-bold"> Console Error: </label>
    <textarea
      id="console-error"
      class="flex-grow rounded-lg bg-red-900 p-2 font-mono text-white"
      readonly
      rows={consoleError.split("\n").length}
    >
      {consoleError}
    </textarea>
  {/if}

  <div class="flex items-center p-2">
    <input
      class="mr-2 flex-grow rounded-lg bg-gray-800 p-2 font-mono text-white"
      type="text"
      bind:value={commandInput}
      on:keydown={(event) => {
        if (event.key === "Enter") {
          sendCommand();
        }
      }}
    />
    <button
      class="m-2 rounded-lg bg-blue-500 p-2 text-white"
      on:click={sendCommand}
    >
      Send
    </button>
  </div>
</main>
