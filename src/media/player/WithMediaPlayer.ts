import { CSSResultGroup, html, LitElement, TemplateResult } from 'lit';
import { createRef, Ref, ref } from 'lit/directives/ref.js';

import { createContext } from '../../base/context';
import { discover, DiscoveryEvent } from '../../base/elements';
import { Constructor } from '../../global/helpers';
import { MediaProviderElement } from '../provider';
import { basePlayerStyles } from './styles';

/**
 * Holds a contextual reference to the media container element. The container simply wraps the
 * media provider element to match it's dimensions, so it can be used by UI components to attach
 * event listeners too (eg: `GestureElement`). This container sits behind `<vds-media-ui>`, so
 * controls and other elements can safely be placed ontop to prevent background events.
 *
 * ❓ The container exists because a provider is rendered dynamically, and the only API for
 * accessing the underlying element is via the `engine` property on `MediaProviderElement`, but
 * that's not guaranteed to be of type `Element`. For example, the engine for `HlsProviderElement`
 * is currently `HTMLMediaElement`, however, in the future it might be the underlying `hls.js`
 * instance.
 */
export const mediaContainerRefContext = createContext<Ref<HTMLDivElement>>(() =>
  createRef()
);

/**
 * Fired when the media player connects to the DOM.
 *
 * @example
 * ```ts
 * import { AudioElement, MediaPlayerConnectEvent } from '@vidstack/player';
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

/**
 * Mixes in the base styles and render methods required to convert a media provider into a
 * media player.
 */
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
      discover(this, 'vds-media-player-connect');
    }

    protected _mediaContainerRefProvider =
      mediaContainerRefContext.provide(this);

    // -------------------------------------------------------------------------------------------
    // Render
    // -------------------------------------------------------------------------------------------

    protected override render(): TemplateResult {
      return this.renderPlayer();
    }

    renderPlayer(): TemplateResult {
      return html`
        <div class="provider" ${ref(this._mediaContainerRefProvider.value)}>
          ${this.renderProvider()}
        </div>
        ${this.renderUi()}
      `;
    }

    /** Override to render a new media provider. */
    renderProvider(): TemplateResult {
      return html``;
    }

    /** Override to render player UI (if not accepting skins). */
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
