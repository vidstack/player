import type { ReactiveControllerHost } from 'lit';

import { hostedEventListener } from '../../base/events';
import type { MediaService } from '.';

export type MediaServiceControllerHost = ReactiveControllerHost &
  EventTarget & {
    readonly mediaService: MediaService;
  };

/**
 * Responsible for listening for events dispatched from the host element, and forwarding
 * media related events to the hosted `MediaService`. This is currently used by the
 * `MediaProviderElement`.
 */
export class MediaServiceController {
  constructor(protected readonly _host: MediaServiceControllerHost) {
    const events = [
      'vds-autoplay-change',
      'vds-autoplay-fail',
      'vds-can-play',
      'vds-can-play-through',
      'vds-controls-change',
      'vds-fullscreen-change',
      'vds-fullscreen-support-change',
      'vds-loop-change',
      'vds-play-fail',
      'vds-playsinline-change',
      'vds-poster-change',
      'vds-src-change',
      'vds-time-update',
      'vds-volume-change',
      'vds-abort',
      'vds-autoplay',
      'vds-ended',
      'vds-error',
      'vds-load-start', // loading
      'vds-loaded-metadata', // loaded
      'vds-pause',
      'vds-play',
      'vds-playing',
      'vds-progress',
      'vds-seeked',
      'vds-seeking',
      'vds-waiting',
      'vds-replay'
    ] as const;

    const mediaEventToMachineEventMap = {
      'vds-can-play-through': 'can-play',
      'vds-loaded-metadata': 'loaded',
      'vds-load-start': 'loading',
      'vds-seeked': 'pause'
    };

    const mediaService = _host.mediaService;
    mediaService.start();

    _host.addController({
      hostConnected() {
        mediaService.start();
      },
      hostDisconnected() {
        mediaService.stop();
      }
    });

    mediaService.subscribe(console.log);

    let replayed = false;
    events.forEach((eventType) => {
      hostedEventListener(_host, eventType, (event) => {
        if (event.type === 'vds-replay') {
          replayed = true;
          return;
        }

        let type =
          mediaEventToMachineEventMap[event.type] ?? event.type.slice(4);

        // Handle when play is called on media end since it seeks back to the start.
        if (event.type === 'vds-seeked' && replayed) {
          type = 'playing';
          replayed = false;
        }

        if (event.type === 'vds-pause' || event.type === 'vds-playing') {
          replayed = false;
        }

        mediaService.send({
          // Slice `vds-` (4 chars) off the event to match the machine event name.
          type,
          trigger: event
        });
      });
    });
  }
}
