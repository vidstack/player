import { elementUpdated, expect } from '@open-wc/testing';
import { html } from 'lit';

import { buildMediaFixture } from '../../../../media/test-utils/index.js';
import {
  TOGGLE_BUTTON_ELEMENT_TAG_NAME,
  ToggleButtonElement
} from '../ToggleButtonElement.js';

window.customElements.define(
  TOGGLE_BUTTON_ELEMENT_TAG_NAME,
  ToggleButtonElement
);

describe(TOGGLE_BUTTON_ELEMENT_TAG_NAME, function () {
  // eslint-disable-next-line jsdoc/require-jsdoc
  async function buildFixture() {
    const { container } = await buildMediaFixture(html`
      <vds-toggle-button>
        <div class="pressed" slot="pressed"></div>
        <div class="not-pressed"></div>
      </vds-toggle-button>
    `);

    const toggle = /** @type {ToggleButtonElement} */ (
      container.querySelector(TOGGLE_BUTTON_ELEMENT_TAG_NAME)
    );

    return { toggle };
  }

  it('should render DOM correctly', async function () {
    const { toggle } = await buildFixture();
    expect(toggle).dom.to.equal(`
      <vds-toggle-button>
        <div class="pressed" slot="pressed" hidden></div>
        <div class="not-pressed"></div>
      </vds-toggle-button>
    `);
  });

  it('should render shadow DOM correctly', async function () {
    const { toggle } = await buildFixture();
    expect(toggle).shadowDom.to.equal(`
      <vds-button
        id="root"
        class="root"
        part="root button"
				type="button"
        exportparts="root: button-root"
      >
        <slot name="pressed"></slot>
        <slot></slot>
      </button>
    `);
  });

  it('should toggle pressed state correctly', async function () {
    const { toggle } = await buildFixture();
    const button = toggle.rootElement;

    toggle.pressed = false;
    await elementUpdated(toggle);

    expect(button).to.not.have.attribute('pressed');

    toggle.pressed = true;
    await elementUpdated(toggle);

    expect(button).to.have.attribute('pressed');
  });

  it('should set disabled attribute', async function () {
    const { toggle } = await buildFixture();
    const button = toggle.rootElement;

    toggle.disabled = true;
    await elementUpdated(toggle);

    expect(button).to.have.attribute('disabled');
  });
});
