import { createContext } from '../../base/context';
import { writable } from '../../base/stores';

export function createScrubberPreviewStore() {
  return {
    /**
     * The current time of media playback to show a preview for. This is determined by where
     * the device is pointing/dragging at on the scrubber.
     */
    time: writable(0),
    /**
     * Whether the preview is showing.
     */
    showing: writable(false)
  };
}

export const scrubberPreviewStore = createContext(createScrubberPreviewStore);
