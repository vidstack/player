import type { HTMLCustomElement } from 'maverick.js/element';

import type { MediaButtonProps } from '../button/types';

export interface SeekButtonProps extends MediaButtonProps {
  /**
   * The amount to seek the media playback forwards (positive number) or backwards (negative number)
   * when the seek button is pressed.
   */
  seconds: number;
}

/**
 * A button for seeking the current media playback forwards or backwards by a specified amount.
 *
 * @docs {@link https://www.vidstack.io/docs/player/components/buttons/seek-button}
 * @slot forward - Used to override the default seek forward icon.
 * @slot backward - Used to override the default seek backward icon.
 * @example
 * ```html
 * <!-- Forward +30s on each press. -->
 * <media-seek-button seconds="+30"></media-seek-button>
 * <!-- Backward -30s on each press. -->
 * <media-seek-button seconds="-30"></media-seek-button>
 * ```
 */
export interface MediaSeekButtonElement extends HTMLCustomElement<SeekButtonProps> {}
