import { expect } from '@open-wc/testing';
import { fixture } from '@open-wc/testing-helpers';
import { html } from 'lit-html';

import { VDS_TIME_ELEMENT_TAG_NAME } from '../vds-time';

describe(`${VDS_TIME_ELEMENT_TAG_NAME}`, () => {
  it('should render dom correctly', async () => {
    const time = await fixture(
      html`<vds-time label="current-time"></vds-time>`,
    );

    expect(time).dom.to.equal(`
      <vds-time label="current-time"></vds-toggle>
    `);
  });

  it('should render shadow dom correctly', async () => {
    const time = await fixture(
      html`<vds-time label="current-time" seconds="3750"></vds-time>`,
    );

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

  it('should render label', async () => {
    const time = await fixture(
      html`<vds-time label="current-time"></vds-time>`,
    );
    const root = time.shadowRoot?.querySelector('time') as HTMLTimeElement;
    expect(root).to.have.attribute('aria-label', 'current-time');
  });

  it('should format and render seconds', async () => {
    const time = await fixture(html`<vds-time seconds="3605"></vds-time>`);
    const root = time.shadowRoot?.querySelector('time') as HTMLTimeElement;
    expect(root.innerHTML).includes('1:00:05');
  });

  it('should hide hours if seconds < 3600', async () => {
    const time = await fixture(html`<vds-time seconds="3599"></vds-time>`);
    const root = time.shadowRoot?.querySelector('time') as HTMLTimeElement;
    expect(root.innerHTML).includes('59:59');
  });

  it('should show hours if seconds < 3600 AND `alwaysShowHours` is true', async () => {
    const time = await fixture(
      html`<vds-time seconds="3599" always-show-hours></vds-time>`,
    );
    const root = time.shadowRoot?.querySelector('time') as HTMLTimeElement;
    expect(root.innerHTML).includes('0:59:59');
  });

  it('should pad hours if `padHours` is true', async () => {
    const time = await fixture(
      html`<vds-time seconds="3605" pad-hours></vds-time>`,
    );
    const root = time.shadowRoot?.querySelector('time') as HTMLTimeElement;
    expect(root.innerHTML).includes('01:00:05');
  });
});
