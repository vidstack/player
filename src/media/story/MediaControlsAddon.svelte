<script>
  import { createEventDispatcher, onMount } from 'svelte';
  import { ControlsAddon } from '@vitebook/client/addons';

  const dispatch = createEventDispatcher();

  export let logLevel = 'warn';
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
      logLevel,
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
  <label>
    Log Level
    <select bind:value={logLevel}>
      <option value="silent">Silent</option>
      <option value="error">Error</option>
      <option value="warn">Warn</option>
      <option value="info">Info</option>
      <option value="debug">Debug</option>
    </select>
  </label>
  <label>
    Autoplay
    <input type="checkbox" bind:checked={autoplay} />
  </label>
  <label>
    Controls
    <input type="checkbox" bind:checked={controls} />
  </label>
  <label>
    Src
    <input type="text" bind:value={src} />
  </label>
  <label>
    Poster
    <input type="text" bind:value={poster} />
  </label>
  <label>
    Current Time
    <input type="number" bind:value={currentTime} min="0" step="1" />
  </label>
  <label>
    Loop
    <input type="checkbox" bind:checked={loop} />
  </label>
  <label>
    Muted
    <input type="checkbox" bind:checked={muted} />
  </label>
  <label>
    Paused
    <input type="checkbox" bind:checked={paused} />
  </label>
  <label>
    Playsinline
    <input type="checkbox" bind:checked={playsinline} />
  </label>
  <label>
    Volume
    <input type="number" step="0.1" min="0" max="1" bind:value={volume} />
  </label>

  <slot />
</ControlsAddon>
