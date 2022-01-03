import { CSSResultGroup, html, LitElement, TemplateResult } from 'lit';

import { DiscoveryEvent, dispatchDiscoveryEvents } from '../../base/elements';
import { Constructor } from '../../global/helpers';
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

    /** Override to render a new media provider. */
    renderProvider(): TemplateResult {
      return html``;
    }

    renderUi(): TemplateResult {
      return html`<slot name="ui"></slot>`;
    }
  }

  return MediaPlayer;
}

export interface BaseMediaPlayer {
  renderPlayer(): TemplateResult;
  renderProvider(): TemplateResult;
  renderUi(): TemplateResult;
}
