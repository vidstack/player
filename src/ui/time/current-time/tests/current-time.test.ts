import '../../../../core/fakes/vds-fake-media-provider';

import { elementUpdated, expect, html } from '@open-wc/testing';

import { FakeMediaProvider } from '../../../../core/fakes/FakeMediaProvider';
import { buildFakeMediaProvider } from '../../../../core/fakes/helpers';
import { CurrentTime } from '../CurrentTime';
import { CURRENT_TIME_TAG_NAME } from '../vds-current-time';

describe(`${CURRENT_TIME_TAG_NAME}`, () => {
  async function buildFixture(): Promise<[FakeMediaProvider, CurrentTime]> {
    const provider = await buildFakeMediaProvider(html`
      <vds-current-time></vds-current-time>
    `);

    const currentTime = provider.querySelector(
      'vds-current-time',
    ) as CurrentTime;

    return [provider, currentTime];
  }

  it('should update current time as context updates', async () => {
    const [provider, currentTime] = await buildFixture();
    expect(currentTime.duration).to.equal(0);
    provider.playerContext.currentTimeCtx = 50;
    await elementUpdated(currentTime);
    expect(currentTime.duration).to.equal(50);
  });
});
