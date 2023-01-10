<script lang="ts">
  import { useRouter } from '@vessel-js/svelte';

  import Select from '$lib/components/base/Select.svelte';
  import { addJSLibToPath, currentJSLibTitle, jsLib, type JSLibType } from '$lib/stores/js-lib';

  let value = $currentJSLibTitle;

  const router = useRouter();

  function onChange() {
    $jsLib = value.toLowerCase() as JSLibType;
    router.go(new URL(addJSLibToPath(location.href, $jsLib)));
  }

  $: value = $currentJSLibTitle;
</script>

<Select block title="Current JS Library" bind:value on:change={onChange}>
  <option>HTML</option>
  <option>React</option>
</Select>
