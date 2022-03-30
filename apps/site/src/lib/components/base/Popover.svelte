<script context="module">
  let idCount = 0;
</script>

<script lang="ts">
  import clsx from 'clsx';
  import { createEventDispatcher } from 'svelte';
  import Transition from 'svelte-class-transition';

  import CloseIcon from '~icons/ri/close-fill';

  import { ariaBool, wasEnterKeyPressed, hideDocumentScrollbar } from '@vidstack/foundation';
  import { dialogManager, type CloseDialogCallback } from '$lib/actions/dialogManager';
  import { isLargeScreen } from '$lib/stores/isLargeScreen';

  import Overlay from './Overlay.svelte';

  export let open = false;
  export let overlay = false;

  const dispatch = createEventDispatcher();

  let popoverId = `popover-${(idCount += 1)}`;
  let popoverButtonId = `popover-button-${idCount}`;

  let closeDialog: CloseDialogCallback;

  function onOpenPopover() {
    open = true;
    hideDocumentScrollbar(true);
    dispatch('open');
  }

  function onClosePopover() {
    open = false;
    hideDocumentScrollbar(false);
    dispatch('close');
  }

  $: if ($isLargeScreen) {
    closeDialog?.();
    hideDocumentScrollbar(false);
  }
</script>

<div class="relative inline-block text-left">
  <button
    id={popoverButtonId}
    type="button"
    class={clsx(
      'inline-flex w-full justify-center rounded-md px-4 py-2 text-sm font-medium ',
      open ? 'text-gray-inverse' : 'text-gray-soft hover:text-gray-inverse',
    )}
    aria-controls={popoverId}
    aria-expanded={ariaBool(open)}
    aria-haspopup="true"
    use:dialogManager={{
      onOpen: onOpenPopover,
      onClose: onClosePopover,
      close: (cb) => {
        closeDialog = cb;
      },
    }}
  >
    <slot name="button" />
  </button>

  {#if overlay}
    <Overlay {open} />
  {/if}

  <Transition
    toggle={open}
    transitions="transition transform"
    inTransition="ease-out duration-150"
    inState="opacity-0 scale-95"
    onState="opacity-100 scale-100"
    outTransition="ease-out duration-100"
  >
    <div
      id={popoverId}
      class={clsx(
        'absolute -top-4 -right-5 z-50 min-w-[340px] origin-top-right p-5 pt-4',
        !open && 'invisible',
      )}
      tabindex="-1"
      role="dialog"
    >
      <div
        class="border-gray-divider bg-gray-elevate flex min-h-[60px] flex-col overflow-hidden rounded-md border shadow-md"
      >
        <div class="flex items-center">
          <div class="flex-1" />
          <button
            class={clsx(
              'text-gray-soft hover:text-gray-inverse p-4',
              !open && 'pointer-events-none',
            )}
            on:pointerdown={() => closeDialog()}
            on:keydown={(e) => wasEnterKeyPressed(e) && closeDialog(true)}
          >
            <CloseIcon width="24" height="24" />
            <span class="sr-only">Close dialog</span>
          </button>
        </div>

        <div class="px-4 pt-0 pb-8">
          <slot />
        </div>
      </div>
    </div>
  </Transition>
</div>
