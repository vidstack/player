import { isString } from '@vidstack/foundation';
import { type CSSResultGroup, html, LitElement, type TemplateResult } from 'lit';
import { property } from 'lit/decorators.js';
import { styleMap } from 'lit/directives/style-map.js';

import { aspectRatioElementStyles } from './styles';

/**
 * This element creates a container that will hold the dimensions of the desired aspect ratio. This
 * container is useful for reserving space for media as it loads over the network.
 *
 * 💡  If your browser matrix supports the
 * [`aspect-ratio`](https://developer.mozilla.org/en-US/docs/Web/CSS/aspect-ratio) CSS property
 * then you can skip using this component, and set the desired aspect ratio directly on the
 * provider element.
 *
 * 💡 By default it respects the browser's default aspect-ratio for media. This is not specific
 * to the loaded media but instead a general setting of `2/1`.
 *
 * @tagname vds-aspect-ratio
 * @slot - Used to pass in a media provider element.
 * @example
 * ```html
 * <vds-aspect-ratio ratio="16/9">
 *  <vds-video>
 *   <!-- ... -->
 *  </vds-video>
 * </vds-aspect-ratio>
 * ```
 */
export class AspectRatioElement extends LitElement {
  static override get styles(): CSSResultGroup {
    return [aspectRatioElementStyles];
  }

  /**
   * The minimum height of the container.
   */
  @property({ attribute: 'min-height', reflect: true })
  minHeight = '150px';

  /**
   * The maximum height of the container.
   */
  @property({ attribute: 'max-height', reflect: true })
  maxHeight = '100vh';

  /**
   * The desired aspect ratio setting given as `'width/height'` (eg: `'16/9'`).
   */
  @property({ reflect: true })
  ratio = '2/1';

  /**
   * Whether the current `ratio` is a valid aspect ratio setting in the form `width/height`.
   */
  get isValidRatio() {
    return isString(this.ratio) ? /\d{1,2}\s*?(?:\/|:)\s*?\d{1,2}/.test(this.ratio) : false;
  }

  override render(): TemplateResult {
    return html`
      <div
        class="container"
        style=${styleMap({
          '--vds-aspect-ratio-percent': this._getAspectRatioPercent(),
          '--vds-aspect-ratio-min-height': this.minHeight ?? '150px',
          '--vds-aspect-ratio-max-height': this.maxHeight ?? '100vh',
        })}
      >
        <slot></slot>
      </div>
    `;
  }

  protected _getAspectRatioPercent() {
    if (this.isValidRatio) {
      const [width, height] = this._parseAspectRatio();
      return `${(height / width) * 100}%`;
    }

    return '50%';
  }

  protected _parseAspectRatio(): [number, number] {
    return this.ratio!.split(/\s*?(?:\/|:)\s*?/).map(Number) as [number, number];
  }
}
