import { Component } from 'maverick.js';

import { useMediaContext, type MediaContext } from '../../../core/api/media-context';
import { setARIALabel } from '../../../utils/dom';
import {
  ToggleButtonController,
  type ToggleButtonControllerProps,
} from './toggle-button-controller';

export interface PlayButtonProps extends ToggleButtonControllerProps {}

/**
 * A button for toggling the playback state (play/pause) of the current media.
 *
 * @attr data-paused - Whether playback has stopped.
 * @attr data-ended - Whether playback has ended.
 * @docs {@link https://www.vidstack.io/docs/player/components/buttons/play-button}
 */
export class PlayButton extends Component<PlayButtonProps> {
  static props: PlayButtonProps = ToggleButtonController.props;

  private _media!: MediaContext;

  constructor() {
    super();

    new ToggleButtonController({
      _isPressed: this._isPressed.bind(this),
      _keyShortcut: 'togglePaused',
      _onPress: this._onPress.bind(this),
    });
  }

  protected override onSetup(): void {
    this._media = useMediaContext();
    const { paused, ended } = this._media.$state;

    this.setAttributes({
      'data-paused': paused,
      'data-ended': ended,
    });
  }

  protected override onAttach(el: HTMLElement): void {
    el.setAttribute('data-media-tooltip', 'play');
    setARIALabel(el, this._getLabel.bind(this));
  }

  private _onPress(event: Event) {
    const remote = this._media.remote;
    this._isPressed() ? remote.pause(event) : remote.play(event);
  }

  private _isPressed() {
    const { paused } = this._media.$state;
    return !paused();
  }

  private _getLabel() {
    const { paused } = this._media.$state;
    return paused() ? 'Play' : 'Pause';
  }
}
