import '../../../define/vds-time-duration';

import { elementUpdated } from '@open-wc/testing-helpers';
import { html } from 'lit';

import { buildMediaPlayerFixture } from '../../../media/test-utils';

async function buildFixture() {
  const { player } = await buildMediaPlayerFixture(html`
    <vds-time-duration></vds-time-duration>
  `);

  const timeDuration = player.querySelector('vds-time-duration')!;

  return { player, timeDuration };
}

test('light DOM snapshot', async function () {
  const { timeDuration } = await buildFixture();
  expect(timeDuration).dom.to.equal(`
    <vds-time-duration></vds-time-duration>
  `);
});

test('shadow DOM snapshot', async function () {
  const { player, timeDuration } = await buildFixture();

  player._mediaStore.duration.set(3750);
  await elementUpdated(timeDuration);

  expect(timeDuration).shadowDom.to.equal(`
    <time
      id="root"
      aria-label="Media duration"
      datetime="PT1H2M30S"
      part="root time"
    >
      1:02:30
    </time>
  `);
});

test('it should update as duration updates', async function () {
  const { player, timeDuration } = await buildFixture();
  expect(timeDuration.seconds).to.equal(0);
  player._mediaStore.duration.set(50);
  await elementUpdated(timeDuration);
  expect(timeDuration.seconds).to.equal(50);
  player._mediaStore.duration.set(100);
  await elementUpdated(timeDuration);
  expect(timeDuration.seconds).to.equal(100);
});
