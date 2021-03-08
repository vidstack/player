import '../../../../core/fakes/vds-fake-media-provider';

import { elementUpdated, expect, html } from '@open-wc/testing';

import { FakeMediaProvider } from '../../../../core/fakes/FakeMediaProvider';
import { buildFakeMediaProvider } from '../../../../core/fakes/helpers';
import { TimeCurrent } from '../TimeCurrent';
import { TIME_CURRENT_TAG_NAME } from '../vds-time-current';

describe(`${TIME_CURRENT_TAG_NAME}`, () => {
  async function buildFixture(): Promise<[FakeMediaProvider, TimeCurrent]> {
    const provider = await buildFakeMediaProvider(html`
      <vds-time-current></vds-time-current>
    `);

    const timeCurrent = provider.querySelector(
      'vds-time-current',
    ) as TimeCurrent;

    return [provider, timeCurrent];
  }

  it('should update current time as context updates', async () => {
    const [provider, timeCurrent] = await buildFixture();
    expect(timeCurrent.duration).to.equal(0);
    provider.playerContext.currentTimeCtx = 50;
    await elementUpdated(timeCurrent);
    expect(timeCurrent.duration).to.equal(50);
  });
});
