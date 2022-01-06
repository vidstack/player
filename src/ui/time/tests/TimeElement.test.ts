import '../../../define/vds-time';

import { elementUpdated, fixture, html } from '@open-wc/testing-helpers';

import { TimeElement } from '../TimeElement';

async function buildFixture(seconds = 0) {
  return await fixture<TimeElement>(
    html`<vds-time seconds=${seconds} label="current-time"></vds-time>`
  );
}

test('light DOM snapshot', async function () {
  const time = await buildFixture();
  expect(time).dom.to.equal(`
    <vds-time seconds="0" label="current-time"></vds-toggle>
  `);
});

test('shadow DOM snapshot', async function () {
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
  expect(time.rootElement?.getAttribute('aria-label')).to.equal('current-time');
});

test('it should format and render seconds', async function () {
  const time = await buildFixture(3605);
  expect(time.rootElement?.innerHTML).contains('1:00:05');
});

test('it should hide hours if seconds < 3600', async function () {
  const time = await buildFixture(3599);
  expect(time.rootElement?.innerHTML).contains('59:59');
});

test('it should show hours if seconds < 3600 AND `alwaysShowHours` is true', async function () {
  const time = await buildFixture(3599);
  time.alwaysShowHours = true;
  await elementUpdated(time);
  expect(time.rootElement?.innerHTML).contains('0:59:59');
});

test('it should pad hours if `padHours` is true', async function () {
  const time = await buildFixture(3605);
  time.padHours = true;
  await elementUpdated(time);
  expect(time.rootElement?.innerHTML).contains('01:00:05');
});
