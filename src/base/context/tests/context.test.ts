import { expect } from '@open-wc/testing';
import { elementUpdated, fixture } from '@open-wc/testing-helpers';
import { html, LitElement } from 'lit';

import {
  createContext,
  derivedContext,
  provideContextRecord
} from '../context';
import {
  ContextConsumerDeclarations,
  ContextProviderDeclarations
} from '../types';
import { WithContext } from '../WithContext';

const ctxA = createContext(10);
const ctxB = createContext('B');
const ctxC = derivedContext([ctxA, ctxB], ([a, b]) => `${a}-${b}`);
const ctxRecord = { ctxA, ctxB, ctxC };

class BaseProviderElement extends WithContext(LitElement) {
  static get contextProviders(): ContextProviderDeclarations {
    return {
      ctxA
    };
  }

  ctxA = ctxA.initialValue;
}

class FakeProviderElement extends BaseProviderElement {
  static get contextProviders(): ContextProviderDeclarations {
    return {
      ctxB,
      ctxC
    };
  }

  ctxB = ctxB.initialValue;
  ctxC = ctxC.initialValue;
  ctxD = provideContextRecord(this, ctxRecord);

  render() {
    return html`<slot></slot>`;
  }
}

class BaseConsumerElement extends WithContext(LitElement) {
  static get contextConsumers(): ContextConsumerDeclarations {
    return {
      ctxA
    };
  }

  ctxA = ctxA.initialValue;
}

class FakeConsumerElement extends BaseConsumerElement {
  static get contextConsumers(): ContextConsumerDeclarations {
    return {
      ctxB,
      ctxC
    };
  }

  ctxB = ctxB.initialValue;
  ctxC = ctxC.initialValue;

  render() {
    return html`<span>${this.ctxA}-${this.ctxB}</span>`;
  }
}

window.customElements.define('fake-provider', FakeProviderElement);
window.customElements.define('fake-consumer', FakeConsumerElement);

describe('context', function () {
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
