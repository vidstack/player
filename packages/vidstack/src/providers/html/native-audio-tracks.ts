import { listenEvent } from 'maverick.js/std';

import type { MediaContext } from '../../core/api/media-context';
import type { AudioTrack, AudioTrackChangeEvent } from '../../core/tracks/audio-tracks';
import { ListSymbol } from '../../foundation/list/symbols';
import type { HTMLMediaProvider } from './provider';

interface NativeAudioTrack {
  id: string;
  label: string;
  language: string;
  kind: string;
  enabled: boolean;
}

interface NativeAudioEvent extends Event {
  track: NativeAudioTrack;
}

interface NativeAudioTrackList extends Iterable<NativeAudioTrack> {
  onaddtrack: ((event: NativeAudioEvent) => void) | null;
  onremovetrack: ((event: NativeAudioEvent) => void) | null;
  onchange: ((event: NativeAudioEvent) => void) | null;
  getTrackById(id: string): NativeAudioTrack | null;
}

export class NativeAudioTracks {
  #provider: HTMLMediaProvider;
  #ctx: MediaContext;

  get #nativeTracks(): NativeAudioTrackList {
    return (this.#provider.media as any).audioTracks;
  }

  constructor(provider: HTMLMediaProvider, ctx: MediaContext) {
    this.#provider = provider;
    this.#ctx = ctx;

    this.#nativeTracks.onaddtrack = this.#onAddNativeTrack.bind(this);
    this.#nativeTracks.onremovetrack = this.#onRemoveNativeTrack.bind(this);
    this.#nativeTracks.onchange = this.#onChangeNativeTrack.bind(this);

    listenEvent(this.#ctx.audioTracks, 'change', this.#onChangeTrack.bind(this));
  }

  #onAddNativeTrack(event: NativeAudioEvent) {
    const nativeTrack = event.track;

    if (nativeTrack.label === '') return;

    const id = nativeTrack.id.toString() || `native-audio-${this.#ctx.audioTracks.length}`,
      audioTrack: AudioTrack = {
        id,
        label: nativeTrack.label,
        language: nativeTrack.language,
        kind: nativeTrack.kind,
        selected: false,
      };

    this.#ctx.audioTracks[ListSymbol.add](audioTrack, event);
    if (nativeTrack.enabled) audioTrack.selected = true;
  }

  #onRemoveNativeTrack(event: NativeAudioEvent) {
    const track = this.#ctx.audioTracks.getById(event.track.id);
    if (track) this.#ctx.audioTracks[ListSymbol.remove](track, event);
  }

  #onChangeNativeTrack(event: NativeAudioEvent) {
    let enabledTrack = this.#getEnabledNativeTrack();
    if (!enabledTrack) return;
    const track = this.#ctx.audioTracks.getById(enabledTrack.id);
    if (track) this.#ctx.audioTracks[ListSymbol.select](track, true, event);
  }

  #getEnabledNativeTrack(): NativeAudioTrack | undefined {
    return Array.from(this.#nativeTracks).find((track) => track.enabled);
  }

  #onChangeTrack(event: AudioTrackChangeEvent) {
    const { current } = event.detail;
    if (!current) return;
    const track = this.#nativeTracks.getTrackById(current.id);
    if (track) {
      const prev = this.#getEnabledNativeTrack();
      if (prev) prev.enabled = false;
      track.enabled = true;
    }
  }
}
