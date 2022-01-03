import { createContext } from '../../base/context';
import { derived, writable } from '../../base/stores';

export function createScrubberStore() {
  const dragging = writable(false);
  const pointing = writable(false);

  return {
    /**
     * Whether the scrubber handle is currently being dragged.
     */
    dragging,
    /**
     * Whether a device pointer is within the scrubber bounds.
     */
    pointing,
    /**
     * Whether the scrubber is being interacted with.
     */
    interactive: derived(
      [dragging, pointing],
      ([$dragging, $pointing]) => $dragging || $pointing
    )
  };
}

export const scrubberStoreContext = createContext(createScrubberStore);
