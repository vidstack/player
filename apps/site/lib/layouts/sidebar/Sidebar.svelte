<script lang="ts">
  import { route } from '@vessel-js/svelte';
  import clsx from 'clsx';
  import { createEventDispatcher, onMount } from 'svelte';
  import CloseIcon from '~icons/ri/close-fill';

  import Overlay from '$lib/components/base/Overlay.svelte';
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

  const componentCategories = {
    'Toggle Button': 'Buttons',
    Slider: 'Sliders',
    Menu: 'Menus',
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
    <slot name="top" />

    <ul class="text-base z-0 992:pb-0 pb-28 mt-8">
      {#each Object.keys($links) as category (category)}
        {@const categoryLinks = $links[category]}

        <li class="my-6 first:mt-0">
          <div class="text-[15px] font-semibold">{category}</div>
          <ul class="space-y-1.5 overflow-hidden ml-1.5 mt-0.5">
            {#each categoryLinks as link (link.title + link.slug)}
              {#if Object.keys(componentCategories).includes(link.title)}
                <div>
                  <div class="font-semibold text-inverse text-sm mt-5 mb-2">
                    {componentCategories[link.title]}
                  </div>
                </div>
              {/if}
              <li class="flex items-center mt-2">
                <a
                  class={clsx(
                    '992:py-1 flex items-center py-2 w-full focus-visible:m-1 text-sm',
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
