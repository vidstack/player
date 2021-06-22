import { elementUpdated, expect } from '@open-wc/testing';
import { html } from 'lit';

import { buildMediaFixture } from '../../../../media/test-utils/index.js';
import {
	TimeDurationElement,
	VDS_TIME_DURATION_ELEMENT_TAG_NAME
} from '../TimeDurationElement.js';

window.customElements.define(
	VDS_TIME_DURATION_ELEMENT_TAG_NAME,
	TimeDurationElement
);

describe(`${VDS_TIME_DURATION_ELEMENT_TAG_NAME}`, function () {
	async function buildFixture() {
		const { container, provider } = await buildMediaFixture(html`
			<vds-time-duration></vds-time-duration>
		`);

		const timeDuration = /** @type {TimeDurationElement} */ (
			container.querySelector(VDS_TIME_DURATION_ELEMENT_TAG_NAME)
		);

		return { provider, timeDuration };
	}

	it('should render DOM correctly', async function () {
		const { timeDuration } = await buildFixture();
		expect(timeDuration).dom.to.equal(`
      <vds-time-duration></vds-time-duration>
    `);
	});

	it('should render shadow DOM correctly', async function () {
		const { provider, timeDuration } = await buildFixture();

		provider.context.duration = 3750;
		await elementUpdated(timeDuration);

		expect(timeDuration).shadowDom.to.equal(`
      <time
        id="root"
        aria-label="Duration"
        class="root"
        datetime="PT1H2M30S"
        part="root time"
      >
        1:02:30
      </time>
    `);
	});

	it('should update duration time as context updates', async function () {
		const { provider, timeDuration } = await buildFixture();
		expect(timeDuration.seconds).to.equal(0);
		provider.context.duration = 50;
		await elementUpdated(timeDuration);
		expect(timeDuration.seconds).to.equal(50);
		provider.context.duration = -1;
		await elementUpdated(timeDuration);
		expect(timeDuration.seconds).to.equal(0);
	});
});
