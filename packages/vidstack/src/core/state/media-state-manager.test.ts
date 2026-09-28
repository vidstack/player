import { signal } from 'maverick.js';
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

import { mediaState } from '../api/player-state';
import { TimeRange } from '../time-ranges';
import { MediaRequestContext, MediaRequestManager } from './media-request-manager';
import { MediaStateManager } from './media-state-manager';

it.each([
  [30, 40],
  [300, 600],
])('replays an ended clip [%i, %i] from its absolute start', (start, end) => {
  const { manager, provider, request, state } = setup();
  state.clipStartTime.set(start);
  state.clipEndTime.set(end);
  state.realCurrentTime.set(end);
  state.ended.set(true);

  manager['play'](manager.createEvent('play'));

  expect(provider.setCurrentTime).toHaveBeenCalledOnce();
  expect(provider.setCurrentTime).toHaveBeenCalledWith(start);
  expect(request.queue.peek('media-seek-request')).toHaveProperty('detail', 0);
  expect(state.ended()).toBe(false);
  expect(state.paused()).toBe(false);
});

it.each([
  { position: 'before the clip start', time: 0 },
  { position: 'at the clip end', time: 600 },
  { position: 'within the end tolerance', time: 599.95 },
])('resets playback $position without an ended event', ({ time }) => {
  const { manager, provider, state } = setup();
  state.realCurrentTime.set(time);

  manager['play'](manager.createEvent('play'));

  expect(provider.setCurrentTime).toHaveBeenCalledOnce();
  expect(provider.setCurrentTime).toHaveBeenCalledWith(300);
});

it('does not reset playback within the clip', () => {
  const { manager, provider, state } = setup();
  state.realCurrentTime.set(450);

  manager['play'](manager.createEvent('play'));

  expect(provider.setCurrentTime).not.toHaveBeenCalled();
});

it('replays unclipped media from zero', () => {
  const { manager, provider, state } = setup();
  state.clipStartTime.set(0);
  state.clipEndTime.set(0);
  state.realCurrentTime.set(900);
  state.ended.set(true);

  manager['play'](manager.createEvent('play'));

  expect(provider.setCurrentTime).toHaveBeenCalledOnce();
  expect(provider.setCurrentTime).toHaveBeenCalledWith(0);
});

it('resets playback before a live DVR window to the window start', () => {
  const { manager, provider, state } = setup();
  state.clipStartTime.set(0);
  state.clipEndTime.set(0);
  state.inferredStreamType.set('live:dvr');
  state.inferredLiveDVRWindow.set(300);
  state.userBehindLiveEdge.set(true);
  state.realCurrentTime.set(500);

  expect(state.seekableStart()).toBe(600);

  manager['play'](manager.createEvent('play'));

  expect(provider.setCurrentTime).toHaveBeenCalledOnce();
  expect(provider.setCurrentTime).toHaveBeenCalledWith(600);
});

function setup() {
  const provider = { setCurrentTime: vi.fn() },
    request = new MediaRequestContext(),
    state = mediaState.create(),
    media = { $provider: signal(provider) },
    manager = new MediaStateManager(request, media as any),
    requests = new MediaRequestManager(manager, request, media as any);

  state.canPlay.set(true);
  state.seekable.set(new TimeRange(0, 900));
  state.clipStartTime.set(300);
  state.clipEndTime.set(600);

  (manager as any).$state = state;
  (requests as any).$state = state;

  manager.addEventListener('media-seek-request', (event) => {
    requests['media-seek-request'](event as any);
  });

  return { manager, provider, request, state };
}
