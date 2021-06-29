import { expect } from '@open-wc/testing';
import { elementUpdated, fixture } from '@open-wc/testing-helpers';
import { html } from 'lit';

import { VdsElement } from '../../elements/index.js';
import {
  createContext,
  derivedContext,
  provideContextRecord
} from '../context.js';

const ctxA = createContext(10);
const ctxB = createContext('B');
const ctxC = derivedContext([ctxA, ctxB], ([a, b]) => `${a}-${b}`);
const ctxRecord = { ctxA, ctxB, ctxC };

class BaseProviderElement extends VdsElement {
  /** @type {import('../types').ContextProviderDeclarations} */
  static get contextProviders() {
    return {
      ctxA
    };
  }

  constructor() {
    super();
    this.ctxA = ctxA.initialValue;
  }
}

class FakeProviderElement extends BaseProviderElement {
  ctxD = provideContextRecord(this, ctxRecord);

  /** @type {import('../types').ContextProviderDeclarations} */
  static get contextProviders() {
    return {
      ctxB,
      ctxC
    };
  }

  constructor() {
    super();
    this.ctxB = ctxB.initialValue;
    this.ctxC = ctxC.initialValue;
  }

  render() {
    return html`<slot></slot>`;
  }
}

class BaseConsumerElement extends VdsElement {
  /** @type {import('../types').ContextConsumerDeclarations} */
  static get contextConsumers() {
    return {
      ctxA
    };
  }

  constructor() {
    super();
    this.ctxA = ctxA.initialValue;
  }
}

class FakeConsumerElement extends BaseConsumerElement {
  /** @type {import('../types').ContextConsumerDeclarations} */
  static get contextConsumers() {
    return {
      ctxB,
      ctxC
    };
  }

  constructor() {
    super();
    this.ctxB = ctxB.initialValue;
    this.ctxC = ctxC.initialValue;
  }

  render() {
    return html`<span>${this.ctxA}-${this.ctxB}</span>`;
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

    const consumer = /** @type {FakeConsumerElement}  */ (
      provider.querySelector('fake-consumer')
    );

    return { provider, consumer };
  }

  it('should update context property in consumer', async function () {
    const { provider, consumer } = await buildFixture();

    provider.ctxA = 20;
    await elementUpdated(consumer);
    expect(consumer.ctxA).to.equal(20);
    expect(consumer.ctxB).to.equal('B');
    expect(consumer.ctxC).to.equal('20-B');
    expect(consumer).shadowDom.to.equal('<span>20-B</span>');

    provider.ctxB = 'B2';
    await elementUpdated(consumer);
    expect(consumer.ctxA).to.equal(20);
    expect(consumer.ctxB).to.equal('B2');
    expect(consumer.ctxC).to.equal('20-B2');
    expect(consumer).shadowDom.to.equal('<span>20-B2</span>');
  });

  it('should reset to initial value when disconnected from DOM', async function () {
    const { provider, consumer } = await buildFixture();

    provider.ctxA = 20;

    consumer.remove();

    expect(consumer.ctxA).to.equal(10);
    expect(consumer.ctxC).to.equal('10-B');

    expect(provider.ctxA).to.equal(20);
    expect(provider.ctxC).to.equal('20-B');

    provider.remove();

    expect(provider.ctxA).to.equal(10);
    expect(provider.ctxC).to.equal('10-B');
  });

  it('should update consumer via context record', async function () {
    const { provider, consumer } = await buildFixture();

    provider.ctxD.ctxA = 20;
    await elementUpdated(consumer);
    expect(consumer.ctxA).to.equal(20);
    expect(consumer.ctxB).to.equal('B');
    expect(consumer.ctxC).to.equal('20-B');
    expect(consumer).shadowDom.to.equal('<span>20-B</span>');

    provider.ctxD.ctxB = 'B2';
    await elementUpdated(consumer);
    expect(consumer.ctxA).to.equal(20);
    expect(consumer.ctxB).to.equal('B2');
    expect(consumer.ctxC).to.equal('20-B2');
    expect(consumer).shadowDom.to.equal('<span>20-B2</span>');
  });

  it('should update derived context in context record', async function () {
    const { provider } = await buildFixture();

    provider.ctxD.ctxA = 20;
    expect(provider.ctxD.ctxC).to.equal('20-B');

    provider.ctxD.ctxB = 'B2';
    expect(provider.ctxD.ctxC).to.equal('20-B2');
  });
});
