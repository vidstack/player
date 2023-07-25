import { tick } from 'svelte';
import { createDisposalBin, listenEvent } from '../utils/events';

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
  '[role="tab"]',
];

export function focusTrap(target: HTMLElement) {
  let focusTargets: HTMLElement[] = [],
    currentIndex = -1,
    focused = false;

  const disposal = createDisposalBin();

  const keyboardActions = {
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

  function onFocus() {
    tick().then(() => {
      focusTargets = Array.from(target.querySelectorAll(FOCUSABLE_DIALOG_ELEMENTS.join(',')));
    });

    if (focused) return;

    disposal.add(listenEvent(target, 'keydown', onKeyDown));
    disposal.add(listenEvent(target, 'focusout', onFocusOut));

    tick().then(() => {
      if (document.activeElement === focusTargets[0]) {
        currentIndex += 1;
      }
    });

    focused = true;
  }

  function onFocusOut() {
    disposal.dispose();
    focusTargets = [];
    currentIndex = -1;
    focused = false;
  }

  function focusChild(index: number) {
    const target = focusTargets[index];
    target?.focus();
    currentIndex = index;
  }

  function nextIndex(delta: number) {
    let index = currentIndex;
    do {
      index = (index + delta + focusTargets.length) % focusTargets.length;
    } while (focusTargets[index].offsetParent === null);
    return index;
  }

  function onKeyDown(event: KeyboardEvent) {
    event.stopPropagation();

    const key = event.key as keyof typeof keyboardActions,
      action = keyboardActions[key];

    if (action) {
      event.preventDefault();
      action(event);
    }
  }

  return {
    destroy: listenEvent(target, 'focusin', onFocus),
  };
}
