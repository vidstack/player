import '../define.js';

import { elementUpdated, expect } from '@open-wc/testing';
import { getSlottedChildren } from '@utils/dom.js';
import { html } from 'lit';

import { buildMediaFixture } from '../../test-utils/index.js';
import {
  MEDIA_UI_ELEMENT_TAG_NAME,
  MediaUiElement
} from '../MediaUiElement.js';

// Why do we need this? `../define ` import at the top of this file is being called correctly.
window.customElements.define(MEDIA_UI_ELEMENT_TAG_NAME, MediaUiElement);

describe(MEDIA_UI_ELEMENT_TAG_NAME, function () {
  // eslint-disable-next-line jsdoc/require-jsdoc
  async function buildFixture() {
    const { container, provider } = await buildMediaFixture(html`
      <vds-media-ui>
        <div></div>
      </vds-media-ui>
    `);

    const ui = /** @type {MediaUiElement} */ (
      container.querySelector(MEDIA_UI_ELEMENT_TAG_NAME)
    );

    return { provider, ui };
  }

  it('should render DOM correctly', async function () {
    const { ui } = await buildFixture();
    expect(ui).dom.to.equal(`
      <vds-media-ui hidden>
        <div></div>
      </vds-media-ui>
    `);
  });

  it('should render shadow DOM correctly', async function () {
    const { ui } = await buildFixture();
    expect(ui).shadowDom.to.equal(`<slot></slot>`);
  });

  it('should toggle hidden attribute as context updates', async function () {
    const { provider, ui } = await buildFixture();

    expect(ui).to.have.attribute('hidden');

    provider.ctx.canPlay = true;
    await elementUpdated(ui);

    expect(ui).to.not.have.attribute('hidden');
  });
});
