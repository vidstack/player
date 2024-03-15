import { isHTMLElement } from '../../../../utils/dom';
import { TextTrackSymbol } from '../symbols';
import type { TextTrack as VdsTextTrack } from '../text-track';
import type { TextRenderer } from './text-renderer';

export class NativeTextRenderer implements TextRenderer {
  readonly priority = 0;

  private _display = true;
  private _video: HTMLVideoElement | null = null;
  private _track: VdsTextTrack | null = null;
  private _tracks = new Set<VdsTextTrack>();

  canRender(_, video: HTMLVideoElement | null) {
    return !!video;
  }

  attach(video: HTMLVideoElement | null) {
    this._video = video;
    if (video) video.textTracks.onchange = this._onChange.bind(this);
  }

  addTrack(track: VdsTextTrack): void {
    this._tracks.add(track);
    this._attachTrack(track);
  }

  removeTrack(track: VdsTextTrack): void {
    track[TextTrackSymbol._native]?.remove?.();
    track[TextTrackSymbol._native] = null;
    this._tracks.delete(track);
  }

  changeTrack(track: VdsTextTrack | null): void {
    const current = track?.[TextTrackSymbol._native];

    if (current && current.track.mode !== 'showing') {
      current.track.mode = 'showing';
    }

    this._track = track;
  }

  setDisplay(display: boolean) {
    this._display = display;
    this._onChange();
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
    const el = (track[TextTrackSymbol._native] ??= this._createTrackElement(track));
    if (isHTMLElement(el)) {
      this._video.append(el);
      el.track.mode = el.default ? 'showing' : 'hidden';
    }
  }

  private _createTrackElement(track: VdsTextTrack): HTMLTrackElement {
    const el = document.createElement('track'),
      isDefault = track.default || track.mode === 'showing',
      isSupported = track.src && track.type === 'vtt';

    el.id = track.id;
    el.src = isSupported ? track.src! : '';
    el.label = track.label;
    el.kind = track.kind;
    el.default = isDefault;
    track.language && (el.srclang = track.language);

    if (isDefault && !isSupported) {
      this._copyCues(track, el.track);
    }

    return el;
  }

  private _copyCues(track: VdsTextTrack, native: Partial<TextTrack>) {
    if ((track.src && track.type === 'vtt') || native.cues?.length) return;
    for (const cue of track.cues) native.addCue!(cue as any);
  }

  private _onChange(event?: Event) {
    for (const track of this._tracks) {
      const nativeTrack = track[TextTrackSymbol._native]?.track;
      if (!nativeTrack) continue;

      if (!this._display) {
        nativeTrack.mode = 'disabled';
        continue;
      }

      const isShowing = nativeTrack.mode === 'showing';
      if (isShowing) this._copyCues(track, nativeTrack);
      track.setMode(isShowing ? 'showing' : 'disabled', event);
    }
  }
}
