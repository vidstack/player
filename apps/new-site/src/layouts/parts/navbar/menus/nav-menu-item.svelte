<script lang="ts">
  import clsx from 'clsx';
  import type { Action } from 'svelte/action';
  import { isDarkColorScheme } from '../../../../stores/color-scheme';
  import { navIcons } from '../nav-icons';
  import type { NavMenuItem } from '../navigation';

  export let item: NavMenuItem;
  export let invert = false;
  export let action: Action = () => void 0;

  $: darkTheme = ($isDarkColorScheme && !invert) || (!$isDarkColorScheme && invert);
</script>

<svelte:element
  this={item.href ? 'a' : 'div'}
  href={item.href}
  {...$$restProps}
  class={clsx('flex flex-col px-6 py-5 focus-visible:ring-0', $$restProps.class)}
  use:action
  aria-label={item.title}
>
  <div class="flex items-center">
    <span class="font-medium text-base flex items-center">
      {#if item.icon && navIcons[item.icon]}
        <svelte:component this={navIcons[item.icon]} class="mr-1.5" width={18} height={18} />
      {/if}

      {item.title}
    </span>

    {#if item.badge}
      <div
        class={clsx(
          'px-1 rounded-sm text-xs py-px border ml-2',
          item.badge === '1.0'
            ? clsx(
                'bg-blue-400/20',
                darkTheme ? 'text-blue-400 border-blue-400' : 'text-blue-600 border-blue-600',
              )
            : item.badge === 'Beta'
            ? clsx(
                'bg-green-400/20',
                darkTheme ? 'text-green-400 border-green-400' : 'text-green-600 border-green-600',
              )
            : item.badge === 'Planned'
            ? clsx(
                'bg-orange-400/20',
                darkTheme
                  ? 'text-orange-400 border-orange-400'
                  : 'text-orange-600 border-orange-600',
              )
            : clsx(
                'bg-indigo-400/20',
                darkTheme
                  ? 'text-indigo-400 border-indigo-400'
                  : 'text-indigo-600 border-indigo-600',
              ),
        )}
      >
        {item.badge}
      </div>
    {/if}
  </div>

  {#if item.description}
    <p class="text-sm mt-2 text-soft max-w-[260px]">
      {item.description}
    </p>
  {/if}
</svelte:element>
