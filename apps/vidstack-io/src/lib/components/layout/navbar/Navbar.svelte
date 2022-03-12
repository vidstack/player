<script lang="ts">
  import clsx from 'clsx';
  import { createEventDispatcher } from 'svelte';
  import { page } from '$app/stores';

  import MenuIcon from '~icons/ri/menu-5-line';
  import ArrowDropDownIcon from '~icons/ri/arrow-drop-down-fill';

  import VidstackLogoIcon from '$img/brand/vidstack-logo.svg?raw';

  import ColorSchemeMenu from './ColorSchemeMenu.svelte';
  import { colorScheme } from '$stores/colorScheme';
  import { uppercaseFirstLetter } from '@vidstack/foundation';
  import Popover from '$components/base/Popover.svelte';
  import SocialLink from '$components/social/SocialLink.svelte';
  import LazyDocSearch from '$components/markdown/LazyDocSearch.svelte';

  export let contain = false;

  const dispatch = createEventDispatcher();

  function onOpenPopover() {
    dispatch('open-popover');
  }

  function onClosePopover() {
    dispatch('close-popover');
  }

  const navLinks = [
    {
      title: 'Documentation',
      slug: '/docs/player/getting-started/quickstart',
      match: /^\/docs\/player/,
    },
  ];
</script>

<div class="flex w-full flex-col items-center justify-center px-5 py-4 1200:py-5">
  <div class={clsx('flex w-full items-center', contain && '1200:mx-auto 1200:max-w-7xl')}>
    <a
      href="/"
      class="ml-1 flex transform-gpu items-center transition-transform duration-100 hover:scale-105"
      sveltekit:prefetch
    >
      <span class="sr-only">Go home</span>
      <div class="svg-responsive h-7 w-32 overflow-hidden text-gray-inverse">
        {@html VidstackLogoIcon}
      </div>
    </a>

    <slot name="left" />

    <div class="flex-1" />

    <div class="-mr-2 flex items-center 992:hidden">
      <LazyDocSearch />

      <Popover overlay on:open={onOpenPopover} on:close={onClosePopover}>
        <svelte:fragment slot="button">
          <MenuIcon width="30" height="30" />
          <span class="sr-only">Main navigation menu</span>
        </svelte:fragment>

        <section class="flex flex-col items-start">
          <h1 class="mb-6 text-xl font-medium">Links</h1>
          <nav>
            <ul>
              {#each navLinks as { title, slug, match } (title + slug)}
                {@const isActive = match.test($page.url.pathname)}
                <li class="mt-4 first:mt-0">
                  <a
                    class={clsx(
                      isActive
                        ? 'border-b-2 border-brand text-gray-inverse'
                        : 'text-gray-soft hover:text-gray-inverse',
                    )}
                    href={slug}
                    sveltekit:prefetch
                  >
                    {title}
                  </a>
                </li>
              {/each}
            </ul>
          </nav>
        </section>

        <hr class="my-6 h-2 w-full border-t-2 border-dashed border-gray-200 dark:border-gray-400" />

        <section class="flex flex-col items-start">
          <h1 class="mb-6 text-xl font-medium">Socials</h1>
          <div class="flex flex-col space-y-6">
            <SocialLink type="twitter">Twitter</SocialLink>
            <SocialLink type="gitHub">GitHub</SocialLink>
            <SocialLink type="discord">Discord</SocialLink>
          </div>
        </section>

        <hr class="my-6 h-2 w-full border-t-2 border-dashed border-gray-200 dark:border-gray-400" />

        <section class="flex flex-col items-start">
          <h1 class="mb-6 text-xl font-medium">Options</h1>
          <div class="flex flex-col space-y-6">
            <div class="flex items-center">
              Theme

              <label
                class="relative ml-4 flex items-center border border-gray-200 px-4 py-1 dark:border-gray-400"
              >
                <span class="sr-only">Theme</span>
                {uppercaseFirstLetter($colorScheme)}
                <ArrowDropDownIcon width="20" height="20" class="ml-1" />
                <select
                  class="absolute inset-0 appearance-none opacity-0"
                  bind:value={$colorScheme}
                >
                  <option value="light">Light</option>
                  <option value="dark">Dark</option>
                  <option value="system">System</option>
                </select>
              </label>
            </div>
          </div>
        </section>
      </Popover>
    </div>

    <div class="hidden 992:flex 992:items-center">
      <nav>
        <ul class="flex items-center space-x-8 text-lg font-medium">
          {#each navLinks as { title, slug, match } (title + slug)}
            {@const isActive = match.test($page.url.pathname)}
            <li>
              <a
                class={clsx(
                  isActive
                    ? 'border-brand border-b hover:border-b-2 focus-visible:border-b-2'
                    : 'text-gray-inverse hover:border-b-2 border-current',
                )}
                href={slug}
                sveltekit:prefetch
              >
                {title}
              </a>
            </li>
          {/each}
        </ul>
      </nav>

      <div class="mx-5 h-7 w-2 border-l-[1.5px] border-gray-divider" />

      <div class="hidden: flex items-center">
        <div class="flex space-x-4">
          <SocialLink type="twitter" />
          <SocialLink type="discord" />
          <SocialLink type="gitHub" />
        </div>

        <ColorSchemeMenu />
      </div>
    </div>
  </div>

  <slot name="bottom" />
</div>
