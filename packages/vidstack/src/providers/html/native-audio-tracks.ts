import { listenEvent } from 'maverick.js/std';

import type { AudioTrack, AudioTrackChangeEvent } from '../../core/tracks/audio-tracks';
import { ListSymbol } from '../../foundation/list/symbols';
import type { MediaSetupContext } from '../types';
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
  private get _nativeTracks(): NativeAudioTrackList {
    return (this._provider.media as any).audioTracks;
  }

  constructor(
    private _provider: HTMLMediaProvider,
    private _ctx: MediaSetupContext,
  ) {
    this._nativeTracks.onaddtrack = this._onAddNativeTrack.bind(this);
    this._nativeTracks.onremovetrack = this._onRemoveNativeTrack.bind(this);
    this._nativeTracks.onchange = this._onChangeNativeTrack.bind(this);
    listenEvent(this._ctx.audioTracks, 'change', this._onChangeTrack.bind(this));
  }

  private _onAddNativeTrack(event: NativeAudioEvent) {
    const _track = event.track;

    if (_track.label === '') return;

    const audioTrack: AudioTrack = {
      id: _track.id + '',
      label: _track.label,
      language: _track.language,
      kind: _track.kind,
      selected: false,
    };

    this._ctx.audioTracks[ListSymbol._add](audioTrack, event);
    if (_track.enabled) audioTrack.selected = true;
  }

  private _onRemoveNativeTrack(event: NativeAudioEvent) {
    const track = this._ctx.audioTracks.getById(event.track.id);
    if (track) this._ctx.audioTracks[ListSymbol._remove](track, event);
  }

  private _onChangeNativeTrack(event: NativeAudioEvent) {
    let enabledTrack = this._getEnabledNativeTrack();
    if (!enabledTrack) return;
    const track = this._ctx.audioTracks.getById(enabledTrack.id);
    if (track) this._ctx.audioTracks[ListSymbol._select](track, true, event);
  }

  private _getEnabledNativeTrack(): NativeAudioTrack | undefined {
    return Array.from(this._nativeTracks).find((track) => track.enabled);
  }

  private _onChangeTrack(event: AudioTrackChangeEvent) {
    const { current } = event.detail;
    if (!current) return;
    const track = this._nativeTracks.getTrackById(current.id);
    if (track) {
      const prev = this._getEnabledNativeTrack();
      if (prev) prev.enabled = false;
      track.enabled = true;
    }
  }
}
