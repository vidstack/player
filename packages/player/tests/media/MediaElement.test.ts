import { isFunction, waitForEvent } from '@vidstack/foundation';

import { MediaConnectEvent, MediaElement } from '$lib';

it('should dispatch discovery event', async () => {
  const controller = document.createElement('vds-media');

  setTimeout(() => {
    window.document.body.append(controller);
  });

  const { detail } = (await waitForEvent(document, 'vds-media-connect')) as MediaConnectEvent;

  expect(detail.element).to.be.instanceOf(MediaElement);
  expect(isFunction(detail.onDisconnect)).to.be.true;
});
