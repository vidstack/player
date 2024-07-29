import { Component } from 'maverick.js';

import { useMediaContext, type MediaContext } from '../../../core/api/media-context';
import type { MediaRequestEvents } from '../../../core/api/media-request-events';
import { $ariaBool } from '../../../utils/aria';
import { setARIALabel } from '../../../utils/dom';
import {
  ToggleButtonController,
  type ToggleButtonControllerProps,
} from './toggle-button-controller';

export interface AirPlayButtonProps extends ToggleButtonControllerProps {}

export interface AirPlayButtonEvents extends Pick<MediaRequestEvents, 'media-airplay-request'> {}

/**
 * A button for requesting remote playback via Apple AirPlay.
 *
 * @attr data-active - Whether AirPlay is connected.
 * @attr data-supported - Whether AirPlay is available.
 * @attr data-state - Current connection state.
 * @see {@link https://www.apple.com/au/airplay}
 * @docs {@link https://www.vidstack.io/docs/player/components/buttons/airplay-button}
 */
export class AirPlayButton extends Component<AirPlayButtonProps, {}, AirPlayButtonEvents> {
  static props: AirPlayButtonProps = ToggleButtonController.props;

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

    const { canAirPlay, isAirPlayConnected } = this.#media.$state;
    this.setAttributes({
      'data-active': isAirPlayConnected,
      'data-supported': canAirPlay,
      'data-state': this.#getState.bind(this),
      'aria-hidden': $ariaBool(() => !canAirPlay()),
    });
  }

  protected override onAttach(el: HTMLElement): void {
    el.setAttribute('data-media-tooltip', 'airplay');
    setARIALabel(el, this.#getDefaultLabel.bind(this));
  }

  #onPress(event: Event) {
    const remote = this.#media.remote;
    remote.requestAirPlay(event);
  }

  #isPressed() {
    const { remotePlaybackType, remotePlaybackState } = this.#media.$state;
    return remotePlaybackType() === 'airplay' && remotePlaybackState() !== 'disconnected';
  }

  #getState() {
    const { remotePlaybackType, remotePlaybackState } = this.#media.$state;
    return remotePlaybackType() === 'airplay' && remotePlaybackState();
  }

  #getDefaultLabel() {
    const { remotePlaybackState } = this.#media.$state;
    return `AirPlay ${remotePlaybackState()}`;
  }
}
