import { LitElement } from 'lit';

import { waitForEvent } from '../../../utils/events';
import { isFunction } from '../../../utils/unit';
import { dispatchDiscoveryEvents } from '../discovery';

class FakeElement extends LitElement {
  constructor() {
    super();
    // Test event type `vds-media-controller-connect` randomly chosen for testing.
    dispatchDiscoveryEvents(this, 'vds-media-controller-connect');
  }
}

window.customElements.define('fake-el', FakeElement);

test('it should dispatch discovery event', async () => {
  const el = document.createElement('fake-el') as FakeElement;

  setTimeout(() => {
    document.body.append(el);
  }, 0);

  const { detail } = await waitForEvent(window, 'vds-media-controller-connect');

  expect(detail.element).to.equal(el);
  expect(isFunction(detail.onDisconnect)).to.be.true;

  const disconnectSpy = vi.fn();
  detail.onDisconnect(disconnectSpy);

  el.remove();

  expect(disconnectSpy).to.toHaveBeenCalledOnce();
});
