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

  #media!: MediaContext;

  constructor() {
    super();
    new ToggleButtonController({
      isPresssed: this.#isPressed.bind(this),
      onPress: this.#onPress.bind(this),
    });
  }

  protected override onSetup(): void {
    this.#media = useMediaContext();

    const { canGoogleCast, isGoogleCastConnected } = this.#media.$state;
    this.setAttributes({
      'data-active': isGoogleCastConnected,
      'data-supported': canGoogleCast,
      'data-state': this.#getState.bind(this),
      'aria-hidden': $ariaBool(() => !canGoogleCast()),
    });
  }

  protected override onAttach(el: HTMLElement): void {
    el.setAttribute('data-media-tooltip', 'google-cast');
    setARIALabel(el, this.#getDefaultLabel.bind(this));
  }

  #onPress(event: Event) {
    const remote = this.#media.remote;
    remote.requestGoogleCast(event);
  }

  #isPressed() {
    const { remotePlaybackType, remotePlaybackState } = this.#media.$state;
    return remotePlaybackType() === 'google-cast' && remotePlaybackState() !== 'disconnected';
  }

  #getState() {
    const { remotePlaybackType, remotePlaybackState } = this.#media.$state;
    return remotePlaybackType() === 'google-cast' && remotePlaybackState();
  }

  #getDefaultLabel() {
    const { remotePlaybackState } = this.#media.$state;
    return `Google Cast ${remotePlaybackState()}`;
  }
}
