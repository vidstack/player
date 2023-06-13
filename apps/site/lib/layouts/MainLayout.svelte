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
  import { addJSLibToPath } from '$lib/stores/js-lib';
  import { isLargeScreen } from '$lib/stores/screen';
  import { scrollDirection, scrollTop } from '$lib/stores/scroll';

  import { setNavbarContext, type NavLinks } from './navbar/context';
  import Navbar from './navbar/Navbar.svelte';

  export let isNavPopoverOpen = false;

  const navLinks = writable<NavLinks>([]);

  $: $navLinks = [
    !$route.pathname.startsWith('/docs') && {
      title: 'Documentation',
      slug: addJSLibToPath(`/docs/player`),
      match: /\/docs(\/react)?\/player/,
    },
    {
      title: 'Icons',
      slug: addJSLibToPath(`/media-icons`),
      match: /\/media-icons/,
    },
    {
      title: 'Components',
      slug: addJSLibToPath(`/docs/player/components/media/player`),
      match: /\/docs(\/react)?\/player\/components/,
    },
    {
      title: 'Releases',
      slug: 'https://github.com/vidstack/player/discussions?discussions_q=is%3Aopen+release',
    },
  ].filter(Boolean) as NavLinks;

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
              class="logo ml-2 transform-gpu transition-transform duration-150 ease-out hover:scale-105 flex-shrink-0"
            >
              <Button class="rounded-md px-1 pt-4" href="/">
                <svg
                  class="svg-responsive h-[32px] overflow-hidden"
                  viewBox="0 0 32 32"
                  fill="none"
                  aria-hidden="true"
                  role="presentation"
                >
                  <rect width="32" height="32" rx="4.8" fill="#030712" />
                  <path
                    fill-rule="evenodd"
                    clip-rule="evenodd"
                    d="M11.0002 2.86755C11.3191 2.73079 11.6862 2.76917 11.9699 2.96895L26.9649 13.5259C27.2309 13.7132 27.3892 14.0182 27.3892 14.3436V17.7995C27.3892 18.1256 27.2302 18.4312 26.9631 18.6184L12.1027 29.0323C11.8303 29.2232 11.4809 29.2662 11.1704 29.147L7.90745 27.8942C7.52096 27.7459 7.26587 27.3747 7.26587 26.9607L7.26588 5.128C7.26588 4.72803 7.5042 4.36654 7.8718 4.20892L11.0002 2.86755ZM9.32647 5.76129C9.28971 5.77705 9.26588 5.8132 9.26588 5.8532L9.26587 21.1863C9.26587 21.2614 9.34554 21.3097 9.41212 21.2749L14.8808 18.4226C14.9139 18.4054 14.9346 18.3712 14.9346 18.334L14.9346 7.55401C14.9346 7.52147 14.9188 7.49097 14.8922 7.47224L11.3208 4.95789C11.2924 4.93791 11.2557 4.93407 11.2238 4.94775L9.32647 5.76129ZM17.0922 9.02111C17.0259 8.97446 16.9346 9.02185 16.9346 9.10288L16.9346 18.2423C16.9346 18.2836 16.96 18.3206 16.9985 18.3356L21.3833 20.0323C21.4144 20.0443 21.4495 20.0401 21.4768 20.0209L25.3466 17.309C25.3733 17.2903 25.3892 17.2597 25.3892 17.2271V14.9144C25.3892 14.8819 25.3734 14.8514 25.3468 14.8326L17.0922 9.02111ZM9.33003 26.2981C9.29138 26.2832 9.26587 26.2461 9.26587 26.2047L9.26587 23.6675C9.26587 23.6303 9.28659 23.5961 9.31963 23.5789L15.9609 20.115C15.9864 20.1017 16.0164 20.1 16.0432 20.1104L19.2868 21.3655C19.3614 21.3944 19.3736 21.4948 19.3081 21.5407L11.4342 27.0586C11.4069 27.0777 11.372 27.082 11.3409 27.0701L9.33003 26.2981Z"
                    fill="#030712"
                  />
                  <path
                    d="M9.3107 23.5755C9.27766 23.5927 9.25695 23.6269 9.25695 23.6642V26.2144C9.25695 26.2558 9.28253 26.293 9.32126 26.3078L11.3441 27.0807C11.3751 27.0925 11.41 27.0882 11.4372 27.0691L19.3263 21.5391C19.3918 21.4932 19.3796 21.3929 19.305 21.364L16.0453 20.1004C16.0184 20.09 15.9884 20.0916 15.9629 20.105L9.3107 23.5755Z"
                    fill="#F43F5E"
                  />
                  <path
                    d="M14.9523 18.3398C14.9523 18.377 14.9315 18.4112 14.8985 18.4284L9.39929 21.2968C9.33271 21.3315 9.25304 21.2832 9.25304 21.2081V5.8453C9.25304 5.80527 9.27691 5.7691 9.31372 5.75336L11.2291 4.93407C11.261 4.92043 11.2976 4.92428 11.326 4.94425L14.9098 7.46819C14.9364 7.48692 14.9523 7.51742 14.9523 7.54995V18.3398Z"
                    fill="#F97316"
                  />
                  <path
                    d="M17.0786 8.99576C17.0123 8.9491 16.921 8.99649 16.921 9.07752V18.246C16.921 18.2873 16.9464 18.3243 16.9848 18.3392L21.3906 20.049C21.4218 20.0611 21.457 20.0568 21.4843 20.0376L25.359 17.3131C25.3856 17.2944 25.4015 17.2638 25.4015 17.2313V14.9093C25.4015 14.8768 25.3857 14.8463 25.3591 14.8276L17.0786 8.99576Z"
                    fill="#EC4899"
                  />
                </svg>
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
