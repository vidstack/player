import { html } from 'lit-html';

import { LitElement } from '../lit/lit-element';

/**
 * @docs {@link https://www.vidstack.io/docs/wc/player/components/display/buffering-indicator}
 * @example
 * ```html
 * <media-spinner></media-spinner>
 * ```
 * @example
 * ```css
 * media-spinner {
 *   --size: 84px;
 *   --track-width: 8px;
 *   --track-color: rgb(255 255 255 / 0.5);
 *   --track-fill-color: white;
 *   --track-fill-percent: 50;
 * }
 * ```
 */
export class MediaSpinnerElement extends LitElement {
  static tagName = 'media-spinner';

  render() {
    return html`
      <svg
        fill="none"
        viewBox="0 0 120 120"
        aria-hidden="true"
        data-part="root"
        style="width: var(--size); height: var(--size)"
      >
        <circle
          cx="60"
          cy="60"
          r="54"
          stroke="currentColor"
          data-part="track"
          style="color: var(--track-color); stroke-width: var(--track-width);"
        ></circle>
        <circle
          cx="60"
          cy="60"
          r="54"
          stroke="currentColor"
          pathLength="100"
          stroke-dasharray="100"
          data-part="track-fill"
          style="color: var(--track-fill-color); stroke-width: var(--track-width); stroke-dashoffset: calc(100 - var(--track-fill-percent, 50));"
        ></circle>
      </svg>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'media-spinner': MediaSpinnerElement;
  }
}
