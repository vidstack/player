import { vdsEvent } from '@vidstack/foundation';
import { css, type CSSResultGroup } from 'lit';

import { ViewType } from '../../media';
import { Html5MediaElement } from '../html5';

/**
 * The `<vds-audio>` element adapts the underlying `<audio>` element to satisfy the media provider
 * contract, which generally involves providing a consistent API for loading, managing, and
 * tracking media state.
 *
 * Most the logic for this element is contained in the `Html5MediaElement` class because both the
 * `<audio>` and `<video>` elements implement the native `HTMLMediaElement` interface.
 *
 * @tagname vds-audio
 * @slot - Used to pass in the `<audio>` element.
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/HTML/Element/audio}
 * @example
 * ```html
 * <vds-audio>
 *   <audio
 *     controls
 *     preload="none"
 *     src="https://media-files.vidstack.io/audio.mp3"
 *    ></audio>
 * </vds-audio>
 * ```
 * @example
 * ```html
 * <vds-audio>
 *   <audio controls preload="none">
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
