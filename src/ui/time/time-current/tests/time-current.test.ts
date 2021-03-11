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
      TIME_CURRENT_TAG_NAME,
    ) as TimeCurrent;

    return [provider, timeCurrent];
  }

  it('should render dom correctly', async () => {
    const [, timeCurrent] = await buildFixture();

    expect(timeCurrent).dom.to.equal(`
      <vds-time-current></vds-time-current>
    `);
  });

  it('should render shadow dom correctly', async () => {
    const [provider, timeCurrent] = await buildFixture();

    provider.context.currentTimeCtx = 3750;
    await elementUpdated(timeCurrent);

    expect(timeCurrent).shadowDom.to.equal(`
      <time
        aria-label="Current time"
        class="root"
        datetime="PT1H2M30S"
        part="root"
      >
        1:02:30
      </time>
    `);
  });

  it('should update current time as context updates', async () => {
    const [provider, timeCurrent] = await buildFixture();
    expect(timeCurrent.duration).to.equal(0);
    provider.context.currentTimeCtx = 50;
    await elementUpdated(timeCurrent);
    expect(timeCurrent.duration).to.equal(50);
  });
});
