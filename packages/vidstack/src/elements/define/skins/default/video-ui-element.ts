import { html } from 'lit-html';
import { computed } from 'maverick.js';
import { Host } from 'maverick.js/element';
import { DefaultVideoUI } from '../../../../components';
import { $signal } from '../../../lit/directives/signal';
import { LitElement, type LitRenderer } from '../../../lit/lit-element';
import { LargeVideoUI, SmallVideoUI } from './video-ui';

/**
 * @docs {@link https://www.vidstack.io/docs/player/core-concepts/skins#default-skin}
 * @example
 * ```html
 * <media-player>
 *   <media-provider></media-provider>
 *   <media-video-ui></media-video-ui>
 * </media-player>
 * ```
 */
export class MediaVideoUIElement extends Host(LitElement, DefaultVideoUI) implements LitRenderer {
  static tagName = 'media-video-ui';

  constructor() {
    super();
    this.classList.add('vds-video-ui');
  }

  private _render() {
    return this.isMatch ? (this.isSmallMatch ? SmallVideoUI() : LargeVideoUI()) : null;
  }

  render() {
    return html`${$signal(computed(this._render.bind(this)))}`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'media-video-ui': MediaVideoUIElement;
  }
}
