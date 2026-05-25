import type * as HLS from 'hls.js';
import { vi } from 'vitest';

import { QualitySymbol } from '../../core/quality/symbols';
import { ListSymbol } from '../../foundation/list/symbols';
import { HLSController } from './hls';
import type { HLSConstructor } from './types';

const Events = {
  AUDIO_TRACK_SWITCHED: 'AUDIO_TRACK_SWITCHED',
  CUES_PARSED: 'CUES_PARSED',
  ERROR: 'ERROR',
  LEVEL_LOADED: 'LEVEL_LOADED',
  LEVEL_SWITCHED: 'LEVEL_SWITCHED',
  LEVEL_UPDATED: 'LEVEL_UPDATED',
  NON_NATIVE_TEXT_TRACKS_FOUND: 'NON_NATIVE_TEXT_TRACKS_FOUND',
} as const;

class FakeHLS {
  static Events = Events;

  audioTracks: any[] = [];
  currentLevel = -1;
  levels: any[] = [];
  liveSyncPosition: number | null = null;
  media: HTMLMediaElement | null = null;
  subtitleTrack = -1;

  readonly #listeners = new Map<string, Set<(eventType: string, data: any) => void>>();

  constructor(_config: Partial<HLS.HlsConfig>) {}

  on(event: string, callback: (eventType: string, data: any) => void) {
    let listeners = this.#listeners.get(event);
    if (!listeners) this.#listeners.set(event, (listeners = new Set()));
    listeners.add(callback);
  }

  attachMedia(media: HTMLMediaElement) {
    this.media = media;
  }

  destroy() {
    this.media = null;
  }

  emit(event: string, data: any) {
    for (const listener of this.#listeners.get(event) ?? []) {
      listener(event, data);
    }
  }

  loadSource() {}

  recoverMediaError() {}
}

it('ignores stale level loaded callbacks after destroy', () => {
  const { controller, ctx, video } = setup();
  const instance = controller.instance as unknown as FakeHLS;
  const onCanPlay = vi.fn();

  video.addEventListener('canplay', onCanPlay);
  ctx.player.dispatch.mockClear();
  controller.destroy();

  expect(() => instance.emit(Events.LEVEL_LOADED, createLevelLoadedData())).not.toThrow();

  expect(ctx.player.dispatch).not.toHaveBeenCalled();
  expect(ctx.notify).not.toHaveBeenCalled();
  expect(ctx.audioTracks[ListSymbol.add]).not.toHaveBeenCalled();
  expect(ctx.qualities[ListSymbol.add]).not.toHaveBeenCalled();
  expect(ctx.qualities[QualitySymbol.setAuto]).not.toHaveBeenCalled();
  expect(onCanPlay).not.toHaveBeenCalled();
});

it('returns from level loaded callbacks when media is unavailable', () => {
  const { controller, ctx, video } = setup();
  const instance = controller.instance as unknown as FakeHLS;
  const onCanPlay = vi.fn();

  video.addEventListener('canplay', onCanPlay);
  instance.media = null;
  ctx.player.dispatch.mockClear();

  expect(() => instance.emit(Events.LEVEL_LOADED, createLevelLoadedData())).not.toThrow();

  expect(ctx.notify).not.toHaveBeenCalled();
  expect(ctx.audioTracks[ListSymbol.add]).not.toHaveBeenCalled();
  expect(ctx.qualities[ListSymbol.add]).not.toHaveBeenCalled();
  expect(ctx.qualities[QualitySymbol.setAuto]).not.toHaveBeenCalled();
  expect(onCanPlay).not.toHaveBeenCalled();
});

function setup() {
  const video = document.createElement('video'),
    ctx = createContext(),
    controller = new HLSController(video, ctx);

  controller.setup(FakeHLS as unknown as HLSConstructor);

  return { controller, ctx, video };
}

function createContext() {
  const audioTracks = new EventTarget() as any,
    qualities = new EventTarget() as any;

  audioTracks.selectedIndex = -1;
  audioTracks[ListSymbol.add] = vi.fn();
  audioTracks[ListSymbol.select] = vi.fn();

  qualities.auto = false;
  qualities.selectedIndex = -1;
  qualities.switch = 'current';
  qualities[ListSymbol.add] = vi.fn();
  qualities[ListSymbol.select] = vi.fn();
  qualities[QualitySymbol.setAuto] = vi.fn();

  return {
    $state: {
      canPlay: () => false,
      inferredLiveDVRWindow: { set: vi.fn() },
      live: () => false,
      liveSyncPosition: { set: vi.fn() },
      source: () => null,
      streamType: () => 'on-demand',
    },
    audioTracks,
    notify: vi.fn(),
    player: { dispatch: vi.fn() },
    qualities,
    textTracks: {
      add: vi.fn(),
      getById: vi.fn(),
    },
  } as any;
}

function createLevelLoadedData() {
  return {
    details: {
      live: false,
      targetduration: 6,
      totalduration: 30,
      type: 'VOD',
    },
  } as HLS.LevelLoadedData;
}
