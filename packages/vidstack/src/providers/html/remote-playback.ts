import { effect, signal } from 'maverick.js';
import { EventsController, listenEvent } from 'maverick.js/std';

import type { MediaContext } from '../../core/api/media-context';
import { getAndroidVersion, IS_CHROME } from '../../utils/support';
import type { MediaRemotePlaybackAdapter } from '../types';

export abstract class HTMLRemotePlaybackAdapter implements MediaRemotePlaybackAdapter {
  protected abstract readonly type: 'airplay' | 'google-cast';
  protected abstract readonly canPrompt: boolean;

  readonly #media: HTMLMediaElement;
  readonly #ctx: MediaContext;

  #state?: RemotePlaybackState;
  #supported = signal(false);

  get supported() {
    return this.#supported();
  }

  constructor(media: HTMLMediaElement, ctx: MediaContext) {
    this.#media = media;
    this.#ctx = ctx;
    this.#setup();
  }

  #setup() {
    if (__SERVER__ || !this.#media?.remote || !this.canPrompt) return;

    this.#media.remote
      .watchAvailability((available) => {
        this.#supported.set(available);
      })
      .catch(() => {
        this.#supported.set(false);
      });

    effect(this.#watchSupported.bind(this));
  }

  #watchSupported() {
    if (!this.#supported()) return;

    const events = ['connecting', 'connect', 'disconnect'],
      onStateChange = this.#onStateChange.bind(this);

    onStateChange();
    listenEvent(this.#media, 'playing', onStateChange);

    const remoteEvents = new EventsController(this.#media.remote);
    for (const type of events) {
      // @ts-expect-error - video remote not typed
      remoteEvents.add(type, onStateChange);
    }
  }

  async prompt() {
    if (!this.supported) throw Error('Not supported on this platform.');

    if (this.type === 'airplay' && this.#media.webkitShowPlaybackTargetPicker) {
      return this.#media.webkitShowPlaybackTargetPicker();
    }

    return this.#media.remote.prompt();
  }

  #onStateChange(event?: Event) {
    const state = this.#media.remote.state;
    if (state === this.#state) return;

    const detail = { type: this.type, state } as const;
    this.#ctx.notify('remote-playback-change', detail, event);

    this.#state = state;
  }
}

export class HTMLAirPlayAdapter extends HTMLRemotePlaybackAdapter {
  override type = 'airplay' as const;

  get canPrompt() {
    return 'WebKitPlaybackTargetAvailabilityEvent' in window;
  }
}

export class HTMLGoogleCastAdapter extends HTMLRemotePlaybackAdapter {
  override type = 'google-cast' as const;

  get canPrompt() {
    // Google Cast is available natively on Chrome Android >=56
    return IS_CHROME && getAndroidVersion() >= 56;
  }
}
