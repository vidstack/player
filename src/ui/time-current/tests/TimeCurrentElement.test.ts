import '../../../define/vds-time-current';

import { elementUpdated } from '@open-wc/testing-helpers';
import { html } from 'lit';

import { buildMediaPlayerFixture } from '../../../media/test-utils';

async function buildFixture() {
  const { player } = await buildMediaPlayerFixture(html`
    <vds-time-current></vds-time-current>
  `);

  const timeCurrent = player.querySelector('vds-time-current')!;

  return { player, timeCurrent };
}

test('light DOM snapshot', async function () {
  const { timeCurrent } = await buildFixture();
  expect(timeCurrent).dom.to.equal(`
    <vds-time-current></vds-time-current>
  `);
});

test('shadow DOM snapshot', async function () {
  const { player, timeCurrent } = await buildFixture();

  player._mediaStore.currentTime.set(3750);
  await elementUpdated(timeCurrent);

  expect(timeCurrent).shadowDom.to.equal(`
    <time
      id="root"
      aria-label="Current media time"
      datetime="PT1H2M30S"
      part="root time"
    >
      1:02:30
    </time>
  `);
});

test('it should update as currentTime updates', async function () {
  const { player, timeCurrent } = await buildFixture();
  expect(timeCurrent.seconds).to.equal(0);
  player._mediaStore.currentTime.set(50);
  await elementUpdated(timeCurrent);
  expect(timeCurrent.seconds).to.equal(50);
});
