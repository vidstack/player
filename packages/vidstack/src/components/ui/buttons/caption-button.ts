import { Component } from 'maverick.js';

import { useMediaContext, type MediaContext } from '../../../core/api/media-context';
import type { MediaRequestEvents } from '../../../core/api/media-request-events';
import { isTrackCaptionKind } from '../../../core/tracks/text/text-track';
import { $ariaBool } from '../../../utils/aria';
import { setARIALabel } from '../../../utils/dom';
import {
  ToggleButtonController,
  type ToggleButtonControllerProps,
} from './toggle-button-controller';

export interface CaptionButtonProps extends ToggleButtonControllerProps {}

export interface CaptionButtonEvents
  extends Pick<MediaRequestEvents, 'media-text-track-change-request'> {}

/**
 * A button for toggling the showing state of the captions.
 *
 * @attr data-supported - Whether captions/subtitles are available.
 * @attr data-active - Whether closed captions or subtitles are on.
 * @docs {@link https://www.vidstack.io/docs/player/components/buttons/caption-button}
 */
export class CaptionButton extends Component<CaptionButtonProps, {}, CaptionButtonEvents> {
  static props: CaptionButtonProps = ToggleButtonController.props;

  #media!: MediaContext;

  constructor() {
    super();
    new ToggleButtonController({
      isPresssed: this.#isPressed.bind(this),
      keyShortcut: 'toggleCaptions',
      onPress: this.#onPress.bind(this),
    });
  }

  protected override onSetup(): void {
    this.#media = useMediaContext();

    this.setAttributes({
      'data-active': this.#isPressed.bind(this),
      'data-supported': () => !this.#isHidden(),
      'aria-hidden': $ariaBool(this.#isHidden.bind(this)),
    });
  }

  protected override onAttach(el: HTMLElement): void {
    el.setAttribute('data-media-tooltip', 'caption');
    setARIALabel(el, 'Captions');
  }

  #onPress(event: Event) {
    this.#media.remote.toggleCaptions(event);
  }

  #isPressed() {
    const { textTrack } = this.#media.$state,
      track = textTrack();
    return !!track && isTrackCaptionKind(track);
  }

  #isHidden() {
    const { hasCaptions } = this.#media.$state;
    return !hasCaptions();
  }
}
