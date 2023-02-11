import { listen, tick } from 'svelte/internal';

import { createDisposalBin } from '$lib/utils/events';
import { wasEnterKeyPressed } from '$lib/utils/keyboard';

import { FOCUSABLE_DIALOG_ELEMENTS } from './focus-trap';

export type DialogManagerOptions = {
  onOpen?: () => void;
  onClose?: () => void;
  focusSelectors?: string[];
  openOnPointerEnter?: boolean;
  closeOnPointerLeave?: boolean;
  closeOnSelectSelectors?: string[];
  close?: (callback: CloseDialogCallback) => void;
};

export type CloseDialogCallback = (focusBtn?: boolean) => void;

export function dialogManager(
  dialogBtn: HTMLElement,
  options: DialogManagerOptions = {},
): SvelteActionReturnType {
  const disposal = createDisposalBin();
  const dialogDisposal = createDisposalBin();

  let open = false;
  let currentIndex: number;
  let focusTargets: HTMLElement[];

  reset();

  function onOpenDialog(event?: Event) {
    if (open) return;

    event?.stopPropagation();
    open = true;

    const dialogId = dialogBtn.getAttribute('aria-controls');
    const dialog = document.querySelector(`#${dialogId}`);

    if (dialog) {
      // Prevent it bubbling up to document body so we can determine when to close dialog.
      dialogDisposal.add(listen(dialog, 'click', (e) => e.stopPropagation()));
      dialogDisposal.add(listen(dialog, 'pointerup', (e) => e.stopPropagation()));
      disposal.add(listen(dialog, 'vds-close-dialog', (e) => onCloseDialog(!!(e as any).detail)));

      // Prevent dialog opening triggering any of these by accident on touch.
      const focusTargets = Array.from(
        dialog.querySelectorAll(FOCUSABLE_DIALOG_ELEMENTS.join(',')),
      ) as HTMLElement[];

      for (const element of focusTargets) {
        element.style.pointerEvents = 'none';
        setTimeout(() => {
          element.style.pointerEvents = 'auto';
        }, 500);
      }

      if (options.closeOnPointerLeave) {
        dialogDisposal.add(listen(dialog, 'pointerleave', () => onCloseDialog()));
      }

      if (options.closeOnSelectSelectors) {
        const closeTargets = Array.from(
          dialog.querySelectorAll(options.closeOnSelectSelectors.join(',')),
        ) as HTMLElement[];

        for (const element of closeTargets) {
          dialogDisposal.add(
            listen(
              element,
              'keydown',
              (e) => wasEnterKeyPressed(e) && setTimeout(() => onCloseDialog(true), 150),
            ),
          );

          let pointerTimer;
          dialogDisposal.add(
            listen(element, 'pointerup', () => {
              window.clearTimeout(pointerTimer);
              // Prevent user scrolling triggering close.
              const y = dialog.scrollTop;
              pointerTimer = setTimeout(() => {
                if (dialog.scrollTop === y) {
                  onCloseDialog();
                }
              }, 150);
            }),
          );
        }
      }
    }

    options.onOpen?.();

    return dialog;
  }

  function onCloseDialog(keyboard = false) {
    if (!open) return;
    setTimeout(() => {
      reset();
      options.onClose?.();
      if (keyboard) {
        dialogBtn?.focus();
      }
    }, 100);
  }

  function onOpenDialogWithKeyboard() {
    if (open) return;

    const dialog = onOpenDialog();
    if (!dialog) return;
    dialogDisposal.add(listen(dialog, 'keydown', onDialogKeydown));

    tick().then(() => {
      const selectors = options.focusSelectors ?? FOCUSABLE_DIALOG_ELEMENTS;
      focusTargets = Array.from(dialog.querySelectorAll(selectors.join(','))) as HTMLElement[];
      if (focusTargets.length === 0) {
        (dialog as HTMLElement)?.focus();
      } else {
        focusChild(0);
      }
    });
  }

  function focusChild(index: number) {
    focusTargets[index]?.focus();
    currentIndex = index;
  }

  function nextIndex(delta: number) {
    let index = currentIndex;
    do {
      index = (index + delta + focusTargets.length) % focusTargets.length;
    } while (focusTargets[index].offsetParent === null);
    return index;
  }

  const keyboardActions = {
    Escape: () => {
      onCloseDialog(true);
    },
    Tab: (event: KeyboardEvent) => {
      focusChild(nextIndex(event.shiftKey ? -1 : +1));
    },
    ArrowUp: () => {
      focusChild(nextIndex(-1));
    },
    ArrowDown: () => {
      focusChild(nextIndex(+1));
    },
    PageUp: () => {
      focusChild(0);
    },
    PageDown: () => {
      focusChild(focusTargets.length - 1);
    },
  };

  function onDialogKeydown(event: Event) {
    event.stopPropagation();
    const action = keyboardActions[(event as KeyboardEvent).key];
    if (action) {
      event.preventDefault();
      action(event);
    }
  }

  function reset() {
    open = false;
    focusTargets = [];
    currentIndex = -1;
    dialogDisposal.dispose();
  }

  disposal.add(
    listen(dialogBtn, 'pointerup', (e) => {
      setTimeout(() => {
        onOpenDialog(e);
      }, 100);
    }),
  );

  disposal.add(listen(document.body, 'pointerup', () => onCloseDialog()));
  disposal.add(
    listen(dialogBtn, 'keydown', (e) => wasEnterKeyPressed(e) && onOpenDialogWithKeyboard()),
  );

  if (options.openOnPointerEnter) {
    disposal.add(listen(dialogBtn, 'pointerenter', onOpenDialog));
  }

  options.close?.(onCloseDialog);

  return {
    destroy() {
      reset();
      disposal.dispose();
    },
  };
}
