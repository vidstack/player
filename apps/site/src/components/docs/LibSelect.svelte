<script lang="ts">
  import { getRouter } from '@vitebook/svelte';

  import Select from '$src/components/base/Select.svelte';
  import { addJSLibToPath, currentJSLibTitle, jsLib, type JSLibType } from '$src/stores/js-lib';

  let value = $currentJSLibTitle;

  const router = getRouter();

  function onChange() {
    $jsLib = value.toLowerCase() as JSLibType;
    router.go(addJSLibToPath(location.href, $jsLib));
  }

  $: value = $currentJSLibTitle;
</script>

<Select block title="Current JS Library" bind:value on:change={onChange}>
  <option>HTML</option>
  <option>React</option>
</Select>
