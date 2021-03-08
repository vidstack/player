import '../../../../core/fakes/vds-fake-media-provider';

import { expect, html } from '@open-wc/testing';

import { FakeMediaProvider } from '../../../../core';
import { buildFakeMediaProvider } from '../../../../core/fakes/helpers';
import { TimeCurrent } from '../../time-current';
import { TimeDuration } from '../../time-duration';
import { TimeProgress } from '../TimeProgress';
import { TIME_PROGRESS_TAG_NAME } from '../vds-time-progress';

// TODO: add some dom diff tests.

describe(TIME_PROGRESS_TAG_NAME, () => {
  async function buildFixture(): Promise<[FakeMediaProvider, TimeProgress]> {
    const provider = await buildFakeMediaProvider(html`
      <vds-time-progress></vds-time-progress>
    `);

    const timeProgress = provider.querySelector(
      'vds-time-progress',
    ) as TimeProgress;

    return [provider, timeProgress];
  }

  it('should render current time label', async () => {
    const [, timeProgress] = await buildFixture();
    const timeCurrent = timeProgress.shadowRoot?.querySelector(
      'vds-time-current',
    ) as TimeCurrent;
    expect(timeCurrent).to.have.attribute('label', 'Current time');
  });

  it('should render duration label', async () => {
    const [, timeProgress] = await buildFixture();
    const timeDuration = timeProgress.shadowRoot?.querySelector(
      'vds-time-duration',
    ) as TimeDuration;
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
