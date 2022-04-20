<script context="module" lang="ts">
  import type { Load } from '@sveltejs/kit';

  export const load: Load = async ({ fetch }) => {
    const res = await fetch(`/docs/player/getting-started/releases/all.json`);
    const { slugs } = await res.json();

    return {
      props: {
        slugs,
      },
    };
  };
</script>

<script lang="ts">
  import { Select } from '@svelteness/kit-docs';
  import { goto } from '$app/navigation';
  import { lowercaseFirstLetter, uppercaseFirstLetter } from '@vidstack/foundation';
  import { page } from '$app/stores';

  import Help from './_components/_Help.md';

  export let slugs;

  const options = slugs.map(slugToOption);

  let value = options.find((option) => $page.url.pathname.includes(optionToSlug(option)));

  function slugToOption(slug: string) {
    return slug.split('-').map(uppercaseFirstLetter).join(' ');
  }

  function optionToSlug(option: string) {
    return option.split(' ').map(lowercaseFirstLetter).join('-');
  }

  function onChange() {
    goto(`/docs/player/getting-started/releases/${optionToSlug(value)}/`);
  }
</script>

<h1>Release ({value})</h1>

<div class="my-10">
  <Select title="Release" bind:value on:change={onChange}>
    {#each options as option}
      <option>{option}</option>
    {/each}
  </Select>
</div>

<slot />

<Help />
