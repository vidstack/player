<script>
  import { onMount } from 'svelte';

  let root;
  let canPlay;
  let userIdle;

  onMount(async () => {
    const media = await findMedia();
    ({ canPlay, userIdle } = media.controller._store);
    $canPlay = true;
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
  <slot />

  <div class="my-4 flex space-x-4 px-2">
    <label>
      Can Play
      <input type="checkbox" bind:checked={$canPlay} />
    </label>

    <label>
      User Idle
      <input type="checkbox" bind:checked={$userIdle} />
    </label>
  </div>
</div>
