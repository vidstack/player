import { effect, untrack } from 'maverick.js';
import { listenEvent } from 'maverick.js/std';

import type { MediaContext } from '../../core/api/media-context';
import type { AudioTrack } from '../../core/tracks/audio/audio-tracks';
import type { TextTrack, TextTrackInit } from '../../core/tracks/text/text-track';
import { ListSymbol } from '../../foundation/list/symbols';
import { getCastSessionMedia } from './utils';

export class GoogleCastTracksManager {
  #cast: cast.framework.RemotePlayer;
  #ctx: MediaContext;
  #onNewLocalTracks?: () => void;

  constructor(cast: cast.framework.RemotePlayer, ctx: MediaContext, onNewLocalTracks?: () => void) {
    this.#cast = cast;
    this.#ctx = ctx;
    this.#onNewLocalTracks = onNewLocalTracks;
  }

  setup() {
    const syncRemoteActiveIds = this.syncRemoteActiveIds.bind(this);
    listenEvent(this.#ctx.audioTracks, 'change', syncRemoteActiveIds);
    listenEvent(this.#ctx.textTracks, 'mode-change', syncRemoteActiveIds);

    effect(this.#syncLocalTracks.bind(this));
  }

  getLocalTextTracks() {
    return this.#ctx.$state.textTracks().filter((track) => track.src && track.type === 'vtt');
  }

  #getLocalAudioTracks() {
    return this.#ctx.$state.audioTracks();
  }

  #getRemoteTracks(type?: chrome.cast.media.TrackType) {
    const tracks = this.#cast.mediaInfo?.tracks ?? [];
    return type ? tracks.filter((track) => track.type === type) : tracks;
  }

  #getRemoteActiveIds(): number[] {
    const activeIds: number[] = [],
      activeLocalAudioTrack = this.#getLocalAudioTracks().find((track) => track.selected),
      activeLocalTextTracks = this.getLocalTextTracks().filter((track) => track.mode === 'showing');

    if (activeLocalAudioTrack) {
      const remoteAudioTracks = this.#getRemoteTracks(chrome.cast.media.TrackType.AUDIO),
        remoteAudioTrack = this.#findRemoteTrack(remoteAudioTracks, activeLocalAudioTrack);
      if (remoteAudioTrack) activeIds.push(remoteAudioTrack.trackId);
    }

    if (activeLocalTextTracks?.length) {
      const remoteTextTracks = this.#getRemoteTracks(chrome.cast.media.TrackType.TEXT);
      if (remoteTextTracks.length) {
        for (const localTrack of activeLocalTextTracks) {
          const remoteTextTrack = this.#findRemoteTrack(remoteTextTracks, localTrack);
          if (remoteTextTrack) activeIds.push(remoteTextTrack.trackId);
        }
      }
    }

    return activeIds;
  }

  #syncLocalTracks() {
    const localTextTracks = this.getLocalTextTracks();

    if (!this.#cast.isMediaLoaded) return;

    const remoteTextTracks = this.#getRemoteTracks(chrome.cast.media.TrackType.TEXT);

    // Sync local tracks with remote cast player.
    for (const localTrack of localTextTracks) {
      const hasRemoteTrack = this.#findRemoteTrack(remoteTextTracks, localTrack);
      if (!hasRemoteTrack) {
        // The Google Cast provider should send a new load request to add the new tracks.
        untrack(() => this.#onNewLocalTracks?.());
        break;
      }
    }
  }

  syncRemoteTracks(event?: Event) {
    if (!this.#cast.isMediaLoaded) return;

    const localAudioTracks = this.#getLocalAudioTracks(),
      localTextTracks = this.getLocalTextTracks(),
      remoteAudioTracks = this.#getRemoteTracks(chrome.cast.media.TrackType.AUDIO),
      remoteTextTracks = this.#getRemoteTracks(chrome.cast.media.TrackType.TEXT);

    // Sync remote audio tracks with local player.
    for (const remoteAudioTrack of remoteAudioTracks) {
      const hasLocalTrack = this.#findLocalTrack(localAudioTracks, remoteAudioTrack);
      if (hasLocalTrack) continue;

      const localAudioTrack: AudioTrack = {
        id: remoteAudioTrack.trackId.toString(),
        label: remoteAudioTrack.name,
        language: remoteAudioTrack.language,
        kind: remoteAudioTrack.subtype ?? 'main',
        selected: false,
      };

      this.#ctx.audioTracks[ListSymbol.add](localAudioTrack, event);
    }

    // Sync remote text tracks with local player.
    for (const remoteTextTrack of remoteTextTracks) {
      const hasLocalTrack = this.#findLocalTrack(localTextTracks, remoteTextTrack);
      if (hasLocalTrack) continue;

      const localTextTrack: TextTrackInit = {
        id: remoteTextTrack.trackId.toString(),
        src: remoteTextTrack.trackContentId,
        label: remoteTextTrack.name,
        language: remoteTextTrack.language,
        kind: remoteTextTrack.subtype.toLowerCase() as TextTrackKind,
      };

      this.#ctx.textTracks.add(localTextTrack, event);
    }
  }

  syncRemoteActiveIds(event?: Event) {
    if (!this.#cast.isMediaLoaded) return;

    const activeIds = this.#getRemoteActiveIds(),
      editRequest = new chrome.cast.media.EditTracksInfoRequest(activeIds);

    this.#editTracksInfo(editRequest).catch((error) => {
      if (__DEV__) {
        this.#ctx.logger
          ?.errorGroup('[vidstack] failed to edit cast tracks info')
          .labelledLog('Edit Request', editRequest)
          .labelledLog('Error', error)
          .dispatch();
      }
    });
  }

  #editTracksInfo(request: chrome.cast.media.EditTracksInfoRequest) {
    const media = getCastSessionMedia();
    return new Promise((resolve, reject) => media?.editTracksInfo(request, resolve, reject));
  }

  #findLocalTrack<T extends AudioTrack | TextTrack>(
    localTracks: T[],
    remoteTrack: chrome.cast.media.Track,
  ): T | undefined {
    return localTracks.find((localTrack) => this.#isMatch(localTrack, remoteTrack));
  }

  #findRemoteTrack(
    remoteTracks: chrome.cast.media.Track[],
    localTrack: AudioTrack | TextTrack,
  ): chrome.cast.media.Track | undefined {
    return remoteTracks.find((remoteTrack) => this.#isMatch(localTrack, remoteTrack));
  }

  // Note: we can't rely on id matching because they will differ between local/remote. A local
  // track id might not even exist.
  #isMatch(localTrack: AudioTrack | TextTrack, remoteTrack: chrome.cast.media.Track) {
    return (
      remoteTrack.name === localTrack.label &&
      remoteTrack.language === localTrack.language &&
      remoteTrack.subtype.toLowerCase() === localTrack.kind.toLowerCase()
    );
  }
}
