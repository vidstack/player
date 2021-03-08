import '../../../../core/fakes/vds-fake-media-provider';

import { elementUpdated, expect, html } from '@open-wc/testing';

import { FakeMediaProvider } from '../../../../core/fakes/FakeMediaProvider';
import { buildFakeMediaProvider } from '../../../../core/fakes/helpers';
import { Duration } from '../Duration';
import { DURATION_TAG_NAME } from '../vds-end-time';

describe(`${DURATION_TAG_NAME}`, () => {
  async function buildFixture(): Promise<[FakeMediaProvider, Duration]> {
    const provider = await buildFakeMediaProvider(html`
      <vds-duration></vds-duration>
    `);

    const duration = provider.querySelector('vds-duration') as Duration;

    return [provider, duration];
  }

  it('should update duration time as context updates', async () => {
    const [provider, duration] = await buildFixture();
    expect(duration.duration).to.equal(0);
    provider.playerContext.durationCtx = 50;
    await elementUpdated(duration);
    expect(duration.duration).to.equal(50);
    provider.playerContext.durationCtx = -1;
    await elementUpdated(duration);
    expect(duration.duration).to.equal(0);
  });
});
