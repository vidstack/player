import { html } from 'lit-html';
import { computed, onDispose } from 'maverick.js';
import { Host } from 'maverick.js/element';
import { DefaultAudioLayout } from '../../../../components/layouts/default-layout';
import { $signal } from '../../../lit/directives/signal';
import { LitElement, type LitRenderer } from '../../../lit/lit-element';
import { DefaultAudioLayoutLarge, DefaultAudioLayoutSmall } from './audio-layout';
import { DefaultLayoutIconsLoader } from './icons-loader';
import { createMenuContainer } from './shared-layout';

/**
 * @docs {@link https://www.vidstack.io/docs/player/core-concepts/layouts/default}
 * @example
 * ```html
 * <media-player>
 *   <media-provider></media-provider>
 *   <media-audio-layout></media-audio-layout>
 * </media-player>
 * ```
 */
export class MediaAudioLayoutElement
  extends Host(LitElement, DefaultAudioLayout)
  implements LitRenderer
{
  static tagName = 'media-audio-layout';

  constructor() {
    super();
    this.classList.add('vds-audio-layout');
  }

  protected onSetup() {
    this.menuContainer = createMenuContainer('vds-audio-layout');
    onDispose(() => this.menuContainer!.remove());
  }

  protected onConnect() {
    const iconsLoader = new DefaultLayoutIconsLoader(this, this.$props.icons, 'vds-icon');
    iconsLoader.connect();
  }

  private _render() {
    return this.isMatch
      ? this.isSmallLayout
        ? DefaultAudioLayoutSmall()
        : DefaultAudioLayoutLarge()
      : null;
  }

  render() {
    return html`${$signal(computed(this._render.bind(this)))}`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'media-audio-layout': MediaAudioLayoutElement;
  }
}
