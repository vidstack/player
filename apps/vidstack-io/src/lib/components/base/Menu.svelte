<script context="module">
  let idCount = 0;
</script>

<script lang="ts">
  import clsx from 'clsx';
  import Transition from 'svelte-class-transition';

  import { ariaBool } from '@vidstack/foundation';
  import { dialogManager } from '$actions/dialogManager';

  export let open = false;

  let menuId = `menu-${(idCount += 1)}`;
  let menuButtonId = `menu-button-${idCount}`;

  function onOpenMenu() {
    open = true;
  }

  function onCloseMenu() {
    open = false;
  }
</script>

<div class="relative inline-block text-left">
  <button
    id={menuButtonId}
    type="button"
    class={clsx(
      'inline-flex w-full justify-center rounded-md px-4 py-2 text-sm font-medium ',
      open ? 'text-gray-inverse' : 'text-gray-soft hover:text-gray-inverse',
    )}
    aria-controls={menuId}
    aria-expanded={ariaBool(open)}
    aria-haspopup="true"
    use:dialogManager={{
      onOpen: onOpenMenu,
      onClose: onCloseMenu,
      openOnPointerEnter: true,
      closeOnPointerLeave: true,
      focusSelectors: ['div > li[role="menuitem"]'],
    }}
  >
    <slot name="button" />
  </button>

  <Transition
    toggle={open}
    transitions="transition transform"
    inTransition="ease-out duration-100"
    inState="opacity-0 scale-95"
    onState="opacity-100 scale-100"
    outTransition="ease-in duration-75"
  >
    <ul
      id={menuId}
      class="absolute right-0 z-50 mt-2 w-48 origin-top-right rounded-md border border-gray-divider bg-gray-elevate shadow-md"
      role="menu"
      aria-orientation="vertical"
      aria-labelledby={menuButtonId}
      tabindex="-1"
    >
      <div class="py-1" role="none">
        <slot />
      </div>
    </ul>
  </Transition>
</div>
