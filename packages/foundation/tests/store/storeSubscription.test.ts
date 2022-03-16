import { LitElement } from 'lit';

import { storeSubscription, writable } from '$lib';

class FakeElement extends LitElement {
  store = writable(0);
  subscription = vi.fn();

  constructor() {
    super();
    storeSubscription(this, this.store, this.subscription);
  }
}

window.customElements.define('fake-el', FakeElement);

it('should subscribe to store on connect', () => {
  const el = document.createElement('fake-el') as FakeElement;

  el.store.set(10);

  expect(el.subscription).to.not.toHaveBeenCalledWith(0);
  expect(el.subscription).to.not.toHaveBeenCalledWith(10);

  document.body.appendChild(el);

  el.store.set(20);

  expect(el.subscription).toHaveBeenCalledWith(10);
  expect(el.subscription).toHaveBeenCalledWith(20);

  el.remove();
  el.store.set(30);

  expect(el.subscription).to.not.toHaveBeenCalledWith(30);
});
