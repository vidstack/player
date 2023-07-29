<script lang="ts">
  import ExternalLinkIcon from '~astro-icons/lucide/external-link';
  import type { NavLink } from '../navigation';

  export let item: NavLink;
</script>

<!-- Link -->
<a
  class="flex items-center text-base hover:underline p-2 rounded-md"
  href={item.href}
  {...$$restProps}
>
  {item.title}
  {#if !item.href.startsWith('/')}
    <ExternalLinkIcon class="ml-1" width={14} height={14} />
  {/if}
</a>
