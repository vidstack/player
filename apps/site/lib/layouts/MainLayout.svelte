<script lang="ts">
  import 'nprogress/nprogress.css';

  import { navigation, route } from '@vessel-js/svelte';
  import clsx from 'clsx';
  import NProgress from 'nprogress';
  import { onMount } from 'svelte';
  import { writable } from 'svelte/store';

  import Button from '$lib/components/base/Button.svelte';
  import SocialLink from '$lib/components/social/SocialLink.svelte';
  import { env } from '$lib/env';
  import vidstackLogo from '$lib/img/brand/vidstack-logo.svg?raw';
  import vidstackSymbol from '$lib/img/brand/vidstack-symbol.svg?raw';
  import { addJSLibToPath } from '$lib/stores/js-lib';
  import { isLargeScreen } from '$lib/stores/screen';
  import { scrollDirection, scrollTop } from '$lib/stores/scroll';
  import { hideDocumentScrollbar } from '$lib/utils/scroll';

  import { setNavbarContext, type NavLinks } from './navbar/context';
  import Navbar from './navbar/Navbar.svelte';

  export let isNavPopoverOpen = false;

  const navLinks = writable<NavLinks>([
    {
      title: 'Media Icons',
      slug: addJSLibToPath(`/media-icons`),
      match: /\/media-icons/,
    },
    {
      title: 'Documentation',
      slug: addJSLibToPath(`/docs/player`),
      match: /\/docs\/player/,
    },
  ]);

  setNavbarContext({ links: navLinks });

  $: collapseNavbar = $isLargeScreen ? false : $scrollTop > 60 && $scrollDirection === 'down';

  // https://github.com/rstacruz/nprogress#configuration
  NProgress.configure({ minimum: 0.16, speed: 300 });

  let navigatingTimeout;

  function showProgress() {
    window.clearTimeout(navigatingTimeout);
    navigatingTimeout = window.setTimeout(() => {
      if ($navigation) NProgress.start();
    }, 500);
  }

  function hideProgress() {
    window.clearTimeout(navigatingTimeout);
    NProgress.done();
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
    class={clsx(
      'h-full min-h-full min-w-full transition-transform duration-150 ease-out',
      $route.matchedURL.pathname !== '/' && 'bg-body',
    )}
    style={clsx(
      'font-family: var(--font-family-sans, inherit);',
      `--navbar-height: calc(var(--app-navbar-height) + var(--breadcrumbs-height));`,
    )}
  >
    <div
      class={clsx(
        'fixed top-0 z-30 w-full flex-none transform-gpu transition-transform duration-150 ease-out',
        isNavPopoverOpen ? '' : 'blur-bg',
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
              class="logo ml-2 transform-gpu transition-transform duration-150 ease-out hover:scale-105"
            >
              <Button class="rounded-md px-1 pt-4" href="/">
                <div
                  class="text-inverse svg-responsive 992:inline-block hidden h-[26px] overflow-hidden"
                >
                  {@html vidstackLogo}
                </div>
                <div class="svg-responsive 992:hidden -ml-2 mt-0.5 h-8 w-8 overflow-hidden">
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
          <div class="socials flex">
            <SocialLink type="twitter" />
            <SocialLink type="gitHub" />
          </div>
        </svelte:fragment>

        <svelte:fragment slot="bottom">
          <slot name="navbar-bottom" />
        </svelte:fragment>
      </Navbar>
    </div>

    <div
      class="z-90 relative mx-auto flex min-h-full w-full max-w-[var(--content-max-width)]"
      style="overflow-x: var(--main-overflow-x, unset); flex-direction: var(--main-direction, column);"
    >
      <slot name="before-main" />
      <main
        class={clsx(
          'w-full overflow-hidden pt-[calc(var(--navbar-height)+2rem)]',
          $route.matchedURL.pathname !== '/' && 'min-h-screen',
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
    background: rgb(var(--color-brand));

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
    box-shadow: 0 0 10px rgb(var(--color-brand)), 0 0 5px rgb(var(--color-brand));
    opacity: 1;

    -webkit-transform: rotate(3deg) translate(0px, -4px);
    -ms-transform: rotate(3deg) translate(0px, -4px);
    transform: rotate(3deg) translate(0px, -4px);
  }
</style>
