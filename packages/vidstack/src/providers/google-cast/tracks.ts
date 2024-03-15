import { effect, untrack } from 'maverick.js';
import { listenEvent } from 'maverick.js/std';

import type { MediaContext } from '../../core/api/media-context';
import type { AudioTrack } from '../../core/tracks/audio-tracks';
import type { TextTrack, TextTrackInit } from '../../core/tracks/text/text-track';
import { ListSymbol } from '../../foundation/list/symbols';
import { getCastSessionMedia } from './utils';

const REMOTE_TRACK_TEXT_TYPE = chrome.cast.media.TrackType.TEXT,
  REMOTE_TRACK_AUDIO_TYPE = chrome.cast.media.TrackType.AUDIO;

export class GoogleCastTracksManager {
  constructor(
    protected _cast: cast.framework.RemotePlayer,
    protected _ctx: MediaContext,
    protected _onNewLocalTracks?: () => void,
  ) {}

  _setup() {
    const syncRemoteActiveIds = this._syncRemoteActiveIds.bind(this);
    listenEvent(this._ctx.audioTracks, 'change', syncRemoteActiveIds);
    listenEvent(this._ctx.textTracks, 'mode-change', syncRemoteActiveIds);

    effect(this._syncLocalTracks.bind(this));
  }

  _getLocalTextTracks() {
    return this._ctx.$state.textTracks().filter((track) => track.src && track.type === 'vtt');
  }

  _getLocalAudioTracks() {
    return this._ctx.$state.audioTracks();
  }

  _getRemoteTracks(type?: chrome.cast.media.TrackType) {
    const tracks = this._cast.mediaInfo?.tracks ?? [];
    return type ? tracks.filter((track) => track.type === type) : tracks;
  }

  _getRemoteActiveIds(): number[] {
    const activeIds: number[] = [],
      activeLocalAudioTrack = this._getLocalAudioTracks().find((track) => track.selected),
      activeLocalTextTracks = this._getLocalTextTracks().filter(
        (track) => track.mode === 'showing',
      );

    if (activeLocalAudioTrack) {
      const remoteAudioTracks = this._getRemoteTracks(REMOTE_TRACK_AUDIO_TYPE),
        remoteAudioTrack = this._findRemoteTrack(remoteAudioTracks, activeLocalAudioTrack);
      if (remoteAudioTrack) activeIds.push(remoteAudioTrack.trackId);
    }

    if (activeLocalTextTracks?.length) {
      const remoteTextTracks = this._getRemoteTracks(REMOTE_TRACK_TEXT_TYPE);
      if (remoteTextTracks.length) {
        for (const localTrack of activeLocalTextTracks) {
          const remoteTextTrack = this._findRemoteTrack(remoteTextTracks, localTrack);
          if (remoteTextTrack) activeIds.push(remoteTextTrack.trackId);
        }
      }
    }

    return activeIds;
  }

  _syncLocalTracks() {
    const localTextTracks = this._getLocalTextTracks();

    if (!this._cast.isMediaLoaded) return;

    const remoteTextTracks = this._getRemoteTracks(REMOTE_TRACK_TEXT_TYPE);

    // Sync local tracks with remote cast player.
    for (const localTrack of localTextTracks) {
      const hasRemoteTrack = this._findRemoteTrack(remoteTextTracks, localTrack);
      if (!hasRemoteTrack) {
        // The Google Cast provider should send a new load request to add the new tracks.
        untrack(() => this._onNewLocalTracks?.());
        break;
      }
    }
  }

  _syncRemoteTracks(event?: Event) {
    if (!this._cast.isMediaLoaded) return;

    const localAudioTracks = this._getLocalAudioTracks(),
      localTextTracks = this._getLocalTextTracks(),
      remoteAudioTracks = this._getRemoteTracks(REMOTE_TRACK_AUDIO_TYPE),
      remoteTextTracks = this._getRemoteTracks(REMOTE_TRACK_TEXT_TYPE);

    // Sync remote audio tracks with local player.
    for (const remoteAudioTrack of remoteAudioTracks) {
      const hasLocalTrack = this._findLocalTrack(localAudioTracks, remoteAudioTrack);
      if (hasLocalTrack) continue;

      const localAudioTrack: AudioTrack = {
        id: remoteAudioTrack.trackId.toString(),
        label: remoteAudioTrack.name,
        language: remoteAudioTrack.language,
        kind: remoteAudioTrack.subtype ?? 'main',
        selected: false,
      };

      this._ctx.audioTracks[ListSymbol._add](localAudioTrack, event);
    }

    // Sync remote text tracks with local player.
    for (const remoteTextTrack of remoteTextTracks) {
      const hasLocalTrack = this._findLocalTrack(localTextTracks, remoteTextTrack);
      if (hasLocalTrack) continue;

      const localTextTrack: TextTrackInit = {
        id: remoteTextTrack.trackId.toString(),
        src: remoteTextTrack.trackContentId,
        label: remoteTextTrack.name,
        language: remoteTextTrack.language,
        kind: remoteTextTrack.subtype.toLowerCase() as TextTrackKind,
      };

      this._ctx.textTracks.add(localTextTrack, event);
    }
  }

  _syncRemoteActiveIds(event?: Event) {
    if (!this._cast.isMediaLoaded) return;

    const activeIds = this._getRemoteActiveIds(),
      editRequest = new chrome.cast.media.EditTracksInfoRequest(activeIds);

    this._editTracksInfo(editRequest).catch((error) => {
      if (__DEV__) {
        this._ctx.logger
          ?.errorGroup('[vidstack] failed to edit cast tracks info')
          .labelledLog('Edit Request', editRequest)
          .labelledLog('Error', error)
          .dispatch();
      }
    });
  }

  protected _editTracksInfo(request: chrome.cast.media.EditTracksInfoRequest) {
    const media = getCastSessionMedia();
    return new Promise((resolve, reject) => media?.editTracksInfo(request, resolve, reject));
  }

  protected _findLocalTrack<T extends AudioTrack | TextTrack>(
    localTracks: T[],
    remoteTrack: chrome.cast.media.Track,
  ): T | undefined {
    return localTracks.find((localTrack) => this._isMatch(localTrack, remoteTrack));
  }

  protected _findRemoteTrack(
    remoteTracks: chrome.cast.media.Track[],
    localTrack: AudioTrack | TextTrack,
  ): chrome.cast.media.Track | undefined {
    return remoteTracks.find((remoteTrack) => this._isMatch(localTrack, remoteTrack));
  }

  // Note: we can't rely on id matching because they will differ between local/remote. A local
  // track id might not even exist.
  protected _isMatch(localTrack: AudioTrack | TextTrack, remoteTrack: chrome.cast.media.Track) {
    return (
      remoteTrack.name === localTrack.label &&
      remoteTrack.language === localTrack.language &&
      remoteTrack.subtype.toLowerCase() === localTrack.kind.toLowerCase()
    );
  }
}
