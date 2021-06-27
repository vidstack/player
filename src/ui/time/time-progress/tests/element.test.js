import { expect } from '@open-wc/testing';
import { html } from 'lit';

import { buildMediaFixture } from '../../../../media/test-utils/index.js';
import {
  TimeProgressElement,
  VDS_TIME_PROGRESS_ELEMENT_TAG_NAME
} from '../TimeProgressElement.js';

window.customElements.define(
  VDS_TIME_PROGRESS_ELEMENT_TAG_NAME,
  TimeProgressElement
);

describe(VDS_TIME_PROGRESS_ELEMENT_TAG_NAME, function () {
  async function buildFixture() {
    const { container } = await buildMediaFixture(html`
      <vds-time-progress></vds-time-progress>
    `);

    const timeProgress = /** @type {TimeProgressElement} */ (
      container.querySelector(VDS_TIME_PROGRESS_ELEMENT_TAG_NAME)
    );

    return { timeProgress };
  }

  it('should render DOM correctly', async function () {
    const { timeProgress } = await buildFixture();
    expect(timeProgress).dom.to.equal(`
      <vds-time-progress></vds-time-progress>
    `);
  });

  it('should render shadow DOM correctly', async function () {
    const { timeProgress } = await buildFixture();
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

  it('should render current time label', async function () {
    const { timeProgress } = await buildFixture();
    expect(timeProgress.timeCurrentElement).to.have.attribute(
      'label',
      'Current time'
    );
  });

  it('should render duration label', async function () {
    const { timeProgress } = await buildFixture();
    expect(timeProgress.timeDurationElement).to.have.attribute(
      'label',
      'Duration'
    );
  });

  it('should render separator', async function () {
    const { timeProgress } = await buildFixture();
    expect(timeProgress.timeSeparator).to.exist;
    expect(timeProgress.separatorElement.innerHTML).to.include(
      timeProgress.timeSeparator
    );
  });
});
