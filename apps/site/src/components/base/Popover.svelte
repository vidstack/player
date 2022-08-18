<script context="module">
  let idCount = 0;
</script>

<script lang="ts">
  import clsx from 'clsx';
  import { createEventDispatcher } from 'svelte';
  import Transition from 'svelte-class-transition';
  import { ariaBool, wasEnterKeyPressed, hideDocumentScrollbar } from '@vidstack/foundation';

  import CloseIcon from '~icons/ri/close-fill';

  import { dialogManager, type CloseDialogCallback } from '$src/actions/dialog-manager';
  import { isLargeScreen } from '$src/stores/screen';

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

<div class="not-prose relative inline-block text-left">
  <button
    id={popoverButtonId}
    type="button"
    class={clsx(
      'inline-flex w-full justify-center rounded-md p-2 text-lg font-medium',
      'transform-gpu transition-transform hover:scale-[1.025]',
      open ? 'text-inverse' : 'text-soft hover:text-inverse',
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
        'absolute -top-4 -right-0 z-50 min-w-[340px] origin-top-right p-5 pt-4',
        !open && 'invisible',
      )}
      tabindex="-1"
      role="dialog"
    >
      <div
        class="bg-elevate border-elevate-border flex min-h-[60px] flex-col overflow-hidden rounded-md border-[1.5px] shadow-lg"
      >
        <div class="z-20 flex items-center">
          <div class="flex-1" />
          <button
            class={clsx(
              'text-soft hover:text-inverse mt-[0.125rem] mr-[0.125rem] p-4',
              !open && 'pointer-events-none',
            )}
            on:pointerup={() => closeDialog()}
            on:keydown={(e) => wasEnterKeyPressed(e) && closeDialog(true)}
          >
            <CloseIcon width="28" height="28" />
            <span class="sr-only">Close</span>
          </button>
        </div>

        <div class="-mt-[2.5rem] px-4 pt-8 pb-6">
          <slot />
        </div>
      </div>
    </div>
  </Transition>
</div>
