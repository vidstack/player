<script>
  import '../.snippets/styling.css';

  import { onMount } from 'svelte';

  let player,
    ready = false,
    canPlay = true,
    userIdle = false;

  $: if (ready) player.$store.canPlay = canPlay;
  $: if (ready) player.$store.userIdle = userIdle;

  onMount(async () => {
    await customElements.whenDefined('media-player');
    player.onAttach(() => void (ready = true));
  });
</script>

<div class="contents">
  <media-player class="w-full max-w-xs bg-black" aspect-ratio="16/9" bind:this={player}>
    <media-outlet />
    <div class="media-controls-container">
      <div class="media-controls-group">Controls Top</div>
      <div class="media-controls-group">Controls Middle</div>
      <div class="media-controls-group">Controls Bottom</div>
    </div>
  </media-player>

  <div class="my-4 flex space-x-4 px-2">
    <label>
      Can Play
      <input type="checkbox" bind:checked={canPlay} />
    </label>

    <label>
      User Idle
      <input type="checkbox" bind:checked={userIdle} />
    </label>
  </div>
</div>
