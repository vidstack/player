import { expect } from '@open-wc/testing';
import { elementUpdated, fixture } from '@open-wc/testing-helpers';
import { html } from 'lit-element';

import {
	consumeContextRecord,
	createContext,
	derivedContext,
	provideContextRecord
} from '../context';
import { VdsElement } from '../elements';

const ctxA = createContext(10);
const ctxB = createContext('B');
const ctxC = derivedContext([ctxA, ctxB], ([a, b]) => `${a}-${b}`);
const ctxRecord = { ctxA, ctxB, ctxC };

class FakeProviderElement extends VdsElement {
	ctxA = ctxA.provide(this);
	ctxB = ctxB.provide(this);
	ctxC = ctxC.provide(this);
	ctxD = provideContextRecord(this, ctxRecord);

	render() {
		return html`<slot></slot>`;
	}
}

class FakeConsumerElement extends VdsElement {
	ctxA = ctxA.consume(this);
	ctxB = ctxB.consume(this);
	ctxC = ctxC.consume(this);
	ctxD = consumeContextRecord(this, {
		...ctxRecord
	});

	render() {
		return html`<span>${this.ctxA.value}-${this.ctxB.value}</span>`;
	}
}

window.customElements.define('fake-provider', FakeProviderElement);
window.customElements.define('fake-consumer', FakeConsumerElement);

describe('context', function () {
	async function buildFixture() {
		/** @type {FakeProviderElement}  */
		const provider = await fixture(html`
			<fake-provider>
				<fake-consumer></fake-consumer>
			</fake-provider>
		`);

		/** @type {FakeConsumerElement}  */
		const consumer = provider.querySelector('fake-consumer');

		return { provider, consumer };
	}

	it('should update context property in consumer', async function () {
		const { provider, consumer } = await buildFixture();

		provider.ctxA.value = 20;
		await elementUpdated(consumer);
		expect(consumer.ctxA.value).to.equal(20);
		expect(consumer.ctxB.value).to.equal('B');
		expect(consumer.ctxC.value).to.equal('20-B');
		expect(consumer).shadowDom.to.equal('<span>20-B</span>');

		provider.ctxB.value = 'B2';
		await elementUpdated(consumer);
		expect(consumer.ctxA.value).to.equal(20);
		expect(consumer.ctxB.value).to.equal('B2');
		expect(consumer.ctxC.value).to.equal('20-B2');
		expect(consumer).shadowDom.to.equal('<span>20-B2</span>');
	});

	it('should reset to initial value when disconnected from DOM', async function () {
		const { provider, consumer } = await buildFixture();

		provider.ctxA.value = 20;

		consumer.remove();

		expect(consumer.ctxA.value).to.equal(10);
		expect(consumer.ctxC.value).to.equal('10-B');

		expect(provider.ctxA.value).to.equal(20);
		expect(provider.ctxC.value).to.equal('20-B');

		provider.remove();

		expect(provider.ctxA.value).to.equal(10);
		expect(provider.ctxC.value).to.equal('10-B');
	});

	it('should update consumer via context record', async function () {
		const { provider, consumer } = await buildFixture();

		provider.ctxD.ctxA = 20;
		await elementUpdated(consumer);
		expect(consumer.ctxA.value).to.equal(20);
		expect(consumer.ctxB.value).to.equal('B');
		expect(consumer.ctxC.value).to.equal('20-B');
		expect(consumer).shadowDom.to.equal('<span>20-B</span>');

		provider.ctxD.ctxB = 'B2';
		await elementUpdated(consumer);
		expect(consumer.ctxA.value).to.equal(20);
		expect(consumer.ctxB.value).to.equal('B2');
		expect(consumer.ctxC.value).to.equal('20-B2');
		expect(consumer).shadowDom.to.equal('<span>20-B2</span>');
	});

	it('should consume context record', async function () {
		const { provider, consumer } = await buildFixture();

		provider.ctxA.value = 20;
		expect(consumer.ctxD.ctxA).to.equal(20);

		provider.ctxB.value = 'B2';
		expect(consumer.ctxD.ctxB).to.equal('B2');
	});
});
