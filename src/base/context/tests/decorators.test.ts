import { elementUpdated, expect, fixture } from '@open-wc/testing';
import { html, LitElement } from 'lit';
import { spy } from 'sinon';

import { createContext } from '../context';
import { consumeContext, provideContext, watchContext } from '../decorators';

const testContext = createContext(10);

class FakeProviderElement extends LitElement {
  @provideContext(testContext) context = testContext.initialValue;
}

class FakeConsumerElement extends LitElement {
  @consumeContext(testContext) context = testContext.initialValue;

  @watchContext(testContext)
  handleTestContextUpdate(n: number) {}
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

  it('should watch context property in consumer', async function () {
    const { provider, consumer } = await buildFixture();

    const handleUpdateSpy = spy(consumer, 'handleTestContextUpdate');

    provider.context = 100;
    await elementUpdated(consumer);
    expect(handleUpdateSpy).to.have.been.calledWith(100);

    provider.context = 200;
    await elementUpdated(consumer);
    expect(handleUpdateSpy).to.have.been.calledWith(200);
  });

  it('should throw error if @consumeContext is used without LitElement', async function () {
    expect(() => {
      class BadConsumerElement {
        @consumeContext(testContext) context: any;
      }
    }).to.throw(
      `[vds]: \`BadConsumerElement\` must extend \`ReactiveElement\` to use the \`@consumeContext\` decorator.`
    );
  });

  it('should throw error if @provideContext is used without LitElement', async function () {
    expect(() => {
      class BadProviderElement {
        @provideContext(testContext) context: any;
      }
    }).to.throw(
      `[vds]: \`BadProviderElement\` must extend \`ReactiveElement\` to use the \`@provideContext\` decorator.`
    );
  });

  it('should throw error if @watchContext is used without LitElement', async function () {
    expect(() => {
      class BadProviderElement {
        @watchContext(testContext)
        handleUpdate() {}
      }
    }).to.throw(
      `[vds]: \`BadProviderElement\` must extend \`ReactiveElement\` to use the \`@watchContext\` decorator.`
    );
  });
});
