import { fixture } from '@open-wc/testing-helpers';
import { html, LitElement } from 'lit';

import { createContext } from '$lib';

const ctxA = createContext(() => ({}));

class FakeProviderElement extends LitElement {
  ctxA = ctxA.provide(this);
}

class FakeConsumerElement extends LitElement {
  ctxA = ctxA.consume(this);
}

window.customElements.define('fake-provider', FakeProviderElement);
window.customElements.define('fake-consumer', FakeConsumerElement);

async function buildFixture() {
  const provider = await fixture<FakeProviderElement>(html`
    <fake-provider>
      <fake-consumer></fake-consumer>
    </fake-provider>
  `);

  const consumer = provider.querySelector('fake-consumer') as FakeConsumerElement;

  return { provider, consumer };
}

it('should connect to provider', async () => {
  const { provider, consumer } = await buildFixture();
  expect(consumer.ctxA.value).to.equal(provider.ctxA.value);
});

it('should cache context value on host element', async () => {
  const { provider, consumer } = await buildFixture();

  const connectEventListenerSpy = vi.fn();
  provider.addEventListener('vds-context-consumer-connect', connectEventListenerSpy, {
    capture: true,
  });

  ctxA.consume(consumer);

  expect(connectEventListenerSpy).not.toHaveBeenCalled();
});
