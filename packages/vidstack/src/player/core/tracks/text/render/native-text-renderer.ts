import { TEXT_TRACK_NATIVE } from '../symbols';
import type { TextTrack as VdsTextTrack } from '../text-track';
import type { TextRenderer } from './text-renderer';

export class NativeTextRenderer implements TextRenderer {
  readonly priority = 0;

  private _display = true;
  private _video: HTMLVideoElement | null = null;
  private _track: VdsTextTrack | null = null;
  private _tracks = new Set<VdsTextTrack>();

  canRender() {
    return true;
  }

  attach(video: HTMLVideoElement) {
    this._video = video;
    if (!video.crossOrigin) video.crossOrigin = 'anonymous';
    video.textTracks.onchange = this._onChange.bind(this);
  }

  addTrack(track: VdsTextTrack): void {
    this._tracks.add(track);
    this._attachTrack(track);
  }

  removeTrack(track: VdsTextTrack): void {
    track[TEXT_TRACK_NATIVE]?.remove?.();
    track[TEXT_TRACK_NATIVE] = null;
    this._tracks.delete(track);
  }

  changeTrack(track: VdsTextTrack | null): void {
    const prev = this._track?.[TEXT_TRACK_NATIVE],
      current = track?.[TEXT_TRACK_NATIVE];
    if (prev && this._track !== track) prev.track.mode = 'disabled';
    if (current) current.track.mode = 'showing';
    this._track = track;
  }

  setDisplay(display: boolean) {
    this._display = display;
  }

  detach() {
    if (this._video) this._video.textTracks.onchange = null;
    for (const track of this._tracks) this.removeTrack(track);
    this._tracks.clear();
    this._video = null;
    this._track = null;
  }

  private _attachTrack(track: VdsTextTrack): void {
    if (!this._video) return;
    const el = (track[TEXT_TRACK_NATIVE] ??= this._createTrackElement(track));
    if (el instanceof HTMLElement) this._video.append(el);
  }

  private _createTrackElement(track: VdsTextTrack): HTMLTrackElement {
    const el = document.createElement('track');
    el.src = 'https://cdn.jsdelivr.net/npm/vidstack/empty.vtt';
    el.id = track.id;
    el.label = track.label;
    el.kind = track.kind;
    el.default = track.default;
    track.language && (el.srclang = track.language);
    return el;
  }

  private _copyCues(track: VdsTextTrack, native: Partial<TextTrack>) {
    if (native.cues?.length) return;
    for (const cue of track.cues) native.addCue!(cue as any);
  }

  private _onChange(event?: Event) {
    for (const track of this._tracks) {
      const nativeTrack = track[TEXT_TRACK_NATIVE]?.track;
      if (!nativeTrack) continue;

      if (!this._display) {
        nativeTrack.mode = 'disabled';
        continue;
      }

      if (nativeTrack.mode === 'showing') {
        this._copyCues(track, nativeTrack);
        track.setMode('showing', event);
      } else if (track.mode === 'showing') {
        track.setMode('disabled', event);
      }
    }
  }
}
