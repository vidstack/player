import { expect, html } from '@open-wc/testing';

import { FakeMediaProviderElement } from '../../../../core';
import { buildFakeMediaProvider } from '../../../../core/fakes/fakes.helpers';
import { TimeCurrentElement } from '../../time-current';
import { TimeDurationElement } from '../../time-duration';
import { TimeProgressElement } from '../TimeProgressElement';
import { VDS_TIME_PROGRESS_ELEMENT_TAG_NAME } from '../vds-time-progress';

describe(VDS_TIME_PROGRESS_ELEMENT_TAG_NAME, () => {
  async function buildFixture(): Promise<
    [FakeMediaProviderElement, TimeProgressElement]
  > {
    const provider = await buildFakeMediaProvider(html`
      <vds-time-progress></vds-time-progress>
    `);

    const timeProgress = provider.querySelector(
      VDS_TIME_PROGRESS_ELEMENT_TAG_NAME,
    ) as TimeProgressElement;

    return [provider, timeProgress];
  }

  it('should render dom correctly', async () => {
    const [, timeProgress] = await buildFixture();

    expect(timeProgress).dom.to.equal(`
      <vds-time-progress></vds-time-progress>
    `);
  });

  it('should render shadow dom correctly', async () => {
    const [, timeProgress] = await buildFixture();

    expect(timeProgress).shadowDom.to.equal(`
      <div id="root" part="root">
        <vds-time-current
          id="time-current"
          exportparts="root: current-time-root, time: current-time-time"
          label="Current time"
          part="current-time"
        ></vds-time-current>

        <span id="separator" part="separator">/</span>
        
        <vds-time-duration
          id="time-duration"
          exportparts="root: duration-root, time: duration-time"
          label="Duration"
          part="duration"
        ></vds-time-duration>
      </div>
    `);
  });

  it('should render current time label', async () => {
    const [, timeProgress] = await buildFixture();
    const timeCurrent = timeProgress.shadowRoot?.querySelector(
      'vds-time-current',
    ) as TimeCurrentElement;
    expect(timeCurrent).to.have.attribute('label', 'Current time');
  });

  it('should render duration label', async () => {
    const [, timeProgress] = await buildFixture();
    const timeDuration = timeProgress.shadowRoot?.querySelector(
      'vds-time-duration',
    ) as TimeDurationElement;
    expect(timeDuration).to.have.attribute('label', 'Duration');
  });

  it('should render separator', async () => {
    const [, timeProgress] = await buildFixture();
    const timeSeparator = timeProgress.shadowRoot?.querySelector(
      "span[part~='separator']",
    ) as HTMLSpanElement;
    expect(timeSeparator).to.exist;
    expect(timeSeparator.innerHTML).to.include(timeProgress.timeSeparator);
  });
});
