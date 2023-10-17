import { html } from 'lit-html';
import { effect, onDispose } from 'maverick.js';
import { Host } from 'maverick.js/element';
import { setAttribute } from 'maverick.js/std';

import { DefaultVideoLayout } from '../../../../components/layouts/default-layout';
import type { MediaContext } from '../../../../core';
import { useMediaContext } from '../../../../core/api/media-context';
import { $computed } from '../../../lit/directives/signal';
import { LitElement, type LitRenderer } from '../../../lit/lit-element';
import { SlotManager } from '../slot-manager';
import { DefaultLayoutIconsLoader } from './icons-loader';
import { createMenuContainer } from './shared-layout';
import {
  DefaultBufferingIndicator,
  DefaultVideoLayoutLarge,
  DefaultVideoLayoutSmall,
} from './video-layout';

/**
 * @docs {@link https://www.vidstack.io/docs/player/components/layouts/default-layout}
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

  private _media!: MediaContext;

  protected onSetup() {
    // Avoid memory leaks if `keepAlive` is true. The DOM will re-render regardless.
    this.forwardKeepAlive = false;

    this._media = useMediaContext();

    this.classList.add('vds-video-layout');
    this.menuContainer = createMenuContainer('vds-video-layout');

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
    const { streamType } = this._media.$state;
    return this.isMatch
      ? streamType() === 'unknown'
        ? DefaultBufferingIndicator()
        : this.isSmallLayout
        ? DefaultVideoLayoutSmall()
        : DefaultVideoLayoutLarge()
      : null;
  }

  render() {
    return html`${$computed(this._render.bind(this))}`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'media-video-layout': MediaVideoLayoutElement;
  }
}
