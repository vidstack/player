<script>
  import { onMount } from 'svelte';

  let player;

  onMount(async () => {
    await customElements.whenDefined('media-player');
    player.onAttach(() => {
      player.textTracks.add({
        src: '/media/sprite-fight.vtt',
        kind: 'subtitles',
        language: 'en-US',
        label: 'English',
        default: true,
      });
    });
  });
</script>

<media-player
  class="w-full max-w-md relative"
  volume={0.2}
  src="https://stream.mux.com/VZtzUzGRv02OhRnZCxcNg49OilvolTqdnFLEqBsTwaxU/low.mp4"
  poster="https://image.mux.com/VZtzUzGRv02OhRnZCxcNg49OilvolTqdnFLEqBsTwaxU/thumbnail.png?time=268&width=640"
  playsinline
  aspect-ratio="16/9"
  bind:this={player}
>
  <media-outlet>
    <media-captions />
  </media-outlet>
  <div class="w-full text-center flex">
    <media-play-button />
    <media-time-slider />
    <media-caption-button />
  </div>
</media-player>
