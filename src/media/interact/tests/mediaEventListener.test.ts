import '../../../define/vds-fake-media-provider';

import { LitElement } from 'lit';

import { vdsEvent } from '../../../base/events';
import { waitForEvent } from '../../../utils/events';
import { mediaEventListener } from '../mediaEventListener';

class MediaListenerElement extends LitElement {
  pauseListener = vi.fn();
  handlePause = mediaEventListener(this, 'vds-pause', this.pauseListener);
}

window.customElements.define('media-listener', MediaListenerElement);

test('it should listen to media events', async function () {
  const listener = document.createElement(
    'media-listener'
  ) as MediaListenerElement;

  window.document.body.append(listener);

  const provider = document.createElement('vds-fake-media-provider');
  setTimeout(() => {
    listener.append(provider);
  }, 0);

  await waitForEvent(listener, 'vds-media-provider-connect');

  const pauseEvent = vdsEvent('vds-pause');

  provider.dispatchEvent(pauseEvent);

  expect(listener.pauseListener).toHaveBeenCalledOnce();
  expect(listener.pauseListener).toHaveBeenCalledWith(pauseEvent);
});

test('it should stop listening to media events when listener disconnects', async function () {
  const listener = document.createElement(
    'media-listener'
  ) as MediaListenerElement;

  window.document.body.append(listener);

  const pauseEvent = vdsEvent('vds-pause');
  listener.dispatchEvent(pauseEvent);

  expect(listener.pauseListener).toHaveBeenCalledTimes(0);
});

test('it should stop listening to media events when provider disconnects', async function () {
  const listener = document.createElement(
    'media-listener'
  ) as MediaListenerElement;

  window.document.body.append(listener);

  const provider = document.createElement('vds-fake-media-provider');
  setTimeout(() => {
    listener.append(provider);
  }, 0);

  await waitForEvent(listener, 'vds-media-provider-connect');

  provider.remove();

  const pauseEvent = vdsEvent('vds-pause');

  provider.dispatchEvent(pauseEvent);

  expect(listener.pauseListener).toHaveBeenCalledTimes(0);
});
