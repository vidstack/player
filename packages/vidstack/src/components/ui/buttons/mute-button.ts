import { Component } from 'maverick.js';

import { useMediaContext, type MediaContext } from '../../../core/api/media-context';
import type { MediaRequestEvents } from '../../../core/api/media-request-events';
import { setARIALabel } from '../../../utils/dom';
import {
  ToggleButtonController,
  type ToggleButtonControllerProps,
} from './toggle-button-controller';

export interface MuteButtonProps extends ToggleButtonControllerProps {}

export interface MuteButtonEvents
  extends Pick<MediaRequestEvents, 'media-mute-request' | 'media-unmute-request'> {}

/**
 * A button for toggling the muted state of the player.
 *
 * @attr data-muted - Whether volume is muted (0).
 * @attr data-state - Current volume setting (low/high/muted).
 * @docs {@link https://www.vidstack.io/docs/player/components/buttons/mute-button}
 */
export class MuteButton extends Component<MuteButtonProps, {}, MuteButtonEvents> {
  static props: MuteButtonProps = ToggleButtonController.props;

  #media!: MediaContext;

  constructor() {
    super();
    new ToggleButtonController({
      isPresssed: this.#isPressed.bind(this),
      keyShortcut: 'toggleMuted',
      onPress: this.#onPress.bind(this),
    });
  }

  protected override onSetup(): void {
    this.#media = useMediaContext();

    this.setAttributes({
      'data-muted': this.#isPressed.bind(this),
      'data-state': this.#getState.bind(this),
    });
  }

  protected override onAttach(el: HTMLElement): void {
    el.setAttribute('data-media-mute-button', '');
    el.setAttribute('data-media-tooltip', 'mute');
    setARIALabel(el, 'Mute');
  }

  #onPress(event: Event) {
    const remote = this.#media.remote;
    this.#isPressed() ? remote.unmute(event) : remote.mute(event);
  }

  #isPressed() {
    const { muted, volume } = this.#media.$state;
    return muted() || volume() === 0;
  }

  #getState() {
    const { muted, volume } = this.#media.$state,
      $volume = volume();
    if (muted() || $volume === 0) return 'muted';
    else if ($volume >= 0.5) return 'high';
    else if ($volume < 0.5) return 'low';
  }
}
