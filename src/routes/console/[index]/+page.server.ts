import type { PageServerLoad } from "./$types";

import { data } from "$lib/server/data";
import { error } from "@sveltejs/kit";

export const load = (({ params }) => {
  const index = +params.index!;

  if (isNaN(index) || index < 0 || index >= data.servers.length) {
    throw error(404, "Not Found");
  }

  return {
    params,
  };
}) satisfies PageServerLoad;
