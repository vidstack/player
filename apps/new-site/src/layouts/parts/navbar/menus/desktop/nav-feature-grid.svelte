<script lang="ts">
  import ArrowRightIcon from '~icons/lucide/arrow-right';
  import clsx from 'clsx';
  import { navIcons } from '../../nav-icons';
  import type { NavMenuItem } from '../../navigation';

  export let items: NavMenuItem[];
</script>

<!-- Feature Grid -->
<div class={clsx('grid grid-cols-1 gap-y-8 1200:grid-cols-2 1200:gap-x-6 1200:gap-y-10')}>
  {#each items as item}
    <a
      class="flex flex-col items-start first:pt-5 last:pb-8 1200:first:pt-0 1200:last:pb-0 group rounded-md p-1"
      href={item.href}
    >
      <div class="flex items-center font-medium">
        {#if item.icon && navIcons[item.icon]}
          <svelte:component this={navIcons[item.icon]} class="mr-1.5" />
        {/if}

        <span class="text-[15px]">{item.title}</span>

        <ArrowRightIcon
          class="-translate-x-2 ml-1 opacity-0 group-hocus:opacity-100 group-hocus:translate-x-px transition-all w-4 h-4"
        />
      </div>

      <p class="text-sm text-soft mt-2.5">{item.description}</p>
    </a>
  {/each}
</div>
