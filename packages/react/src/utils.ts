import { noop } from 'maverick.js/std';
import type { VTTCue } from 'media-captions';

export function createVTTCue(startTime = 0, endTime = 0, text = ''): VTTCue {
  if (__SERVER__) {
    return {
      startTime,
      endTime,
      text,
      addEventListener: noop,
      removeEventListener: noop,
      dispatchEvent: noop,
    } as VTTCue;
  }

  return new window.VTTCue(startTime, endTime, text);
}
