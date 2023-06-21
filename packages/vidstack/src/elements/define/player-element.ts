import { Host } from 'maverick.js/element';
import type { Attributes } from 'maverick.js/element';

import { MediaPlayer } from '../../components';
import type { MediaPlayerProps } from '../../core/api/player-props';

/**
 * @docs {@link https://www.vidstack.io/docs/player/components/media/player}
 * @example
 * ```html
 * <media-player src="...">
 *   <media-provider></media-provider>
 *   <!-- Other components that use/manage media state here. -->
 * </media-player>
 * ```
 */
export class MediaPlayerElement extends Host(HTMLElement, MediaPlayer) {
  static tagName = 'media-player';

  static override attrs: Attributes<MediaPlayerProps> = {
    preferNativeHLS: 'prefer-native-hls',
    aspectRatio: {
      converter(value) {
        if (!value) return null;
        if (!value.includes('/')) return +value;
        const [width, height] = value.split('/').map(Number);
        return +(width / height).toFixed(4);
      },
    },
    textTracks: false,
  };
}

declare global {
  interface HTMLElementTagNameMap {
    'media-player': MediaPlayerElement;
  }
}
