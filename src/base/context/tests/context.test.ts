import { expect } from '@open-wc/testing';
import { fixture } from '@open-wc/testing-helpers';
import { html, LitElement } from 'lit';

import { createContext } from '../createContext';

const ctxA = createContext(() => 10);
const ctxB = createContext(() => 'string');
const ctxC = createContext(() => ({}));

class FakeProviderElement extends LitElement {
  ctxA = ctxA.provide(this);
  ctxB = ctxB.provide(this);
  ctxC = ctxC.provide(this);
}

class FakeConsumerElement extends LitElement {
  ctxA = ctxA.consume(this);
  ctxB = ctxB.consume(this);
  ctxC = ctxC.provide(this);

  override render() {
    return html`<span>${this.ctxA.value}-${this.ctxB.value}</span>`;
  }
}

window.customElements.define('fake-provider', FakeProviderElement);
window.customElements.define('fake-consumer', FakeConsumerElement);

describe('context', function () {
  async function buildFixture() {
    const parentProvider = await fixture<FakeProviderElement>(html`
      <fake-provider>
        <fake-consumer></fake-consumer>
      </fake-provider>
    `);

    const provider = parentProvider.querySelector(
      'fake-provider'
    ) as FakeProviderElement;

    const consumer = parentProvider.querySelector(
      'fake-consumer'
    ) as FakeConsumerElement;

    return { parentProvider, provider, consumer };
  }

  it('should connect to provider', async function () {
    const { provider, consumer } = await buildFixture();
    expect(consumer.ctxA.value).to.equal(10);
    expect(consumer.ctxB.value).to.equal('string');
    expect(consumer.ctxC.value).to.equal(provider.ctxC.value);
  });
});
