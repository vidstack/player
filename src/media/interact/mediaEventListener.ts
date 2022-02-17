import type { ReactiveControllerHost } from 'lit';

import { DisposalBin, listen } from '../../base/events';
import type { MediaControllerEvents } from '../controller';

/**
 * Simplifies attaching event listeners to a media provider below in the DOM.
 * Listens for a connect event from the media provider and then attaches event listeners
 * directly on it. This is required because media events don't bubble by default.
 *
 * @example
 * ```ts
 * import { LitElement } from 'lit';
 * import { mediaEventListener } from '@vidstack/player';
 *
 * class MyElement extends LitElement {
 *   _handlePlay = mediaEventListener(this, 'vds-play', (event) => {
 *     // ...
 *   })
 * }
 * ```
 */
export function mediaEventListener<
  MediaEvent extends keyof MediaControllerEvents
>(
  host: ReactiveControllerHost & EventTarget,
  eventType: MediaEvent,
  listener: (event: MediaControllerEvents[MediaEvent]) => void
) {
  const disposal = new DisposalBin();

  host.addController({
    hostConnected: () => {
      disposal.add(
        listen(host, 'vds-media-provider-connect', (event) => {
          const { element: mediaProvider, onDisconnect } = event.detail;

          // @ts-expect-error - ?
          const off = listen(mediaProvider, eventType, listener);
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
