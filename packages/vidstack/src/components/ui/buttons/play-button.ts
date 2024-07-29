import { Component } from 'maverick.js';

import { useMediaContext, type MediaContext } from '../../../core/api/media-context';
import type { MediaRequestEvents } from '../../../core/api/media-request-events';
import { setARIALabel } from '../../../utils/dom';
import {
  ToggleButtonController,
  type ToggleButtonControllerProps,
} from './toggle-button-controller';

export interface PlayButtonProps extends ToggleButtonControllerProps {}

export interface PlayButtonEvents
  extends Pick<MediaRequestEvents, 'media-play-request' | 'media-pause-request'> {}

/**
 * A button for toggling the playback state (play/pause) of the current media.
 *
 * @attr data-paused - Whether playback has stopped.
 * @attr data-ended - Whether playback has ended.
 * @docs {@link https://www.vidstack.io/docs/player/components/buttons/play-button}
 */
export class PlayButton extends Component<PlayButtonProps, {}, PlayButtonEvents> {
  static props: PlayButtonProps = ToggleButtonController.props;

  #media!: MediaContext;

  constructor() {
    super();

    new ToggleButtonController({
      isPresssed: this.#isPressed.bind(this),
      keyShortcut: 'togglePaused',
      onPress: this.#onPress.bind(this),
    });
  }

  protected override onSetup(): void {
    this.#media = useMediaContext();
    const { paused, ended } = this.#media.$state;

    this.setAttributes({
      'data-paused': paused,
      'data-ended': ended,
    });
  }

  protected override onAttach(el: HTMLElement): void {
    el.setAttribute('data-media-tooltip', 'play');
    setARIALabel(el, 'Play');
  }

  #onPress(event: Event) {
    const remote = this.#media.remote;
    this.#isPressed() ? remote.pause(event) : remote.play(event);
  }

  #isPressed() {
    const { paused } = this.#media.$state;
    return !paused();
  }
}
