<script lang="ts">
  import { ServerStatus } from "$lib/types";
  import type { PageData } from "./$types";

  export let data: PageData;

  $: ({ servers } = data);

  const actions = {
    [ServerStatus.STOPPED]: "Start",
    [ServerStatus.RUNNING]: "Stop",
    [ServerStatus.ERROR]: "Reset",
    [ServerStatus.STOPPING]: "--WAIT--",
  };
</script>

<main>
  <div class="flex flex-col gap-4">
    {#each servers as server}
      <div class="m-4 flex flex-col gap-4 rounded-lg bg-gray-200 p-4">
        <h2 class="text-xl font-bold">Server Info</h2>
        <p class="text-lg font-bold">{server.name}</p>
        <p>Join at: {server.serverIP}:{server.serverPort}</p>

        <h2 class="text-xl font-bold">Server Management</h2>
        <p>Location: {server.folderPath}</p>

        <p>Status: {server.status}</p>
        <p>
          Action:
          <button class="rounded-lg border border-black p-1">
            {actions[server.status]}
          </button>
        </p>
      </div>
    {/each}
  </div>
</main>
