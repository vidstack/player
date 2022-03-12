<script lang="ts">
  import MenuUnfoldIcon from '~icons/ri/menu-unfold-fill';
  import RightArrowIcon from '~icons/ri/arrow-right-s-line';

  import clsx from 'clsx';
  import Navbar from './navbar/Navbar.svelte';
  import Sidebar, { getSidebarContext } from './sidebar/Sidebar.svelte';

  import { ariaBool, hideDocumentScrollbar } from '@vidstack/foundation';
  import { type CloseDialogCallback, dialogManager } from '$actions/dialogManager';
  import Button from '$components/base/Button.svelte';

  let isSidebarOpen = false;
  let isNavPopoverOpen = false;
  let closeSidebar: CloseDialogCallback;

  const { activeCategory, activeItem, nextItem, previousItem } = getSidebarContext();
</script>

<div
  class={clsx(
    'border-b border-gray-divider top-0 z-30 w-full flex-none fixed',
    isNavPopoverOpen
      ? 'bg-gray-100 dark:bg-gray-800'
      : 'bg-gray-200/95 dark:bg-gray-800/60 backdrop-blur supports-backdrop-blur:bg-white/60',
  )}
>
  <Navbar
    on:open-popover={() => {
      isNavPopoverOpen = true;
    }}
    on:close-popover={() => {
      isNavPopoverOpen = false;
    }}
  >
    <div
      class="mt-4 flex w-full items-center border-t border-gray-divider pt-4 992:hidden"
      slot="bottom"
    >
      <button
        id="main-sidebar-button"
        type="button"
        class="-ml-3 inline-flex justify-center rounded-md px-4 py-2 text-sm font-medium text-gray-soft hover:text-gray-inverse"
        aria-controls="main-sidebar"
        aria-expanded={ariaBool(isSidebarOpen)}
        aria-haspopup="true"
        use:dialogManager={{
          closeOnSelectSelectors: ['a'],
          onOpen: () => {
            isSidebarOpen = true;
            hideDocumentScrollbar(true);
          },
          onClose: () => {
            isSidebarOpen = false;
            hideDocumentScrollbar(false);
          },
          close: (cb) => {
            closeSidebar = cb;
          },
        }}
      >
        <span class="sr-only">Open main sidebar</span>
        <MenuUnfoldIcon width="28" height="28" />
      </button>

      <ol class="text-md mt-px ml-1 flex items-center whitespace-nowrap leading-6 text-gray-soft">
        <li class="flex items-center">
          {$activeCategory}
          <RightArrowIcon class="mx-1" width="16" height="16" />
        </li>
        <li class="truncate font-semibold text-slate-900 dark:text-slate-200">
          {$activeItem?.title}
        </li>
      </ol>
    </div>
  </Navbar>
</div>

<main class="max-w-8xl z-20 mx-auto 1200:pr-10">
  <Sidebar open={isSidebarOpen} on:close={(e) => closeSidebar(e.detail)} />

  <div class="px-4 576:px-6 768:px-8 992:pl-[21rem]">
    <div class="relative mx-auto mt-[13rem] w-full max-w-3xl 992:mt-32">
      <slot />

      {#if $previousItem || $nextItem}
        <hr class="mt-20 border-gray-divider" />
      {/if}

      <div class="flex items-center pt-12 pb-20 text-lg font-semibold text-gray-300 992:text-xl">
        {#if $previousItem}
          <div class="mb-4 flex flex-col items-start">
            <span class="ml-3 mb-4 inline-block text-gray-inverse">Previous</span>
            <Button arrow="left" href={$previousItem.slug} class="hover:text-gray-inverse">
              {$previousItem.title}
            </Button>
          </div>
        {/if}

        {#if $nextItem}
          <div class="ml-auto mb-4 flex flex-col items-end">
            <span class="mr-3 mb-4 inline-block text-gray-inverse">Next</span>
            <Button arrow="right" href={$nextItem.slug} class="hover:text-gray-inverse">
              {$nextItem.title}
            </Button>
          </div>
        {/if}
      </div>
    </div>
  </div>
</main>
