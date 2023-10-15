<script lang="ts">
  import { goto, invalidate } from "$app/navigation";
  import { ServerStatus } from "$lib/types";
  import type { PageData } from "./$types";

  export let data: PageData;

  $: ({ servers } = data);

  const actions = {
    [ServerStatus.STOPPED]: {
      name: "Start",
      async run(serverID: number) {
        await fetch(`/api/start/${serverID}`, { method: "POST" });
        invalidate("/");
      },
    },
    [ServerStatus.RUNNING]: {
      name: "Stop",
      async run(serverID: number) {
        await fetch(`/api/stop/${serverID}`, { method: "POST" });
        invalidate("/");
      },
    },
    [ServerStatus.ERROR]: {
      name: "Reset",
      async run(serverID: number) {
        await fetch(`/api/reset/${serverID}`, { method: "POST" });
        invalidate("/");
      },
    },
    [ServerStatus.STOPPING]: {
      name: "--WAIT--",
      run: undefined,
    },
  };
</script>

<main>
  <div class="flex flex-col gap-4">
    {#each servers as server, index}
      {@const action = actions[server.status]}
      <div class="m-4 flex flex-col gap-4 rounded-lg bg-gray-200 p-4">
        <h2 class="text-xl font-bold">Server Info</h2>
        <p class="text-lg font-bold">{server.name}</p>
        <p>Join at: {server.serverIP}:{server.serverPort}</p>

        <h2 class="text-xl font-bold">Server Management</h2>
        <p>Location: {server.folderPath}</p>

        <p>Status: {server.status}</p>
        <p>
          Action:

          <button
            class="rounded-lg border border-black p-1"
            on:click={action.run ? () => action.run(index) : undefined}
            disabled={!action.run}
          >
            {action.name}
          </button>
        </p>

        {#if server.status !== ServerStatus.STOPPED}
          <p>
            <button
              class="rounded-lg border border-black bg-blue-500 p-1 text-white"
              on:click={() => goto(`/console/${index}`)}
            >
              Go to Console
            </button>
          </p>
        {/if}
      </div>
    {/each}
  </div>
</main>
