import { html } from 'lit-html';

export function DefaultMenuSlider({ label, value, children }) {
  return html`
    <div class="vds-menu-item vds-menu-item-slider">
      <div class="vds-menu-slider-title">
        <span class="vds-menu-slider-label">${label}</span>
        <span class="vds-menu-slider-value">${value}</span>
      </div>
      <div class="vds-menu-slider-group">${children}</div>
    </div>
  `;
}

export function DefaultSliderParts() {
  return html`
    <div class="vds-slider-track"></div>
    <div class="vds-slider-track-fill vds-slider-track"></div>
    <div class="vds-slider-thumb"></div>
  `;
}
