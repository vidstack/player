<script lang="ts">
  import type { createDropdownMenu } from '@melt-ui/svelte';
  import ArrowRightIcon from '~icons/lucide/arrow-right';
  import clsx from 'clsx';
  import { navIcons } from '../nav-icons';
  import type { NavSubmenu } from '../navigation';
  import NavMenuItem from './nav-menu-item.svelte';

  export let createSubMenu: ReturnType<typeof createDropdownMenu>['createSubMenu'];

  export let item: NavSubmenu;

  const { subTrigger, subMenu, subOpen, subArrow } = createSubMenu({
    arrowSize: 8,
    loop: true,
  });
</script>

<!-- Submenu Trigger -->
<NavMenuItem
  class={clsx('cursor-pointer', $subOpen && 'bg-inverse')}
  {item}
  {...$subTrigger}
  action={subTrigger}
  invert={$subOpen}
/>

<!-- Submenu -->
<div
  class={clsx(
    'min-w-[300px] 1200:min-w-[600px] pl-8 pr-4 1200:pl-10 1200:pr-4 border border-border',
    'rounded-r-md bg-body h-full outline-none',
    'flex 1200:items-center 1200:justify-center -translate-x-3 overflow-y-auto 1200:overflow-hidden',
  )}
  {...$subMenu}
  use:subMenu
>
  {#if item.featured}
    <!-- Featured Items -->
    <div
      class={clsx(
        'grid grid-cols-1 gap-y-8 1200:grid-cols-2 1200:gap-x-6 1200:gap-y-12',
        !$subOpen
          ? 'opacity-0 pointer-events-none'
          : 'slide-in-from-left-4 fade-in animate-in duration-300',
      )}
    >
      {#each item.items as feature}
        <section class="flex flex-col first:pt-5 last:pb-8 1200:first:pt-0 1200:last:pb-0">
          <h2 class="font-medium flex items-center">
            {#if feature.icon && navIcons[feature.icon]}
              <svelte:component
                this={navIcons[feature.icon]}
                class="mr-1.5"
                width={18}
                height={18}
              />
            {/if}

            {feature.title}
          </h2>

          <p class="text-sm text-soft mt-2">{feature.description}</p>

          {#if feature.href}
            <a
              class="flex items-center text-brand group text-sm mt-2 font-medium"
              href={feature.href}
            >
              Learn More
              <ArrowRightIcon
                class="-translate-x-2 opacity-0 group-hover:opacity-100 group-hover:translate-x-px transition-all"
                width={14}
                height={14}
              />
            </a>
          {/if}
        </section>
      {/each}
    </div>
  {:else}
    <div class="flex flex-col">
      {#each item.items as menuItem}
        <NavMenuItem role="menuitem" item={menuItem} tabindex={-1} />
      {/each}
    </div>
  {/if}

  <div {...$subArrow} use:subArrow></div>
</div>
