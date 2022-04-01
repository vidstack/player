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
    contain
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

<div class="z-20 mx-auto pt-40 992:pt-20 w-full max-w-[1440px] docs-layout flex flex-row">
  <Sidebar
    class={({ open }) =>
      clsx(
        'self-start fixed top-0 left-0 transform bg-gray-body z-50 border-gray-divider border-r w-full max-w-[90vw] max-h-screen pb-8 px-5',
        '-translate-x-full transform transition-transform duration-200 ease-out will-change-transform',
        '992:translate-x-0 922:block 992:sticky 992:top-20 992:z-0 992:max-h-[calc(100vh-5rem)] 992:w-72 992:min-w-[17rem] overflow-y-auto 1460:pl-0.5',
        open && 'translate-x-0',
      )}
    open={isSidebarOpen}
    on:close={(e) => closeSidebar(e.detail)}
  />

  <main class="pt-10 min-h-[80vh] w-full max-w-[85ch] overflow-x-hidden px-8 992:px-16">
    <slot />

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
  </main>

  <div class="flex-1" />

  <OnThisPage
    class="pt-10 pb-8 hidden overflow-auto max-h-[calc(100vh-5rem)] min-w-[160px] sticky top-20 right-4 1440:right-6 1440:pr-4 1280:block"
  />
</div>
