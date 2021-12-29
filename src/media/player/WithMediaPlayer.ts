import { CSSResultGroup, html, LitElement, TemplateResult } from 'lit';

import { DiscoveryEvent, dispatchDiscoveryEvents } from '../../base/elements';
import { Constructor } from '../../global/helpers';
import { getSlottedChildren } from '../../utils/dom';
import { isNil, isUndefined } from '../../utils/unit';
import { MediaController } from '../controller';
import { MediaProviderElement } from '../provider';
import { basePlayerStyles } from './styles';

/**
 * Fired when the media player connects to the DOM.
 *
 * @example
 * ```ts
 * import { AudioElement, MediaPlayerConnectEvent } from '@vidstack/elements';
 *
 * function eventHandler(event: MediaPlayerConnectEvent<AudioElement>) {
 *   const { element, onDisconnect } = event.detail;
 *
 *   onDisconnect(() => {
 *     // ...
 *   });
 * }
 * ```
 */
export type MediaPlayerConnectEvent<
  Provider extends MediaProviderElement = MediaProviderElement
> = DiscoveryEvent<Provider>;

export function WithMediaPlayer<T extends Constructor<LitElement>>(
  Provider: T
): T & Constructor<BaseMediaPlayer> {
  class MediaPlayer extends Provider {
    static get styles(): CSSResultGroup {
      // Provider styles should override base media styles.
      // @ts-expect-error
      if (super.styles) return [basePlayerStyles, super.styles];
      return [basePlayerStyles];
    }

    readonly controller = new MediaController(this);

    constructor(...args: any[]) {
      super(...args);
      dispatchDiscoveryEvents(this, 'vds-media-player-connect');
    }

    // -------------------------------------------------------------------------------------------
    // Render
    // -------------------------------------------------------------------------------------------

    protected override render(): TemplateResult {
      return this.renderPlayer();
    }

    renderPlayer(): TemplateResult {
      return html`${this.renderProvider()}${this.renderUi()}`;
    }

    renderProvider(): TemplateResult {
      return this._renderMediaSlot();
    }

    renderUi(): TemplateResult {
      return html`<slot name="ui"></slot>`;
    }

    // -------------------------------------------------------------------------------------------
    // Media Slot
    // -------------------------------------------------------------------------------------------

    /**
     * This slot is not required for the player to work. It only introduces support for
     * additional players in the ecosystem to plug in and work with this player.
     */
    protected _renderMediaSlot(): TemplateResult {
      return html`
        <slot name="media" @slotchange="${this._handleMediaSlotChange}"></slot>
      `;
    }

    protected _handleMediaSlotChange() {
      // This is a media provider.
      if (!isUndefined((this as any).play)) return;

      const mediaProvider = getSlottedChildren(
        this,
        'media'
      )[0] as MediaProviderElement;

      // Not a bulletproof check, but it's a good enough safety-check to warn devs if they pass the
      // wrong element.
      if (!isNil(mediaProvider) && isUndefined(mediaProvider.play)) {
        throw Error('Invalid media element given to `media` slot.');
      }

      this.controller.setMediaProvider(mediaProvider);
    }
  }

  return MediaPlayer;
}

export interface BaseMediaPlayer {
  readonly controller: MediaController;

  renderPlayer(): TemplateResult;
  renderProvider(): TemplateResult;
  renderUi(): TemplateResult;
}
