<script lang="ts">
  import Select from '$lib/components/base/Select.svelte';
  import { installMethod } from '$lib/stores/install-method';
  import { jsLib, jsLibs, titleCaseJSLib, type JSLibType } from '$lib/stores/js-lib';

  $: value = titleCaseJSLib($jsLib);
  $: options = $installMethod === 'cdn' ? [titleCaseJSLib('html')] : jsLibs.map(titleCaseJSLib);

  function onChange() {
    $jsLib = value.toLowerCase() as JSLibType;
  }
</script>

<Select title="Select JS Library" {options} bind:value on:change={onChange} />
