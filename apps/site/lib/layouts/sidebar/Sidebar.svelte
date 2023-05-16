<script lang="ts">
  import { route } from '@vessel-js/svelte';
  import clsx from 'clsx';
  import { createEventDispatcher, onMount } from 'svelte';
  import { get } from 'svelte/store';
  import ArrowDropDownIcon from '~icons/ri/arrow-drop-down-line';
  import CloseIcon from '~icons/ri/close-fill';

  import Overlay from '$lib/components/base/Overlay.svelte';
  import LibSelect from '$lib/components/docs/LibSelect.svelte';
  import VersionSelect from '$lib/components/docs/VersionSelect.svelte';
  import { env } from '$lib/env';
  import { isLargeScreen } from '$lib/stores/screen';
  import { ariaBool } from '$lib/utils/aria';
  import { wasEnterKeyPressed } from '$lib/utils/keyboard';
  import { scrollIntoCenter } from '$lib/utils/scroll';
  import { isFunction } from '$lib/utils/unit';

  import { getSidebarContext, isActiveSidebarLink } from './context';

  const dispatch = createEventDispatcher();

  let sidebar: HTMLElement;

  // Only valid on small screen (<992px).
  export let open = false;
  export let search = false;
  export let style = '';

  let _class: string | ((state: { open: boolean }) => string) = '';
  export { _class as class };

  const { links, activeLink, activeCategory } = getSidebarContext();

  function scrollToActiveItem() {
    if (!$activeLink) return;
    const activeEl = sidebar.querySelector(`a[href="${$activeLink.slug}"]`);
    if (activeEl) {
      scrollIntoCenter(sidebar, activeEl, { behaviour: 'smooth' });
    }
  }

  onMount(() => {
    scrollToActiveItem();
  });

  let focusTimeout,
    preventFocus = false;
  $: if (env.browser) {
    window.clearTimeout(focusTimeout);
    if (!open && !$isLargeScreen) {
      focusTimeout = setTimeout(() => {
        preventFocus = true;
      }, 500);
    } else {
      preventFocus = false;
    }
  }

  const isCategoryOpen = {
    [get(activeCategory) as string]: true,
  };
</script>

<aside
  id="main-sidebar"
  class={clsx(
    'sidebar',
    isFunction(_class) ? _class({ open }) : _class,
    preventFocus ? 'invisible' : '',
  )}
  role={!$isLargeScreen ? 'dialog' : null}
  aria-modal={ariaBool(!$isLargeScreen)}
  aria-hidden={ariaBool(!open && !$isLargeScreen)}
  bind:this={sidebar}
  {style}
>
  <div class="992:hidden sticky top-0 left-0 z-20 flex items-center">
    <div class="flex-1" />
    <button
      class={clsx('text-soft hover:text-inverse -mx-6 p-4', !open && 'pointer-events-none')}
      on:pointerup={() => dispatch('close')}
      on:keydown={(e) => wasEnterKeyPressed(e) && dispatch('close', true)}
    >
      <CloseIcon width="28" height="28" />
      <span class="sr-only">Close sidebar</span>
    </button>
  </div>

  <nav class="992:px-1 992:mt-0 -mt-6">
    {#if search}
      <div class="pointer-events-none sticky top-0 z-10 -ml-0.5 min-h-[80px]">
        <div class="992:h-6 bg-body" />
        <div class="bg-body pointer-events-auto relative">
          <div class="992:block hidden">
            <slot name="search" />
          </div>
          <div class="992:h-4 bg-body h-14" />
          <div class="flex w-full items-center space-x-2">
            <LibSelect />
            <VersionSelect />
          </div>
        </div>
        <div class="from-body h-10 bg-gradient-to-b" />
      </div>
    {/if}

    <slot name="top" />

    <ul class={clsx('text-base z-0', !search && 'mt-8', '992:pb-0 pb-28')}>
      {#each Object.keys($links) as category (category)}
        {@const categoryLinks = $links[category]}
        {@const isOpen = isCategoryOpen[category]}

        <li class={clsx(isOpen && 'mb-4 last:mb-0')}>
          {#if category === 'Getting Started'}
            <div class="uppercase font-bold text-soft text-xs mb-3">Introduction</div>
          {/if}
          {#if category === 'Media'}
            <div class="w-full h-px bg-border my-5 mb-7" />
            <div class="uppercase font-bold text-soft text-xs mb-3">Components</div>
          {/if}
          <button
            class="flex items-center min-w-full -ml-2.5 py-1.5 rounded-md hover:bg-soft/10 focus-visible:m-1"
            aria-pressed={ariaBool(isOpen)}
            aria-label={`${!isOpen ? 'Open' : 'Close'} ${category} Category`}
            on:click={() => {
              isCategoryOpen[category] = !isCategoryOpen[category];
            }}
          >
            <ArrowDropDownIcon
              class={clsx('text-inverse transition-transform', !isOpen && '-rotate-90')}
              width={24}
              height={24}
            />
            <h5 class="font-medium text-[15px]">
              {category}
            </h5>
            <div class="flex-1" />
          </button>
          <ul class={clsx('space-y-1.5 overflow-hidden ml-1', !isOpen ? 'hidden' : 'mt-1')}>
            {#each categoryLinks as link (link.title + link.slug)}
              <li class="flex items-center">
                <a
                  class={clsx(
                    '992:py-1 -ml-px flex items-center py-2 pl-4 w-full focus-visible:m-1 focus-visible:last:mb-2 text-[15px]',
                    isActiveSidebarLink(link, $route.matchedURL.pathname)
                      ? 'text-brand font-medium'
                      : 'hover:border-inverse focus-visible:border-inverse text-soft hover:text-inverse focus-visible:text-inverse border-transparent font-normal',
                  )}
                  href={link.slug}
                  style={isActiveSidebarLink(link, $route.matchedURL.pathname)
                    ? 'border-color: var(--sidebar-border-active);'
                    : ''}
                  data-prefetch
                >
                  {link.title}
                  {#if link.wip}
                    *
                  {/if}
                </a>
              </li>
            {/each}
          </ul>
        </li>
      {/each}
    </ul>

    <slot name="bottom" />
  </nav>
</aside>

<div class="992:hidden z-[999999]">
  <Overlay {open} />
</div>
