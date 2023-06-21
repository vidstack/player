import { Component } from 'maverick.js';

import { useMediaContext, type MediaContext } from '../../../core/api/media-context';
import { setARIALabel } from '../../../utils/dom';
import { Slots } from '../utils/slots';
import {
  ToggleButtonController,
  type ToggleButtonControllerProps,
} from './toggle-button-controller';

export interface MuteButtonProps extends ToggleButtonControllerProps {}

/**
 * A button for toggling the muted state of the player.
 *
 * @docs {@link https://www.vidstack.io/docs/player/components/buttons/mute-button}
 */
export class MuteButton extends Component<MuteButtonProps> {
  static props: MuteButtonProps = ToggleButtonController.props;

  private _media!: MediaContext;

  constructor() {
    super();
    new ToggleButtonController({
      _isPressed: this._isPressed.bind(this),
      _keyShortcut: 'toggleMuted',
      _onPress: this._onPress.bind(this),
    });
  }

  protected override onSetup(): void {
    this._media = useMediaContext();

    this.setAttributes({
      'data-muted': this._isPressed.bind(this),
      'data-volume': this._getVolumeText.bind(this),
    });

    new Slots(() => {
      const volume = this._getVolumeText();
      return {
        mute: volume !== 'muted',
        unmute: volume === 'muted',
        'volume-mute': volume === 'muted',
        'volume-low': volume === 'low',
        'volume-high': volume === 'high',
      };
    }).attach(this);
  }

  protected override onAttach(el: HTMLElement): void {
    setARIALabel(el, this._getLabel.bind(this));
  }

  private _onPress(event: Event) {
    const remote = this._media.remote;
    this._isPressed() ? remote.unmute(event) : remote.mute(event);
  }

  private _isPressed() {
    const { muted, volume } = this._media.$state;
    return muted() || volume() === 0;
  }

  private _getLabel() {
    return this._isPressed() ? 'Unmute' : 'Mute';
  }

  private _getVolumeText() {
    const { muted, volume } = this._media.$state,
      $volume = volume();
    if (muted() || $volume === 0) return 'muted';
    else if ($volume >= 0.5) return 'high';
    else if ($volume < 0.5) return 'low';
  }
}
