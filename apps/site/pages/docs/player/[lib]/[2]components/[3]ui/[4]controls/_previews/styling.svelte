<script>
  import '../_snippets/styling.css';

  import { onMount } from 'svelte';

  let root;
  let canPlay;
  let userIdle;

  let canPlayValue = true;
  let userIdleValue = false;

  $: if (canPlay) canPlay.set(canPlayValue);
  $: if (userIdle) userIdle.set(userIdleValue);

  onMount(async () => {
    const media = await findMedia();
    ({ canPlay, userIdle } = media.$store);
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
    <div class="media-controls-container">
      <div class="media-controls-group">Controls Top</div>
      <div class="media-controls-group">Controls Middle</div>
      <div class="media-controls-group">Controls Bottom</div>
    </div>
  </vds-media>

  <div class="my-4 flex space-x-4 px-2">
    <label>
      Can Play
      <input type="checkbox" bind:checked={canPlayValue} />
    </label>

    <label>
      User Idle
      <input type="checkbox" bind:checked={userIdleValue} />
    </label>
  </div>
</div>
