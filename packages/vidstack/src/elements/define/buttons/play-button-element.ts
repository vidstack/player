import { Host } from 'maverick.js/element';
import { PlayButton } from '../../../components';
import { useMediaContext } from '../../../core/api/media-context';
import { StateController } from '../../state-controller';

/**
 * @example
 * ```html
 * <media-play-button>
 *   <media-icon type="play" data-state="play"></media-icon>
 *   <media-icon type="pause" data-state="pause"></media-icon>
 *   <media-icon type="replay" data-state="replay"></media-icon>
 * </media-play-button>
 * ```
 */
export class MediaPlayButtonElement extends Host(HTMLElement, PlayButton) {
  static tagName = 'media-play-button';

  protected onConnect() {
    const media = useMediaContext();
    new StateController(this, () => {
      const { paused, ended } = media.$state;
      return {
        play: paused() && !ended(),
        pause: !paused(),
        replay: ended(),
      };
    });
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'media-play-button': MediaPlayButtonElement;
  }
}
