import { html } from 'lit-html';
import { computed } from 'maverick.js';
import { Host } from 'maverick.js/element';

import { DefaultSkin } from '../../../components';
import { $signal } from '../../lit/directives/signal';
import { LitElement, type LitRenderer } from '../../lit/lit-element';
import { renderAudio } from './default/audio-ui';
import { renderVideo } from './default/video-ui';

/**
 * @docs {@link https://www.vidstack.io/docs/player/core-concepts/skins#default-skin}
 * @example
 * ```html
 * <media-player>
 *   <media-provider></media-provider>
 *   <media-default-skin></media-default-skin>
 * </media-player>
 * ```
 */
export class MediaDefaultSkinElement extends Host(LitElement, DefaultSkin) implements LitRenderer {
  static tagName = 'media-default-skin';

  private _layoutType = computed(this.getLayoutType.bind(this));
  private _isMobile = computed(this.isMobile.bind(this));

  constructor() {
    super();
    this.classList.add('vds-skin');
  }

  private _render() {
    const render = this._layoutType().startsWith('video') ? renderVideo : renderAudio;
    return render(this._isMobile());
  }

  render() {
    return html`${$signal(computed(this._render.bind(this)))}`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'media-default-skin': MediaDefaultSkinElement;
  }
}
