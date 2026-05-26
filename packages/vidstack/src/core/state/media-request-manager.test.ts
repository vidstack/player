import { vi } from 'vitest';

vi.mock('../api/player-controller', () => ({
  MediaPlayerController: class extends EventTarget {
    $props = {};
    $state: any;

    createEvent(type: string, init?: EventInit & { detail?: unknown; trigger?: Event }) {
      const event = new Event(type, init) as Event & { detail?: unknown; trigger?: Event };
      event.detail = init?.detail;
      event.trigger = init?.trigger;
      return event;
    }

    dispatch(event: Event | string, init?: EventInit & { detail?: unknown; trigger?: Event }) {
      return typeof event === 'string'
        ? this.dispatchEvent(this.createEvent(event, init))
        : this.dispatchEvent(event);
    }

    listen() {
      return () => {};
    }
  },
}));

import { MediaRequestContext, MediaRequestManager } from './media-request-manager';

it('seeks non-DVR live streams to the live edge even when seeking is disabled', () => {
  const { event, manager, provider, request, state } = setup();

  manager['media-live-edge-request'](event as any);

  expect(provider.setCurrentTime).toHaveBeenCalledWith(100);
  expect(state.userBehindLiveEdge.set).toHaveBeenCalledWith(false);
  expect(request.queue.peek('media-seek-request')).toBe(event);
});

it('does not bypass normal seek guards for non-DVR live streams', () => {
  const { manager, provider, request } = setup();
  const event = new CustomEvent('media-seek-request', { detail: 50 });

  manager['media-seek-request'](event as any);

  expect(provider.setCurrentTime).not.toHaveBeenCalled();
  expect(request.queue.peek('media-seek-request')).toBeUndefined();
});

it('keeps seekable live streams at the live edge as a no-op', () => {
  const { event, manager, provider } = setup({
    canSeek: signal(true),
    liveEdge: signal(true),
  });

  manager['media-live-edge-request'](event as any);

  expect(provider.setCurrentTime).not.toHaveBeenCalled();
});

function setup(stateOverrides: Record<string, unknown> = {}) {
  const provider = {
      setCurrentTime: vi.fn(),
    },
    request = new MediaRequestContext(),
    state = {
      bufferedStart: signal(0),
      canPlay: signal(true),
      canSeek: signal(false),
      clipStartTime: signal(0),
      ended: signal(false),
      isLiveDVR: signal(false),
      live: signal(true),
      liveDVRWindow: signal(0),
      liveEdge: signal(true),
      liveSyncPosition: signal(100),
      seekableEnd: signal(102),
      seekableStart: signal(0),
      userBehindLiveEdge: signal(true),
      ...stateOverrides,
    },
    media = {
      $provider: signal(provider),
    },
    manager = new MediaRequestManager({ handle: vi.fn() } as any, request, media as any),
    event = new Event('media-live-edge-request');

  (manager as any).$state = state;

  return { event, manager, provider, request, state };
}

function signal<T>(initialValue: T) {
  let value = initialValue;

  const read = vi.fn(() => value) as unknown as (() => T) & { set: ReturnType<typeof vi.fn> };

  read.set = vi.fn((nextValue: T) => {
    value = nextValue;
  });

  return read;
}
