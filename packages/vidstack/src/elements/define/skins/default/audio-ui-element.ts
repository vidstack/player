import { html } from 'lit-html';
import { computed } from 'maverick.js';
import { Host } from 'maverick.js/element';
import { DefaultAudioUI } from '../../../../components';
import { $signal } from '../../../lit/directives/signal';
import { LitElement, type LitRenderer } from '../../../lit/lit-element';
import { LargeAudioUI, SmallAudioUI } from './audio-ui';

/**
 * @docs {@link https://www.vidstack.io/docs/player/core-concepts/skins#default-skin}
 * @example
 * ```html
 * <media-player>
 *   <media-provider></media-provider>
 *   <media-audio-ui></media-audio-ui>
 * </media-player>
 * ```
 */
export class MediaAudioUIElement extends Host(LitElement, DefaultAudioUI) implements LitRenderer {
  static tagName = 'media-audio-ui';

  constructor() {
    super();
    this.classList.add('vds-audio-ui');
  }

  private _render() {
    return this.isMatch ? (this.isSmallMatch ? SmallAudioUI() : LargeAudioUI()) : null;
  }

  render() {
    return html`${$signal(computed(this._render.bind(this)))}`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'media-audio-ui': MediaAudioUIElement;
  }
}
