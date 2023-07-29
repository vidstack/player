<script lang="ts">
  import ArrowRightIcon from '~icons/lucide/arrow-right';
  import clsx from 'clsx';
  import { navIcons } from '../../nav-icons';
  import type { NavMenuItem } from '../../navigation';

  export let items: NavMenuItem[];
</script>

<!-- Feature Grid -->
<div class={clsx('grid grid-cols-1 gap-y-8 1200:grid-cols-2 1200:gap-x-6 1200:gap-y-12')}>
  {#each items as item}
    <a
      class="flex flex-col items-start first:pt-5 last:pb-8 1200:first:pt-0 1200:last:pb-0 group"
      href={item.href}
    >
      <div class="flex items-center font-medium">
        {#if item.icon && navIcons[item.icon]}
          <div
            class={clsx(
              'rounded-full bg-brand/20 flex items-center justify-center w-6 h-6 mr-2 border border-brand',
            )}
          >
            <svelte:component this={navIcons[item.icon]} class="w-3 h-3 text-brand" />
          </div>
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
