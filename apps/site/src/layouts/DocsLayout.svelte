<script lang="ts">
  import '$src/styles/docs.css';
  import '@docsearch/css';
  import '$src/styles/docsearch.css';

  import clsx from 'clsx';
  import { type Readable, writable } from 'svelte/store';
  import { markdown, route } from '@vitebook/svelte';
  import { ariaBool, hideDocumentScrollbar } from '@vidstack/foundation';

  import Button from '$src/components/base/Button.svelte';
  import MetaTags from '$src/components/docs/MetaTags.svelte';
  import { type CloseDialogCallback, dialogManager } from '$src/actions/dialog-manager';

  import MenuUnfoldIcon from '~icons/ri/menu-unfold-fill';
  import RightArrowIcon from '~icons/ri/arrow-right-s-line';

  import MainLayout from './MainLayout.svelte';
  import Sidebar from './sidebar/Sidebar.svelte';
  import OnThisPage from './toc/OnThisPage.svelte';
  import { createSidebarContext, setSidebarContext, type SidebarLinks } from './sidebar/context';
  import { setOnThisPageContext, type OnThisPageConfig } from './toc/context';

  export let sidebar: Readable<SidebarLinks>;

  let search = true;
  let isSidebarOpen = false;
  let closeSidebar: CloseDialogCallback;

  const sidebarContext = createSidebarContext(sidebar);
  setSidebarContext(sidebarContext);
  const { activeCategory, activeLink, nextLink, previousLink } = sidebarContext;

  let canUpdateHash = false;
  setOnThisPageContext(
    writable<OnThisPageConfig>({
      canUpdateHash: (hash) => {
        const isApiHash = $route.url.hash.includes('--');

        // Skip first update to prevent messing with initial api hash.
        if (isApiHash && !canUpdateHash) {
          canUpdateHash = true;
          return false;
        }

        const currentHash = isApiHash ? $route.url.hash.split('--')[0] : $route.url.hash;
        return currentHash !== hash;
      },
      cleanHash: (hash) => (hash.includes('--') ? hash.split('--')[0] : hash),
    }),
  );
</script>

<div class="docs contents">
  <MainLayout>
    <MetaTags />

    <svelte:fragment slot="search">
      <slot name="search" />
    </svelte:fragment>

    <svelte:fragment slot="navbar-bottom">
      <div class="border-gray-outline border-t flex mt-3 w-full pt-4 items-center 992:hidden">
        <button
          id="main-sidebar-button"
          type="button"
          class="rounded-md font-medium text-gray-soft text-sm p-2 inline-flex justify-center hover:text-gray-inverse"
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
        <ol
          class="flex mt-px text-md text-gray-soft ml-2.5 leading-6 items-center whitespace-nowrap"
        >
          <li class="flex items-center">
            {$activeCategory}
            <RightArrowIcon class="mx-1" width="16" height="16" />
          </li>
          <li class="font-semibold text-slate-900 truncate dark:text-slate-200">
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
            'self-start fixed top-0 left-0 transform bg-gray-body z-50 border-gray-outline border-r scrollbar scroll-contain',
            '-translate-x-full transform transition-transform duration-200 ease-out will-change-transform',
            'max-h-screen min-h-screen min-w-[var(--sidebar-min-width)] max-w-[var(--sidebar-max-width)]',
            '992:translate-x-0 922:block 992:sticky 992:z-0 overflow-y-auto p-[var(--sidebar-padding)]',
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

    <div class="max-w-[var(--article-max-width)] z-10 markdown prose dark:prose-invert">
      <p class="font-semibold text-brand mb-3.5 text-[15px] leading-6">
        {$activeCategory}
      </p>

      <slot />
    </div>

    {#if $previousLink || $nextLink}
      <hr class="border-gray-divider mt-20" />

      <div class="flex font-semibold text-lg pt-12 pb-20 text-gray-300 items-center 992:text-xl">
        {#if $previousLink}
          <div class="flex flex-col mb-4 items-start">
            <span class="text-gray-inverse mb-4 ml-3 inline-block">Previous</span>
            <Button arrow="left" href={$previousLink.slug} class="hover:text-gray-inverse">
              {$previousLink.title}
            </Button>
          </div>
        {/if}

        {#if $nextLink}
          <div class="flex flex-col ml-auto mb-4 items-end">
            <span class="text-gray-inverse mr-3 mb-4 inline-block">Next</span>
            <Button arrow="right" href={$nextLink.slug} class="hover:text-gray-inverse">
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
          'pt-8 pb-8 hidden overflow-auto min-w-[160px] sticky right-4 pr-4 1440:right-6 1440:pr-2 1280:block pl-0.5',
          'top-[var(--navbar-height)] max-h-[calc(100vh-var(--navbar-height))]',
        )}
      />
    </svelte:fragment>
  </MainLayout>
</div>
