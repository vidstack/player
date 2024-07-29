import { html } from 'lit-html';
import { effect, onDispose } from 'maverick.js';
import { Host } from 'maverick.js/element';

import { PlyrLayout, usePlyrLayoutClasses } from '../../../../components/layouts/plyr/plyr-layout';
import { useMediaContext, type MediaContext } from '../../../../core/api/media-context';
import { $signal } from '../../../lit/directives/signal';
import { LitElement, type LitRenderer } from '../../../lit/lit-element';
import { SlotManager } from '../slot-manager';
import { PlyrLayoutIconsLoader } from './icons-loader';
import { PlyrAudioLayout, PlyrVideoLayout } from './ui';

/**
 * @docs {@link https://www.vidstack.io/docs/wc/player/components/layouts/plyr-layout}
 * @example
 * ```html
 * <media-player>
 *   <media-provider></media-provider>
 *   <media-plyr-layout></media-plyr-layout>
 * </media-player>
 * ```
 */
export class MediaPlyrLayoutElement extends Host(LitElement, PlyrLayout) implements LitRenderer {
  static tagName = 'media-plyr-layout';

  #media!: MediaContext;

  protected onSetup() {
    // Avoid memory leaks if `keepAlive` is true. The DOM will re-render regardless.
    this.forwardKeepAlive = false;
    this.#media = useMediaContext();
  }

  protected onConnect() {
    this.#media.player.el?.setAttribute('data-layout', 'plyr');
    onDispose(() => this.#media.player.el?.removeAttribute('data-layout'));

    usePlyrLayoutClasses(this, this.#media);

    effect(() => {
      if (this.$props.customIcons()) {
        new SlotManager([this]).connect();
      } else {
        new PlyrLayoutIconsLoader([this]).connect();
      }
    });
  }

  render() {
    return $signal(this.#render.bind(this));
  }

  #render() {
    const { viewType } = this.#media.$state;
    return viewType() === 'audio'
      ? PlyrAudioLayout()
      : viewType() === 'video'
        ? PlyrVideoLayout()
        : null;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'media-plyr-layout': MediaPlyrLayoutElement;
  }
}
