<script lang="ts">
  import ArrowRightIcon from '~icons/lucide/arrow-right';
  import clsx from 'clsx';
  import { navIcons } from '../../nav-icons';
  import type { NavMenuItem } from '../../navigation';

  export let items: NavMenuItem[];
</script>

<!-- Feature Grid -->
<div class={clsx('grid grid-cols-1 gap-y-8 1200:grid-cols-2 1200:gap-x-6 1200:gap-y-16')}>
  {#each items as item}
    <section class="flex flex-col items-start first:pt-5 last:pb-8 1200:first:pt-0 1200:last:pb-0">
      <h2 class="font-medium flex items-center">
        {#if item.icon && navIcons[item.icon]}
          <svelte:component this={navIcons[item.icon]} class="mr-1.5" width={18} height={18} />
        {/if}

        {item.title}
      </h2>

      <p class="text-sm text-soft mt-2">{item.description}</p>

      {#if item.href}
        <a class="flex items-center text-brand group text-sm mt-2 font-medium" href={item.href}>
          Learn More
          <ArrowRightIcon
            class="-translate-x-2 ml-auto opacity-0 group-hocus:opacity-100 group-hocus:translate-x-px transition-all"
            width={14}
            height={14}
          />
        </a>
      {/if}
    </section>
  {/each}
</div>
