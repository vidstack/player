import { elementUpdated, expect, html } from '@open-wc/testing';

import { getSlottedChildren } from '../../../../utils/dom';
import { FakeMediaProviderElement } from '../../../fakes/FakeMediaProviderElement';
import { buildMediaFixture } from '../../../fakes/fakes.helpers';
import { VDS_MEDIA_UI_ELEMENT_TAG_NAME } from '../media-ui.constants';
import { MediaUiElement } from '../MediaUiElement';

describe(VDS_MEDIA_UI_ELEMENT_TAG_NAME, function () {
	async function buildFixture(): Promise<{
		provider: FakeMediaProviderElement;
		ui: MediaUiElement;
	}> {
		const { container, provider } = await buildMediaFixture(html`
			<vds-media-ui>
				<div class="slot"></div>
			</vds-media-ui>
		`);

		const ui = container.querySelector(
			VDS_MEDIA_UI_ELEMENT_TAG_NAME
		) as MediaUiElement;

		return { provider, ui };
	}

	it('should render DOM correctly', async function () {
		const { ui } = await buildFixture();
		expect(ui).dom.to.equal(`
      <vds-media-ui>
        <div class="slot"></div>
      </vds-media-ui>
    `);
	});

	it('should render shadow DOM correctly', async function () {
		const { ui } = await buildFixture();
		expect(ui).shadowDom.to.equal(`
      <div 
        id="root"
        part="root root-hidden"
      >
        <slot />
      </div>
    `);
	});

	it('should render <slot>', async function () {
		const { ui } = await buildFixture();
		const slottedChildren = getSlottedChildren(ui);
		expect(slottedChildren).to.have.length(1);
		expect(slottedChildren[0]).to.have.class('slot');
	});

	it('should toggle root-hidden css part as context updates', async function () {
		// Not ready.
		const { provider, ui } = await buildFixture();
		const root = ui.shadowRoot?.querySelector('#root') as HTMLDivElement;
		expect(root.getAttribute('part')).to.include('root-hidden');

		// Ready.
		provider.context.canPlay = true;
		await elementUpdated(ui);
		expect(root.getAttribute('part')).to.not.include('root-hidden');
	});

	it('should return element [rootElement]', async function () {
		const { ui } = await buildFixture();
		expect(ui.rootElement).to.be.instanceOf(HTMLDivElement);
	});
});
