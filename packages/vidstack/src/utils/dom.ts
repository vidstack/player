import {
  autoUpdate,
  computePosition,
  flip,
  shift,
  type ComputePositionConfig,
  type Placement,
} from '@floating-ui/dom';
import {
  computed,
  effect,
  getScope,
  onDispose,
  scoped,
  signal,
  type ReadSignal,
} from 'maverick.js';
import {
  animationFrameThrottle,
  EventsController,
  isDOMNode,
  isFunction,
  isKeyboardClick,
  isTouchEvent,
  listenEvent,
  setAttribute,
  setStyle,
  toggleClass,
} from 'maverick.js/std';

import { round } from './number';

export interface EventTargetLike {
  addEventListener(type: string, handler: (...args: any[]) => void): void;
  removeEventListener(type: string, handler: (...args: any[]) => void): void;
}

export function isEventInside(el: HTMLElement, event: Event) {
  const target = event.composedPath()[0];
  return isDOMNode(target) && el.contains(target);
}

const rafJobs = new Set<() => void>();

if (!__SERVER__) {
  function processJobs() {
    for (const job of rafJobs) {
      try {
        job();
      } catch (e) {
        if (__DEV__) console.error(`[vidstack] failed job:\n\n${e}`);
      }
    }

    window.requestAnimationFrame(processJobs);
  }

  processJobs();
}

export function scheduleRafJob(job: () => void) {
  rafJobs.add(job);
  return () => rafJobs.delete(job);
}

export function setAttributeIfEmpty(target: Element, name: string, value: string) {
  if (!target.hasAttribute(name)) target.setAttribute(name, value);
}

export function setARIALabel(target: Element, $label: string | null | ReadSignal<string | null>) {
  if (target.hasAttribute('aria-label') || target.hasAttribute('data-no-label')) return;

  if (!isFunction($label)) {
    setAttribute(target, 'aria-label', $label);
    return;
  }

  function updateAriaDescription() {
    setAttribute(target, 'aria-label', ($label as ReadSignal<string | null>)());
  }

  if (__SERVER__) updateAriaDescription();
  else effect(updateAriaDescription);
}

export function hasParentElement(node: Element | null, test: (node: Element) => boolean) {
  if (!node) {
    return false;
  } else if (test(node)) {
    return true;
  }

  return hasParentElement(node.parentElement, test);
}

export function isElementVisible(el: HTMLElement) {
  const style = getComputedStyle(el);
  return style.display !== 'none' && parseInt(style.opacity) > 0;
}

export function checkVisibility(el: HTMLElement | null) {
  return (
    !!el &&
    ('checkVisibility' in el
      ? el.checkVisibility({ checkOpacity: true, checkVisibilityCSS: true })
      : isElementVisible(el))
  );
}

export function observeVisibility(el: HTMLElement, callback: (isVisible: boolean) => void) {
  return scheduleRafJob(() => callback(checkVisibility(el)));
}

export function isElementParent(
  owner: Element,
  node: Element | null,
  test?: (node: Element) => boolean,
) {
  while (node) {
    if (node === owner) {
      return true;
    } else if (test?.(node)) {
      break;
    } else {
      node = node.parentElement;
    }
  }

  return false;
}

export function onPress(
  target: EventTarget,
  handler: (event: PointerEvent | KeyboardEvent) => void,
) {
  return new EventsController(target)
    .add('pointerup', (event) => {
      if (event.button === 0 && !event.defaultPrevented) handler(event);
    })
    .add('keydown', (event) => {
      if (isKeyboardClick(event)) handler(event);
    });
}

export function isTouchPinchEvent(event: Event) {
  return isTouchEvent(event) && (event.touches.length > 1 || event.changedTouches.length > 1);
}

export function requestScopedAnimationFrame(callback: () => void) {
  if (__SERVER__) return callback();

  let scope = getScope(),
    id = window.requestAnimationFrame(() => {
      scoped(callback, scope);
      id = -1;
    });

  return () => void window.cancelAnimationFrame(id);
}

