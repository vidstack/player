<script>
  import '../_snippets/styling.css';

  import { onMount } from 'svelte';
  import { AspectRatio, Gesture, Media, Video } from '@vidstack/player/svelte';

  let hideMessage = false;
  onMount(() => {
    setTimeout(() => {
      hideMessage = true;
    }, 3000);
  });
</script>

<div class="relative w-full flex justify-center">
  <Media class="w-full max-w-md">
    <AspectRatio ratio="16/9">
      <Video>
        <video controls preload="none" src="https://media-files.vidstack.io/360p.mp4">
          <track kind="captions" />
        </video>
      </Video>
    </AspectRatio>

    <!-- GESTURES -->
    <Gesture type="mouseleave" action="pause" />
    <Gesture type="click" action="toggle:paused" />
    <Gesture type="click" repeat={1} priority={1} action="toggle:fullscreen" />
    <Gesture class="seek-gesture left" type="click" repeat={1} priority={0} action="seek:-30" />
    <Gesture class="seek-gesture right" type="click" repeat={1} priority={0} action="seek:30" />
  </Media>

  {#if !hideMessage}
    <div class="pointer-events-none absolute inset-0 flex items-center justify-center">
      <p>tap to start playback</p>
    </div>
  {/if}
</div>

<p class="mt-4 px-2 text-xs w-full text-left">The following gestures are applied:</p>

<ul class="my-4 space-y-2 px-2 text-xs w-full text-left">
  <li>- Toggle playback when the user taps the player.</li>
  <li>- Toggle fullscreen when the user double taps the player.</li>
  <li>- Pause media when the user's mouse leaves the player.</li>
  <li>
    - Seek playback backwards thirty seconds when the user double-taps on the left region (25%) of
    the player.
  </li>
  <li>
    - Seek playback forwards thirty seconds when the user double-taps on the right region (25%) of
    the player.
  </li>
</ul>
