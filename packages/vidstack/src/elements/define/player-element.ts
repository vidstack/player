import { Host } from 'maverick.js/element';
import type { Attributes } from 'maverick.js/element';

import { MediaPlayer } from '../../components';
import type { MediaPlayerProps } from '../../core/api/player-props';

/**
 * @docs {@link https://www.vidstack.io/docs/wc/player/components/core/player}
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
  };
}

declare global {
  interface HTMLElementTagNameMap {
    'media-player': MediaPlayerElement;
  }
}
