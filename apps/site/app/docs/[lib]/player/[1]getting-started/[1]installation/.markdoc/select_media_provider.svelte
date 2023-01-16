<script lang="ts">
  import Select from '$lib/components/base/Select.svelte';
  import {
    mediaProvider,
    mediaProviders,
    titleCaseMediaProvider,
    type MediaProviderType,
  } from '$lib/stores/media-provider';

  let options = mediaProviders.map(titleCaseMediaProvider);

  $: value = titleCaseMediaProvider($mediaProvider);
  function onChange() {
    $mediaProvider = value.toLowerCase() as MediaProviderType;
  }
</script>

<Select title="Select Media Provider" {options} bind:value on:change={onChange} />
