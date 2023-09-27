import { html, type TemplateResult } from 'lit-html';
import { computed, type ReadSignal } from 'maverick.js';
import { isFunction, isString } from 'maverick.js/std';

import type { RadioOption } from '../../../../components';
import { $signal } from '../../../lit/directives/signal';

export function renderMenuButton({ label, icon }: { label: ReadSignal<string>; icon: string }) {
  return html`
    <media-menu-button class="vds-menu-button">
      <slot name="menu-arrow-left-icon" data-class="vds-menu-button-close-icon"></slot>
      <slot name="${icon}-icon" data-class="vds-menu-button-icon"></slot>
      <span class="vds-menu-button-label">${$signal(label)}</span>
      <span class="vds-menu-button-hint" data-part="hint"></span>
      <slot name="menu-arrow-right-icon" data-class="vds-menu-button-open-icon"></slot>
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
