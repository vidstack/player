import { Host } from 'maverick.js/element';
import { PIPButton } from '../../../components';
import { useMediaContext } from '../../../core/api/media-context';
import { StateController } from '../../state-controller';

/**
 * @example
 * ```html
 * <media-pip-button>
 *   <media-icon type="picture-in-picture" data-state="enter"></media-icon>
 *   <media-icon type="picture-in-picture-exit" data-state="exit"></media-icon>
 * </media-pip-button>
 * ```
 */
export class MediaPIPButtonElement extends Host(HTMLElement, PIPButton) {
  static tagName = 'media-pip-button';

  protected onConnect() {
    const media = useMediaContext();
    new StateController(this, () => {
      const isPIP = media.$state.pictureInPicture();
      return { enter: !isPIP, exit: isPIP };
    });
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'media-pip-button': MediaPIPButtonElement;
  }
}
