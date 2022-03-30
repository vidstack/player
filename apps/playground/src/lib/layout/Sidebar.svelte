<script lang="ts" context="module">
  export type SidebarVariant = {
    title: string;
    slug: string;
  };

  export type SidebarComponents = Record<string, SidebarVariant[]>;

  export type SidebarNav = Record<string, SidebarComponents>;

  export function isActiveSidebarItem({ slug }: SidebarVariant, currentPath: string) {
    return currentPath === slug;
  }

  export const SIDEBAR_CONTEXT_KEY = Symbol();

  export type SidebarContext = {
    nav: Readable<SidebarNav>;
    allCategories: Readable<string[]>;
    activeCategory: Readable<string | null>;
    activeComponent: Readable<string | null>;
    allVariants: Readable<SidebarVariant[]>;
    activeVariantIndex: Readable<number>;
    activeVariant: Readable<SidebarVariant | null>;
  };

  export function createSidebarContext(nav: Readable<SidebarNav>): SidebarContext {
    const allCategories = derived(nav, ($nav) => Object.keys($nav));
    const allVariants = derived(nav, ($nav) =>
      Object.values($nav)
        .map((component) => Object.values(component).flat())
        .flat(),
    );

    const activeVariantIndex = derived([allVariants, page], ([$allVariants, $page]) =>
      $allVariants.findIndex((item) => isActiveSidebarItem(item, $page.url.pathname)),
    );

    const activeVariant = derived(
      [allVariants, activeVariantIndex],
      ([$allVariants, $activeVariantIndex]) => $allVariants[$activeVariantIndex],
    );

    const activeCategory = derived([nav, activeVariant], ([$nav, $activeVariant]) =>
      Object.keys($nav).find((category) =>
        Object.values($nav[category])
          .flat()
          .some((item) => item === $activeVariant),
      ),
    );

    const activeComponent = derived(
      [nav, activeCategory, activeVariant],
      ([$nav, $activeCategory, $activeVariant]) =>
        Object.keys($nav[$activeCategory] ?? {}).find((component) =>
          $nav[$activeCategory][component].some((variant) => variant === $activeVariant),
        ),
    );

    const ctx: SidebarContext = {
      nav,
      allCategories,
      activeCategory,
      activeComponent,
      allVariants,
      activeVariantIndex,
      activeVariant,
    };

    setContext(SIDEBAR_CONTEXT_KEY, ctx);
    return ctx;
  }

  export function getSidebarContext(): SidebarContext {
    return getContext(SIDEBAR_CONTEXT_KEY);
  }
</script>

<script lang="ts">
  import clsx from 'clsx';
  import { createEventDispatcher, getContext, onMount, setContext } from 'svelte';
  import { page } from '$app/stores';

  import FolderIcon from '~icons/ri/book-mark-fill';
  import FolderOpenIcon from '~icons/ri/book-open-fill';
  import VariantIcon from '~icons/ri/bookmark-fill';
  import ActiveVariantIcon from '~icons/ri/bookmark-3-fill';
  import CloseIcon from '~icons/ri/close-fill';

  import { ariaBool, wasEnterKeyPressed, scrollIntoCenter } from '@vidstack/foundation';
  import { isLargeScreen } from '$lib/stores/isLargeScreen';
  import Overlay from '$lib/components/base/Overlay.svelte';
  import { derived, type Readable } from 'svelte/store';

  const dispatch = createEventDispatcher();

  let sidebar: HTMLElement;
  let _isOpen = {};

  // Only valid on small screen (<992px).
  export let open = false;

  const { nav, activeVariant, activeCategory, activeComponent } = getSidebarContext();

  function scrollToActiveItem() {
    if (!$activeVariant) return;
    const activeEl = sidebar.querySelector(`a[href="${$activeVariant.slug}"]`);
    if (activeEl) {
      scrollIntoCenter(sidebar, activeEl, { behaviour: 'smooth' });
    }
  }

  onMount(() => {
    scrollToActiveItem();
  });

  $: _isOpen[`${$activeCategory}-${$activeComponent}`.toLowerCase()] = true;
