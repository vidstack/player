<script lang="ts">
  import clsx from 'clsx';
  import NProgress from 'nprogress';
  import { onMount } from 'svelte';
  import { writable } from 'svelte/store';
  import { navigation } from '@vitebook/svelte';
  import { hideDocumentScrollbar } from '@vidstack/foundation';

  import { env } from '$src/env';
  import { isLargeScreen } from '$src/stores/screen';
  import { scrollDirection, scrollTop } from '$src/stores/scroll';
  import { addJSLibToPath, jsLib } from '$src/stores/js-lib';

  import vidstackLogo from '$src/img/brand/vidstack-logo.svg?raw';
  import vidstackSymbol from '$src/img/brand/vidstack-symbol.svg?raw';

  import Navbar from './navbar/Navbar.svelte';
  import SocialLink from '$src/components/social/SocialLink.svelte';
  import Button from '$src/components/base/Button.svelte';
  import { setNavbarContext, type NavLinks } from './navbar/context';

  export let isNavPopoverOpen = false;

  const navLinks = writable<NavLinks>([
    {
      title: 'Documentation',
      slug: addJSLibToPath(`/docs/player/`, $jsLib),
      match: /\/docs\/player/,
    },
  ]);

  setNavbarContext({ links: navLinks });

  $: collapseNavbar = $isLargeScreen ? false : $scrollTop > 60 && $scrollDirection === 'down';

  // https://github.com/rstacruz/nprogress#configuration
  NProgress.configure({ minimum: 0.16 });

  let navigatingTimeout;

  function showProgress() {
    window.clearTimeout(navigatingTimeout);
    navigatingTimeout = window.setTimeout(() => {
      if (!$navigation) return;
      NProgress.start();
    }, 500);
  }

  function hideProgress() {
    NProgress.done();
    window.clearTimeout(navigatingTimeout);
    hideDocumentScrollbar(false);

    // Fix to catch progress accidentally starting.
    window.setTimeout(() => {
      if (!$navigation) NProgress.done();
    }, 500);
  }

  $: if (env.browser && $navigation) {
    showProgress();
  } else if (env.browser) {
    hideProgress();
  }

  onMount(() => {
    // Strange fix for strange issue -_O_- (`cmd + k` opening two docsearch containers).
    window.addEventListener('keydown', (e) => {
      if (e.key === 'k' && e.metaKey) {
        setTimeout(() => {
          const search = Array.from(document.querySelectorAll('.DocSearch.DocSearch-Container'));
          search[1]?.remove();
        });
      }
    });
  });
</script>

<div class="contents" style="--app-navbar-height: var(--navbar-height);">
  <div
    class="bg-gray-body h-full min-h-full min-w-full transition-transform ease-out duration-150"
    style={clsx(
      'font-family: var(--font-family-sans, inherit);',
      `--navbar-height: calc(var(--app-navbar-height) + var(--breadcrumbs-height));`,
    )}
  >
    <div
      class={clsx(
        'fixed top-0 z-30 w-full flex-none transform-gpu transition-transform duration-150 ease-out',
        isNavPopoverOpen ? 'bg-gray-100 dark:bg-gray-800' : 'blur-bg',
        collapseNavbar
          ? '-translate-y-[calc(calc(var(--navbar-height)-var(--breadcrumbs-height))+8px)]'
          : 'translate-y-0',
      )}
      style="border-bottom: var(--navbar-border-bottom);"
    >
      <Navbar
        search
        on:open-popover={() => {
          isNavPopoverOpen = true;
        }}
        on:close-popover={() => {
          isNavPopoverOpen = false;
        }}
      >
        <svelte:fragment slot="search">
          <slot name="search" />
        </svelte:fragment>

        <svelte:fragment slot="left">
          <div class="flex items-center">
            <div
              class="ml-2 transform-gpu transition-transform ease-out duration-150 logo hover:scale-105"
            >
              <Button class="rounded-md px-1 pt-4" href="/">
                <div
                  class="h-[26px] text-gray-inverse svg-responsive hidden overflow-hidden 992:inline-block"
                >
                  {@html vidstackLogo}
                </div>
                <div class="h-8 -ml-2 mt-0.5 w-8 svg-responsive overflow-hidden 992:hidden">
                  {@html vidstackSymbol}
                </div>
              </Button>
            </div>

            <slot name="navbar-left" />
          </div>
        </svelte:fragment>

        <svelte:fragment slot="right">
          <slot name="navbar-right" />
        </svelte:fragment>

        <svelte:fragment slot="right-alt">
          <slot name="navbar-right-alt" />
          <div class="flex -ml-1 socials">
            <SocialLink type="twitter" />
            <SocialLink type="discord" />
            <SocialLink type="gitHub" />
          </div>
        </svelte:fragment>

        <svelte:fragment slot="bottom">
          <slot name="navbar-bottom" />
        </svelte:fragment>
      </Navbar>
    </div>

    <div
      class="flex flex-row mx-auto min-h-full max-w-[var(--content-max-width)] pt-[var(--navbar-height)] w-full z-20"
    >
      <slot name="before-main" />

      <main
        class={clsx(
          'w-full overflow-x-hidden pt-8',
          `992:min-h-[calc(100vh-var(--navbar-height))]`,
          'min-h-[calc(100vh-var(--navbar-height))]',
        )}
        style={clsx(
          `max-width: var(--main-max-width, var(--article-max-width));`,
          `padding-left: var(--main-padding-x);`,
          `padding-right: var(--main-padding-x);`,
        )}
      >
        <slot />
      </main>

      <slot name="after-main" />
    </div>
  </div>
</div>

<style>
  .logo {
    margin-top: 0.25rem;
  }

  /* Make clicks pass-through */
  :global(#nprogress) {
    pointer-events: none;
  }

  :global(#nprogress .bar) {
    background: var(--color-brand);

    position: fixed;
    z-index: 1031;
    top: 0;
    left: 0;

    width: 100%;
    height: 2.5px;
  }

  /* Fancy blur effect */
  :global(#nprogress .peg) {
    display: block;
    position: absolute;
    right: 0px;
    width: 100px;
    height: 100%;
    box-shadow: 0 0 10px var(--color-brand), 0 0 5px var(--color-brand);
    opacity: 1;

    -webkit-transform: rotate(3deg) translate(0px, -4px);
    -ms-transform: rotate(3deg) translate(0px, -4px);
    transform: rotate(3deg) translate(0px, -4px);
  }
</style>
