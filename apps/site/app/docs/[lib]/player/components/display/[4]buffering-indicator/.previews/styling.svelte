<script>
  import '../.snippets/styling.css';

  import { onMount } from 'svelte';

  let player,
    ready = false,
    canPlay = true,
    waiting = true;

  $: if (ready) player.$store.canPlay = canPlay;
  $: if (ready) player.$store.waiting = waiting;

  onMount(async () => {
    await customElements.whenDefined('media-player');
    player.onAttach(() => void (ready = true));
  });
</script>

<div class="contents">
  <media-player class="w-full max-w-xs bg-black" aspect-ratio="16/9" bind:this={player}>
    <media-outlet />
    <div class="media-buffering-container">
      <svg class="media-buffering-icon" fill="none" viewBox="0 0 120 120" aria-hidden="true">
        <circle
          class="media-buffering-track"
          cx="60"
          cy="60"
          r="54"
          stroke="currentColor"
          stroke-width="8"
        />
        <circle
          class="media-buffering-track-fill"
          cx="60"
          cy="60"
          r="54"
          stroke="currentColor"
          stroke-width="10"
          pathLength="100"
        />
      </svg>
    </div>
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
