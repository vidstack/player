<script>
  import { Gesture } from '@vidstack/player-svelte';
</script>

<Gesture class="absolute inset-0 z-0 h-full w-full" type="click" action="toggle:paused" />

<Gesture
  class="absolute inset-0 z-0 h-full w-full"
  type="pointerup"
  action="toggle:fullscreen"
  repeat={1}
  priority={1}
/>

<Gesture
  class="absolute top-0 left-0 h-full w-1/4"
  type="pointerup"
  action="seek:-30"
  repeat={1}
  priority={0}
/>

<Gesture
  class="absolute top-0 right-0 h-full w-1/4"
  type="pointerup"
  action="seek:30"
  repeat={1}
  priority={0}
/>
