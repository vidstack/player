import { html, LitElement } from 'lit';
import { property } from 'lit/decorators.js';

import { StorybookControl } from '../../foundation/storybook/StorybookControl.js';
import { scrimElementStyles } from './styles.js';

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
  /**
   * @type {import('lit').CSSResultGroup}
   */
  static get styles() {
    return [scrimElementStyles];
  }

  // -------------------------------------------------------------------------------------------
  // Properties
  // -------------------------------------------------------------------------------------------

  /**
   * The direction of the gradient.
   *
   * @type {'up' | 'down'}
   */
  @property({ reflect: true })
  direction = 'up';

  // -------------------------------------------------------------------------------------------
  // Lifecycle
  // -------------------------------------------------------------------------------------------

  render() {
    return html`
      <div id="gradient" part=${this.getGradientPartAttr()}>
        ${this.renderGradientSlot()}
      </div>
    `;
  }

  /**
   * @protected
   * @returns {string}
   */
  getGradientPartAttr() {
    return 'gradient';
  }

  /**
   * @protected
   * @returns {import('lit').TemplateResult}
   */
  renderGradientSlot() {
    return html`<slot></slot>`;
  }
}

export const SCRIM_STORYBOOK_ARG_TYPES = {
  direction: {
    control: StorybookControl.Select,
    options: ['up', 'down'],
    defaultValue: 'up'
  }
};
