import { Component } from 'maverick.js';

import { useMediaContext, type MediaContext } from '../../../core/api/media-context';
import type { MediaRequestEvents } from '../../../core/api/media-request-events';
import { $ariaBool } from '../../../utils/aria';
import { setARIALabel } from '../../../utils/dom';
import {
  ToggleButtonController,
  type ToggleButtonControllerProps,
} from './toggle-button-controller';

export interface GoogleCastButtonProps extends ToggleButtonControllerProps {}

export interface GoogleCastButtonEvents
  extends Pick<MediaRequestEvents, 'media-google-cast-request'> {}

/**
 * A button for requesting remote playback via Google Cast.
 *
 * @attr data-active - Whether Google Cast is connected.
 * @attr data-supported - Whether Google Cast is available.
 * @attr data-state - Current connection state.
 * @see {@link https://developers.google.com/cast/docs/overview}
 * @docs {@link https://www.vidstack.io/docs/player/components/buttons/google-cast-button}
 */
export class GoogleCastButton extends Component<GoogleCastButtonProps, {}, GoogleCastButtonEvents> {
  static props: GoogleCastButtonProps = ToggleButtonController.props;

  private _media!: MediaContext;

  constructor() {
    super();
    new ToggleButtonController({
      _isPressed: this._isPressed.bind(this),
      _onPress: this._onPress.bind(this),
    });
  }

  protected override onSetup(): void {
    this._media = useMediaContext();

    const { canGoogleCast, isGoogleCastConnected } = this._media.$state;
    this.setAttributes({
      'data-active': isGoogleCastConnected,
      'data-supported': canGoogleCast,
      'data-state': this._getState.bind(this),
      'aria-hidden': $ariaBool(() => !canGoogleCast()),
    });
  }

  protected override onAttach(el: HTMLElement): void {
    el.setAttribute('data-media-tooltip', 'google-cast');
    setARIALabel(el, this._getDefaultLabel.bind(this));
  }

  private _onPress(event: Event) {
    const remote = this._media.remote;
    remote.requestGoogleCast(event);
  }

  private _isPressed() {
    const { remotePlaybackType, remotePlaybackState } = this._media.$state;
    return remotePlaybackType() === 'google-cast' && remotePlaybackState() !== 'disconnected';
  }

  private _getState() {
    const { remotePlaybackType, remotePlaybackState } = this._media.$state;
    return remotePlaybackType() === 'google-cast' && remotePlaybackState();
  }

  private _getDefaultLabel() {
    const { remotePlaybackState } = this._media.$state;
    return `Google Cast ${remotePlaybackState()}`;
  }
}
