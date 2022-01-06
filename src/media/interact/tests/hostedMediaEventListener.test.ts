import '../../../define/vds-media-controller';

import { LitElement } from 'lit';

import { VdsEvent } from '../../../base/events';
import { waitForEvent } from '../../../global/tests/utils';
import { hostedMediaEventListener } from '../hostedMediaEventListener';

class MediaListenerElement extends LitElement {
  playListener = vi.fn();
  pauseListener = vi.fn();

  handlePlay = hostedMediaEventListener(this, 'vds-play', this.playListener);
  handlePause = hostedMediaEventListener(this, 'vds-pause', this.pauseListener);
}

window.customElements.define('media-listener', MediaListenerElement);

test('it should listen to media events', async function () {
  const listener = document.createElement(
    'media-listener'
  ) as MediaListenerElement;

  window.document.body.append(listener);

  const controller = document.createElement('vds-media-controller');
  setTimeout(() => {
    listener.append(controller);
  }, 0);

  await waitForEvent(listener, 'vds-media-controller-connect');

  const playEvent = new VdsEvent('vds-play');
  const pauseEvent = new VdsEvent('vds-pause');

  controller.dispatchEvent(playEvent);
  controller.dispatchEvent(pauseEvent);
  controller.dispatchEvent(playEvent);

  expect(listener.playListener).toHaveBeenCalledTimes(2);
  expect(listener.pauseListener).toHaveBeenCalledOnce();
  expect(listener.playListener).toHaveBeenCalledWith(playEvent);
  expect(listener.pauseListener).toHaveBeenCalledWith(pauseEvent);
});

test('it should stop listening to media events when listener disconnects', async function () {
  const listener = document.createElement(
    'media-listener'
  ) as MediaListenerElement;

  window.document.body.append(listener);

  const playEvent = new VdsEvent('vds-play');
  listener.dispatchEvent(playEvent);

  expect(listener.playListener).toHaveBeenCalledTimes(0);
});

test('it should stop listening to media events when controller disconnects', async function () {
  const listener = document.createElement(
    'media-listener'
  ) as MediaListenerElement;

  window.document.body.append(listener);

  const controller = document.createElement('vds-media-controller');
  setTimeout(() => {
    listener.append(controller);
  }, 0);

  await waitForEvent(listener, 'vds-media-controller-connect');

  controller.remove();

  const playEvent = new VdsEvent('vds-play');

  controller.dispatchEvent(playEvent);

  expect(listener.playListener).toHaveBeenCalledTimes(0);
});
