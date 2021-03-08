import '../../../../core/fakes/vds-fake-media-provider';

import { elementUpdated, expect, html } from '@open-wc/testing';

import { FakeMediaProvider } from '../../../../core/fakes/FakeMediaProvider';
import { buildFakeMediaProvider } from '../../../../core/fakes/helpers';
import { TimeDuration } from '../TimeDuration';
import { TIME_DURATION_TAG_NAME } from '../vds-time-duration';

describe(`${TIME_DURATION_TAG_NAME}`, () => {
  async function buildFixture(): Promise<[FakeMediaProvider, TimeDuration]> {
    const provider = await buildFakeMediaProvider(html`
      <vds-time-duration></vds-time-duration>
    `);

    const timeDuration = provider.querySelector(
      'vds-time-duration',
    ) as TimeDuration;

    return [provider, timeDuration];
  }

  it('should update duration time as context updates', async () => {
    const [provider, timeDuration] = await buildFixture();
    expect(timeDuration.duration).to.equal(0);
    provider.playerContext.durationCtx = 50;
    await elementUpdated(timeDuration);
    expect(timeDuration.duration).to.equal(50);
    provider.playerContext.durationCtx = -1;
    await elementUpdated(timeDuration);
    expect(timeDuration.duration).to.equal(0);
  });
});
