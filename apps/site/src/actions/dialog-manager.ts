import { wasEnterKeyPressed } from '@vidstack/foundation';
import { listen, tick } from 'svelte/internal';

import { createDisposalBin } from '$src/utils/events';

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

export const FOCUSABLE_DIALOG_ELEMENTS = [
  'a[href]',
  'area[href]',
  'input:not([disabled]):not([type="hidden"]):not([aria-hidden])',
  'select:not([disabled]):not([aria-hidden])',
  'textarea:not([disabled]):not([aria-hidden])',
  'button:not([disabled]):not([aria-hidden])',
  'iframe',
  'object',
  'embed',
  '[contenteditable]',
  '[tabindex]:not([tabindex^="-"])',
];

export function dialogManager(
  dialogBtn: HTMLElement,
  options: DialogManagerOptions = {},
): SvelteActionReturnType {
  const disposal = createDisposalBin();
  const dialogDisposal = createDisposalBin();

  let open = false;
  let currentListItemIndex: number;
  let focusableElements: HTMLElement[];

  reset();

  function onOpenDialog(event?: Event) {
    if (open) return;

    event?.stopPropagation();
    open = true;

    const dialogId = dialogBtn.getAttribute('aria-controls');
    const dialogEl = document.querySelector(`#${dialogId}`);

    if (dialogEl) {
      // Prevent it bubbling up to document body so we can determine when to close dialog.
      dialogDisposal.add(listen(dialogEl, 'click', (e) => e.stopPropagation()));
      dialogDisposal.add(listen(dialogEl, 'pointerdown', (e) => e.stopPropagation()));

      disposal.add(
        listen(dialogEl, 'vds-close-dialog', (e: CustomEvent<boolean>) => onCloseDialog(e.detail)),
      );

      // Prevent dialog opening triggering any of these by accident on touch.
      for (const selector of FOCUSABLE_DIALOG_ELEMENTS) {
        const elements = Array.from(dialogEl.querySelectorAll(selector)) as HTMLElement[];
        for (const element of elements) {
          element.style.pointerEvents = 'none';
          setTimeout(() => {
            element.style.pointerEvents = 'auto';
          }, 500);
        }
      }

      if (options.closeOnPointerLeave) {
        dialogDisposal.add(listen(dialogEl, 'pointerleave', () => onCloseDialog()));
      }

      if (options.closeOnSelectSelectors) {
        for (const selector of options.closeOnSelectSelectors) {
          const elements = Array.from(dialogEl.querySelectorAll(selector)) as HTMLElement[];
          for (const element of elements) {
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
                const y = dialogEl.scrollTop;
                pointerTimer = setTimeout(() => {
                  if (dialogEl.scrollTop === y) {
                    onCloseDialog();
                  }
                }, 150);
              }),
            );
          }
        }
      }
    }

    options.onOpen?.();

    return dialogEl;
  }

  function onCloseDialog(focusBtn = false) {
    if (!open) return;
    setTimeout(() => {
      reset();
      options.onClose?.();
      if (focusBtn) {
        dialogBtn?.focus();
      }
    }, 100);
  }

  function onOpenDialogWithKeyboard() {
    if (open) return;

    const dialogEl = onOpenDialog();

    if (!dialogEl) return;

    dialogDisposal.add(listen(dialogEl, 'keydown', onDialogKeydown));

    tick().then(() => {
      for (const selector of options.focusSelectors ?? FOCUSABLE_DIALOG_ELEMENTS) {
        const elements = Array.from(dialogEl.querySelectorAll(selector)) as HTMLElement[];
        focusableElements.push(...elements);
      }

      if (focusableElements.length === 0) {
        (dialogEl as HTMLElement)?.focus();
      } else {
        focusChild(0);
      }
    });
  }

  function focusChild(index: number) {
    focusableElements[index]?.focus();
    currentListItemIndex = index;
  }

  function nextIndex(delta: number) {
    const noOfChildren = focusableElements.length;
    return (currentListItemIndex + delta + noOfChildren) % noOfChildren;
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
      focusChild(focusableElements.length - 1);
    },
  };

  function onDialogKeydown(event: KeyboardEvent) {
    event.stopPropagation();

    const action = keyboardActions[event.key];

    if (action) {
      event.preventDefault();
      action(event);
    }
  }

  function reset() {
    open = false;
    focusableElements = [];
    currentListItemIndex = -1;
    dialogDisposal.dispose();
  }

  disposal.add(
    listen(dialogBtn, 'pointerdown', (e) => {
      setTimeout(() => {
        onOpenDialog(e);
      }, 100);
    }),
  );

  disposal.add(listen(document.body, 'pointerdown', () => onCloseDialog()));
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
