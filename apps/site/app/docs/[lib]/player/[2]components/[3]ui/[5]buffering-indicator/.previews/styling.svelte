<script>
  import '../.snippets/styling.css';

  import { onMount } from 'svelte';

  let root;
  let canPlay;
  let waiting;

  let canPlayValue = false;
  let waitingValue = false;

  $: if (canPlay) canPlay.set(canPlayValue);
  $: if (waiting) waiting.set(waitingValue);

  onMount(async () => {
    const media = await findMedia();
    ({ canPlay, waiting } = media.$store);
  });

  function findMedia() {
    return new Promise((resolve) => {
      window.requestAnimationFrame(() => {
        const media = root.querySelector('vds-media');
        resolve(media ? media : findMedia());
      });
    });
  }
</script>

<div class="contents" bind:this={root}>
  <vds-media class="w-full max-w-xs">
    <vds-aspect-ratio ratio="16/9">
      <vds-video />
    </vds-aspect-ratio>

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
  </vds-media>

  <div class="my-4 flex space-x-4 px-2">
    <label>
      Can Play
      <input type="checkbox" bind:checked={canPlayValue} />
    </label>

    <label>
      Buffering
      <input type="checkbox" bind:checked={waitingValue} />
    </label>
  </div>
</div>
