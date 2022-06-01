<script lang="ts">
  import Select from '$src/components/base/Select.svelte';
  import {
    mediaProvider,
    mediaProviders,
    titleCaseMediaProvider,
    type MediaProviderType,
  } from '$src/stores/media-provider';

  let options = mediaProviders.map(titleCaseMediaProvider);

  $: value = titleCaseMediaProvider($mediaProvider);
  function onChange() {
    $mediaProvider = value.toLowerCase() as MediaProviderType;
  }
</script>

<Select title="Select Media Provider" {options} bind:value on:change={onChange} />
