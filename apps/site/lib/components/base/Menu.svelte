<script context="module">
  let idCount = 0;
</script>

<script lang="ts">
  import clsx from 'clsx';
  import Transition from 'svelte-class-transition';

  import { dialogManager } from '$lib/actions/dialog-manager';
  import { ariaBool } from '$lib/utils/aria';

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

<div class="not-prose relative inline-block text-left">
  <button
    id={menuButtonId}
    type="button"
    class={clsx(
      'inline-flex w-full transform-gpu justify-center rounded-md p-2 text-lg font-medium transition-transform hover:scale-[1.1]',
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
      class="bg-elevate border-elevate-border absolute right-0 z-50 mt-2 w-40 origin-top-right rounded-md border-[1.5px] shadow-lg"
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