</script>

<aside
  id="main-sidebar"
  class={clsx(
    'bg-gray-body fixed inset-0 z-50 w-96 max-w-[85vw] overflow-y-auto',
    'border-gray-divider border-r',
    '-translate-x-full transform transition-transform duration-200 ease-out will-change-transform',
    open && 'translate-x-0',
    '992:top-[4.5rem] 992:pb-[5rem] 1200:top-20 1200:pb-24 992:left-0 992:w-[17rem] 992:h-full 992:translate-x-0 992:translate-y-px',
  )}
  role={!$isLargeScreen ? 'dialog' : null}
  aria-modal={ariaBool(!$isLargeScreen)}
  bind:this={sidebar}
>
  <div class="992:hidden sticky top-0 left-0 flex items-center">
    <div class="flex-1" />
    <button
      class={clsx('text-gray-soft hover:text-gray-inverse p-4', !open && 'pointer-events-none')}
      on:pointerdown={() => dispatch('close')}
      on:keydown={(e) => wasEnterKeyPressed(e) && dispatch('close', true)}
    >
      <CloseIcon width="24" height="24" />
      <span class="sr-only">Close sidebar</span>
    </button>
  </div>

  <nav class="p-6 pt-0">
    <ul class="mt-8">
      {#each Object.keys($nav) as category (category)}
        {@const components = $nav[category]}
        <li class="992:mt-10 mt-12 first:mt-0">
          <h5 class="text-gray-strong 992:mb-3 mb-8 hidden text-xl font-semibold">{category}</h5>
          <ul class="space-y-2">
            {#each Object.keys(components) as component (component)}
              {@const key = `${category}-${component}`.toLowerCase()}
              {@const isOpen = _isOpen[key]}
              <li class="first:mt-6">
                <button
                  id={`folder-btn-${key}`}
                  class={clsx(
                    'hover:text-gray-inverse hover:bg-gray-hover h-full w-full py-2 px-2.5 text-left',
                    component === $activeComponent
                      ? 'text-gray-soft font-medium'
                      : 'text-gray-soft',
                  )}
                  aria-controls={`folder-${key}`}
                  aria-expanded={ariaBool(isOpen)}
                  on:click={() => {
                    _isOpen[key] = !_isOpen[key];
                  }}
                >
                  <h6 class="flex items-center">
                    <svelte:component
                      this={isOpen ? FolderOpenIcon : FolderIcon}
                      class="mr-2 mb-px"
                      width="16"
                      height="16"
                    />
                    {component}
                  </h6>
                </button>
                <ul
                  id={`folder-${key}`}
                  aria-labelledby={`folder-btn-${key}`}
                  class={clsx(!isOpen && 'hidden', 'ml-3.5 space-y-1.5')}
                >
                  {#each components[component] as variant (variant.title)}
                    {@const isActive = isActiveSidebarItem(variant, $page.url.pathname)}
                    <li class="flex items-center first:mt-1">
                      <a
                        class={clsx(
                          '992:py-1.5 hover:bg-gray-hover -ml-px flex w-full items-center py-2 pl-4',
                          isActive
                            ? 'text-brand font-semibold'
                            : 'text-gray-soft hover:text-gray-inverse font-normal',
                        )}
                        href={variant.slug}
                        sveltekit:prefetch
                      >
                        <svelte:component
                          this={isActive ? ActiveVariantIcon : VariantIcon}
                          class="mr-1.5 mb-px"
                          width="16"
                          height="16"
                        />
                        {variant.title}
                      </a>
                    </li>
                  {/each}
                </ul>
              </li>
            {/each}
          </ul>
        </li>
      {/each}
    </ul>
  </nav>
</aside>

<div class="992:hidden z-40">
  <Overlay {open} />
</div>
