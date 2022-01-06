import { elementUpdated, expect } from '@open-wc/testing';
import { html } from 'lit';

import { buildMediaPlayerFixture } from '../../../media/test-utils';
import {
  TIME_DURATION_ELEMENT_TAG_NAME,
  TimeDurationElement
} from '../TimeDurationElement';

window.customElements.define(
  TIME_DURATION_ELEMENT_TAG_NAME,
  TimeDurationElement
);

describe(`${TIME_DURATION_ELEMENT_TAG_NAME}`, function () {
  async function buildFixture() {
    const { player } = await buildMediaPlayerFixture(html`
      <vds-time-duration></vds-time-duration>
    `);

    const timeDuration = player.querySelector(TIME_DURATION_ELEMENT_TAG_NAME)!;

    return { player, timeDuration };
  }

  test('it should render DOM correctly', async function () {
    const { timeDuration } = await buildFixture();
    expect(timeDuration).dom.to.equal(`
      <vds-time-duration></vds-time-duration>
    `);
  });

  test('it should render shadow DOM correctly', async function () {
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

  test('it should update duration time as context updates', async function () {
    const { player, timeDuration } = await buildFixture();
    expect(timeDuration.seconds).to.equal(0);
    player._mediaStore.duration.set(50);
    await elementUpdated(timeDuration);
    expect(timeDuration.seconds).to.equal(50);
    player._mediaStore.duration.set(-1);
    await elementUpdated(timeDuration);
    expect(timeDuration.seconds).to.equal(0);
  });
});
