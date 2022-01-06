import '../../../define/vds-time';

import { elementUpdated, expect, fixture } from '@open-wc/testing';
import { html } from 'lit';

import { TIME_ELEMENT_TAG_NAME, TimeElement } from '../TimeElement';

describe(`${TIME_ELEMENT_TAG_NAME}`, function () {
  async function buildFixture(seconds = 0) {
    return await fixture<TimeElement>(
      html`<vds-time seconds=${seconds} label="current-time"></vds-time>`
    );
  }

  test('it should render DOM correctly', async function () {
    const time = await buildFixture();
    expect(time).dom.to.equal(`
      <vds-time seconds="0" label="current-time"></vds-toggle>
    `);
  });

  test('it should render shadow DOM correctly', async function () {
    const time = await buildFixture(3750);
    expect(time).shadowDom.to.equal(`
      <time
        id="root"
        part="root time"
        datetime="PT1H2M30S"
        aria-label="current-time"
      >
        1:02:30
      </time>
    `);
  });

  test('it should render label', async function () {
    const time = await buildFixture();
    expect(time.rootElement).to.have.attribute('aria-label', 'current-time');
  });

  test('it should format and render seconds', async function () {
    const time = await buildFixture(3605);
    expect(time.rootElement?.innerHTML).includes('1:00:05');
  });

  test('it should hide hours if seconds < 3600', async function () {
    const time = await buildFixture(3599);
    expect(time.rootElement?.innerHTML).includes('59:59');
  });

  test('it should show hours if seconds < 3600 AND `alwaysShowHours` is true', async function () {
    const time = await buildFixture(3599);
    time.alwaysShowHours = true;
    await elementUpdated(time);
    expect(time.rootElement?.innerHTML).includes('0:59:59');
  });

  test('it should pad hours if `padHours` is true', async function () {
    const time = await buildFixture(3605);
    time.padHours = true;
    await elementUpdated(time);
    expect(time.rootElement?.innerHTML).includes('01:00:05');
  });
});
