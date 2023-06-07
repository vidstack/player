<script context="module" lang="ts">
  import { writable } from 'svelte/store';

  export type StylingPreference = 'none' | 'defaults' | 'headless' | 'community-skin' | 'plyr-skin';

  export const styling = writable<StylingPreference>(getStyleFromQuery());

  function getStyleFromQuery() {
    if (!env.browser) return 'community-skin';
    const searchParams = new URLSearchParams(location.search);
    return (searchParams.get('styling') as StylingPreference) ?? 'community-skin';
  }
</script>

<script lang="ts">
  import { useRouter } from '@vessel-js/svelte';

  import Select from '$lib/components/base/Select.svelte';
  import { env } from '$lib/env';
  import { kebabToTitleCase } from '$lib/utils/string';

  import CommunitySkin from '../partials/styling/community-skin.md';
  import Defaults from '../partials/styling/defaults.md';
  import Headless from '../partials/styling/headless.md';
  import None from '../partials/styling/none.md';
  import PlyrSkin from '../partials/styling/plyr-skin.md';

  const router = useRouter();

  let options = ['None', 'Headless', 'Defaults', 'Community Skin', 'Plyr Skin'];

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
    'community-skin': CommunitySkin,
    'plyr-skin': PlyrSkin,
  };
</script>

<Select title="Select Styling Preference" {options} bind:value on:change={onChange} />

<svelte:component this={Component[$styling]} />
