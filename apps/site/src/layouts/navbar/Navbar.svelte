<script lang="ts">
  import clsx from 'clsx';
  import { createEventDispatcher } from 'svelte';
  import { uppercaseFirstLetter } from '@vidstack/foundation';

  import MenuIcon from '~icons/ri/menu-5-line';

  import { colorScheme } from '$src/stores/color-scheme';
  import Popover from '$src/components/base/Popover.svelte';
  import ColorSchemeMenu from '$src/components/base/ColorSchemeMenu.svelte';

  import NavLinkItem from './NavLink.svelte';
  import { getNavbarContext } from './context';
  import Select from '$src/components/base/Select.svelte';

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
  class="flex flex-col h-[var(--navbar-height)] mx-auto max-w-[var(--navbar-max-width)] p-[var(--navbar-padding)] w-full items-center justify-center"
>
  <div class={clsx('flex w-full items-center')}>
    <slot name="left" />

    <div class="flex-1" />

    <div class="flex -mr-2 items-center 992:hidden">
      {#if search}
        <slot name="search" />
      {/if}

      <Popover overlay on:open={onOpenPopover} on:close={onClosePopover}>
        <svelte:fragment slot="button">
          <MenuIcon class="mr-2" width="30" height="30" />
          <span class="sr-only">Open Main Menu</span>
        </svelte:fragment>

        <slot name="popover-top" />

        <section class="flex flex-col items-start">
          <h1 class="text-gray-soft text-lg mb-3">Links</h1>
          <nav>
            <ul class="-ml-0.5">
              {#each $links as navLink (navLink.title)}
                <NavLinkItem {...navLink} />
              {/each}
            </ul>
          </nav>
        </section>

        <slot name="popover-middle" />

        <hr class="border-t mt-8 h-2 mb-6 w-full border-gray-outline-strong" />

        <section class="flex flex-col items-start">
          <h1 class="text-gray-soft text-lg mb-3">Options</h1>
          <div class="flex flex-col space-y-6">
            <slot name="popover-options" />
            <div class="flex items-center">
              <span class="text-lg 992:text-base">Theme</span>
              <div class="ml-2">
                <Select
                  title="Color Scheme"
                  value={uppercaseFirstLetter($colorScheme)}
                  on:change={(e) => {
                    $colorScheme = e.target.value.toLowerCase();
                  }}
                  --select-border-color="var(--color-gray-outline-strong)"
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

    <div class="hidden 992:flex 992:items-center">
      <nav>
        <ul class="flex space-x-8 items-center">
          {#each $links as navLink (navLink.title)}
            <NavLinkItem {...navLink} />
          {/each}
        </ul>
      </nav>

      <slot name="right" />

      <div class="border-gray-divider border-l-[1.5px] h-7 mr-2 ml-5 w-2" />

      <div class="hidden items-center 992:flex">
        <slot name="right-alt" />
        <ColorSchemeMenu />
      </div>
    </div>
  </div>

  <slot name="bottom" />
</div>
