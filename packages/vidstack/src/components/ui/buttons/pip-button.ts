import { Component } from 'maverick.js';

import { useMediaContext, type MediaContext } from '../../../core/api/media-context';
import type { MediaRequestEvents } from '../../../core/api/media-request-events';
import { $ariaBool } from '../../../utils/aria';
import { setARIALabel } from '../../../utils/dom';
import {
  ToggleButtonController,
  type ToggleButtonControllerProps,
} from './toggle-button-controller';

export interface PIPButtonProps extends ToggleButtonControllerProps {}

export interface PIPButtonEvents
  extends Pick<MediaRequestEvents, 'media-enter-pip-request' | 'media-exit-pip-request'> {}

/**
 * A button for toggling the picture-in-picture (PIP) mode of the player.
 *
 * @attr data-active - Whether picture-in-picture mode is active.
 * @attr data-supported - Whether picture-in-picture mode is available.
 * @docs {@link https://www.vidstack.io/docs/player/components/buttons/pip-button}
 * @see {@link https://www.vidstack.io/docs/player/api/picture-in-picture}
 */
export class PIPButton extends Component<PIPButtonProps, {}, PIPButtonEvents> {
  static props: PIPButtonProps = ToggleButtonController.props;

  #media!: MediaContext;

  constructor() {
    super();
    new ToggleButtonController({
      isPresssed: this.#isPressed.bind(this),
      keyShortcut: 'togglePictureInPicture',
      onPress: this.#onPress.bind(this),
    });
  }

  protected override onSetup(): void {
    this.#media = useMediaContext();

    const { pictureInPicture } = this.#media.$state,
      isSupported = this.#isSupported.bind(this);

    this.setAttributes({
      'data-active': pictureInPicture,
      'data-supported': isSupported,
      'aria-hidden': $ariaBool(() => !isSupported()),
    });
  }

  protected override onAttach(el: HTMLElement): void {
    el.setAttribute('data-media-tooltip', 'pip');
    setARIALabel(el, 'PiP');
  }

  #onPress(event: Event) {
    const remote = this.#media.remote;
    this.#isPressed() ? remote.exitPictureInPicture(event) : remote.enterPictureInPicture(event);
  }

  #isPressed() {
    const { pictureInPicture } = this.#media.$state;
    return pictureInPicture();
  }

  #isSupported() {
    const { canPictureInPicture } = this.#media.$state;
    return canPictureInPicture();
  }
}
