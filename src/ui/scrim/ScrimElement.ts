import { CSSResultGroup, html, LitElement, TemplateResult } from 'lit';
import { property } from 'lit/decorators.js';

import { ElementLogger } from '../../base/logger';
import { DEV_MODE } from '../../env';
import { scrimElementStyles } from './styles';

export const SCRIM_ELEMENT_TAG_NAME = 'vds-scrim';

/**
 * A darkened overlay (gradient) that covers the video to enable controls placed on it to be more
 * visible. The gradient is a base64 pre-defined image for the best possible gradient transition.
 * One caveat is it has a fixed height of 258px. Change the background-image to your liking or use
 * CSS to override the `gradient` part.
 *
 * @tagname vds-scrim
 * @csspart gradient - The gradient element.
 * @slot - Used to pass content inside the gradient.
 */
export class ScrimElement extends LitElement {
  static override get styles(): CSSResultGroup {
    return [scrimElementStyles];
  }

  // -------------------------------------------------------------------------------------------
  // Properties
  // -------------------------------------------------------------------------------------------

  /* c8 ignore next */
  protected readonly _logger = DEV_MODE && new ElementLogger(this);

  /**
   * The direction of the gradient.
   */
  @property({ reflect: true })
  direction: 'up' | 'down' = 'up';

  // -------------------------------------------------------------------------------------------
  // Lifecycle
  // -------------------------------------------------------------------------------------------

  protected override render(): TemplateResult {
    return html`
      <div id="gradient" part="gradient">${this._renderGradientSlot()}</div>
    `;
  }

  protected _renderGradientSlot(): TemplateResult {
    return html`<slot></slot>`;
  }
}
