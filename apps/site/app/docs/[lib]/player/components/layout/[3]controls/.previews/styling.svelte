<script>
  import '../.snippets/styling.css';

  import { onMount } from 'svelte';

  let root,
    media,
    canPlay = true,
    userIdle = false;

  $: if (media) media.$store.canPlay = canPlay;
  $: if (media) media.$store.userIdle = userIdle;

  onMount(async () => {
    media = await findMedia();
  });

  function findMedia() {
    return new Promise((resolve) => {
      window.requestAnimationFrame(() => {
        const media = root.querySelector('vds-media');
        media.onAttach(() => {
          resolve(media ? media : findMedia());
        });
      });
    });
  }
</script>

<div class="contents" bind:this={root}>
  <vds-media class="w-full max-w-xs" view="video">
    <vds-aspect-ratio ratio="16/9">
      <vds-video>
        <video>
          <track kind="captions" />
        </video>
      </vds-video>
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
      <input type="checkbox" bind:checked={canPlay} />
    </label>

    <label>
      User Idle
      <input type="checkbox" bind:checked={userIdle} />
    </label>
  </div>
</div>
