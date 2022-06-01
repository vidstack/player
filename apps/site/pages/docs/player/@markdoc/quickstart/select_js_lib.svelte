<script lang="ts">
  import Select from '$src/components/base/Select.svelte';
  import { installMethod } from '$src/stores/install-method';
  import { jsLib, jsLibs, titleCaseJSLib, type JSLibType } from '$src/stores/js-lib';

  $: value = titleCaseJSLib($jsLib);
  $: options = $installMethod === 'cdn' ? [titleCaseJSLib('html')] : jsLibs.map(titleCaseJSLib);

  function onChange() {
    $jsLib = value.toLowerCase() as JSLibType;
  }
</script>

<Select title="Select JS Library" {options} bind:value on:change={onChange} />
