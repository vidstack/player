import { elementUpdated, expect, html } from '@open-wc/testing';

import { FakeMediaProviderElement } from '../../../../core/fakes/FakeMediaProviderElement';
import { buildFakeMediaProvider } from '../../../../core/fakes/fakes.helpers';
import { TimeCurrentElement } from '../TimeCurrentElement';
import { VDS_TIME_CURRENT_ELEMENT_TAG_NAME } from '../vds-time-current';

describe(`${VDS_TIME_CURRENT_ELEMENT_TAG_NAME}`, () => {
  async function buildFixture(): Promise<
    [FakeMediaProviderElement, TimeCurrentElement]
  > {
    const provider = await buildFakeMediaProvider(html`
      <vds-time-current></vds-time-current>
    `);

    const timeCurrent = provider.querySelector(
      VDS_TIME_CURRENT_ELEMENT_TAG_NAME,
    ) as TimeCurrentElement;

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

    provider.context.currentTime = 3750;
    await elementUpdated(timeCurrent);

    expect(timeCurrent).shadowDom.to.equal(`
      <time
        id="root"
        aria-label="Current time"
        class="root"
        datetime="PT1H2M30S"
        part="root time"
      >
        1:02:30
      </time>
    `);
  });

  it('should update current time as context updates', async () => {
    const [provider, timeCurrent] = await buildFixture();
    expect(timeCurrent.seconds).to.equal(0);
    provider.context.currentTime = 50;
    await elementUpdated(timeCurrent);
    expect(timeCurrent.seconds).to.equal(50);
  });
});
