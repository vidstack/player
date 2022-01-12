import type { ReactiveControllerHost } from 'lit';

import { DisposalBin, listen } from '../../base/events';
import { MediaEvents } from '../events';

/**
 * Simplifies attaching event listeners to a media controller below in the DOM.
 * Listens for a connect event from the media controller and then attaches event listeners
 * directly on it. This is required because media events don't bubble by default.
 *
 * @example
 * ```ts
 * import { LitElement } from 'lit';
 * import { hostMediaEventListener } from '@vidstack/player';
 *
 * class MyElement extends LitElement {
 *   _handlePlay = hostMediaEventListener(this, (event) => {
 *     // ...
 *   })
 * }
 * ```
 */
export function hostedMediaEventListener<MediaEvent extends keyof MediaEvents>(
  host: ReactiveControllerHost & EventTarget,
  eventType: MediaEvent,
  listener: (event: MediaEvents[MediaEvent]) => void
) {
  const disposal = new DisposalBin();

  host.addController({
    hostConnected: () => {
      disposal.add(
        listen(host, 'vds-media-controller-connect', (event) => {
          const { element: mediaController, onDisconnect } = event.detail;

          // @ts-expect-error - ?
          const off = listen(mediaController, eventType, listener);
          disposal.add(off);
          onDisconnect(() => {
            off?.();
          });
        })
      );
    },
    hostDisconnected: () => {
      disposal.empty();
    }
  });
}
