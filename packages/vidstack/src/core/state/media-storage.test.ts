import { vi } from 'vitest';

import type { Src } from '../api/src-types';
import { LocalMediaStorage } from './media-storage';

describe('LocalMediaStorage', function () {
  afterEach(function () {
    vi.unstubAllGlobals();
  });

  it('does not throw when `localStorage` is unavailable', async function () {
    // Some mobile WebViews expose `localStorage` as `null` (see issue #1444).
    vi.stubGlobal('localStorage', null);

    const storage = new LocalMediaStorage(),
      src: Src = { src: 'https://example.com/video.mp4', type: 'video/mp4' };

    expect(() => storage.onChange(src, 'media-id', 'player-id')).not.toThrow();
    await expect(storage.setVolume(0.5)).resolves.toBeUndefined();
    await expect(storage.setTime(10, true)).resolves.toBeUndefined();
  });
});
