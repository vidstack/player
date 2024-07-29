import { isHTMLElement } from '../../../../utils/dom';
import { TextTrackSymbol } from '../symbols';
import type { TextTrack as VdsTextTrack } from '../text-track';
import type { TextRenderer } from './text-renderer';

export class NativeTextRenderer implements TextRenderer {
  readonly priority = 0;

  #display = true;
  #video: HTMLVideoElement | null = null;
  #track: VdsTextTrack | null = null;
  #tracks = new Set<VdsTextTrack>();

  canRender(_, video: HTMLVideoElement | null) {
    return !!video;
  }

  attach(video: HTMLVideoElement | null) {
    this.#video = video;
    if (video) video.textTracks.onchange = this.#onChange.bind(this);
  }

  addTrack(track: VdsTextTrack): void {
    this.#tracks.add(track);
    this.#attachTrack(track);
  }

  removeTrack(track: VdsTextTrack): void {
    track[TextTrackSymbol.native]?.remove?.();
    track[TextTrackSymbol.native] = null;
    this.#tracks.delete(track);
  }

  changeTrack(track: VdsTextTrack | null): void {
    const current = track?.[TextTrackSymbol.native];

    if (current && current.track.mode !== 'showing') {
      current.track.mode = 'showing';
    }

    this.#track = track;
  }

  setDisplay(display: boolean) {
    this.#display = display;
    this.#onChange();
  }

  detach() {
    if (this.#video) this.#video.textTracks.onchange = null;
    for (const track of this.#tracks) this.removeTrack(track);
    this.#tracks.clear();
    this.#video = null;
    this.#track = null;
  }

  #attachTrack(track: VdsTextTrack): void {
    if (!this.#video) return;
    const el = (track[TextTrackSymbol.native] ??= this.#createTrackElement(track));
    if (isHTMLElement(el)) {
      this.#video.append(el);
      el.track.mode = el.default ? 'showing' : 'disabled';
    }
  }

  #createTrackElement(track: VdsTextTrack): HTMLTrackElement {
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
      this.#copyCues(track, el.track);
    }

    return el;
  }

  #copyCues(track: VdsTextTrack, native: Partial<TextTrack>) {
    if ((track.src && track.type === 'vtt') || native.cues?.length) return;
    for (const cue of track.cues) native.addCue!(cue as any);
  }

  #onChange(event?: Event) {
    for (const track of this.#tracks) {
      const native = track[TextTrackSymbol.native];

      if (!native) continue;

      if (!this.#display) {
        native.track.mode = native.managed ? 'hidden' : 'disabled';
        continue;
      }

      const isShowing = native.track.mode === 'showing';
      if (isShowing) this.#copyCues(track, native.track);
      track.setMode(isShowing ? 'showing' : 'disabled', event);
    }
  }
}
