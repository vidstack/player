<script context="module" lang="ts">
  import { writable } from 'svelte/store';

  export type StylingPreference = 'none' | 'defaults' | 'headless' | 'default-skin' | 'plyr-skin';

  export const styling = writable<StylingPreference>(getStyleFromQuery());

  function getStyleFromQuery() {
    if (!env.browser) return 'default-skin';
    const searchParams = new URLSearchParams(location.search);
    return (searchParams.get('styling') as StylingPreference) ?? 'default-skin';
  }
</script>

<script lang="ts">
  import { useRouter } from '@vessel-js/svelte';

  import Select from '$lib/components/base/Select.svelte';
  import { env } from '$lib/env';
  import { kebabToTitleCase } from '$lib/utils/string';

  import DefaultSkin from '../partials/styling/default-skin.md';
  import Defaults from '../partials/styling/defaults.md';
  import Headless from '../partials/styling/headless.md';
  import None from '../partials/styling/none.md';
  import PlyrSkin from '../partials/styling/plyr-skin.md';

  const router = useRouter();

  let options = ['None', 'Headless', 'Defaults', 'Default Skin', 'Plyr Skin'];

  $: value = kebabToTitleCase($styling);
  function onChange() {
    $styling = value.replace(/\s/g, '-').toLowerCase() as StylingPreference;
    const url = new URL(location.href);
    url.searchParams.set('styling', $styling);
    router.go(url, { replace: true, keepfocus: true, scroll: () => false });
  }

  const Component = {
    none: None,
    headless: Headless,
    defaults: Defaults,
    'default-skin': DefaultSkin,
    'plyr-skin': PlyrSkin,
  };
</script>

<Select title="Select Styling Preference" {options} bind:value on:change={onChange} />

<svelte:component this={Component[$styling]} />
