import { Host } from 'maverick.js/element';
import { FullscreenButton } from '../../../components';
import { useMediaContext } from '../../../core/api/media-context';
import { StateController } from '../../state-controller';

/**
 * @example
 * ```html
 * <media-fullscreen-button>
 *   <media-icon type="fullscreen" data-state="enter"></media-icon>
 *   <media-icon type="fullscreen-exit" data-state="exit"></media-icon>
 * </media-fullscreen-button>
 * ```
 */
export class MediaFullscreenButtonElement extends Host(HTMLElement, FullscreenButton) {
  static tagName = 'media-fullscreen-button';

  protected onConnect() {
    const media = useMediaContext();
    new StateController(this, () => {
      const isFullscreen = media.$state.fullscreen();
      return { enter: !isFullscreen, exit: isFullscreen };
    });
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'media-fullscreen-button': MediaFullscreenButtonElement;
  }
}
