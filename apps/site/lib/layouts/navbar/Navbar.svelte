<script lang="ts">
  import clsx from 'clsx';
  import { createEventDispatcher } from 'svelte';
  import MenuIcon from '~icons/ri/menu-5-line';

  import ColorSchemeMenu from '$lib/components/base/ColorSchemeMenu.svelte';
  import Popover from '$lib/components/base/Popover.svelte';
  import Select from '$lib/components/base/Select.svelte';
  import { colorScheme } from '$lib/stores/color-scheme';
  import { uppercaseFirstLetter } from '$lib/utils/string';

  import { getNavbarContext } from './context';
  import NavLinkItem from './NavLink.svelte';

  export let search = false;

  const { links } = getNavbarContext();

  const dispatch = createEventDispatcher();

  function onOpenPopover() {
    dispatch('open-popover');
  }

  function onClosePopover() {
    dispatch('close-popover');
  }
</script>

<div
  class="mx-auto flex h-[var(--navbar-height)] w-full max-w-[var(--navbar-max-width)] flex-col items-center justify-center p-[var(--navbar-padding)] z-40"
>
  <div class={clsx('flex w-full items-center')}>
    <slot name="left" />

    <div class="flex-1" />

    <div class="992:hidden -mr-2 flex items-center">
      {#if search}
        <slot name="search" />
      {/if}

      <Popover overlay on:open={onOpenPopover} on:close={onClosePopover}>
        <svelte:fragment slot="button">
          <MenuIcon class="mr-2" width="30" height="30" />
          <span class="sr-only">Open Main Menu</span>
        </svelte:fragment>

        <slot name="popover-top" />

        <section class="flex flex-col items-start" aria-label="Links">
          <nav>
            <ul class="-ml-0.5">
              {#each $links as navLink (navLink.title)}
                <NavLinkItem {...navLink} />
              {/each}
            </ul>
          </nav>
        </section>

        <slot name="popover-middle" />

        <section class="flex flex-col items-start mt-4" aria-label="Options">
          <div class="flex flex-col space-y-6">
            <slot name="popover-options" />
            <div class="flex items-center">
              <span class=" text-[15px] font-medium">Theme</span>
              <div class="ml-2">
                <Select
                  title="Color Scheme"
                  value={uppercaseFirstLetter($colorScheme)}
                  on:change={(e) => {
                    $colorScheme = e.target.value.toLowerCase();
                  }}
                >
                  <option>Light</option>
                  <option>Dark</option>
                  <option>System</option>
                </Select>
              </div>
            </div>
          </div>
        </section>

        <slot name="popover-bottom" />
      </Popover>
    </div>

    {#if search}
      <div class="flex-1 hidden 1200:inline-block" />
      <div class="hidden 992:inline-flex items-center 1200:flex-1">
        <div class="min-w-[320px] 1200:min-w-[380px]">
          <slot name="search" />
        </div>
      </div>
      <div class="hidden 992:inline-block flex-1" />
    {/if}

    <div class="992:flex 992:items-center hidden">
      <nav>
        <ul class="mr-6 flex items-center space-x-5">
          {#each $links as navLink (navLink.title)}
            <NavLinkItem {...navLink} />
          {/each}
        </ul>
      </nav>

      <slot name="right" />

      <div class="992:flex hidden items-center">
        <slot name="right-alt" />
        <ColorSchemeMenu />
      </div>
    </div>
  </div>

  <slot name="bottom" />
</div>
