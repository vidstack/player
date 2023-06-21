import { html, type TemplateResult } from 'lit-html';
import { computed, type ReadSignal } from 'maverick.js';
import { isFunction, isString } from 'maverick.js/std';
import arrowLeftPaths from 'media-icons/dist/icons/arrow-left.js';
import arrowRightPaths from 'media-icons/dist/icons/chevron-right.js';

import type { RadioOption } from '../../../../components';
import { Icon } from '../../../icon';
import { $signal } from '../../../lit/directives/signal';

export function renderMenuButton({
  label,
  iconPaths,
}: {
  label: ReadSignal<string>;
  iconPaths: string;
}) {
  return html`
    <media-menu-button class="vds-menu-button">
      ${Icon({ paths: arrowLeftPaths, class: 'vds-menu-button-close-icon' })}
      ${Icon({ paths: iconPaths, class: 'vds-menu-button-icon' })}
      <span class="vds-menu-button-label">${$signal(label)}</span>
      <span class="vds-menu-button-hint" data-part="hint"></span>
      ${Icon({ paths: arrowRightPaths, class: 'vds-menu-button-open-icon' })}
    </media-menu-button>
  `;
}

export function renderRadioGroup({
  options,
  hideLabel = false,
  children = null,
}: {
  options: ReadSignal<RadioOption[]>;
  hideLabel?: boolean;
  children?: TemplateResult | ((option: RadioOption) => TemplateResult | null) | null;
}) {
  const radios = computed(() =>
    options().map((option) => {
      const { value, label: content } = option;
      return html`
        <media-radio class="vds-radio" value=${value}>
          <div class="vds-radio-check"></div>
          ${!hideLabel
            ? html`<span data-part="label">${isString(content) ? content : $signal(content)}</span>`
            : null}
          ${isFunction(children) ? children(option) : children}
        </media-radio>
      `;
    }),
  );

  return html`<media-radio-group>${$signal(radios)}</media-radio-group>`;
}
