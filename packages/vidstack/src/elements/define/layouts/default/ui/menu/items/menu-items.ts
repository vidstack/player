import { html, type TemplateResult } from 'lit-html';
import { type ReadSignal } from 'maverick.js';
import { isArray, isFunction, isString } from 'maverick.js/std';

import type { RadioGroupChangeEvent, RadioOption } from '../../../../../../../components';
import { $signal } from '../../../../../../lit/directives/signal';
import { IconSlot } from '../../../slots';

let sectionId = 0;

export function DefaultMenuSection({ label = '', value = '', children }) {
  if (!label) {
    return html`
      <div class="vds-menu-section">
        <div class="vds-menu-section-body">${children}</div>
      </div>
    `;
  }

  const id = `vds-menu-section-${++sectionId}`;

  return html`
    <section class="vds-menu-section" role="group" aria-labelledby=${id}>
      <div class="vds-menu-section-title">
        <header id=${id}>${label}</header>
        ${value ? html`<div class="vds-menu-section-value">${value}</div>` : null}
      </div>
      <div class="vds-menu-section-body">${children}</div>
    </section>
  `;
}

export function DefaultMenuItem({ label, children }) {
  return html`
    <div class="vds-menu-item">
      <div class="vds-menu-item-label">${label}</div>
      ${children}
    </div>
  `;
}

export function DefaultMenuButton({
  label,
  icon,
  hint,
}: {
  label: ReadSignal<string>;
  icon?: string;
  hint?: ReadSignal<string> | null;
}) {
  return html`
    <media-menu-button class="vds-menu-item">
      ${IconSlot('menu-arrow-left', 'vds-menu-close-icon')}
      ${icon ? IconSlot(icon, 'vds-menu-item-icon') : null}
      <span class="vds-menu-item-label">${$signal(label)}</span>
      <span class="vds-menu-item-hint" data-part="hint">${hint ? $signal(hint) : null} </span>
      ${IconSlot('menu-arrow-right', 'vds-menu-open-icon')}
    </media-menu-button>
  `;
}

export function DefaultRadioGroup({
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
        ${IconSlot('menu-radio-check')}
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
