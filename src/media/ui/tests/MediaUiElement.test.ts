import '../../../define/vds-media-ui';

import { elementUpdated } from '@open-wc/testing-helpers';
import { html } from 'lit';

import { buildMediaPlayerFixture } from '../../test-utils';

async function buildFixture() {
  const { player } = await buildMediaPlayerFixture(html`
    <vds-media-ui>
      <div></div>
    </vds-media-ui>
  `);

  const ui = player.querySelector('vds-media-ui')!;

  return { player, ui };
}

test('light DOM snapshot', async function () {
  const { ui } = await buildFixture();
  expect(ui).dom.to.equal(`
    <vds-media-ui
      media-can-load media-type="unknown" media-paused media-view-type="unknown"
      style="--vds-media-buffered-amount: 0; --vds-media-current-time: 0; --vds-media-duration: 0; --vds-media-seekable-amount: 0;"
    >
      <div></div>
    </vds-media-ui>
  `);
});

test('shadow DOM snapshot', async function () {
  const { ui } = await buildFixture();
  expect(ui).shadowDom.to.equal(`<slot></slot>`);
});

test('it should toggle `media-can-play` attribute as `canPlay` changes', async function () {
  const { player, ui } = await buildFixture();

  expect(ui.hasAttribute('media-can-play')).to.be.false;

  player._store.canPlay.set(true);

  await elementUpdated(ui);

  expect(ui.hasAttribute('media-can-play')).to.be.true;
});
