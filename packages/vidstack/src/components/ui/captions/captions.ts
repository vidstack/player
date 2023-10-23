import { Component, effect, peek, scoped } from 'maverick.js';
import { listenEvent } from 'maverick.js/std';
import type { CaptionsRenderer } from 'media-captions';

import { useMediaContext, type MediaContext } from '../../../core/api/media-context';
import { isTrackCaptionKind } from '../../../core/tracks/text/text-track';
import { $ariaBool } from '../../../utils/aria';
import { CaptionsTextRenderer } from './captions-renderer';

export interface CaptionsProps {
  /*
   * Text direction:
   * - left-to-right (ltr)
   * - right-to-left (rtl)
   */
  textDir: 'ltr' | 'rtl';
}

/**
 * Renders and displays captions/subtitles. This will be an overlay for video and a simple
 * captions box for audio.
 *
 * @docs {@link https://www.vidstack.io/docs/player/components/display/captions}
 */
export class Captions extends Component<CaptionsProps> {
  static props: CaptionsProps = {
    textDir: 'ltr',
  };

  private _media!: MediaContext;
  private _renderer!: CaptionsRenderer;
  private _textRenderer!: CaptionsTextRenderer;
  private _lib!: typeof import('media-captions');

  protected override onSetup(): void {
    this._media = useMediaContext();
    this.setAttributes({
      'aria-hidden': $ariaBool(this._isHidden.bind(this)),
    });
  }

  protected override onAttach(el: HTMLElement): void {
    el.style.setProperty('pointer-events', 'none');
  }

  protected override onConnect(el: HTMLElement) {
    if (this._renderer) {
      effect(this._watchViewType.bind(this));
      return;
    }

    import('media-captions').then((lib) => {
      if (!this.connectScope) return;
      scoped(() => {
        this._lib = lib;
        const { CaptionsRenderer } = this._lib;
        this._renderer = new CaptionsRenderer(el);
        this._textRenderer = new CaptionsTextRenderer(this._renderer);
        effect(this._watchViewType.bind(this));
      }, this.connectScope);
    });
  }

  protected override onDestroy() {
    if (this._textRenderer) {
      this._textRenderer.detach();
      this._media.textRenderers.remove(this._textRenderer);
    }

    this._renderer?.destroy();
  }

  private _isHidden() {
    const { textTrack } = this._media.$state,
      track = textTrack();
    return this._media.$iosControls() || !track || !isTrackCaptionKind(track);
  }

  private _watchViewType() {
    const { viewType } = this._media.$state;
    if (viewType() === 'audio') {
      return this._setupAudioView();
    } else {
      return this._setupVideoView();
    }
  }

  private _setupAudioView() {
    effect(this._onTrackChange.bind(this));
    return () => {
      this.el!.textContent = '';
    };
  }

  private _onTrackChange() {
    if (this._isHidden()) return;
    const { textTrack } = this._media.$state;
    this._onCueChange();
    listenEvent(textTrack()!, 'cue-change', this._onCueChange.bind(this));
    effect(this._onUpdateTimedNodes.bind(this));
  }

  private _onCueChange() {
    this.el!.textContent = '';

    const { currentTime, textTrack } = this._media.$state,
      time = peek(currentTime),
      activeCues = peek(textTrack)!.activeCues;

    const { renderVTTCueString } = this._lib;
    for (const cue of activeCues) {
      const cueEl = document.createElement('div');
      cueEl.setAttribute('data-part', 'cue');
      cueEl.innerHTML = renderVTTCueString(cue, time);
      this.el!.append(cueEl);
    }
  }

  private _onUpdateTimedNodes() {
    const { currentTime } = this._media.$state,
      { updateTimedVTTCueNodes } = this._lib;
    updateTimedVTTCueNodes(this.el!, currentTime());
  }

  private _setupVideoView() {
    effect(this._watchTextDirection.bind(this));
    effect(this._watchMediaTime.bind(this));
    this._media.textRenderers.add(this._textRenderer);
    return () => {
      this.el!.textContent = '';
      this._textRenderer.detach();
      this._media.textRenderers.remove(this._textRenderer);
    };
  }

  private _watchTextDirection() {
    this._renderer.dir = this.$props.textDir();
  }

  private _watchMediaTime() {
    if (this._isHidden()) return;
    const { currentTime } = this._media.$state;
    this._renderer.currentTime = currentTime();
  }
}
