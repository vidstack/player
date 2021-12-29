import {
  CSSResultGroup,
  html,
  LitElement,
  PropertyValues,
  TemplateResult
} from 'lit';
import { property } from 'lit/decorators.js';

import { round } from '../../utils/number';
import { isString } from '../../utils/unit';
import { aspectRatioElementStyles } from './styles';

/**
 * This element creates a container that will hold the dimensions of the desired aspect ratio. This
 * container is useful for reserving space for media (img, video, etc.) as it loads over the
 * network.
 *
 * 💡 By default it respects the browser's default width and height for media. This is not specific
 * to the loaded media but instead a general setting of `1:2`.
 *
 * @tagname vds-aspect-ratio
 * @cssprop --vds-min-height - The minimum height of the container (defaults to `150px`).
 * @cssprop --vds-max-height - The maximum height of the container (defaults to `100vh`).
 * @cssprop --vds-aspect-ratio - The desired aspect ratio (defaults to `calc(150 / 300)`).
 * @example
 * ```html
 * <vds-aspect-ratio ratio="16:9">
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
   * The desired aspect ratio setting given as `'width:height'` (eg: `'16:9'`).
   */
  @property({ reflect: true })
  ratio = '2:1';

  /**
   * Whether the current `ratio` is a valid aspect ratio setting in the form `width:height`.
   */
  get isValidRatio() {
    return isString(this.ratio) ? /\d{1,2}:\d{1,2}/.test(this.ratio) : false;
  }

  protected override update(changedProperties: PropertyValues) {
    super.update(changedProperties);

    if (changedProperties.has('ratio')) {
      this._updateAspectRatio();
    }

    if (changedProperties.has('minHeight')) {
      this.style.setProperty('--vds-min-height', this.minHeight);
    }

    if (changedProperties.has('maxHeight')) {
      this.style.setProperty('--vds-max-height', this.maxHeight);
    }
  }

  override render(): TemplateResult {
    return html`<slot></slot>`;
  }

  protected _updateAspectRatio() {
    if (this.isValidRatio) {
      const [width, height] = this._parseAspectRatio();
      const roundedRatio = round(height / width, 4);
      this.style.setProperty('--vds-aspect-ratio', String(roundedRatio));
    } else {
      this.style.setProperty('--vds-aspect-ratio', '0.5');
    }
  }

  protected _parseAspectRatio(): [number, number] {
    return this.ratio!.split(':').map(Number) as [number, number];
  }
}
