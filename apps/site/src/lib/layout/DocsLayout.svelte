<script lang="ts">
  import MenuUnfoldIcon from '~icons/ri/menu-unfold-fill';
  import RightArrowIcon from '~icons/ri/arrow-right-s-line';

  import clsx from 'clsx';
  import Navbar from './Navbar.svelte';
  import Sidebar, { getSidebarContext } from './Sidebar.svelte';

  import { ariaBool, hideDocumentScrollbar } from '@vidstack/foundation';
  import { type CloseDialogCallback, dialogManager } from '$lib/actions/dialogManager';
  import Button from '$lib/components/base/Button.svelte';
  import OnThisPage from './OnThisPage.svelte';
  import { hasMarkdownHeaders } from '$lib/stores/markdown';

  let isSidebarOpen = false;
  let isNavPopoverOpen = false;
  let closeSidebar: CloseDialogCallback;

  const { activeCategory, activeItem, nextItem, previousItem } = getSidebarContext();
</script>

<div
  class={clsx(
    'border-gray-divider fixed top-0 z-30 w-full flex-none border-b',
    isNavPopoverOpen
      ? 'bg-gray-100 dark:bg-gray-800'
      : 'supports-backdrop-blur:bg-white/60 bg-gray-200/95 backdrop-blur dark:bg-gray-800/60',
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
      class="border-gray-divider 992:hidden mt-4 flex w-full items-center border-t pt-4"
      slot="bottom"
    >
      <button
        id="main-sidebar-button"
        type="button"
        class="text-gray-soft hover:text-gray-inverse -ml-3 inline-flex justify-center rounded-md px-4 py-2 text-sm font-medium"
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

      <ol class="text-md text-gray-soft mt-px ml-1 flex items-center whitespace-nowrap leading-6">
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

<main class="max-w-8xl 1200:pr-10 z-20 mx-auto">
  <Sidebar open={isSidebarOpen} on:close={(e) => closeSidebar(e.detail)} />

  <div
    class={clsx('576:px-6 768:px-8 992:pl-[21rem] px-4', $hasMarkdownHeaders && '1200:mr-[18rem]')}
  >
    <div class="992:mt-32 relative mx-auto mt-[13rem] w-full max-w-3xl">
      <slot />

      <OnThisPage />

      {#if $previousItem || $nextItem}
        <hr class="border-gray-divider mt-20" />
      {/if}

      <div class="992:text-xl flex items-center pt-12 pb-20 text-lg font-semibold text-gray-300">
        {#if $previousItem}
          <div class="mb-4 flex flex-col items-start">
            <span class="text-gray-inverse ml-3 mb-4 inline-block">Previous</span>
            <Button arrow="left" href={$previousItem.slug} class="hover:text-gray-inverse">
              {$previousItem.title}
            </Button>
          </div>
        {/if}

        {#if $nextItem}
          <div class="ml-auto mb-4 flex flex-col items-end">
            <span class="text-gray-inverse mr-3 mb-4 inline-block">Next</span>
            <Button arrow="right" href={$nextItem.slug} class="hover:text-gray-inverse">
              {$nextItem.title}
            </Button>
          </div>
        {/if}
      </div>
    </div>
  </div>
</main>
