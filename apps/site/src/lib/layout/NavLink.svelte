<script lang="ts">
  import clsx from 'clsx';
  import { page } from '$app/stores';
  import { isNull } from '@vidstack/foundation';

  export let title: string;
  export let slug: string;
  export let match: RegExp | null = null;

  $: isActive = match?.test($page.url.pathname);
</script>

<li class="mt-4 first:mt-0">
  <a
    class={clsx(
      isActive
        ? 'border-b hover:border-b-2 border-brand text-gray-inverse'
        : 'text-gray-soft hover:text-gray-inverse',
    )}
    href={slug}
    target={isNull(match) ? '_blank' : null}
  >
    {title}
  </a>
</li>
