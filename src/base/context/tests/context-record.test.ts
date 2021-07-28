import { elementUpdated, expect, fixture } from '@open-wc/testing';
import { html, LitElement } from 'lit';

import {
  createContext,
  derivedContext,
  provideContextRecord
} from '../context';

const ctxA = createContext(10);
const ctxB = createContext('B');
const ctxC = derivedContext([ctxA, ctxB], ([a, b]) => `${a}-${b}`);
const ctxRecord = { ctxA, ctxB, ctxC };

class FakeProviderElement extends LitElement {
  ctx = provideContextRecord(this, ctxRecord);
}

class FakeConsumerElement extends LitElement {
  ctxA = ctxA.consume(this, { shouldRequestUpdate: true });
  ctxB = ctxB.consume(this, { shouldRequestUpdate: true });
  ctxC = ctxC.consume(this, { shouldRequestUpdate: true });

  override render() {
    return html`<span>${this.ctxA.value}-${this.ctxB.value}</span>`;
  }
}

window.customElements.define('fake-provider', FakeProviderElement);
window.customElements.define('fake-consumer', FakeConsumerElement);

describe('context/record', function () {
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

  it('should update consumer via context record', async function () {
    const { provider, consumer } = await buildFixture();

    provider.ctx.ctxA = 20;
    await elementUpdated(consumer);
    expect(consumer.ctxA.value).to.equal(20);
    expect(consumer.ctxB.value).to.equal('B');
    expect(consumer.ctxC.value).to.equal('20-B');
    expect(consumer).shadowDom.to.equal('<span>20-B</span>');

    provider.ctx.ctxB = 'B2';
    await elementUpdated(consumer);
    expect(consumer.ctxA.value).to.equal(20);
    expect(consumer.ctxB.value).to.equal('B2');
    expect(consumer.ctxC.value).to.equal('20-B2');
    expect(consumer).shadowDom.to.equal('<span>20-B2</span>');
  });

  it('should update derived context in context record', async function () {
    const { provider } = await buildFixture();

    provider.ctx.ctxA = 20;
    expect(provider.ctx.ctxC).to.equal('20-B');

    provider.ctx.ctxB = 'B2';
    expect(provider.ctx.ctxC).to.equal('20-B2');
  });
});
