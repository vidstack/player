import { html } from 'lit-html';

import { $signal } from '../../../../../../lit/directives/signal';
import { IconSlot } from '../../../slots';

export function DefaultSliderParts() {
  return html`
    <div class="vds-slider-track"></div>
    <div class="vds-slider-track-fill vds-slider-track"></div>
    <div class="vds-slider-thumb"></div>
  `;
}

export function DefaultSliderSteps() {
  return html`
    <media-slider-steps class="vds-slider-steps">
      <template>
        <div class="vds-slider-step"></div>
      </template>
    </media-slider-steps>
  `;
}

export function DefaultMenuSliderItem({
  label = null,
  value = null,
  upIcon = '',
  downIcon = '',
  children,
  isMin,
  isMax,
}: any) {
  const hasTitle = label || value,
    content = [
      downIcon ? IconSlot(downIcon, 'down') : null,
      children,
      upIcon ? IconSlot(upIcon, 'up') : null,
    ];

  return html`
    <div
      class=${`vds-menu-item vds-menu-slider-item${hasTitle ? ' group' : ''}`}
      data-min=${$signal(() => (isMin() ? '' : null))}
      data-max=${$signal(() => (isMax() ? '' : null))}
    >
      ${hasTitle
        ? html`
            <div class="vds-menu-slider-title">
              ${[
                label ? html`<div>${label}</div>` : null,
                value ? html`<div>${value}</div>` : null,
              ]}
            </div>
            <div class="vds-menu-slider-body">${content}</div>
          `
        : content}
    </div>
  `;
}
