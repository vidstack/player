import { html } from 'lit-html';
import { computed, effect, onDispose } from 'maverick.js';
import { Host } from 'maverick.js/element';
import { DefaultVideoLayout } from '../../../../components/layouts/default-layout';
import { useMediaContext } from '../../../../core/api/media-context';
import { $signal } from '../../../lit/directives/signal';
import { LitElement, type LitRenderer } from '../../../lit/lit-element';
import { DefaultLayoutIconsLoader } from './icons-loader';
import { createMenuContainer } from './shared-layout';
import { DefaultVideoLayoutLarge, DefaultVideoLayoutSmall } from './video-layout';

/**
 * @docs {@link https://www.vidstack.io/docs/player/core-concepts/layouts/default}
 * @example
 * ```html
 * <media-player>
 *   <media-provider></media-provider>
 *   <media-video-layout></media-video-layout>
 * </media-player>
 * ```
 */
export class MediaVideoLayoutElement
  extends Host(LitElement, DefaultVideoLayout)
  implements LitRenderer
{
  static tagName = 'media-video-layout';

  constructor() {
    super();
    this.classList.add('vds-video-layout');
  }

  protected onSetup() {
    this.menuContainer = createMenuContainer('vds-video-layout');

    const media = useMediaContext();
    effect(() => {
      const { height } = media.$state;
      this.menuContainer!.style.setProperty('--player-height', height() + 'px');
    });

    onDispose(() => this.menuContainer!.remove());
  }

  protected onConnect() {
    const iconsLoader = new DefaultLayoutIconsLoader(this, this.$props.icons, 'vds-icon');
    iconsLoader.connect();
  }

  private _render() {
    return this.isMatch
      ? this.isSmallLayout
        ? DefaultVideoLayoutSmall()
        : DefaultVideoLayoutLarge()
      : null;
  }

  render() {
    return html`${$signal(computed(this._render.bind(this)))}`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'media-video-layout': MediaVideoLayoutElement;
  }
}
