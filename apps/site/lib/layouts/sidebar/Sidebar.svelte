<script lang="ts">
  import { route } from '@vessel-js/svelte';
  import clsx from 'clsx';
  import { createEventDispatcher, onMount } from 'svelte';
  import CloseIcon from '~icons/ri/close-fill';

  import Overlay from '$lib/components/base/Overlay.svelte';
  import LibSelect from '$lib/components/docs/LibSelect.svelte';
  import VersionSelect from '$lib/components/docs/VersionSelect.svelte';
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

  const { links, activeLink } = getSidebarContext();

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
</script>

<aside
  id="main-sidebar"
  class={clsx('sidebar', isFunction(_class) ? _class({ open }) : _class)}
  role={!$isLargeScreen ? 'dialog' : null}
  aria-modal={ariaBool(!$isLargeScreen)}
  bind:this={sidebar}
  {style}
>
  <div class="992:hidden sticky top-0 left-0 z-10 flex items-center">
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
      <div class="pointer-events-none sticky top-0 z-0 -ml-0.5 min-h-[80px]">
        <div class="992:h-6 bg-body dark:bg-gray-800" />
        <div class="bg-body pointer-events-auto relative dark:bg-gray-800">
          <div class="992:block hidden">
            <slot name="search" />
          </div>
          <div class="992:h-4 bg-body h-14 dark:bg-gray-800" />
          <div class="flex w-full items-center space-x-2">
            <LibSelect />
            <VersionSelect />
          </div>
        </div>
        <div class="from-body h-10 bg-gradient-to-b dark:from-gray-800" />
      </div>
    {/if}

    <slot name="top" />

    <ul class={clsx('text-base', !search && 'mt-8', '992:pb-0 pb-28')}>
      {#each Object.keys($links) as category (category)}
        {@const categoryLinks = $links[category]}
        <li class="mt-9 first:mt-0">
          <h5 class="text-strong font-semibold">
            {category}
          </h5>
          <ul class="border-divider space-y-3 border-l">
            {#each categoryLinks as link (link.title + link.slug)}
              <li class="first:mt-5">
                <a
                  class={clsx(
                    '992:py-1 -ml-px flex items-center border-l-2 py-2 pl-4',
                    isActiveSidebarLink(link, $route.matchedURL.pathname)
                      ? 'text-brand font-semibold'
                      : 'hover:border-inverse text-soft hover:text-inverse border-transparent font-normal',
                  )}
                  href={link.slug}
                  style={isActiveSidebarLink(link, $route.matchedURL.pathname)
                    ? 'border-color: var(--sidebar-border-active);'
                    : ''}
                  data-prefetch
                >
                  {#if link.icon?.before}
                    <svelte:component this={link.icon.before} class="mr-1" width="20" height="20" />
                  {/if}
                  {link.title}
                  {#if link.icon?.after}
                    <svelte:component this={link.icon.after} class="ml-1" width="20" height="20" />
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

<div class="992:hidden z-40">
  <Overlay {open} />
</div>
