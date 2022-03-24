import { vdsEvent } from '@vidstack/foundation';
import { css, type CSSResultGroup } from 'lit';

import { ViewType } from '../../media';
import { Html5MediaElement } from '../html5';

/**
 * @tagname vds-audio
 * @slot - Used to pass in `<audio>` element.
 * @example
 * ```html
 * <vds-audio>
 *   <audio src="https://media-files.vidstack.io/audio.mp3"></audio>
 * </vds-audio>
 * ```
 * @example
 * ```html
 * <vds-audio>
 *   <audio>
 *     <source src="https://media-files.vidstack.io/audio.mp3" type="audio/mp3" />
 *   </audio>
 * </vds-audio>
 * @example
 * ```html
 * <vds-audio loading="lazy">
 *   <audio preload="none" data-preload="metadata">
 *     <source src="https://media-files.vidstack.io/audio.mp3" type="audio/mp3" />
 *   </audio>
 * </vds-audio>
 * ```
 */
export class AudioElement extends Html5MediaElement {
  static override get styles(): CSSResultGroup {
    return [
      css`
        :host {
          display: inline-block;
        }

        :host([hidden]) {
          display: none;
        }
      `,
    ];
  }

  override connectedCallback(): void {
    super.connectedCallback();
    this.dispatchEvent(
      vdsEvent('vds-view-type-change', {
        detail: ViewType.Audio,
      }),
    );
  }
}
