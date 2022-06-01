<script lang="ts">
  import clsx from 'clsx';
  import { route } from '@vitebook/svelte';
  import { isNull } from '@vidstack/foundation';

  export let title: string;
  export let slug: string;
  export let match: RegExp | null = null;

  $: isActive = match?.test($route.url.pathname);
</script>

<li class="mt-4 992:mt-0 first:mt-0">
  <a
    class={clsx(
      'p-1 border-brand hover:border-b-2 text-lg 992:text-base',
      isActive ? 'text-gray-inverse' : 'text-gray-soft hover:text-gray-inverse',
    )}
    href={slug}
    target={isNull(match) ? '_blank' : null}
    data-prefetch
  >
    {title}
  </a>
</li>
