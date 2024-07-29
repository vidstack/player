import { Component } from 'maverick.js';

import { useMediaContext, type MediaContext } from '../../../core/api/media-context';
import type {
  MediaFullscreenRequestTarget,
  MediaRequestEvents,
} from '../../../core/api/media-request-events';
import { $ariaBool } from '../../../utils/aria';
import { setARIALabel } from '../../../utils/dom';
import {
  ToggleButtonController,
  type ToggleButtonControllerProps,
} from './toggle-button-controller';

export interface FullscreenButtonProps extends ToggleButtonControllerProps {
  /**
   * The target element on which to request fullscreen on. The target can be `media`
   * (i.e., `<media-player>`) or `provider`. The `prefer-media` option will first see if the native
   * fullscreen API is available, if not it'll try the media provider.
   */
  target: MediaFullscreenRequestTarget | undefined;
}

export interface FullscreenButtonEvents
  extends Pick<
    MediaRequestEvents,
    'media-enter-fullscreen-request' | 'media-exit-fullscreen-request'
  > {}

/**
 * A button for toggling the fullscreen mode of the player.
 *
 * @attr data-active - Whether fullscreen mode is active.
 * @attr data-supported - Whether fullscreen mode is supported.
 * @docs {@link https://www.vidstack.io/docs/player/components/buttons/fullscreen-button}
 * @see {@link https://www.vidstack.io/docs/player/api/fullscreen}
 */
export class FullscreenButton extends Component<FullscreenButtonProps, {}, FullscreenButtonEvents> {
  static props: FullscreenButtonProps = {
    ...ToggleButtonController.props,
    target: 'prefer-media',
  };

  #media!: MediaContext;

  constructor() {
    super();
    new ToggleButtonController({
      isPresssed: this.#isPressed.bind(this),
      keyShortcut: 'toggleFullscreen',
      onPress: this.#onPress.bind(this),
    });
  }

  protected override onSetup(): void {
    this.#media = useMediaContext();

    const { fullscreen } = this.#media.$state,
      isSupported = this.#isSupported.bind(this);

    this.setAttributes({
      'data-active': fullscreen,
      'data-supported': isSupported,
      'aria-hidden': $ariaBool(() => !isSupported()),
    });
  }

  protected override onAttach(el: HTMLElement): void {
    el.setAttribute('data-media-tooltip', 'fullscreen');
    setARIALabel(el, 'Fullscreen');
  }

  #onPress(event: Event) {
    const remote = this.#media.remote,
      target = this.$props.target();
    this.#isPressed()
      ? remote.exitFullscreen(target, event)
      : remote.enterFullscreen(target, event);
  }

  #isPressed() {
    const { fullscreen } = this.#media.$state;
    return fullscreen();
  }

  #isSupported() {
    const { canFullscreen } = this.#media.$state;
    return canFullscreen();
  }
}
