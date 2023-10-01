import { Component } from 'maverick.js';

import { useMediaContext, type MediaContext } from '../../../core/api/media-context';
import { isTrackCaptionKind } from '../../../core/tracks/text/text-track';
import { $ariaBool } from '../../../utils/aria';
import { setARIALabel } from '../../../utils/dom';
import {
  ToggleButtonController,
  type ToggleButtonControllerProps,
} from './toggle-button-controller';

export interface CaptionButtonProps extends ToggleButtonControllerProps {}

/**
 * A button for toggling the showing state of the captions.
 *
 * @attr data-supported - Whether captions/subtitles are available.
 * @attr data-active - Whether closed captions or subtitles are on.
 * @docs {@link https://www.vidstack.io/docs/player/components/buttons/caption-button}
 */
export class CaptionButton extends Component<CaptionButtonProps> {
  static props: CaptionButtonProps = ToggleButtonController.props;

  private _media!: MediaContext;

  constructor() {
    super();
    new ToggleButtonController({
      _isPressed: this._isPressed.bind(this),
      _keyShortcut: 'toggleCaptions',
      _onPress: this._onPress.bind(this),
    });
  }

  protected override onSetup(): void {
    this._media = useMediaContext();

    this.setAttributes({
      'data-active': this._isPressed.bind(this),
      'data-supported': () => !this._isHidden(),
      'aria-hidden': $ariaBool(this._isHidden.bind(this)),
    });
  }

  protected override onAttach(el: HTMLElement): void {
    el.setAttribute('data-media-tooltip', 'caption');
    setARIALabel(el, this._getLabel.bind(this));
  }

  private _onPress(event: Event) {
    this._media.remote.toggleCaptions(event);
  }

  private _isPressed() {
    const { textTrack } = this._media.$state,
      track = textTrack();
    return !!track && isTrackCaptionKind(track);
  }

  private _isHidden() {
    const { textTracks } = this._media.$state;
    return textTracks().filter(isTrackCaptionKind).length == 0;
  }

  private _getLabel() {
    const { textTrack } = this._media.$state;
    return textTrack() ? 'Closed-Captions Off' : 'Closed-Captions On';
  }
}
