import { defineElement, type HTMLCustomElement } from 'maverick.js/element';
import { pausePaths, playPaths, replayPaths } from 'media-icons';

import { Icon } from '../../../icons/icon';
import { setARIALabel } from '../../../utils/dom';
import { useMedia, type MediaContext } from '../../core/api/context';
import type { MediaKeyShortcut } from '../../core/keyboard/types';
import { ToggleButton, toggleButtonProps, type ToggleButtonAPI } from './toggle-button';

declare global {
  interface MaverickElements {
    'media-play-button': MediaPlayButtonElement;
  }
}

/**
 * A button for toggling the playback state (play/pause) of the current media.
 *
 * @docs {@link https://www.vidstack.io/docs/player/components/buttons/play-button}
 * @slot play - Used to override the default play icon.
 * @slot replay - Used to override the default replay icon.
 * @slot pause - Used to override the default pause icon.
 * @example
 * ```html
 * <media-play-button></media-play-button>
 * ```
 */
export class PlayButton extends ToggleButton {
  static override el = defineElement<PlayButtonAPI>({
    tagName: 'media-play-button',
    props: toggleButtonProps,
  });

  protected _media!: MediaContext;
  protected override _keyShortcut: MediaKeyShortcut = 'togglePaused';

  protected override onAttach(el: HTMLElement): void {
    this._media = useMedia();
    this._pressed = this._isPressed.bind(this);
    super.onAttach(el);

    setARIALabel(el, this._getLabel.bind(this));

    const { paused, ended } = this._media.$store;
    this.setAttributes({
      'data-paused': paused,
      'data-ended': ended,
    });
  }

  protected override _onPress(event: Event) {
    const remote = this._media.remote;
    this._pressed() ? remote.pause(event) : remote.play(event);
  }

  protected _isPressed() {
    const { paused } = this._media.$store;
    return !paused();
  }

  protected _getLabel() {
    const { paused } = this._media.$store;
    return paused() ? 'Play' : 'Pause';
  }

  override render() {
    return (
      <>
        <Icon paths={playPaths} slot="play" />
        <Icon paths={replayPaths} slot="replay" />
        <Icon paths={pausePaths} slot="pause" />
      </>
    );
  }
}

export interface PlayButtonAPI extends ToggleButtonAPI {}

export interface MediaPlayButtonElement extends HTMLCustomElement<PlayButton> {}
