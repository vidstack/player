import { DisposalBin, listenEvent } from '../utils/events';

export const FOCUS_TARGET_ELEMENTS = [
  'a[href]',
  'area[href]',
  'input:not([disabled]):not([aria-hidden])',
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

export interface FocusTrapOptions {
  selectors?: string[];
  onEscape?(event?: KeyboardEvent): void;
}

export function createFocusTrap(options?: FocusTrapOptions) {
  let focusTargets: HTMLElement[] = [],
    currentIndex = -1,
    focused = false,
    disposal = new DisposalBin();

  const keyboardActions = {
    Escape(event: KeyboardEvent) {
      onEscape(event);
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

  function onEscape(event?: KeyboardEvent) {
    disposal.dispose();
    focusTargets = [];
    currentIndex = -1;
    focused = false;
    options?.onEscape?.(event);
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

  return function trap(target: HTMLElement) {
    if (focused) return;

    requestAnimationFrame(() => {
      const selectors = options?.selectors ?? FOCUS_TARGET_ELEMENTS;
      focusTargets = Array.from(target.querySelectorAll(selectors.join(',')));
      if (focusTargets.length !== 0) focusChild(0);
    });

    disposal.add(listenEvent(target, 'keydown', onKeyDown));

    focused = true;
    return () => onEscape();
  };
}
