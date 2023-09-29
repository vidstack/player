<script lang="ts">
  import Select from '$lib/components/base/Select.svelte';
  import { installMethod } from '$lib/stores/install-method';
  import { jsLib, jsLibs, titleCaseJSLib, type JSLibType } from '$lib/stores/js-lib';

  import HTML from '../partials/lib/html.md';
  import React from '../partials/lib/react.md';

  $: value = titleCaseJSLib($jsLib);
  $: options = $installMethod === 'cdn' ? [titleCaseJSLib('html')] : jsLibs.map(titleCaseJSLib);

  function onChange() {
    $jsLib = value.toLowerCase() as JSLibType;
  }

  const Component = {
    html: HTML,
    react: React,
  };
</script>

<Select title="Select JS Library" {options} bind:value on:change={onChange} />

<svelte:component this={Component[$jsLib]} />
