import { html } from 'lit-html';
import { effect, onDispose } from 'maverick.js';
import { Host, type Attributes } from 'maverick.js/element';
import { setAttribute } from 'maverick.js/std';

import type { DefaultLayoutProps } from '../../../../components/layouts/default/props';
import { DefaultVideoLayout } from '../../../../components/layouts/default/video-layout';
import type { MediaContext } from '../../../../core';
import { useMediaContext } from '../../../../core/api/media-context';
import { $signal } from '../../../lit/directives/signal';
import { LitElement, type LitRenderer } from '../../../lit/lit-element';
import { SlotManager } from '../slot-manager';
import { DefaultLayoutIconsLoader } from './icons-loader';
import { createMenuContainer } from './ui/menu/menu-portal';
import {
  DefaultBufferingIndicator,
  DefaultVideoLayoutLarge,
  DefaultVideoLayoutSmall,
  DefaultVideoLoadLayout,
} from './video-layout';

/**
 * @docs {@link https://www.vidstack.io/docs/wc/player/components/layouts/default-layout}
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

  static override attrs: Attributes<DefaultLayoutProps> = {
    smallWhen: {
      converter(value) {
        return value !== 'never' && !!value;
      },
    },
  };

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
    this._media.player.el?.setAttribute('data-layout', 'video');
    onDispose(() => this._media.player.el?.removeAttribute('data-layout'));

    effect(() => {
      if (this.$props.customIcons()) {
        new SlotManager(this).connect();
      } else {
        new DefaultLayoutIconsLoader(this).connect();
      }
    });
  }

  render() {
    return html`${$signal(this._render.bind(this))}`;
  }

  private _render() {
    const { load } = this._media.$props,
      { canLoad, streamType } = this._media.$state;

    return this.isMatch
      ? load() === 'play' && !canLoad()
        ? DefaultVideoLoadLayout()
        : streamType() === 'unknown'
          ? DefaultBufferingIndicator()
          : this.isSmallLayout
            ? DefaultVideoLayoutSmall()
            : DefaultVideoLayoutLarge()
      : null;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'media-video-layout': MediaVideoLayoutElement;
  }
}
