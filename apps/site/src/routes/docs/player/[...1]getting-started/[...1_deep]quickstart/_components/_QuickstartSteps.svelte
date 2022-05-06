<script lang="ts">
  import { goto } from '$app/navigation';
  import { navigating, page } from '$app/stores';
  import { Select, Steps, Step } from '@svelteness/kit-docs';

  import InstallNpm from './_InstallNPM.md';
  import InstallCdn from './_InstallCDN.md';
  import LibHtml from './_LibHTML.md';
  import LibReact from './_LibReact.md';
  import ProviderHls from './_ProviderHls.md';

  import {
    installMethod as _installMethod,
    type InstallMethodType,
  } from '$lib/stores/installMethod';
  import { lib as _lib, type LibType } from '$lib/stores/lib';

  const basePath = '/docs/player/getting-started/quickstart';

  export let installMethod;
  export let libType;
  export let providerType;
  export let installOptions;
  export let libOptions;
  export let providerOptions;

  let isLibDisabled = installMethod === 'CDN';

  $: if ($navigating?.to.pathname === basePath) {
    installMethod = 'NPM';
    libType = 'HTML';
    providerType = 'Video';
  }

  $: if (installMethod === 'CDN') {
    libType = 'HTML';
    isLibDisabled = true;
  } else {
    isLibDisabled = false;
  }

  function onOptionsChange() {
    const isCDNInstallMethod = installMethod === 'CDN';
    const isReact = libType === 'React';

    let installPath = isCDNInstallMethod ? '/cdn' : '';
    let libPath = isReact && !isCDNInstallMethod ? '/react' : '';
    let providerPath = `/${providerType}`;
    let slug = `${basePath}${installPath}${libPath}${providerPath}`.toLowerCase();

    if ($page.url.pathname !== slug) {
      goto(slug, { noscroll: true });
    }

    $_installMethod = installMethod.toLowerCase() as InstallMethodType;
    $_lib = libType.toLowerCase() as LibType;
  }
</script>

<Steps>
  <Step orientation="vertical">
    <h3 slot="title">Select Installation Method</h3>

    <Select
      title="Select Installation Method"
      options={installOptions}
      bind:value={installMethod}
      on:change={onOptionsChange}
    />

    {#if installMethod === 'NPM'}
      <InstallNpm />
    {:else}
      <InstallCdn />
    {/if}
  </Step>

  {#if !isLibDisabled}
    <Step orientation="vertical">
      <h3 slot="title">Select Library</h3>

      <Select
        title="Select Library"
        options={libOptions}
        bind:value={libType}
        on:change={onOptionsChange}
      />

      {#if libType === 'HTML'}
        <LibHtml />
      {:else}
        <LibReact />
      {/if}
    </Step>
  {/if}

  <Step orientation="vertical">
    <h3 slot="title">Select Media Provider</h3>

    <Select
      title="Select Media Provider"
      options={providerOptions}
      bind:value={providerType}
      on:change={onOptionsChange}
    />

    {#if providerType === 'Audio'}
      <p>
        Embed sound content into documents via the native <code>&lt;audio&gt;</code> element.
      </p>
    {:else if providerType === 'Video'}
      <p>
        Embed video content into documents via the native <code>&lt;video&gt;</code> element.
      </p>
    {:else if providerType === 'HLS'}
      <ProviderHls />
    {/if}
  </Step>

  <slot />
</Steps>
