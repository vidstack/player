import { DisposalBin } from '../../base/events';
import { type MediaContext } from '../MediaContext';
import { type MediaProviderElement } from '../provider';

/**
 * Default set of whitelisted store properties that the `mediaStoreAction` is subscribing to on
 * the provider's `mediaStore`.
 *
 * 🤯 What a name... we're now officially writing Java.
 */
export function getWhitelistedMediaStoreActionProperties() {
  return new Set<keyof MediaContext>([
    'autoplay',
    'controls',
    'currentTime',
    'loop',
    'muted',
    'paused',
    'playsinline',
    'volume'
  ]);
}

/**
 * Subscribes to a set of `whitelist` stores on the given provider's `mediaStore`, and calls
 * the `onChange` callback with the updated values.
 *
 * This action is used to keep media properties in a story in-sync with the state of the actual
 * provider.
 */
export function mediaStoreAction(
  node: MediaProviderElement,
  onChange: (ctx: Partial<MediaContext>) => void,
  whitelist = getWhitelistedMediaStoreActionProperties()
) {
  const disposal = new DisposalBin();

  let ready = false;

  for (const key in node.mediaStore) {
    if (whitelist.has(key as keyof MediaContext)) {
      const unsub = node.mediaStore[key].subscribe(() => {
        if (ready) {
          const state = {};

          for (const prop of whitelist) {
            state[prop] = node.mediaState[prop];
          }

          onChange(state);
        }
      });

      disposal.add(unsub);
    }
  }

  ready = true;

  return {
    destroy() {
      ready = false;
      disposal.empty();
    }
  };
}
