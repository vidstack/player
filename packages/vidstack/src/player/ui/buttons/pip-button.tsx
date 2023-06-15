import { defineElement, type HTMLCustomElement } from 'maverick.js/element';
import pictureInPictureExitPaths from 'media-icons/dist/icons/picture-in-picture-exit.js';
import pictureInPicturePaths from 'media-icons/dist/icons/picture-in-picture.js';

import { Icon } from '../../../icons/icon';
import { $ariaBool } from '../../../utils/aria';
import { setARIALabel } from '../../../utils/dom';
import { useMedia, type MediaContext } from '../../core/api/context';
import type { MediaKeyShortcut } from '../../core/keyboard/types';
import { ToggleButton, toggleButtonProps, type ToggleButtonAPI } from './toggle-button';

declare global {
  interface MaverickElements {
    'media-pip-button': MediaPIPButtonElement;
  }
}

/**
 * A button for toggling the picture-in-picture (PIP) mode of the player.
 *
 * @docs {@link https://www.vidstack.io/docs/player/components/buttons/pip-button}
 * @see {@link https://www.vidstack.io/docs/player/core-concepts/picture-in-picture}
 * @slot enter - Used to override the default enter PIP icon.
 * @slot exit - Used to override the default exit PIP icon.
 * @example
 * ```html
 * <media-pip-button></media-pip-button>
 * ```
 */
export class PIPButton extends ToggleButton {
  static override el = defineElement<PIPButtonAPI>({
    tagName: 'media-pip-button',
    props: toggleButtonProps,
  });

  protected _media!: MediaContext;
  protected override _keyShortcut: MediaKeyShortcut = 'togglePictureInPicture';

  protected override onAttach(el: HTMLElement): void {
    this._media = useMedia();
    this._pressed = this._isPressed.bind(this);
    super.onAttach(el);

    setARIALabel(el, this._getLabel.bind(this));

    const { pictureInPicture } = this._media.$store;
    this.setAttributes({
      'aria-hidden': $ariaBool(this._isHidden.bind(this)),
      'data-pip': pictureInPicture,
    });
  }

  protected override _onPress(event: Event) {
    const remote = this._media.remote;
    this._pressed() ? remote.exitPictureInPicture(event) : remote.enterPictureInPicture(event);
  }

  protected _isPressed() {
    const { pictureInPicture } = this._media.$store;
    return pictureInPicture();
  }

  protected _isHidden() {
    const { canPictureInPicture } = this._media.$store;
    return !canPictureInPicture();
  }

  protected _getLabel() {
    const { pictureInPicture } = this._media.$store;
    return pictureInPicture() ? 'Exit Picture In Picture' : 'Enter Picture In Picture';
  }

  override render() {
    return (
      <>
        <Icon paths={pictureInPicturePaths} slot="enter" />
        <Icon paths={pictureInPictureExitPaths} slot="exit" />
      </>
    );
  }
}

export interface PIPButtonAPI extends ToggleButtonAPI {}

export interface MediaPIPButtonElement extends HTMLCustomElement<PIPButton> {}
