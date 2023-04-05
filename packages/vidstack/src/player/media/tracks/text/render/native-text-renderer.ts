import { listenEvent } from 'maverick.js/std';

import { TEXT_TRACK_PROXY } from '../symbols';
import type { TextTrack as VdsTextTrack } from '../text-track';
import type { TextRenderer } from './text-renderer';

export class NativeTextRenderer implements TextRenderer {
  readonly priority = 0;

  private _display = false;
  private _video: HTMLVideoElement | null = null;
  private _tracks = new Set<VdsTextTrack>();
  private _trackChangeOff: (() => void) | null = null;

  canRender() {
    return true;
  }

  attach(video: HTMLVideoElement) {
    this._video = video;
    this._trackChangeOff = listenEvent(video.textTracks, 'change', () => {
      for (const track of this._tracks) {
        const nativeTrack = track[TEXT_TRACK_PROXY]?.track;
        if (nativeTrack?.mode === 'showing') {
          track.mode = 'showing';
        } else if (track.mode === 'showing') {
          track.mode = 'disabled';
        }
      }
    });
  }

  addTrack(track: VdsTextTrack): void {
    this._tracks.add(track);
    this._attachTrack(track);
  }

  removeTrack(track: VdsTextTrack): void {
    track[TEXT_TRACK_PROXY]?.remove?.();
    track[TEXT_TRACK_PROXY] = null;
    this._tracks.delete(track);
  }

  changeTrack(track: VdsTextTrack | null): void {
    if (!track || !this._display) {
      for (const track of this._tracks) {
        const nativeTrack = track[TEXT_TRACK_PROXY]?.track;
        if (nativeTrack?.mode === 'showing') nativeTrack.mode = 'hidden';
      }
    } else {
      const nativeTrack = track[TEXT_TRACK_PROXY]?.track;
      if (nativeTrack) nativeTrack.mode = 'showing';
    }
  }

  setDisplay(display: boolean) {
    this._display = display;
  }

  detach() {
    this._video = null;
    this._trackChangeOff?.();
    this._trackChangeOff = null;
    for (const track of this._tracks) this.removeTrack(track);
    this._tracks.clear();
  }

  private _attachTrack(track: VdsTextTrack): void {
    if (!this._video) return;
    const el = (track[TEXT_TRACK_PROXY] ??= this._createTrackElement(track));
    if (el instanceof HTMLElement) this._video.append(el);
  }

  private _createTrackElement(track: VdsTextTrack): HTMLTrackElement {
    const el = document.createElement('track');
    el.id = track.id;
    el.label = track.label;
    el.kind = track.kind;
    el.track.mode = this._display && track.mode === 'showing' ? 'showing' : 'disabled';
    track.language && (el.srclang = track.language);
    for (const cue of track.cues) el.track.addCue(cue as any);
    return el;
  }
}
