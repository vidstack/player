<script>
  import { onMount } from 'svelte';

  let playerImport;

  onMount(() => {
    playerImport = import('./video-player.svelte');
  });
</script>

{#if playerImport}
  {#await playerImport then { default: Player }}
    <Player />
  {/await}
{/if}
