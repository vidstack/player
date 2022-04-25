<script lang="ts" context="module">
  export const load = createKitDocsLoader({
    sidebar: {
      '/': null,
      '/docs/player': '/docs/player',
    },
  });
</script>

<script lang="ts">
  import '$lib/styles/fonts.css';
  import '$lib/styles/tailwind.css';
  import '$lib/styles/app.css';
  import '$lib/styles/kit-docs.css';
  import '$lib/polyfills/focus-visible';

  import '@docsearch/css';
  import '@svelteness/kit-docs/client/styles/docsearch.css';

  import NProgress from 'nprogress';
  import clsx from 'clsx';
  import { onMount } from 'svelte';
  import { writable } from 'svelte/store';

  import { page, navigating } from '$app/stores';
  import { browser } from '$app/env';
  import { hideDocumentScrollbar } from '@vidstack/foundation';
  import {
    Button,
    createKitDocsLoader,
    createSidebarContext,
    KitDocs,
    KitDocsLayout,
    type NavbarConfig,
    type ResolvedSidebarConfig,
    type MarkdownMeta,
    type NavigationConfig,
  } from '@svelteness/kit-docs';
  import { Algolia } from '@svelteness/kit-docs/client/algolia';
  import SocialLink from '$lib/components/social/SocialLink.svelte';
  import { framework, frameworkSpecificSidebar } from '$lib/stores/framework';

  import socialCardLarge from '$lib/img/brand/social-card-large.jpg';
  import vidstackLogo from '$lib/img/brand/vidstack-logo.svg?raw';
  import vidstackSymbol from '$lib/img/brand/vidstack-symbol.svg?raw';
  import FrameworkSelect from './docs/player/[...5]components/_components/_FrameworkSelect.svelte';

  export let meta: MarkdownMeta | null = null;
  export let sidebar: ResolvedSidebarConfig | null = null;

  framework.set(/\/react\/?/.test($page.url.pathname) ? 'react' : 'html');

  const navbar: NavbarConfig = {
    links: [{ title: 'Documentation', slug: '/docs/player', match: /\/docs\/player/ }],
  };

  let canUpdateHash = false;
  const navigation: NavigationConfig = {
    canUpdateHash: (hash) => {
      const isApiHash = $page.url.hash.includes('--');

      // Skip first updates to prevent messing with initial api hash.
      if (isApiHash && !canUpdateHash) {
        window.setTimeout(() => {
          canUpdateHash = true;
        }, 150);
        return false;
      }

      const currentHash = isApiHash ? $page.url.hash.split('--')[0] : $page.url.hash;
      return currentHash !== hash;
    },
    cleanHash: (hash) => (hash.includes('--') ? hash.split('--')[0] : hash),
  };

  const _sidebar = writable<ResolvedSidebarConfig | null>(null);
  $: $_sidebar = sidebar;
  const frameworkSidebar = frameworkSpecificSidebar(_sidebar);
  const { activeCategory } = createSidebarContext(frameworkSidebar);

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

  // https://github.com/rstacruz/nprogress#configuration
  NProgress.configure({ minimum: 0.16 });

  let navigatingTimeout;

  function showProgress() {
    window.clearTimeout(navigatingTimeout);
    navigatingTimeout = window.setTimeout(() => {
      if (!$navigating) return;
      NProgress.start();
    }, 500);
  }

  function hideProgress() {
    NProgress.done();
    window.clearTimeout(navigatingTimeout);
    hideDocumentScrollbar(false);

    // Fix to catch progress accidentally starting.
    window.setTimeout(() => {
      if (!$navigating) NProgress.done();
    }, 500);
  }

  $: if (browser && $navigating) {
    showProgress();
  } else if (browser) {
    hideProgress();
  }

  $: category = $activeCategory ? `${$activeCategory}: ` : '';
  $: title = meta ? `${category}${meta.title} | Vidstack` : null;
  $: description = meta?.description;

  $: isHomePath = $page.url.pathname === '/';
  $: isDocsPath = $page.url.pathname.startsWith('/docs');
</script>

<svelte:head>
  {#key $page.url.pathname}
    {#if title}
      <title>{title}</title>
      <meta property="og:title" content={title} />
      <meta name="twitter:title" content={title} />
    {/if}
    {#if description}
      <meta name="description" content={description} />
      <meta name="twitter:description" content={description} />
      <meta name="og:description" content={description} />
    {/if}
    {#if title && description}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content="@vidstackjs" />
      <meta name="twitter:image" content={`https://vidstack.io${socialCardLarge}`} />
      <meta name="twitter:creator" content="@vidstackjs" />
      <meta property="og:site_name" content="Vidstack" />
      <meta property="og:url" content={`https://vidstack.io${$page.url.pathname}`} />
      <meta property="og:type" content="article" />
      <meta property="og:image" content={`https://vidstack.io${socialCardLarge}`} />
    {/if}
  {/key}
</svelte:head>

<div
  class="contents"
  style={clsx(
    !isDocsPath && `--kd-content-max-width: none;`,
    isHomePath && `--kd-navbar-border-bottom: none;`,
  )}
>
  <KitDocs {meta}>
    <KitDocsLayout {navigation} {navbar} sidebar={$frameworkSidebar} search>
      <Algolia
        apiKey="03b81ed3b7849b33599967cec76734fe"
        appId="JV3QY1UI79"
        indexName="vidstack"
        slot="search"
      />

      <div class="flex items-center" slot="navbar-left">
        <div
          class="logo ml-2 transform-gpu transition-transform duration-150 ease-out hover:scale-105"
        >
          <Button href="/">
            <div
              class="svg-responsive text-gray-inverse 992:inline-block hidden h-7 w-32 overflow-hidden"
            >
              {@html vidstackLogo}
            </div>
            <div class="svg-responsive 992:hidden -ml-2 h-8">
              {@html vidstackSymbol}
            </div>
          </Button>
        </div>

        {#if isDocsPath}
          <div class="992:ml-3 ml-2 -mt-0.5">
            <FrameworkSelect />
          </div>
        {/if}
      </div>

      <div class="socials -mx-2 flex" slot="navbar-right-alt">
        <SocialLink type="twitter" />
        <SocialLink type="discord" />
        <SocialLink type="gitHub" />
      </div>

      <slot />
    </KitDocsLayout>
  </KitDocs>
</div>

<style>
  .logo {
    margin-top: 0.25rem;
  }

  .socials > :global(a) {
    padding: 0 0.5rem;
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
