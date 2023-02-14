<script lang="ts">
  import Button from '$lib/components/base/Button.svelte';
  import Select from '$lib/components/base/Select.svelte';
  import {
    installMethod,
    installMethods,
    type InstallMethodType,
  } from '$lib/stores/install-method';

  import ComponentDesc from '../../../components/.markdoc/component_desc.svelte';
  import CDN from '../partials/install/cdn.md';
  import NPM from '../partials/install/npm.md';
  import WhyCDN from '../partials/install/why-cdn.md';
  import WhyNPM from '../partials/install/why-npm.md';

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

  const WhyComponent = {
    npm: WhyNPM,
    cdn: WhyCDN,
  };
</script>

<Select title="Select Install Method" {options} bind:value on:change={onChange} />

<svelte:component this={Component[$installMethod]} />

{#if !compare}
  <Button
    primary
    type="raised"
    on:press={() => {
      compare = true;
    }}
  >
    {$installMethod === 'npm' ? 'Why use NPM?' : 'Why use a CDN?'}
  </Button>
{:else}
  <div class="-mt-4">
    <svelte:component this={WhyComponent[$installMethod]} />
  </div>
{/if}
