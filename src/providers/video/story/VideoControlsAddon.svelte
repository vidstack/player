<script lang="ts">
  import { createEventDispatcher, onMount } from 'svelte';

  import { MediaControlsAddon } from '../../../media/story';
  import type {
    MediaControlsList,
    MediaCrossOriginOption,
    MediaPreloadOption
  } from '../../html5';

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
  export let controlsList: MediaControlsList | undefined = undefined;
  export let crossOrigin: MediaCrossOriginOption | undefined = undefined;
  export let defaultMuted: boolean | undefined = undefined;
  export let defaultPlaybackRate: number | undefined = undefined;
  export let disableRemotePlayback: boolean | undefined = undefined;
  export let preload: MediaPreloadOption | undefined = undefined;
  export let width: number | undefined = undefined;
  export let height: number | undefined = undefined;

  let controlsListSelections = controlsList?.split(' ') ?? [];

  let mounted = false;
  onMount(() => {
    mounted = true;
  });

  $: if (mounted) {
    dispatch('change', {
      controlsList: controlsListSelections.join(' '),
      // @ts-expect-error - Can be empty string because of <select>.
      crossOrigin: crossOrigin === '' ? undefined : crossOrigin,
      defaultMuted,
      defaultPlaybackRate,
      disableRemotePlayback,
      preload,
      width,
      height
    });
  }
</script>

<MediaControlsAddon
  {logLevel}
  {autoplay}
  {controls}
  {src}
  {poster}
  {currentTime}
  {loop}
  {muted}
  {paused}
  {playsinline}
  {volume}
  on:change
>
  <label>
    Controls List
    <select multiple bind:value={controlsListSelections}>
      <option value="">None</option>
      <option value="nofullscreen">No Fullscreen</option>
      <option value="noremoteplayback">No Remote Playback</option>
      <option value="nodownload">No Download</option>
    </select>
  </label>
  <label>
    Cross Origin
    <select bind:value={crossOrigin}>
      <option value="">None</option>
      <option value="anonymous">Anonymous</option>
      <option value="use-credentials">Use Credentials</option>
    </select>
  </label>
  <label>
    Default Muted
    <input type="checkbox" bind:checked={defaultMuted} />
  </label>
  <label>
    Default Playback Rate
    <input type="number" bind:value={defaultPlaybackRate} />
  </label>
  <label>
    Disable Remote Playback
    <input type="checkbox" bind:checked={disableRemotePlayback} />
  </label>
  <label>
    Preload
    <select bind:value={preload}>
      <option value="none">None</option>
      <option value="metadata">Metadata</option>
      <option value="auto">Auto</option>
    </select>
  </label>
  <label>
    Width
    <input type="number" bind:value={width} />
  </label>
  <label>
    Height
    <input type="number" bind:value={height} />
  </label>

  <slot />
</MediaControlsAddon>
