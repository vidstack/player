<script lang="ts">
  import clsx from 'clsx';

  import ExternalLinkIcon from '~astro-icons/lucide/external-link';

  import type { NavLink } from '../../../nav/nav-items';

  export let item: NavLink;
  export let pathname = '';

  const isExternal = !item.href.startsWith('/');
</script>

<!-- Link -->
<a
  class={clsx(
    'flex items-center text-base p-2 rounded-md',
    item.href === pathname
      ? 'text-brand font-medium underline'
      : 'text-soft hocus:text-inverse hocus:underline',
  )}
  href={item.href}
  target={isExternal ? '_blank' : null}
  rel={isExternal ? 'noreferrer' : null}
  {...$$restProps}
>
  {item.title}
  {#if isExternal}
    <ExternalLinkIcon class="ml-1" width={14} height={14} />
  {/if}
</a>
