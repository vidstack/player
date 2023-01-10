<script lang="ts">
  import { route } from '@vitebook/svelte';
  import clsx from 'clsx';

  import { isNull } from '$src/utils/unit';

  export let title: string;
  export let slug: string;
  export let match: RegExp | null = null;

  $: isActive = match?.test($route.url.pathname);
</script>

<li class="992:mt-0 mt-4 first:mt-0">
  <a
    class={clsx(
      '992:text-base p-1 text-lg',
      isActive ? 'text-inverse' : 'text-soft hover:text-inverse',
    )}
    href={slug}
    target={isNull(match) ? '_blank' : null}
    data-prefetch
  >
    {title}
  </a>
</li>
