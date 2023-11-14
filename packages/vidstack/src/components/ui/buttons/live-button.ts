import { Component } from 'maverick.js';

import { useMediaContext, type MediaContext } from '../../../core/api/media-context';
import { FocusVisibleController } from '../../../foundation/observers/focus-visible';
import { $ariaBool } from '../../../utils/aria';
import { onPress, setAttributeIfEmpty } from '../../../utils/dom';

export interface LiveButtonProps {
  /**
   * Whether the button should be disabled (non-interactive). This will prevent seeking to the
   * live edge when pressed.
   */
  disabled: boolean;
}

/**
 * This component displays the current live status of the stream. This includes whether it's
 * live, at the live edge, or not live. In addition, when this button is pressed it will skip
 * ahead to the live edge.
 *
 * @attr data-edge - Playback is at the live edge.
 * @attr data-hidden - Whether current media is _not_ live.
 * @attr data-focus - Whether button is being keyboard focused.
 * @attr data-hocus - Whether button is being keyboard focused or hovered over.
 * @docs {@link https://www.vidstack.io/docs/player/components/buttons/live-button}
 */
export class LiveButton extends Component<LiveButtonProps> {
  static props: LiveButtonProps = {
    disabled: false,
  };

  private _media!: MediaContext;

  constructor() {
    super();
    new FocusVisibleController();
  }

  protected override onSetup(): void {
    this._media = useMediaContext();

    const { disabled } = this.$props,
      { live, liveEdge } = this._media.$state,
      isHidden = () => !live();

    this.setAttributes({
      'data-edge': liveEdge,
      'data-hidden': isHidden,
      'aria-disabled': $ariaBool(() => disabled() || liveEdge()),
      'aria-hidden': $ariaBool(isHidden),
    });
  }

  protected override onAttach(el: HTMLElement): void {
    setAttributeIfEmpty(el, 'tabindex', '0');
    setAttributeIfEmpty(el, 'role', 'button');
    setAttributeIfEmpty(el, 'type', 'button');
    el.setAttribute('data-media-tooltip', 'live');
  }

  protected override onConnect(el: HTMLElement) {
    onPress(el, this._onPress.bind(this));
  }

  private _onPress(event: Event) {
    const { disabled } = this.$props,
      { liveEdge } = this._media.$state;

    if (disabled() || liveEdge()) return;

    this._media.remote.seekToLiveEdge(event);
  }
}
