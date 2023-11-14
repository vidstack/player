import {
  autoUpdate,
  computePosition,
  type ComputePositionConfig,
  type Placement,
} from '@floating-ui/dom';
import { effect, getScope, onDispose, scoped } from 'maverick.js';
import {
  isKeyboardClick,
  isTouchEvent,
  listenEvent,
  setAttribute,
  setStyle,
} from 'maverick.js/std';

export function setAttributeIfEmpty(target: Element, name: string, value: string) {
  if (!target.hasAttribute(name)) target.setAttribute(name, value);
}

export function setARIALabel(target: Element, $label: () => string | null) {
  if (target.hasAttribute('aria-label')) return;

  function updateAriaDescription() {
    setAttribute(target, 'aria-label', $label());
  }

  if (__SERVER__) updateAriaDescription();
  else effect(updateAriaDescription);
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
  listenEvent(target, 'pointerup', (event) => {
    if (event.button === 0) handler(event);
  });
  listenEvent(target, 'keydown', (event) => {
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

  const negateY = (y: string) => (placement.includes('top') ? `calc(-1 * ${y})` : y);

  return autoUpdate(trigger, el, () => {
    computePosition(trigger, el, { placement: floatingPlacement, ...options }).then(({ x, y }) => {
      Object.assign(el.style, {
        top: `calc(${y + 'px'} + ${negateY(
          yOffset ? yOffset + 'px' : `var(--${offsetVarName}-y-offset, 0px)`,
        )})`,
        left: `calc(${x + 'px'} + ${
          xOffset ? xOffset + 'px' : `var(--${offsetVarName}-x-offset, 0px)`
        })`,
      });
    });
  });
}

export function hasAnimation(el: HTMLElement): boolean {
  const styles = getComputedStyle(el);
  return styles.animationName !== 'none';
}
