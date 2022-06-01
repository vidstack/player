<script lang="ts">
  import Select from '$src/components/base/Select.svelte';
  import {
    installMethod,
    installMethods,
    type InstallMethodType,
  } from '$src/stores/install-method';

  let options = installMethods.map((s) => s.toUpperCase());

  $: value = $installMethod.toUpperCase();
  function onChange() {
    $installMethod = value.toLowerCase() as InstallMethodType;
  }
</script>

<Select title="Select Install Method" {options} bind:value on:change={onChange} />
