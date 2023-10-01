import { html } from 'lit-html';
import { effect, onDispose } from 'maverick.js';
import { Host } from 'maverick.js/element';
import { setAttribute } from 'maverick.js/std';

import { DefaultAudioLayout } from '../../../../components/layouts/default-layout';
import { $computed } from '../../../lit/directives/signal';
import { LitElement, type LitRenderer } from '../../../lit/lit-element';
import { SlotManager } from '../slot-manager';
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

  protected onSetup() {
    this.classList.add('vds-audio-layout');
    this.menuContainer = createMenuContainer('vds-audio-layout');

    effect(() => {
      if (!this.menuContainer) return;
      setAttribute(this.menuContainer, 'data-size', this.isSmallLayout && 'sm');
    });

    onDispose(() => this.menuContainer?.remove());
  }

  protected onConnect() {
    effect(() => {
      if (this.$props.customIcons()) {
        new SlotManager(this).connect();
      } else {
        new DefaultLayoutIconsLoader(this).connect();
      }
    });
  }

  private _render() {
    return this.isMatch
      ? this.isSmallLayout
        ? DefaultAudioLayoutSmall()
        : DefaultAudioLayoutLarge()
      : null;
  }

  render() {
    return html`${$computed(this._render.bind(this))}`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'media-audio-layout': MediaAudioLayoutElement;
  }
}
