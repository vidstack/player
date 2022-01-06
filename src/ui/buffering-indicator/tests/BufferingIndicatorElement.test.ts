import '../../../define/vds-buffering-indicator';

import { elementUpdated } from '@open-wc/testing-helpers';
import { html } from 'lit';

import { buildMediaPlayerFixture } from '../../../media/test-utils';

async function buildFixture() {
  const { player } = await buildMediaPlayerFixture(html`
    <vds-buffering-indicator>
      <div class="slot"></div>
    </vds-buffering-indicator>
  `);

  const bufferingIndicator = player.querySelector('vds-buffering-indicator')!;

  return { player, bufferingIndicator };
}

test('light DOM snapshot', async function () {
  const { bufferingIndicator } = await buildFixture();
  expect(bufferingIndicator).dom.to.equal(`
    <vds-buffering-indicator>
      <div class="slot"></div>
    </vds-buffering-indicator>
  `);
});

test('shadow DOM snapshot', async function () {
  const { bufferingIndicator } = await buildFixture();
  expect(bufferingIndicator).shadowDom.to.equal(`<slot></slot>`);
});

test('it should toggle `media-can-play` attribute', async function () {
  const { player, bufferingIndicator } = await buildFixture();
  player._mediaStore.canPlay.set(true);
  await elementUpdated(bufferingIndicator);
  expect(bufferingIndicator.hasAttribute('media-can-play')).to.be.true;
  player._mediaStore.canPlay.set(false);
  await elementUpdated(bufferingIndicator);
  expect(bufferingIndicator.hasAttribute('media-can-play')).to.be.false;
});

test('it should toggle `media-waiting` attribute', async function () {
  const { player, bufferingIndicator } = await buildFixture();
  player._mediaStore.waiting.set(true);
  await elementUpdated(bufferingIndicator);
  expect(bufferingIndicator.hasAttribute('media-waiting')).to.be.true;
  player._mediaStore.waiting.set(false);
  await elementUpdated(bufferingIndicator);
  expect(bufferingIndicator.hasAttribute('media-waiting')).to.be.false;
});

test('it should toggle `media-ended` attribute', async function () {
  const { player, bufferingIndicator } = await buildFixture();
  await player.forceMediaReady();
  player._mediaStore.ended.set(true);
  await elementUpdated(bufferingIndicator);
  expect(bufferingIndicator.hasAttribute('media-ended')).to.be.true;
  player._mediaStore.ended.set(false);
  await elementUpdated(bufferingIndicator);
  expect(bufferingIndicator.hasAttribute('media-ended')).to.be.false;
});
