import { effect, type Scope } from 'maverick.js';
import { isString } from 'maverick.js/std';

import type { RadioOption } from '../../../components';
import { cloneTemplate, requestScopedAnimationFrame } from '../../../utils/dom';
import type { MediaRadioElement } from './radio-element';

export function renderMenuItemsTemplate(
  el: HTMLElement & { connectScope: Scope | null; getOptions(): RadioOption[] },
  onCreate?: (el: MediaRadioElement, option: RadioOption, index: number) => void,
) {
  // Animation frame required as some frameworks append late for some reason.
  requestScopedAnimationFrame(() => {
    if (!el.connectScope) return;

    const template = el.querySelector('template') as HTMLTemplateElement | null;
    if (!template) return;

    effect(() => {
      if (
        __DEV__ &&
        !template.content.firstElementChild?.localName &&
        !template.firstElementChild
      ) {
        throw Error('[vidstack] menu items template requires root element');
      }

      const options = el.getOptions();

      cloneTemplate<MediaRadioElement>(template, options.length, (radio, i) => {
        const { label, value } = options[i],
          labelEl = radio.querySelector(`[data-part="label"]`);
        radio.setAttribute('value', value);
        if (labelEl) {
          if (isString(label)) {
            labelEl.textContent = label;
          } else {
            effect(() => {
              labelEl.textContent = label();
            });
          }
        }
        onCreate?.(radio, options[i], i);
      });
    });
  });
}
