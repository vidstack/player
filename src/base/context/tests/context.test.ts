import { expect } from '@open-wc/testing';
import { elementUpdated, fixture } from '@open-wc/testing-helpers';
import { html, LitElement } from 'lit';

import { createContext, derivedContext } from '../context';

const ctxA = createContext(10);
const ctxB = createContext('B');
const ctxC = derivedContext([ctxA, ctxB], ([a, b]) => `${a}-${b}`);

class FakeProviderElement extends LitElement {
  ctxA = ctxA.provide(this);
  ctxB = ctxB.provide(this);
  ctxC = ctxC.provide(this);
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

describe('context', function () {
  async function buildFixture() {
    const parentProvider = await fixture<FakeProviderElement>(html`
      <fake-provider>
        <fake-provider>
          <fake-consumer></fake-consumer>
        </fake-provider>
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

  it('should stop receiving context updates given provider stops', async function () {
    const { provider, consumer } = await buildFixture();

    provider.ctxA.stop();

    provider.ctxA.value = 50;
    await elementUpdated(consumer);
    expect(consumer.ctxA.value).to.equal(consumer.ctxA.initialValue);
  });

  it('should stop receiving context updates given consumer stops', async function () {
    const { provider, consumer } = await buildFixture();

    consumer.ctxA.stop();

    provider.ctxA.value = 50;
    await elementUpdated(consumer);
    expect(consumer.ctxA.value).to.equal(consumer.ctxA.initialValue);
  });

  it('should reconnect successfully', async function () {
    const { provider, consumer } = await buildFixture();

    consumer.ctxA.stop();
    consumer.ctxA.start();

    provider.ctxA.value = 50;
    await elementUpdated(consumer);
    expect(consumer.ctxA.value).to.equal(50);
  });

  it('should reconnect if current provider target changes', async function () {
    const { parentProvider, provider, consumer } = await buildFixture();

    provider.ctxA.setRef(undefined);

    parentProvider.ctxA.value = 50;
    await elementUpdated(consumer);
    expect(consumer.ctxA.value).to.equal(50);
  });

  it('should update derived context on reconnection', async function () {
    const { parentProvider, provider, consumer } = await buildFixture();

    provider.ctxA.setRef(undefined);

    parentProvider.ctxA.value = 50;
    await elementUpdated(consumer);
    expect(consumer.ctxC.value).to.equal('50-B');
  });
});
