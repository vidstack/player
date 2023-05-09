<script>
  import { onMount } from 'svelte';

  let player,
    ready = false,
    canPlay = true,
    waiting = true;

  $: if (ready) player.$store.canPlay.set(canPlay);
  $: if (ready) player.$store.waiting.set(waiting);

  onMount(async () => {
    await customElements.whenDefined('media-player');
    player.onAttach(() => void (ready = true));
  });
</script>

<div class="contents">
  <media-player class="w-full max-w-xs bg-black" aspect-ratio="16/9" bind:this={player}>
    <media-outlet />
    <media-buffering-indicator />
  </media-player>

  <div class="my-4 flex space-x-4 px-2">
    <label>
      Can Play
      <input type="checkbox" bind:checked={canPlay} />
    </label>

    <label>
      Buffering
      <input type="checkbox" bind:checked={waiting} />
    </label>
  </div>
</div>
