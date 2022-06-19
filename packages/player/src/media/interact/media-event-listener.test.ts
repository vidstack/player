import '$define/vds-media';
import '$test-utils/vds-fake-media-provider';

import { vdsEvent, waitForEvent } from '@vidstack/foundation';
import { LitElement } from 'lit';

import { mediaEventListener } from './media-event-listener';

class MediaListenerElement extends LitElement {
  pauseListener = vi.fn();
  handlePause = mediaEventListener(this, 'vds-pause', this.pauseListener);
}

window.customElements.define('media-listener', MediaListenerElement);

it('should listen to media events', async function () {
  const media = document.createElement('vds-media');

  const listener = document.createElement('media-listener') as MediaListenerElement;
  media.append(listener);

  window.document.body.append(media);

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

it('should stop listening to media events when listener disconnects', async function () {
  const media = document.createElement('vds-media');

  const listener = document.createElement('media-listener') as MediaListenerElement;
  media.append(listener);

  window.document.body.append(media);

  const pauseEvent = vdsEvent('vds-pause');
  listener.dispatchEvent(pauseEvent);
  expect(listener.pauseListener).toHaveBeenCalledTimes(0);
});

it('should stop listening to media events when provider disconnects', async function () {
  const media = document.createElement('vds-media');

  const listener = document.createElement('media-listener') as MediaListenerElement;
  media.append(listener);

  window.document.body.append(media);

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
