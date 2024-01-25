import { Component, effect } from 'maverick.js';
import { Host } from 'maverick.js/element';

import { type MediaContext } from '../../core';
import { useMediaContext } from '../../core/api/media-context';

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

  private _media!: MediaContext;

  protected onSetup() {
    this._media = useMediaContext();
  }

  protected onConnect() {
    effect(this._watchTitle.bind(this));
  }

  private _watchTitle() {
    const { title } = this._media.$state;
    this.textContent = title();
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'media-title': MediaTitleElement;
  }
}
