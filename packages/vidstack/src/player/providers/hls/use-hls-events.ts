import type * as HLS from 'hls.js';
import type { ReadSignal } from 'maverick.js';
import { CustomElementHost, onAttach } from 'maverick.js/element';
import { DOMEvent, kebabToCamelCase } from 'maverick.js/std';

import type { HLSProviderEvents } from './events';
import type { HLSVideoElement } from './types';

const PREFIX = 'hls-';

// `hls-media-attaching` -> `hlsMediaAttaching`
function vdsToHLSEventType(type: string) {
  return kebabToCamelCase(type) as HLS.Events;
}

// these events are not `hls.js` events but start with the `hls-` prefix.
const ignore = new Set<keyof HLSProviderEvents>([
  `${PREFIX}lib-load-start`,
  `${PREFIX}lib-loaded`,
  `${PREFIX}lib-load-error`,
  `${PREFIX}instance`,
  `${PREFIX}unsupported`,
]);

// e.g., `hls-media-attaching`
function isHLSEventType(type: string): type is HLS.Events {
  return type.startsWith(PREFIX) && !ignore.has(type as keyof HLSProviderEvents);
}

export function useHLSEvents(
  host: CustomElementHost<HLSVideoElement>,
  $engine: ReadSignal<HLS.default | null>,
) {
  let listeners: {
    type: HLS.Events;
    listener: (type: HLS.Events, data: any) => void;
    handler: () => void;
    options?: AddEventListenerOptions & { context: any };
  }[] = [];

  // Modify native event interface to handle adding/removing `hls.js` events
  onAttach(() => {
    if (__SERVER__) return;

    const addEventListener = host.el!.addEventListener;
    host.el!.addEventListener = function (eventType, handler, options) {
      if (isHLSEventType(eventType)) {
        const type = vdsToHLSEventType(eventType),
          listener = (_, data) => void handler(new DOMEvent(eventType, { detail: data }));

        listeners.push({
          type,
          listener,
          handler,
          options,
        });

        $engine()?.[options?.once ? 'once' : 'on'](eventType, listener, options?.context);
        return;
      }

      addEventListener.call(this, eventType, handler, options);
    };

    const removeEventListener = host.el!.removeEventListener;
    host.el!.removeEventListener = function (eventType, handler, options) {
      if (isHLSEventType(eventType)) {
        const type = vdsToHLSEventType(eventType);

        listeners = listeners.filter((l) => {
          if (l.type === type && l.handler === handler) {
            $engine()?.off(l.type, l.listener);
            return false;
          }

          return true;
        });

        return;
      }

      removeEventListener.call(this, eventType, handler, options);
    };
  });

  return {
    get listeners() {
      return listeners;
    },
  };
}
