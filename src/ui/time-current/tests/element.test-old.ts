import { elementUpdated, expect } from '@open-wc/testing';
import { html } from 'lit';

import { buildMediaPlayerFixture } from '../../../media/test-utils';
import {
  TIME_CURRENT_ELEMENT_TAG_NAME,
  TimeCurrentElement
} from '../TimeCurrentElement';

window.customElements.define(TIME_CURRENT_ELEMENT_TAG_NAME, TimeCurrentElement);

describe(`${TIME_CURRENT_ELEMENT_TAG_NAME}`, function () {
  async function buildFixture() {
    const { player } = await buildMediaPlayerFixture(html`
      <vds-time-current></vds-time-current>
    `);

    const timeCurrent = player.querySelector(TIME_CURRENT_ELEMENT_TAG_NAME)!;

    return { player, timeCurrent };
  }

  test('it should render DOM correctly', async function () {
    const { timeCurrent } = await buildFixture();
    expect(timeCurrent).dom.to.equal(`
      <vds-time-current></vds-time-current>
    `);
  });

  test('it should render shadow DOM correctly', async function () {
    const { player, timeCurrent } = await buildFixture();

    player.ctx.currentTime = 3750;
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

  test('it should update current time as context updates', async function () {
    const { player, timeCurrent } = await buildFixture();
    expect(timeCurrent.seconds).to.equal(0);
    player.ctx.currentTime = 50;
    await elementUpdated(timeCurrent);
    expect(timeCurrent.seconds).to.equal(50);
  });
});
