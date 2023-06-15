import { defineElement, type HTMLCustomElement } from 'maverick.js/element';
import mutePaths from 'media-icons/dist/icons/mute.js';
import volumeHighPaths from 'media-icons/dist/icons/volume-high.js';
import volumeLowPaths from 'media-icons/dist/icons/volume-low.js';

import { Icon } from '../../../icons/icon';
import { setARIALabel } from '../../../utils/dom';
import { useMedia, type MediaContext } from '../../core/api/context';
import type { MediaKeyShortcut } from '../../core/keyboard/types';
import { ToggleButton, toggleButtonProps, type ToggleButtonAPI } from './toggle-button';

declare global {
  interface MaverickElements {
    'media-mute-button': MediaMuteButtonElement;
  }
}

/**
 * A button for toggling the muted state of the player.
 *
 * @docs {@link https://www.vidstack.io/docs/player/components/buttons/mute-button}
 * @slot volume-muted - Used to override the default muted icon.
 * @slot volume-low - Used to override the default volume low icon.
 * @slot volume-high - Used to override the default volume high icon.
 * @example
 * ```html
 * <media-mute-button></media-mute-button>
 * ```
 */
export class MuteButton extends ToggleButton {
  static override el = defineElement<MuteButtonAPI>({
    tagName: 'media-mute-button',
    props: toggleButtonProps,
  });

  protected _media!: MediaContext;
  protected override _keyShortcut: MediaKeyShortcut = 'toggleMuted';

  protected override onAttach(el: HTMLElement): void {
    this._media = useMedia();
    this._pressed = this._isPressed.bind(this);
    setARIALabel(el, this._getLabel.bind(this));

    this.setAttributes({
      'data-muted': this._pressed,
      'data-volume': this._getVolumeText.bind(this),
    });

    super.onAttach(el);
  }

  protected override _onPress(event: Event) {
    const remote = this._media.remote;
    this._pressed() ? remote.unmute(event) : remote.mute(event);
  }

  protected _isPressed() {
    const { muted, volume } = this._media.$store;
    return muted() || volume() === 0;
  }

  protected _getLabel() {
    return this._pressed() ? 'Unmute' : 'Mute';
  }

  protected _getVolumeText() {
    const { muted, volume } = this._media.$store,
      $volume = volume();
    if (muted() || $volume === 0) return 'muted';
    else if ($volume >= 0.5) return 'high';
    else if ($volume < 0.5) return 'low';
  }

  override render() {
    return (
      <>
        <Icon paths={volumeHighPaths} slot="volume-high" />
        <Icon paths={volumeLowPaths} slot="volume-low" />
        <Icon paths={mutePaths} slot="volume-muted" />
      </>
    );
  }
}

export interface MuteButtonAPI extends ToggleButtonAPI {}

export interface MediaMuteButtonElement extends HTMLCustomElement<MuteButton> {}
