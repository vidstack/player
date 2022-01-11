<script>
  import { createEventDispatcher, onMount } from 'svelte';
  import { ControlsAddon } from '@vitebook/client/addons';

  const dispatch = createEventDispatcher();

  export let autoplay = false;
  export let controls = false;
  export let src = '';
  export let poster = '';
  export let currentTime = 0;
  export let loop = false;
  export let muted = false;
  export let paused = true;
  export let playsinline = false;
  export let volume = 0.5;

  let mounted = false;
  onMount(() => {
    mounted = true;
  });

  $: if (mounted)
    dispatch('change', {
      autoplay,
      controls,
      src,
      poster,
      currentTime,
      loop,
      muted,
      paused,
      playsinline,
      volume
    });
</script>

<ControlsAddon>
  <div class="control">
    <span>Autoplay</span>
    <input type="checkbox" bind:checked={autoplay} />
  </div>
  <div class="control">
    <span>Controls</span>
    <input type="checkbox" bind:checked={controls} />
  </div>
  <div class="control">
    <span>Src</span>
    <input type="text" bind:value={src} />
  </div>
  <div class="control">
    <span>Poster</span>
    <input type="text" bind:value={poster} />
  </div>
  <div class="control">
    <span>Current Time</span>
    <input type="number" bind:value={currentTime} min="0" step="1" />
  </div>
  <div class="control">
    <span>Loop</span>
    <input type="checkbox" bind:checked={loop} />
  </div>
  <div class="control">
    <span>Muted</span>
    <input type="checkbox" bind:checked={muted} />
  </div>
  <div class="control">
    <span>Paused</span>
    <input type="checkbox" bind:checked={paused} />
  </div>
  <div class="control">
    <span>Playsinline</span>
    <input type="checkbox" bind:checked={playsinline} />
  </div>
  <div class="control">
    <span>Volume</span>
    <input type="number" step="0.1" min="0" max="1" bind:value={volume} />
  </div>
  <slot />
</ControlsAddon>
