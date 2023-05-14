import {
  Component,
  ComponentInstance,
  defineElement,
  type HTMLCustomElement,
} from 'maverick.js/element';
import { isKeyboardClick, isKeyboardEvent } from 'maverick.js/std';

import { FocusVisibleController } from '../../foundation/observers/focus-visible';
import { onPress, setARIALabel } from '../../utils/dom';
import { useMedia, type MediaContext } from '../core/api/context';

declare global {
  interface MaverickElements {
    'media-live-indicator': MediaLiveIndicatorElement;
  }
}

/**
 * This component displays the current live status of the stream. This includes whether it's
 * live, at the live edge, or not live. In addition, this component is a button during live streams
 * and will skip ahead to the live edge when pressed.
 *
 * 🚨 This component will contain no content, sizing, or role when the current stream is _not_ live.
 *
 * @docs {@link https://www.vidstack.io/docs/player/components/display/live-indicator}
 * @slot live - Used to insert content when media stream is live.
 * @slot live-edge - Used to insert content when media playback is at live edge.
 * @slot not-live - Used to insert content when media stream is not live.
 * @example
 * ```html
 * <media-live-indicator></media-live-indicator>
 * ```
 * @example
 * ```html
 * <media-live-indicator>
 *   <div slot="live"></div>
 *   <div slot="live-edge"></div>
 *   <div slot="not-live"></div>
 * </media-live-indicator>
 * ```
 */
export class LiveIndicator extends Component<LiveIndicatorAPI> {
  static el = defineElement<LiveIndicatorAPI>({
    tagName: 'media-live-indicator',
  });

  protected _media: MediaContext;

  constructor(instance: ComponentInstance<LiveIndicatorAPI>) {
    super(instance);
    this._media = useMedia();
    new FocusVisibleController(instance);
  }

  protected override onAttach(el: HTMLElement): void {
    const { live, liveEdge } = this._media.$store;
    setARIALabel(el, this._getLabel.bind(this));
    this.setAttributes({
      tabindex: this._getTabIndex.bind(this),
      role: this._getRole.bind(this),
      'data-live': live,
      'data-live-edge': liveEdge,
      'data-media-button': true,
    });
  }

  protected override onConnect(el: HTMLElement) {
    onPress(el, this._onPress.bind(this));
  }

  protected _getLabel() {
    const { live } = this._media.$store;
    return live() ? 'Go live' : null;
  }

  protected _getTabIndex() {
    const { live } = this._media.$store;
    return live() ? 0 : null;
  }

  protected _getRole() {
    const { live } = this._media.$store;
    return live() ? 'button' : null;
  }

  protected _onPress(event: Event) {
    const { liveEdge } = this._media.$store;
    if (liveEdge()) return;
    this._media.remote.seekToLiveEdge(event);
  }

  override render() {
    return (
      <div part="container">
        <div part="text">LIVE</div>
      </div>
    );
  }
}

export interface LiveIndicatorAPI {}

export interface MediaLiveIndicatorElement extends HTMLCustomElement<LiveIndicator> {}
