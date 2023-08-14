import { Host } from 'maverick.js/element';
import { CaptionButton } from '../../../components';
import { isTrackCaptionKind } from '../../../core';
import { useMediaContext } from '../../../core/api/media-context';
import { StateController } from '../../state-controller';

/**
 * @example
 * ```html
 * <media-caption-button>
 *   <media-icon type="closed-captions-on" data-state="on"></media-icon>
 *   <media-icon type="closed-captions" data-state="off"></media-icon>
 * </media-caption-button>
 * ```
 */
export class MediaCaptionButtonElement extends Host(HTMLElement, CaptionButton) {
  static tagName = 'media-caption-button';

  protected onConnect() {
    const media = useMediaContext();
    new StateController(this, () => {
      const { textTrack } = media.$state,
        track = textTrack(),
        isOn = !!track && isTrackCaptionKind(track);
      return { on: isOn, off: !isOn };
    });
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'media-caption-button': MediaCaptionButtonElement;
  }
}
