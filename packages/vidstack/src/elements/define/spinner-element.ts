import { html } from 'lit-html';
import { Component, effect } from 'maverick.js';
import { Host } from 'maverick.js/element';
import { setAttribute } from 'maverick.js/std';

import { requestScopedAnimationFrame } from '../../utils/dom';
import { LitElement } from '../lit/lit-element';

export interface SpinnerProps {
  /**
   * The horizontal (width) and vertical (height) length of the spinner.
   */
  size: number;
  /**
   * The width of the spinner track and track fill.
   */
  trackWidth: number;
  /**
   * The percentage of the spinner track that should be filled.
   */
  fillPercent: number;
}

export class Spinner extends Component<SpinnerProps> {
  static props: SpinnerProps = {
    size: 96,
    trackWidth: 8,
    fillPercent: 50,
  };

  protected override onConnect(el: HTMLElement): void {
    requestScopedAnimationFrame(() => {
      if (!this.connectScope) return;

      const root = el.querySelector('svg')!,
        track = root.firstElementChild as SVGCircleElement,
        trackFill = track.nextElementSibling as SVGCircleElement;

      effect(this.#update.bind(this, root, track, trackFill));
    });
  }

  #update(root: SVGSVGElement, track: SVGCircleElement, trackFill: SVGCircleElement) {
    const { size, trackWidth, fillPercent } = this.$props;
    setAttribute(root, 'width', size());
    setAttribute(root, 'height', size());
    setAttribute(track, 'stroke-width', trackWidth());
    setAttribute(trackFill, 'stroke-width', trackWidth());
    setAttribute(trackFill, 'stroke-dashoffset', 100 - fillPercent());
  }
}

/**
 * @docs {@link https://www.vidstack.io/docs/wc/player/components/display/buffering-indicator}
 * @example
 * ```html
 * <!-- default values below -->
 * <media-spinner size="84" track-width="8" fill-percent="50"></media-spinner>
 * ```
 * @example
 * ```css
 * media-spinner [data-part="track"] {
 *   color: rgb(255 255 255 / 0.5);
 * }
 *
 * media-spinner [data-part="track-fill"] {
 *   color: white;
 * }
 * ```
 */
export class MediaSpinnerElement extends Host(LitElement, Spinner) {
  static tagName = 'media-spinner';

  render() {
    return html`
      <svg fill="none" viewBox="0 0 120 120" aria-hidden="true" data-part="root">
        <circle cx="60" cy="60" r="54" stroke="currentColor" data-part="track"></circle>
        <circle
          cx="60"
          cy="60"
          r="54"
          stroke="currentColor"
          pathLength="100"
          stroke-dasharray="100"
          data-part="track-fill"
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
