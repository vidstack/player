import { isString, setCSSProperty } from '@vidstack/foundation';
import {
  type CSSResultGroup,
  html,
  LitElement,
  type PropertyValues,
  type TemplateResult,
} from 'lit';
import { property } from 'lit/decorators.js';

import { aspectRatioElementStyles } from './styles.js';

/**
 * This element creates a container that will hold the dimensions of the desired aspect ratio. This
 * container is useful for reserving space for media as it loads over the network.
 *
 * 💡  If your browser matrix supports the
 * [`aspect-ratio`](https://developer.mozilla.org/en-US/docs/Web/CSS/aspect-ratio) CSS property
 * then you can skip using this component, and set the desired aspect ratio directly on the
 * provider.
 *
 * 💡 By default it respects the browser's default aspect-ratio for media. This is not specific
 * to the loaded media but instead a general setting of `2/1`.
 *
 * @tagname vds-aspect-ratio
 * @example
 * ```html
 * <vds-aspect-ratio ratio="16/9">
 *   <vds-video-player>
 *     <!-- ... -->
 *   </vds-video-player>
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

  protected override update(changedProperties: PropertyValues) {
    super.update(changedProperties);

    if (changedProperties.has('ratio')) {
      this._updateAspectRatio();
    }

    if (changedProperties.has('minHeight')) {
      setCSSProperty(this, 'min-height', this.minHeight);
    }

    if (changedProperties.has('maxHeight')) {
      setCSSProperty(this, 'max-height', this.maxHeight);
    }
  }

  override render(): TemplateResult {
    return html`<slot></slot>`;
  }

  protected _updateAspectRatio() {
    if (this.isValidRatio) {
      const [width, height] = this._parseAspectRatio();
      setCSSProperty(this, 'aspect-ratio-percent', `${(height / width) * 100}%`);
    } else {
      setCSSProperty(this, 'aspect-ratio-percent', '50%');
    }
  }

  protected _parseAspectRatio(): [number, number] {
    return this.ratio!.split(/\s*?(?:\/|:)\s*?/).map(Number) as [number, number];
  }
}
