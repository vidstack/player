import { Component, effect } from 'maverick.js';
import { Host } from 'maverick.js/element';

import { useMediaContext, type MediaContext } from '../../core/api/media-context';

class Title extends Component {}

/**
 * @docs {@link https://www.vidstack.io/docs/wc/player/components/display/title}
 * @example
 * ```html
 * <media-title></media-title>
 * ```
 */
export class MediaTitleElement extends Host(HTMLElement, Title) {
  static tagName = 'media-title';

  #media!: MediaContext;

  protected onSetup() {
    this.#media = useMediaContext();
  }

  protected onConnect() {
    effect(this.#watchTitle.bind(this));
  }

  #watchTitle() {
    const { title } = this.#media.$state;
    this.textContent = title();
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'media-title': MediaTitleElement;
  }
}
