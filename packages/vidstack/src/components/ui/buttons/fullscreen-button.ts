import { Component } from 'maverick.js';

import { useMediaContext, type MediaContext } from '../../../core/api/media-context';
import type { MediaFullscreenRequestTarget } from '../../../core/api/media-request-events';
import { $ariaBool } from '../../../utils/aria';
import { setARIALabel } from '../../../utils/dom';
import {
  ToggleButtonController,
  type ToggleButtonControllerProps,
} from './toggle-button-controller';

export interface FullscreenButtonProps extends ToggleButtonControllerProps {
  /**
   * The target element on which to request fullscreen on. The target can be `media`
   * (i.e., `<media-player>`) or `provider`. The `prefer-media` option will first see if the native
   * fullscreen API is available, if not it'll try the media provider.
   */
  target: MediaFullscreenRequestTarget | undefined;
}

/**
 * A button for toggling the fullscreen mode of the player.
 *
 * @attr data-active - Whether fullscreen mode is active.
 * @attr data-supported - Whether fullscreen mode is supported.
 * @docs {@link https://www.vidstack.io/docs/player/components/buttons/fullscreen-button}
 * @see {@link https://www.vidstack.io/docs/player/core-concepts/fullscreen}
 */
export class FullscreenButton extends Component<FullscreenButtonProps> {
  static props: FullscreenButtonProps = {
    ...ToggleButtonController.props,
    target: 'prefer-media',
  };

  private _media!: MediaContext;

  constructor() {
    super();
    new ToggleButtonController({
      _isPressed: this._isPressed.bind(this),
      _keyShortcut: 'toggleFullscreen',
      _onPress: this._onPress.bind(this),
    });
  }

  protected override onSetup(): void {
    this._media = useMediaContext();

    const { fullscreen } = this._media.$state,
      isSupported = this._isSupported.bind(this);

    this.setAttributes({
      'data-active': fullscreen,
      'data-supported': isSupported,
      'aria-hidden': $ariaBool(() => !isSupported()),
    });
  }

  protected override onAttach(el: HTMLElement): void {
    el.setAttribute('data-media-tooltip', 'fullscreen');
    setARIALabel(el, this._getLabel.bind(this));
  }

  private _onPress(event: Event) {
    const remote = this._media.remote,
      target = this.$props.target();
    this._isPressed()
      ? remote.exitFullscreen(target, event)
      : remote.enterFullscreen(target, event);
  }

  private _isPressed() {
    const { fullscreen } = this._media.$state;
    return fullscreen();
  }

  private _isSupported() {
    const { canFullscreen } = this._media.$state;
    return canFullscreen();
  }

  private _getLabel() {
    const { fullscreen } = this._media.$state;
    return fullscreen() ? 'Exit Fullscreen' : 'Enter Fullscreen';
  }
}
