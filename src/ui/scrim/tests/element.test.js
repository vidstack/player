import { expect, fixture } from '@open-wc/testing';
import { html } from 'lit';

import { SCRIM_ELEMENT_TAG_NAME, ScrimElement } from '../ScrimElement.js';

window.customElements.define(SCRIM_ELEMENT_TAG_NAME, ScrimElement);

describe(SCRIM_ELEMENT_TAG_NAME, function () {
  // eslint-disable-next-line jsdoc/require-jsdoc
  async function buildFixture() {
    const scrim = /** @type {ScrimElement} */ (
      await fixture(html`<vds-scrim></vds-scrim>`)
    );

    return { scrim };
  }

  it('should render DOM correctly', async function () {
    const { scrim } = await buildFixture();
    expect(scrim).dom.to.equal(`
      <vds-scrim direction="up"></vds-scrim>
    `);
  });

  it('should render shadow DOM correctly', async function () {
    const { scrim } = await buildFixture();
    expect(scrim).shadowDom.to.equal(`
      <div id="gradient" part="gradient">
        <slot></slot>
      </div>
    `);
  });
});
