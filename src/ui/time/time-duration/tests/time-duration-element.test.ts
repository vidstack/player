import { elementUpdated, expect } from '@open-wc/testing';
import { html } from 'lit';

import { FakeMediaProviderElement } from '../../../../core';
import { buildMediaFixture } from '../../../../core/fakes/fakes.helpers';
import { TimeDurationElement } from '../TimeDurationElement';
import { VDS_TIME_DURATION_ELEMENT_TAG_NAME } from '../vds-time-duration';

describe(`${VDS_TIME_DURATION_ELEMENT_TAG_NAME}`, () => {
  async function buildFixture(): Promise<{
    provider: FakeMediaProviderElement;
    timeDuration: TimeDurationElement;
  }> {
    const { container, provider } = await buildMediaFixture(html`
      <vds-time-duration></vds-time-duration>
    `);

    const timeDuration = container.querySelector(
      VDS_TIME_DURATION_ELEMENT_TAG_NAME,
    ) as TimeDurationElement;

    return { provider, timeDuration };
  }

  it('should render DOM correctly', async () => {
    const { timeDuration } = await buildFixture();
    expect(timeDuration).dom.to.equal(`
      <vds-time-duration></vds-time-duration>
    `);
  });

  it.only('should render shadow DOM correctly', async () => {
    const { provider, timeDuration } = await buildFixture();

    provider.context.duration = 3750;
    await elementUpdated(timeDuration);

    expect(timeDuration).shadowDom.to.equal(`
      <time
        id="root"
        aria-label="Duration"
        class="root"
        datetime="PT1H2M30S"
        part="root time"
      >
        1:02:30
      </time>
    `);
  });

  it('should update duration time as context updates', async () => {
    const { provider, timeDuration } = await buildFixture();
    expect(timeDuration.seconds).to.equal(0);
    provider.context.duration = 50;
    await elementUpdated(timeDuration);
    expect(timeDuration.seconds).to.equal(50);
    provider.context.duration = -1;
    await elementUpdated(timeDuration);
    expect(timeDuration.seconds).to.equal(0);
  });
});
