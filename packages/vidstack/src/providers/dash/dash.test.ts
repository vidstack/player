import type { MediaContext } from '../../core/api/media-context';
import { QualitySymbol } from '../../core/quality/symbols';
import { ListSymbol } from '../../foundation/list/symbols';
import { DASHController } from './dash';

vi.mock('maverick.js/std', async (importOriginal) => {
  const actual = await importOriginal<typeof import('maverick.js/std')>();

  return {
    ...actual,
    DOMEvent: class DOMEvent<T = unknown> extends Event {
      detail: T | undefined;
      trigger: Event | undefined;

      constructor(type: string, init?: EventInit & { detail?: T; trigger?: Event }) {
        super(type, init);
        this.detail = init?.detail;
        this.trigger = init?.trigger;
      }
    },
  };
});

const DASH_EVENTS = {
  ERROR: 'error',
  FRAGMENT_LOADING_STARTED: 'fragmentLoadingStarted',
  FRAGMENT_LOADING_COMPLETED: 'fragmentLoadingCompleted',
  MANIFEST_LOADED: 'manifestLoaded',
  QUALITY_CHANGE_RENDERED: 'qualityChangeRendered',
  TEXT_TRACKS_ADDED: 'textTracksAdded',
  TRACK_CHANGE_RENDERED: 'trackChangeRendered',
};

it('continues manifest processing when no supported video quality is found', () => {
  const video = document.createElement('video');
  vi.spyOn(video, 'canPlayType').mockImplementation((type) => {
    return type === 'audio/mp4' ? 'probably' : '';
  });

  const ctx = {
    player: { dispatch: vi.fn() },
    qualities: createTestList(true),
    audioTracks: createTestList(),
    notify: vi.fn(),
    $state: {
      canPlay: () => false,
      live: () => false,
    },
  } as unknown as MediaContext;

  const listeners: Record<string, ((event: any) => void)[]> = {};
  const dash = {
    on: vi.fn((type: string, listener: (event: any) => void) => {
      (listeners[type] ??= []).push(listener);
    }),
    initialize: vi.fn(),
    updateSettings: vi.fn(),
    getVideoElement: () => video,
    getTracksForTypeFromManifest: vi.fn((type: string) => {
      return type === 'audio'
        ? [
            {
              index: 0,
              lang: 'en',
              labels: [],
              mimeType: 'audio/mp4',
              codec: 'mp4a.40.2',
            },
          ]
        : [
            {
              index: 0,
              bitrateList: [{ id: 1, width: 1920, height: 1080, bandwidth: 5_000_000 }],
              mimeType: 'video/mp4',
              codec: 'avc1.640028',
            },
          ];
    }),
    duration: () => 0,
    time: () => 0,
    destroy: vi.fn(),
  };

  const ctor = Object.assign(
    () => ({
      create: () => dash,
    }),
    { events: DASH_EVENTS },
  );

  const dispatchEvent = vi.spyOn(video, 'dispatchEvent').mockImplementation(() => true);

  new DASHController(video, ctx).setup(ctor as any);

  const event = {
    type: DASH_EVENTS.MANIFEST_LOADED,
    data: { type: 'static', mediaPresentationDuration: 10 },
  };

  expect(() => {
    listeners[DASH_EVENTS.MANIFEST_LOADED]!.forEach((listener) => listener(event));
  }).not.toThrow();

  expect(ctx.qualities.length).to.equal(0);
  expect(ctx.audioTracks.length).to.equal(1);
  expect((ctx.audioTracks[0] as any)?.mimeType).to.equal('audio/mp4');
  expect(dispatchEvent).toHaveBeenCalledOnce();
  expect(dispatchEvent.mock.calls[0]?.[0].type).to.equal('canplay');
});

function createTestList(qualityList = false) {
  const list = [] as any;

  list.addEventListener = vi.fn();
  list.removeEventListener = vi.fn();
  list.getById = (id: string) => list.find((item) => item.id === id) ?? null;
  list.toArray = () => [...list];
  list[ListSymbol.add] = (item: any) => {
    list.push({ ...item, selected: false });
  };
  list[ListSymbol.select] = (item: any, selected: boolean) => {
    if (item) item.selected = selected;
  };

  Object.defineProperties(list, {
    selected: {
      get: () => list.find((item) => item.selected) ?? null,
    },
    selectedIndex: {
      get: () => list.findIndex((item) => item.selected),
    },
  });

  if (qualityList) {
    list.auto = false;
    list.switch = 'current';
    list[QualitySymbol.setAuto] = (auto: boolean) => {
      list.auto = auto;
    };
  }

  return list;
}
