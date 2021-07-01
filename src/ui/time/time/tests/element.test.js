import '../define.js';

import { elementUpdated, expect, fixture } from '@open-wc/testing';
import { html } from 'lit';

import { TIME_ELEMENT_TAG_NAME, TimeElement } from '../TimeElement.js';

describe(`${TIME_ELEMENT_TAG_NAME}`, function () {
  /**
   * @param {number} [seconds=0]
   * @returns {Promise<TimeElement>}
   */
  async function buildFixture(seconds = 0) {
    return await fixture(
      html`<vds-time seconds=${seconds} label="current-time"></vds-time>`
    );
  }

  it('should render DOM correctly', async function () {
    const time = await buildFixture();
    expect(time).dom.to.equal(`
      <vds-time seconds="0" label="current-time"></vds-toggle>
    `);
  });

  it('should render shadow DOM correctly', async function () {
    const time = await buildFixture(3750);
    expect(time).shadowDom.to.equal(`
      <time
        id="root"
        class="root"
        part="root time"
        datetime="PT1H2M30S"
        aria-label="current-time"
      >
        1:02:30
      </time>
    `);
  });

  it('should render label', async function () {
    const time = await buildFixture();
    expect(time.rootElement).to.have.attribute('aria-label', 'current-time');
  });

  it('should format and render seconds', async function () {
    const time = await buildFixture(3605);
    expect(time.rootElement.innerHTML).includes('1:00:05');
  });

  it('should hide hours if seconds < 3600', async function () {
    const time = await buildFixture(3599);
    expect(time.rootElement.innerHTML).includes('59:59');
  });

  it('should show hours if seconds < 3600 AND `alwaysShowHours` is true', async function () {
    const time = await buildFixture(3599);
    time.alwaysShowHours = true;
    await elementUpdated(time);
    expect(time.rootElement.innerHTML).includes('0:59:59');
  });

  it('should pad hours if `padHours` is true', async function () {
    const time = await buildFixture(3605);
    time.padHours = true;
    await elementUpdated(time);
    expect(time.rootElement.innerHTML).includes('01:00:05');
  });
});
