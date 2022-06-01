<script lang="ts">
  import clsx from 'clsx';
  import { createEventDispatcher, onMount } from 'svelte';
  import { route } from '@vitebook/svelte';
  import { ariaBool, wasEnterKeyPressed, isFunction, scrollIntoCenter } from '@vidstack/foundation';

  import CloseIcon from '~icons/ri/close-fill';

  import { isLargeScreen } from '$src/stores/screen';
  import Overlay from '$src/components/base/Overlay.svelte';
  import LibSelect from '$src/components/docs/LibSelect.svelte';
  import VersionSelect from '$src/components/docs/VersionSelect.svelte';
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
  <div class="flex top-0 left-0 sticky items-center 992:hidden z-10">
    <div class="flex-1" />
    <button
      class={clsx(
        'text-gray-soft hover:text-gray-inverse p-4 -mx-6',
        !open && 'pointer-events-none',
      )}
      on:pointerdown={() => dispatch('close')}
      on:keydown={(e) => wasEnterKeyPressed(e) && dispatch('close', true)}
    >
      <CloseIcon width="28" height="28" />
      <span class="sr-only">Close sidebar</span>
    </button>
  </div>

  <nav class="992:px-1 -mt-6 992:mt-0">
    {#if search}
      <div class="-ml-0.5 min-h-[80px] top-0 pointer-events-none sticky z-0">
        <div class="bg-white 992:h-6 dark:bg-gray-800" />
        <div class="bg-white pointer-events-auto relative dark:bg-gray-800">
          <div class="hidden 992:block">
            <slot name="search" />
          </div>
          <div class="bg-white h-14 992:h-4 dark:bg-gray-800" />
          <div class="flex items-center w-full space-x-2">
            <LibSelect />
            <VersionSelect />
          </div>
        </div>
        <div class="bg-gradient-to-b from-white h-10 dark:from-gray-800" />
      </div>
    {/if}

    <slot name="top" />

    <ul class={clsx('text-base', !search && 'mt-8', 'pb-28 992:pb-0')}>
      {#each Object.keys($links) as category (category)}
        {@const categoryLinks = $links[category]}
        <li class="mt-9 first:mt-0">
          <h5 class="font-semibold text-gray-strong">
            {category}
          </h5>
          <ul class="border-gray-divider border-l space-y-3">
            {#each categoryLinks as link (link.title + link.slug)}
              <li class="first:mt-5">
                <a
                  class={clsx(
                    '-ml-px flex items-center border-l-2 py-2 pl-4 992:py-1',
                    isActiveSidebarLink(link, $route.url.pathname)
                      ? 'text-brand font-semibold'
                      : 'hover:border-gray-inverse text-gray-soft hover:text-gray-inverse border-transparent font-normal',
                  )}
                  href={link.slug}
                  style={isActiveSidebarLink(link, $route.url.pathname)
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

<div class="z-40 992:hidden">
  <Overlay {open} />
</div>
