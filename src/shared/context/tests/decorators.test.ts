import { elementUpdated, expect, fixture } from '@open-wc/testing';
import { html, LitElement } from 'lit';

import { VdsElement } from '../../elements/index.js';
import { createContext } from '../context.js';
import { consumeContext, provideContext } from '../decorators.js';

const testContext = createContext(10);

class FakeProviderElement extends VdsElement {
	@provideContext(testContext) context = testContext.initialValue;
}

class FakeConsumerElement extends VdsElement {
	@consumeContext(testContext) context = testContext.initialValue;
}

window.customElements.define('fake-provider', FakeProviderElement);
window.customElements.define('fake-consumer', FakeConsumerElement);

describe('context/decorators', function () {
	async function buildFixture() {
		const provider = await fixture<FakeProviderElement>(html`
			<fake-provider>
				<fake-consumer></fake-consumer>
			</fake-provider>
		`);

		const consumer = provider.querySelector(
			'fake-consumer'
		) as FakeConsumerElement;

		return { provider, consumer };
	}

	it('should update context property in consumer', async function () {
		const { provider, consumer } = await buildFixture();

		provider.context = 100;
		await elementUpdated(consumer);
		expect(consumer.context).to.equal(100);

		provider.context = 200;
		await elementUpdated(consumer);
		expect(consumer.context).to.equal(200);
	});

	it('should throw error if @consumeContext is used without WithContext mixin', async function () {
		expect(() => {
			class BadConsumerElement extends LitElement {
				@consumeContext(testContext) context;
			}
		}).to.throw(
			`[BadConsumerElement] requires the [WithContext] mixin to use the [@consumeContext] decorator.`
		);
	});

	it('should throw error if @provideContext is used without WithContext mixin', async function () {
		expect(() => {
			class BadProviderElement extends LitElement {
				@provideContext(testContext) context;
			}
		}).to.throw(
			`[BadProviderElement] requires the [WithContext] mixin to use the [@provideContext] decorator.`
		);
	});
});
