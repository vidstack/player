<script lang="ts">
  import Select from '$lib/components/base/Select.svelte';
  import {
    installMethod,
    installMethods,
    type InstallMethodType,
  } from '$lib/stores/install-method';

  import CDN from '../partials/install/cdn.md';
  import NPM from '../partials/install/npm.md';

  let options = installMethods.map((s) => s.toUpperCase());

  let compare = false;

  $: value = $installMethod.toUpperCase();
  function onChange() {
    $installMethod = value.toLowerCase() as InstallMethodType;
  }

  const Component = {
    npm: NPM,
    cdn: CDN,
  };
</script>

<Select title="Select Install Method" {options} bind:value on:change={onChange} />

<svelte:component this={Component[$installMethod]} />
