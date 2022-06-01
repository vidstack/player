<script context="module">
  let idCount = 0;
</script>

<script lang="ts">
  import clsx from 'clsx';
  import Transition from 'svelte-class-transition';
  import { ariaBool } from '@vidstack/foundation';

  import { dialogManager } from '$src/actions/dialog-manager';

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

<div class="text-left relative inline-block not-prose">
  <button
    id={menuButtonId}
    type="button"
    class={clsx(
      'inline-flex w-full justify-center rounded-md p-2 text-lg font-medium transform-gpu transition-transform hover:scale-[1.1]',
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
      class="bg-gray-elevate border border-gray-divider rounded-md shadow-md mt-2 origin-top-right right-0 w-40 z-50 absolute"
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
