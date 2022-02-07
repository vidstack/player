import { css, CSSResultGroup, html, LitElement, PropertyValues } from 'lit';
import { property, state } from 'lit/decorators.js';

import { isString } from '../../utils/unit';
import { MediaTextController } from './MediaTextController';

/**
 * Subscribes to some media state declared by the `value` attribute, and outputs its value
 * as text. This element also supports very basic arithmetic operations such as `+`,`-`,`*`,`/`.
 *
 * It can declare any media context propery that is of type `string` or `number`. For example:
 * `currentTime`, `duration`, `bufferedAmount`, and `seekableAmount`.
 *
 * @tagname vds-media-text
 * @example
 * ```html
 * <vds-media-text value="currentTime"></vds-media-text>
 * ```
 * @example
 * ```html
 * <!-- Remaining time. -->
 * <vds-media-text value="duration-currentTime"></vds-media-text>
 * ```
 */
export class MediaTextElement extends LitElement {
  static override get styles(): CSSResultGroup {
    return [
      css`
        :host {
          display: inline-block;
          contain: content;
        }

        :host([hidden]) {
          display: none;
        }
      `
    ];
  }

  /**
   * The media text value string.
   *
   * @example 'currentTime'
   * @example 'duration-currentTime'
   */
  @property() value?: string;

  @state() protected _text: string | null = null;

  protected _mediaTextController = new MediaTextController(this, (text) => {
    this._text = text;
  });

  override connectedCallback(): void {
    super.connectedCallback();
    this._mediaTextController.template = this.value;
  }

  protected override update(changedProperties: PropertyValues) {
    if (changedProperties.has('value')) {
      this._mediaTextController.template = this.value;
    }

    super.update(changedProperties);
  }

  protected override render() {
    return isString(this._text) ? html`${this._text}` : html``;
  }
}
