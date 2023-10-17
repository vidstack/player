import { effect, peek, signal, type StopEffect } from 'maverick.js';
import { lazyPaths, type IconType } from 'media-icons';

import { cloneTemplateContent, createTemplate } from '../../utils/dom';

const svgTemplate = /* #__PURE__*/ createTemplate(
  `<svg width="100%" height="100%" viewBox="0 0 32 32" fill="none" aria-hidden="true" focusable="false" xmlns="http://www.w3.org/2000/svg"></svg>`,
);

/**
 * The `<media-icon>` component dynamically loads and renders our custom Vidstack icons. See our
 * [media icons catalog](https://www.vidstack.io/media-icons) to preview them all. Do note, the
 * icon `type` can be dynamically changed.
 *
 * @docs {@link https://www.vidstack.io/docs/wc/player/components/display/icons}
 * @example
 * ```html
 * <media-icon type="play"></media-icon>
 * <media-icon type="pause"></media-icon>
 * ```
 */
export class MediaIconElement extends HTMLElement {
  static tagName = 'media-icon';

  static get observedAttributes() {
    return ['type'];
  }

  private _svg = this._createSVG();
  private _paths = signal<string>('');
  private _type = signal<IconType | null>(null);
  private _disposal: StopEffect[] = [];

  /**
   * The type of icon. You can find a complete and searchable list on our website - see our
   * [media icons catalog](https://www.vidstack.io/media-icons?lib=html).
   */
  get type() {
    return this._type();
  }

  set type(type) {
    this._type.set(type);

    // Make sure type is reflected as attribute incase the element is cloned.
    if (type) this.setAttribute('type', type);
    else this.removeAttribute('type');
  }

  attributeChangedCallback(name: string, _, newValue: string | null) {
    if (name === 'type') {
      this._type.set(newValue ? (newValue as IconType) : null);
    }
  }

  connectedCallback() {
    this.classList.add('vds-icon');

    if (this._svg.parentNode !== this) {
      this.prepend(this._svg);
    }

    this._disposal.push(
      // Load
      effect(this._loadIcon.bind(this)),
      // Render
      effect(() => {
        this._svg.innerHTML = this._paths();
      }),
    );
  }

  disconnectedCallback() {
    for (const fn of this._disposal) fn();
    this._disposal.length = 0;
  }

  private _createSVG() {
    return cloneTemplateContent<SVGElement>(svgTemplate);
  }

  private _loadIcon() {
    const type = this._type();
    if (type && lazyPaths[type]) {
      lazyPaths[type]().then(({ default: paths }) => {
        // Check type because it may have changed by the time the icon loads.
        if (type === peek(this._type)) this._paths.set(paths);
      });
    } else {
      this._paths.set('');
    }
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'media-icon': MediaIconElement;
  }
}
