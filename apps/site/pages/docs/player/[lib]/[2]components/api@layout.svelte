<script lang="ts" context="module">
  import { type ServerLoader } from '@vitebook/core';

  export const loader: ServerLoader = async ({ pathname }) => {
    const { loadComponentAPI } = await import('$src/server/component-api');
    return {
      data: { api: await loadComponentAPI(pathname) },
    };
  };
</script>

<script>
  import ApiTable from '$src/components/docs/ApiTable.svelte';

  export let api;
</script>

<ApiTable {api} />

<slot />
