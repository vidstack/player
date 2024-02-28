import { html, type TemplateResult } from 'lit-html';
import { type ReadSignal } from 'maverick.js';
import { isArray, isFunction, isString } from 'maverick.js/std';

import type { RadioGroupChangeEvent, RadioOption } from '../../../../../../../components';
import { $signal } from '../../../../../../lit/directives/signal';

export function renderMenuButton({
  label,
  icon,
  hint,
}: {
  label: ReadSignal<string>;
  icon?: string;
  hint?: ReadSignal<string> | null;
}) {
  return html`
    <media-menu-button class="vds-menu-button">
      <slot name="menu-arrow-left-icon" data-class="vds-menu-button-close-icon"></slot>
      ${icon ? html`<slot name="${icon}-icon" data-class="vds-menu-button-icon"></slot>` : null}
      <span class="vds-menu-button-label">${$signal(label)}</span>
      <span class="vds-menu-button-hint" data-part="hint">${hint ? $signal(hint) : null} </span>
      <slot name="menu-arrow-right-icon" data-class="vds-menu-button-open-icon"></slot>
    </media-menu-button>
  `;
}

export function renderRadioGroup({
  value = null,
  options,
  hideLabel = false,
  children = null,
  onChange = null,
}: {
  value?: string | ReadSignal<string> | null;
  options: RadioOption[] | ReadSignal<RadioOption[]>;
  hideLabel?: boolean;
  children?: TemplateResult | ((option: RadioOption) => TemplateResult | null) | null;
  onChange?: ((event: RadioGroupChangeEvent) => void) | null;
}) {
  function renderRadio(option: RadioOption) {
    const { value, label: content } = option;
    return html`
      <media-radio class="vds-radio" value=${value}>
        <div class="vds-radio-check"></div>
        ${!hideLabel
          ? html`
              <span class="vds-radio-label" data-part="label">
                ${isString(content) ? content : $signal(content)}
              </span>
            `
          : null}
        ${isFunction(children) ? children(option) : children}
      </media-radio>
    `;
  }

  return html`
    <media-radio-group
      class="vds-radio-group"
      value=${isString(value) ? value : value ? $signal(value) : ''}
      @change=${onChange}
    >
      ${isArray(options) ? options.map(renderRadio) : $signal(() => options().map(renderRadio))}
    </media-radio-group>
  `;
}

export function createRadioOptions(entries: string[] | Record<string, string>): RadioOption[] {
  return isArray(entries)
    ? entries.map((entry) => ({ label: entry, value: entry.toLowerCase() }))
    : Object.keys(entries).map((label) => ({ label, value: entries[label] }));
}