export function repaint(el: HTMLElement) {
  el.style.display = 'none';
  el.offsetHeight;
  el.style.removeProperty('display');
}

export function cloneTemplate<T extends HTMLElement>(
  template: HTMLTemplateElement,
  length: number,
  onCreate?: (el: T, index: number) => void,
) {
  let current: HTMLElement,
    prev: HTMLElement = template,
    parent = template.parentElement!,
    content = template.content.firstElementChild,
    elements: T[] = [];

  // Simple patch for Vue since it incorrectly appends template.
  if (!content && template.firstElementChild) {
    template.innerHTML = template.firstElementChild.outerHTML;
    template.firstElementChild.remove();
    content = template.content.firstElementChild;
  }

  if (__DEV__ && content?.nodeType !== 1) {
    throw Error('[vidstack] template must contain root element');
  }

  for (let i = 0; i < length; i++) {
    current = document.importNode(content!, true) as HTMLElement;
    onCreate?.(current as T, i);
    parent.insertBefore(current, prev.nextSibling);
    elements.push(current as T);
    prev = current;
  }

  onDispose(() => {
    for (let i = 0; i < elements.length; i++) elements[i].remove();
  });

  return elements;
}

export function createTemplate(content: string) {
  const template = document.createElement('template');
  template.innerHTML = content;
  return template.content;
}

export function cloneTemplateContent<T>(content: DocumentFragment): T {
  const fragment = content.cloneNode(true);
  return (fragment as Element).firstElementChild as T;
}

export function autoPlacement(
  el: HTMLElement | null,
  trigger: HTMLElement | null,
  placement: string,
  {
    offsetVarName,
    xOffset,
    yOffset,
    ...options
  }: Partial<ComputePositionConfig> & {
    offsetVarName: string;
    xOffset: number;
    yOffset: number;
  },
) {
  if (!el) return;

  const floatingPlacement = placement.replace(' ', '-').replace('-center', '') as Placement;

  setStyle(el, 'visibility', !trigger ? 'hidden' : null);
  if (!trigger) return;

  let isTop = placement.includes('top');

  const negateX = (x: string) => (placement.includes('left') ? `calc(-1 * ${x})` : x),
    negateY = (y: string) => (isTop ? `calc(-1 * ${y})` : y);

  return autoUpdate(trigger, el, () => {
    computePosition(trigger, el, {
      placement: floatingPlacement,
      middleware: [
        ...(options.middleware ?? []),
        flip({ fallbackAxisSideDirection: 'start', crossAxis: false }),
        shift(),
      ],
      ...options,
    }).then(({ x, y, middlewareData }) => {
      const hasFlipped = !!middlewareData.flip?.index;
      isTop = placement.includes(hasFlipped ? 'bottom' : 'top');

      el.setAttribute(
        'data-placement',
        hasFlipped
          ? placement.startsWith('top')
            ? placement.replace('top', 'bottom')
            : placement.replace('bottom', 'top')
          : placement,
      );

      Object.assign(el.style, {
        top: `calc(${y + 'px'} + ${negateY(
          yOffset ? yOffset + 'px' : `var(--${offsetVarName}-y-offset, 0px)`,
        )})`,
        left: `calc(${x + 'px'} + ${negateX(
          xOffset ? xOffset + 'px' : `var(--${offsetVarName}-x-offset, 0px)`,
        )})`,
      });
    });
  });
}

export function hasAnimation(el: HTMLElement): boolean {
  const styles = getComputedStyle(el);
  return styles.animationName !== 'none';
}

export function createSlot(name: string) {
  const slot = document.createElement('slot');
  slot.name = name;
  return slot;
}

export function useTransitionActive($el: ReadSignal<Element | null | undefined>) {
  const $active = signal(false);

  effect(() => {
    const el = $el();
    if (!el) return;
    new EventsController(el)
      .add('transitionstart', () => $active.set(true))
      .add('transitionend', () => $active.set(false));
  });

  return $active;
}

