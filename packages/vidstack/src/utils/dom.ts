import { effect } from 'maverick.js';
import { setAttribute } from 'maverick.js/std';

export function setAttributeIfEmpty(target: Element, name: string, value: string) {
  if (!target.hasAttribute(name)) target.setAttribute(name, value);
}

export function setARIALabel(target: Element, label: () => string | null) {
  if (target.hasAttribute('aria-label') || target.hasAttribute('aria-describedby')) return;

  function updateAriaDescription() {
    setAttribute(target, 'aria-label', label());
  }

  if (__SERVER__) updateAriaDescription();
  else effect(updateAriaDescription);
}
