import '../define';

import { elementUpdated, expect } from '@open-wc/testing';
import { html } from 'lit';

import { buildMediaPlayerFixture } from '../../test-utils';
import { MEDIA_UI_ELEMENT_TAG_NAME } from '../MediaUiElement';

describe(MEDIA_UI_ELEMENT_TAG_NAME, function () {
  async function buildFixture() {
    const { player } = await buildMediaPlayerFixture(html`
      <vds-media-ui>
        <div></div>
      </vds-media-ui>
    `);

    const ui = player.querySelector(MEDIA_UI_ELEMENT_TAG_NAME)!;

    return { player, ui };
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
    const { player, ui } = await buildFixture();

    expect(ui).to.have.attribute('hidden');

    player.ctx.canPlay = true;
    await elementUpdated(ui);

    expect(ui).to.not.have.attribute('hidden');
  });
});
