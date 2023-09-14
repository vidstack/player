import { effect } from 'maverick.js';
import { isString } from 'maverick.js/std';

import type { RadioOption } from '../../../components';
import { cloneTemplate } from '../../../utils/dom';
import type { MediaRadioElement } from './radio-element';

export function renderMenuItemsTemplate(
  el: HTMLElement & { getOptions(): RadioOption[] },
  onCreate?: (el: MediaRadioElement, option: RadioOption, index: number) => void,
) {
  const template = el.querySelector('template') as HTMLTemplateElement | null;
  if (!template) return;

  effect(() => {
    if (__DEV__ && !template.content.firstElementChild?.localName) {
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
}
