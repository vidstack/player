<script lang="ts">
  import '@docsearch/css';
  import '$lib/styles/docsearch.css';

  import { markdown, route } from '@vessel-js/svelte';
  import clsx from 'clsx';
  import { writable, type Readable } from 'svelte/store';
  import RightArrowIcon from '~icons/ri/arrow-right-s-line';
  import MenuUnfoldIcon from '~icons/ri/menu-unfold-fill';

  import { dialogManager, type CloseDialogCallback } from '$lib/actions/dialog-manager';
  import Button from '$lib/components/base/Button.svelte';
  import DocsMetaTags from '$lib/components/docs/DocsMetaTags.svelte';
  import { ariaBool } from '$lib/utils/aria';
  import { hideDocumentScrollbar } from '$lib/utils/scroll';

  import MainLayout from './MainLayout.svelte';
  import { createSidebarContext, setSidebarContext, type SidebarLinks } from './sidebar/context';
  import Sidebar from './sidebar/Sidebar.svelte';
  import { setOnThisPageContext, type OnThisPageConfig } from './toc/context';
  import OnThisPage from './toc/OnThisPage.svelte';

  export let sidebar: Readable<SidebarLinks>;

  let search = true;
  let isSidebarOpen = false;
  let closeSidebar: CloseDialogCallback;

  const sidebarContext = createSidebarContext(sidebar);
  setSidebarContext(sidebarContext);
  const { activeCategory, activeLink, nextLink, previousLink } = sidebarContext;

  let canUpdateHash = false;
  setOnThisPageContext({
    override: writable(null),
    config: writable<OnThisPageConfig>({
      canUpdateHash: (hash) => {
        const isApiHash = $route.matchedURL.hash.includes('--');

        // Skip first update to prevent messing with initial api hash.
        if (isApiHash && !canUpdateHash) {
          canUpdateHash = true;
          return false;
        }

        const currentHash = isApiHash
          ? $route.matchedURL.hash.split('--')[0]
          : $route.matchedURL.hash;
        return currentHash !== hash;
      },
      cleanHash: (hash) => (hash.includes('--') ? hash.split('--')[0] : hash),
    }),
  });
</script>

<div class="docs contents">
  <MainLayout --main-direction="row">
    <DocsMetaTags />

    <svelte:fragment slot="search">
      <slot name="search" />
    </svelte:fragment>

    <svelte:fragment slot="navbar-bottom">
      <div class="border-border 992:hidden mt-3 flex w-full items-center border-t pt-4">
        <button
          id="main-sidebar-button"
          type="button"
          class="text-soft hover:text-inverse inline-flex justify-center rounded-md p-2 text-sm font-medium"
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
          <span class="sr-only">Open Sidebar</span>
          <MenuUnfoldIcon width="28" height="28" />
        </button>
        <ol class="text-md text-soft mt-px ml-2.5 flex items-center whitespace-nowrap leading-6">
          <li class="flex items-center">
            {$activeCategory}
            <RightArrowIcon class="mx-1" width="16" height="16" />
          </li>
          <li class="truncate font-semibold text-slate-900 dark:text-slate-200">
            {$activeLink?.title || $markdown?.title}
          </li>
        </ol>
      </div>
    </svelte:fragment>

    <svelte:fragment slot="before-main">
      <Sidebar
        {search}
        class={({ open }) =>
          clsx(
            'bg-body scrollbar scroll-contain-mobile fixed top-0 left-0 z-[9999999] transform self-start',
            '-translate-x-full transform transition-transform duration-200 ease-out will-change-transform',
            'max-h-screen min-h-screen min-w-[var(--sidebar-min-width)] max-w-[var(--sidebar-max-width)]',
            '992:translate-x-0 922:block 992:sticky 992:z-0 overflow-y-scroll p-[var(--sidebar-padding)]',
            '992:top-[var(--navbar-height)] 992:min-h-[calc(100vh-var(--navbar-height))] 992:max-h-[calc(100vh-var(--navbar-height))]',
            open && 'translate-x-0',
          )}
        open={isSidebarOpen}
        on:close={(e) => closeSidebar(e.detail)}
      >
        <svelte:fragment slot="search">
          <slot name="search" />
        </svelte:fragment>
      </Sidebar>
    </svelte:fragment>

    <div class="markdown prose dark:prose-invert z-10 max-w-[var(--article-max-width)]">
      <p class="text-brand mb-2.5 text-[15px] font-semibold leading-6">
        {$activeCategory}
      </p>

      <slot />
    </div>

    {#if $previousLink || $nextLink}
      <hr class="border-border mt-14" />

      <div class="992:text-xl flex items-center pt-8 pb-20 text-lg font-semibold text-soft">
        {#if $previousLink}
          <div class="mb-4 flex flex-col items-start">
            <span class="text-inverse mb-4 inline-block">Previous</span>
            <Button arrow="left" href={$previousLink.slug} class="hover:text-inverse -ml-2">
              {$previousLink.title}
            </Button>
          </div>
        {/if}

        {#if $nextLink}
          <div class="ml-auto mb-4 flex flex-col items-end">
            <span class="text-inverse mb-2.5 inline-block">Next</span>
            <Button arrow="right" href={$nextLink.slug} class="-mr-3">
              {$nextLink.title}
            </Button>
          </div>
        {/if}
      </div>
    {/if}

    <svelte:fragment slot="after-main">
      <div class="992:flex-1" />

      <OnThisPage
        class={clsx(
          '1440:right-6 1440:pr-2 1280:block sticky right-4 hidden min-w-[160px] overflow-auto pt-8 pb-8 pr-4 pl-0.5',
          'top-[var(--navbar-height)] max-h-[calc(100vh-var(--navbar-height))]',
        )}
      />
    </svelte:fragment>
  </MainLayout>
</div>
