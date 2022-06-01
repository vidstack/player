<script lang="ts" context="module">
  import { type ServerLoader } from '@vitebook/core';

  export const loader: ServerLoader = async () => {
    return {
      redirect: '/docs/player/getting-started/quickstart/',
      cache: () => true,
    };
  };
</script>
