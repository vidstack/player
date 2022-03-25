import { discover, listen } from '@vidstack/foundation';
import type { ReactiveControllerHost } from 'lit';

import type { MediaControllerEvents } from '../controller';
import { mediaProviderDiscoveryId } from '../provider';

/**
 * Simplifies attaching event listeners to a media provider below in the DOM. This is required
 * because media events don't bubble by default.
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
export function mediaEventListener<MediaEvent extends keyof MediaControllerEvents>(
  host: ReactiveControllerHost & HTMLElement,
  eventType: MediaEvent,
  listener: (event: MediaControllerEvents[MediaEvent]) => void,
) {
  discover(host, mediaProviderDiscoveryId, (provider, onDisconnect) => {
    // @ts-expect-error - ?
    const off = listen(provider, eventType, listener);
    onDisconnect(() => {
      off?.();
    });
  });
}
