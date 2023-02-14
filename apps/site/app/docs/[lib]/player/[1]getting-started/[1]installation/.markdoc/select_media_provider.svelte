<script lang="ts">
  import Select from '$lib/components/base/Select.svelte';
  import {
    mediaProvider,
    mediaProviders,
    titleCaseMediaProvider,
    type MediaProviderType,
  } from '$lib/stores/media-provider';

  import Audio from '../partials/provider/audio.md';
  import HLS from '../partials/provider/hls.md';
  import Video from '../partials/provider/video.md';

  let options = mediaProviders.map(titleCaseMediaProvider);

  $: value = titleCaseMediaProvider($mediaProvider);
  function onChange() {
    $mediaProvider = value.toLowerCase() as MediaProviderType;
  }

  const Component = {
    audio: Audio,
    video: Video,
    hls: HLS,
  };
</script>

<Select title="Select Media Provider" {options} bind:value on:change={onChange} />

<svelte:component this={Component[$mediaProvider]} />
