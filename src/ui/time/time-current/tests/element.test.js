import { elementUpdated, expect } from '@open-wc/testing';
import { html } from 'lit';

import { buildMediaFixture } from '../../../../media/test-utils';
import {
	TimeCurrentElement,
	VDS_TIME_CURRENT_ELEMENT_TAG_NAME
} from '../TimeCurrentElement';

window.customElements.define(
	VDS_TIME_CURRENT_ELEMENT_TAG_NAME,
	TimeCurrentElement
);

describe(`${VDS_TIME_CURRENT_ELEMENT_TAG_NAME}`, function () {
	async function buildFixture() {
		const { container, provider } = await buildMediaFixture(html`
			<vds-time-current></vds-time-current>
		`);

		const timeCurrent = /** @type {TimeCurrentElement} */ (
			container.querySelector(VDS_TIME_CURRENT_ELEMENT_TAG_NAME)
		);

		return { provider, timeCurrent };
	}

	it('should render DOM correctly', async function () {
		const { timeCurrent } = await buildFixture();
		expect(timeCurrent).dom.to.equal(`
      <vds-time-current></vds-time-current>
    `);
	});

	it('should render shadow DOM correctly', async function () {
		const { provider, timeCurrent } = await buildFixture();

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

	it('should update current time as context updates', async function () {
		const { provider, timeCurrent } = await buildFixture();
		expect(timeCurrent.seconds).to.equal(0);
		provider.context.currentTime = 50;
		await elementUpdated(timeCurrent);
		expect(timeCurrent.seconds).to.equal(50);
	});
});
