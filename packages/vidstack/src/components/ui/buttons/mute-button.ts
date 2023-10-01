import { Component } from 'maverick.js';

import { useMediaContext, type MediaContext } from '../../../core/api/media-context';
import { setARIALabel } from '../../../utils/dom';
import {
  ToggleButtonController,
  type ToggleButtonControllerProps,
} from './toggle-button-controller';

export interface MuteButtonProps extends ToggleButtonControllerProps {}

/**
 * A button for toggling the muted state of the player.
 *
 * @attr data-muted - Whether volume is muted (0).
 * @attr data-state - Current volume setting (low/high/muted).
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
      'data-state': this._getState.bind(this),
    });
  }

  protected override onAttach(el: HTMLElement): void {
    el.setAttribute('data-media-mute-button', '');
    el.setAttribute('data-media-tooltip', 'mute');
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

  private _getState() {
    const { muted, volume } = this._media.$state,
      $volume = volume();
    if (muted() || $volume === 0) return 'muted';
    else if ($volume >= 0.5) return 'high';
    else if ($volume < 0.5) return 'low';
  }
}
