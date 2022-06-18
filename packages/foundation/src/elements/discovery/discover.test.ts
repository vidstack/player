import { LitElement } from 'lit';

import { waitForEvent } from '../../utils/events';
import { isFunction } from '../../utils/unit';
import { discoverable } from './discover';

class FakeElement extends LitElement {
  constructor() {
    super();
    discoverable(this, 'vds-noop');
  }
}

window.customElements.define('fake-el', FakeElement);

it('should dispatch discovery event', async () => {
  const el = document.createElement('fake-el') as FakeElement;

  setTimeout(() => {
    document.body.append(el);
  }, 0);

  const { detail } = await waitForEvent(window, 'vds-noop');

  expect(detail.element).to.equal(el);
  expect(isFunction(detail.onDisconnect)).to.be.true;

  const disconnectSpy = vi.fn();
  detail.onDisconnect(disconnectSpy);

  el.remove();

  expect(disconnectSpy).toHaveBeenCalledOnce();
});
