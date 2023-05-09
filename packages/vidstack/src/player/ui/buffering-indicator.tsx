import { computed } from 'maverick.js';
import { Component, defineElement, type HTMLCustomElement } from 'maverick.js/element';

import { useMedia, type MediaContext } from '../core/api/context';

declare global {
  interface MaverickElements {
    'media-buffering-indicator': MediaBufferingIndicatorElement;
  }
}

/**
 * Display a loading indicator to users before the media is ready for playback or when
 * waiting for media to buffer.
 *
 * @docs {@link https://www.vidstack.io/docs/player/components/display/buffering-indicator}
 * @example
 * ```html
 * <media-buffering-indicator></media-buffering-indicator>
 * ```
 */
export class BufferingIndicator extends Component<BufferingIndicatorAPI> {
  static el = defineElement({
    tagName: 'media-buffering-indicator',
  });

  private _media!: MediaContext;

  protected override onAttach(): void {
    this._media = useMedia();
    this.setAttributes({
      'data-buffering': computed(this._isBuffering.bind(this)),
    });
  }

  protected _isBuffering() {
    const { canPlay, waiting } = this._media.$store;
    return !canPlay() || waiting();
  }

  override render() {
    return (
      <>
        <svg part="icon" fill="none" viewBox="0 0 120 120" aria-hidden="true">
          <circle part="track" cx="60" cy="60" r="54" stroke="currentColor"></circle>
          <circle
            part="track-fill"
            cx="60"
            cy="60"
            r="54"
            stroke="currentColor"
            pathLength="100"
          ></circle>
        </svg>
      </>
    );
  }
}

export interface BufferingIndicatorAPI {}

export interface MediaBufferingIndicatorElement extends HTMLCustomElement<BufferingIndicator> {}
