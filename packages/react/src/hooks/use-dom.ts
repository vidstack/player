import * as React from 'react';

import { animationFrameThrottle, createDisposalBin, listenEvent, setStyle } from 'maverick.js/std';

export function useClassName(el: HTMLElement | null, className?: string) {
  React.useEffect(() => {
    if (!el || !className) return;

    const tokens = className.split(' ');
    for (const token of tokens) el.classList.add(token);

    return () => {
      for (const token of tokens) el.classList.remove(token);
    };
  }, [el, className]);
}

export function useResizeObserver(el: Element | null | undefined, callback: () => void) {
  React.useEffect(() => {
    if (!el) return;

    callback();

    const observer = new ResizeObserver(animationFrameThrottle(callback));
    observer.observe(el);

    return () => observer.disconnect();
  }, [el, callback]);
}

export function useTransitionActive(el: Element | null) {
  const [isActive, setIsActive] = React.useState(false);

  React.useEffect(() => {
    if (!el) return;

    const disposal = createDisposalBin();

    disposal.add(
      listenEvent(el, 'transitionstart', () => setIsActive(true)),
      listenEvent(el, 'transitionend', () => setIsActive(false)),
    );

    return () => disposal.empty();
  }, [el]);

  return isActive;
}

export function useMouseEnter(el: Element | null) {
  const [isMouseEnter, setIsMouseEnter] = React.useState(false);

  React.useEffect(() => {
    if (!el) return;

    const disposal = createDisposalBin();

    disposal.add(
      listenEvent(el, 'mouseenter', () => setIsMouseEnter(true)),
      listenEvent(el, 'mouseleave', () => setIsMouseEnter(false)),
    );

    return () => disposal.empty();
  }, [el]);

  return isMouseEnter;
}

export function useFocusIn(el: Element | null) {
  const [isFocusIn, setIsFocusIn] = React.useState(false);

  React.useEffect(() => {
    if (!el) return;

    const disposal = createDisposalBin();

    disposal.add(
      listenEvent(el, 'focusin', () => setIsFocusIn(true)),
      listenEvent(el, 'focusout', () => setIsFocusIn(false)),
    );

    return () => disposal.empty();
  }, [el]);

  return isFocusIn;
}

export function useActive(el: Element | null) {
  const isMouseEnter = useMouseEnter(el),
    isFocusIn = useFocusIn(el),
    prevMouseEnter = React.useRef(false);

  if (prevMouseEnter.current && !isMouseEnter) return false;

  prevMouseEnter.current = isMouseEnter;
  return isMouseEnter || isFocusIn;
}

export function useRectCSSVars(root: Element | null, el: Element | null, prefix: string) {
  const onResize = React.useCallback(() => {
    if (root && el) setRectCSSVars(root, el, prefix);
  }, [root, el, prefix]);

  useResizeObserver(el, onResize);
}

export function setRectCSSVars(root: Element, el: Element, prefix: string) {
  const rect = el.getBoundingClientRect();
  for (const side of ['top', 'left', 'bottom', 'right']) {
    setStyle(root as HTMLElement, `--${prefix}-${side}`, `${rect[side]}px`);
  }
}
