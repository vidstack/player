import { defineElement, type HTMLCustomElement } from 'maverick.js/element';
import fullscreenExitPaths from 'media-icons/dist/icons/fullscreen-exit.js';
import fullscreenPaths from 'media-icons/dist/icons/fullscreen.js';

import { Icon } from '../../../icons/icon';
import { $ariaBool } from '../../../utils/aria';
import { setARIALabel } from '../../../utils/dom';
import { useMedia, type MediaContext } from '../../core/api/context';
import type { MediaFullscreenRequestTarget } from '../../core/api/request-events';
import type { MediaKeyShortcut } from '../../core/keyboard/types';
import { ToggleButton, toggleButtonProps, type ToggleButtonProps } from './toggle-button';

declare global {
  interface MaverickElements {
    'media-fullscreen-button': MediaFullscreenButtonElement;
  }
}

/**
 * A button for toggling the fullscreen mode of the player.
 *
 * @docs {@link https://www.vidstack.io/docs/player/components/buttons/fullscreen-button}
 * @see {@link https://www.vidstack.io/docs/player/core-concepts/fullscreen}
 * @slot enter - Used to override the default enter fullscreen icon.
 * @slot exit - Used to override the default exit fullscreen icon.
 * @example
 * ```html
 * <media-fullscreen-button></media-fullscreen-button>
 * ```
 */
export class FullscreenButton extends ToggleButton<FullscreenButtonAPI> {
  static override el = defineElement<FullscreenButtonAPI>({
    tagName: 'media-fullscreen-button',
    props: {
      ...toggleButtonProps,
      target: 'prefer-media',
    },
  });

  protected _media!: MediaContext;
  protected override _keyShortcut: MediaKeyShortcut = 'toggleFullscreen';

  protected override onAttach(el: HTMLElement): void {
    this._media = useMedia();
    this._pressed = this._isPressed.bind(this);
    super.onAttach(el);

    setARIALabel(el, this._getLabel.bind(this));

    const { fullscreen } = this._media.$store;
    this.setAttributes({
      'aria-hidden': $ariaBool(this._isHidden.bind(this)),
      'data-fullscreen': fullscreen,
    });
  }

  protected override _onPress(event: Event) {
    const remote = this._media.remote,
      target = this.$props.target();
    this._pressed() ? remote.exitFullscreen(target, event) : remote.enterFullscreen(target, event);
  }

  protected _isPressed() {
    const { fullscreen } = this._media.$store;
    return fullscreen();
  }

  protected _isHidden() {
    const { canFullscreen } = this._media.$store;
    return !canFullscreen();
  }

  protected _getLabel() {
    const { fullscreen } = this._media.$store;
    return fullscreen() ? 'Exit Fullscreen' : 'Enter Fullscreen';
  }

  override render() {
    return (
      <>
        <Icon paths={fullscreenPaths} slot="enter" />
        <Icon paths={fullscreenExitPaths} slot="exit" />
      </>
    );
  }
}

export interface FullscreenButtonAPI {
  props: FullscreenButtonProps;
}

export interface FullscreenButtonProps extends ToggleButtonProps {
  /**
   * The target element on which to request fullscreen on. The target can be `media`
   * (i.e., `<media-player>`) or `provider`. The `prefer-media` option will first see if the native
   * fullscreen API is available, if not it'll try the media provider.
   */
  target: MediaFullscreenRequestTarget | undefined;
}

export interface MediaFullscreenButtonElement extends HTMLCustomElement<FullscreenButton> {}
