import '../define.js';

import { elementUpdated, expect } from '@open-wc/testing';
import { html } from 'lit';

import { getSlottedChildren } from '../../../utils/dom.js';
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
        <div class="slot"></div>
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
      <vds-media-ui>
        <div class="slot"></div>
      </vds-media-ui>
    `);
  });

  it('should render shadow DOM correctly', async function () {
    const { ui } = await buildFixture();
    expect(ui).shadowDom.to.equal(`
      <div
        id="root"
        part="root root-hidden"
      >
        <slot />
      </div>
    `);
  });

  it('should render <slot>', async function () {
    const { ui } = await buildFixture();
    const slottedChildren = getSlottedChildren(ui);
    expect(slottedChildren).to.have.length(1);
    expect(slottedChildren[0]).to.have.class('slot');
  });

  // TODO: works but for some reason not updating in test env...?
  // eslint-disable-next-line mocha/no-skipped-tests
  it.skip('should toggle root-hidden css part as context updates', async function () {
    // Not ready.
    const { provider, ui } = await buildFixture();
    const root = ui.rootElement;
    expect(root.getAttribute('part')).to.include('root-hidden');

    // Ready.
    provider.context.canPlay = true;
    await elementUpdated(ui);
    expect(root.getAttribute('part')).to.equal('root');
  });

  it('should return element [rootElement]', async function () {
    const { ui } = await buildFixture();
    expect(ui.rootElement).to.be.instanceOf(HTMLDivElement);
  });
});
