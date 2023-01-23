import type * as HLS from 'hls.js';
import { effect, ReadSignal } from 'maverick.js';
import type { CustomElementHost } from 'maverick.js/element';
import { camelToKebabCase, DOMEvent, kebabToPascalCase } from 'maverick.js/std';

import type { HLSConstructor, HLSVideoElement } from './types';

const toDOMEventType = (type: string) => camelToKebabCase(type.slice('hls'.length));
const toHLSEventType = (type: string) => ('hls' + kebabToPascalCase(type)) as HLS.Events;

export function useHLSEvents(
  host: CustomElementHost<HLSVideoElement>,
  $ctor: ReadSignal<HLSConstructor | null>,
  $engine: ReadSignal<HLS.default | null>,
) {
  effect(() => {
    const ctor = $ctor(),
      engine = $engine();

    if (ctor && engine) {
      const validEvents = new Set(Object.values(ctor.Events).map(toDOMEventType)),
        active: Record<string, number> = {};

      effect(() => {
        const add = host.el!.$$_add_listeners!();

        for (const [event, once] of add) {
          if (!validEvents.has(event)) continue;
          const count = (active[event] ??= 0);
          if (!count) engine[once ? 'once' : 'on'](toHLSEventType(event), onDispatchEvent);
          if (!once) active[event]++;
        }

        add.length = 0;
      });

      effect(() => {
        const remove = host.el!.$$_remove_listeners!();

        for (const event of remove) {
          if (!validEvents.has(event) || !active[event]) continue;
          if (!--active[event]) engine.off(toHLSEventType(event), onDispatchEvent);
        }

        remove.length = 0;
      });
    }
  });

  function onDispatchEvent(event, data) {
    host.el?.dispatchEvent(new DOMEvent(toDOMEventType(event), { detail: data }));
  }
}