export function useResizeObserver(
  $el: ReadSignal<Element | null | undefined>,
  onResize: () => void,
) {
  function onElementChange() {
    const el = $el();
    if (!el) return;

    onResize();

    const observer = new ResizeObserver(animationFrameThrottle(onResize));
    observer.observe(el);
    return () => observer.disconnect();
  }

  effect(onElementChange);
}

export function useSafeTriangle(
  $root: ReadSignal<Element | null | undefined>,
  $trigger: ReadSignal<Element | null | undefined>,
  $popper: ReadSignal<Element | null | undefined>,
) {
  effect(() => {
    const root = $root(),
      trigger = $trigger(),
      popper = $popper();

    if (!root || !trigger || !popper) return;

    const $isActive = useMouseEnter($root);

    effect(() => {
      if (!$isActive()) return;
      useRectCSSVars($root, $popper, 'safe');
      listenEvent(trigger, 'mousemove', (event) => {
        setStyle(root as HTMLElement, '--safe-cursor-x', `${event.clientX}px`);
        setStyle(root as HTMLElement, '--safe-cursor-y', `${event.clientY}px`);
      });
    });
  });
}

export function useRectCSSVars(
  $root: ReadSignal<Element | null | undefined>,
  $el: ReadSignal<Element | null | undefined>,
  prefix: string,
) {
  useResizeObserver($el, () => {
    const root = $root(),
      el = $el();

    if (root && el) setRectCSSVars(root, el, prefix);
  });
}

export function setRectCSSVars(root: Element, el: Element, prefix: string) {
  const rect = el.getBoundingClientRect();

  for (const side of ['top', 'left', 'bottom', 'right']) {
    setStyle(root as HTMLElement, `--${prefix}-${side}`, `${round(rect[side], 3)}px`);
  }
}

export function useActive($el: ReadSignal<Element | null | undefined>) {
  const $isMouseEnter = useMouseEnter($el),
    $isFocusedIn = useFocusIn($el);

  let prevMouseEnter = false;

  return computed(() => {
    const isMouseEnter = $isMouseEnter();
    if (prevMouseEnter && !isMouseEnter) return false;
    prevMouseEnter = isMouseEnter;
    return isMouseEnter || $isFocusedIn();
  });
}

export function useMouseEnter($el: ReadSignal<Element | null | undefined>) {
  const $isMouseEnter = signal(false);

  effect(() => {
    const el = $el();

    if (!el) {
      $isMouseEnter.set(false);
      return;
    }

    new EventsController(el)
      .add('mouseenter', () => $isMouseEnter.set(true))
      .add('mouseleave', () => $isMouseEnter.set(false));
  });

  return $isMouseEnter;
}

export function useFocusIn($el: ReadSignal<Element | null | undefined>) {
  const $isFocusIn = signal(false);

  effect(() => {
    const el = $el();

    if (!el) {
      $isFocusIn.set(false);
      return;
    }

    new EventsController(el)
      .add('focusin', () => $isFocusIn.set(true))
      .add('focusout', () => $isFocusIn.set(false));
  });

  return $isFocusIn;
}

export function isHTMLElement(el: any): el is HTMLElement {
  return el instanceof HTMLElement;
}

export function useColorSchemePreference() {
  const colorScheme = signal<'light' | 'dark'>('dark');

  if (__SERVER__) return colorScheme;

  const media = window.matchMedia('(prefers-color-scheme: light)');

  function onChange() {
    colorScheme.set(media.matches ? 'light' : 'dark');
  }

  onChange();
  listenEvent(media, 'change', onChange);

  return colorScheme;
}

export function watchColorScheme(
  el: HTMLElement,
  colorScheme: ReadSignal<'light' | 'dark' | 'system' | 'default'>,
) {
  effect(() => {
    const scheme = colorScheme();

    if (scheme === 'system') {
      const preference = useColorSchemePreference();
      effect(() => updateColorScheme(preference()));
      return;
    }

    updateColorScheme(scheme);
  });

  function updateColorScheme(scheme: string) {
    toggleClass(el, 'light', scheme === 'light');
    toggleClass(el, 'dark', scheme === 'dark');
  }
}
