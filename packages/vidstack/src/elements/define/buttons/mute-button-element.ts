import { Host } from 'maverick.js/element';
import { MuteButton } from '../../../components';
import { useMediaContext } from '../../../core/api/media-context';
import { StateController } from '../../state-controller';

/**
 * @example
 * ```html
 * <media-mute-button>
 *   <media-icon type="mute" data-state="volume-muted"></media-icon>
 *   <media-icon type="volume-low" data-state="volume-low"></media-icon>
 *   <media-icon type="volume-high" data-state="volume-high"></media-icon>
 * </media-mute-button>
 * ```
 */
export class MediaMuteButtonElement extends Host(HTMLElement, MuteButton) {
  static tagName = 'media-mute-button';

  protected onConnect() {
    const media = useMediaContext();
    new StateController(this, () => {
      const { muted, volume } = media.$state,
        isMuted = muted() || volume() === 0,
        isLowVolume = !isMuted && volume() < 0.5,
        isHighVolume = !isMuted && volume() >= 0.5;
      return {
        mute: isMuted,
        unmute: !isMuted,
        'volume-mute': isMuted,
        'volume-low': isLowVolume,
        'volume-high': isHighVolume,
      };
    });
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'media-mute-button': MediaMuteButtonElement;
  }
}
