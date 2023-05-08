import { effect, peek } from 'maverick.js';
import { Component, defineElement, type HTMLCustomElement } from 'maverick.js/element';
import { listenEvent } from 'maverick.js/std';
import { CaptionsRenderer, renderVTTCueString, updateTimedVTTCueNodes } from 'media-captions';

import { $ariaBool } from '../../../utils/aria';
import { useMedia, type MediaContext } from '../../core/api/context';
import { isTrackCaptionKind } from '../../core/tracks/text/text-track';
import { CaptionsTextRenderer } from './captions-renderer';

declare global {
  interface MaverickElements {
    'media-captions': MediaCaptionsElement;
  }
}

/**
 * Renders and displays captions/subtitles. This will be an overlay for video and a simple
 * captions box for audio.
 *
 * @docs {@link https://www.vidstack.io/docs/player/components/display/captions}
 * @example
 * ```html
 * <media-captions></media-captions>
 * ```
 */
export class Captions extends Component<CaptionsAPI> {
  static el = defineElement<CaptionsAPI>({
    tagName: 'media-captions',
    props: { textDir: 'ltr' },
  });

  _media!: MediaContext;
  _renderer!: CaptionsRenderer;
  _textRenderer!: CaptionsTextRenderer;

  protected override onAttach(): void {
    this._media = useMedia();
    this.setAttributes({
      'aria-hidden': $ariaBool(this._isHidden.bind(this)),
    });
  }

  protected override onConnect(el: HTMLElement) {
    this._renderer = new CaptionsRenderer(el);
    this._textRenderer = new CaptionsTextRenderer(this._renderer);
    effect(this._watchViewType.bind(this));
  }

  protected override onDisconnect() {
    if (this._textRenderer) {
      this._textRenderer.detach();
      this._media.textRenderers.remove(this._textRenderer);
    }

    this._renderer?.destroy();
  }

  protected _isHidden() {
    const { textTrack } = this._media.$store,
      track = textTrack();
    return !track || !isTrackCaptionKind(track);
  }

  protected _watchViewType() {
    const { viewType } = this._media.$store;
    if (viewType() === 'audio') {
      return this._setupAudioView();
    } else {
      return this._setupVideoView();
    }
  }

  protected _setupAudioView() {
    effect(this._onTrackChange.bind(this));
    return () => {
      this.el!.textContent = '';
    };
  }

  protected _onTrackChange() {
    if (this._isHidden()) return;
    const { textTrack } = this._media.$store;
    listenEvent(textTrack()!, 'cue-change', this._onCueChange.bind(this));
    effect(this._onUpdateTimedNodes.bind(this));
  }

  protected _onCueChange() {
    this.el!.textContent = '';

    const { currentTime, textTrack } = this._media.$store,
      time = peek(currentTime),
      activeCues = peek(textTrack)!.activeCues;

    for (const cue of activeCues) {
      const cueEl = document.createElement('div');
      cueEl.setAttribute('part', 'cue');
      cueEl.innerHTML = renderVTTCueString(cue, time);
      this.el!.append(cueEl);
    }
  }

  protected _onUpdateTimedNodes() {
    const { currentTime } = this._media.$store;
    updateTimedVTTCueNodes(this.el!, currentTime());
  }

  protected _setupVideoView() {
    effect(this._watchTextDirection.bind(this));
    effect(this._watchMediaTime.bind(this));
    this._media.textRenderers.add(this._textRenderer);
    return () => {
      this.el!.textContent = '';
      this._textRenderer.detach();
      this._media.textRenderers.remove(this._textRenderer);
    };
  }

  protected _watchTextDirection() {
    this._renderer.dir = this.$props.textDir();
  }

  protected _watchMediaTime() {
    if (this._isHidden()) return;
    const { currentTime } = this._media.$store;
    this._renderer.currentTime = currentTime();
  }
}

export interface CaptionsAPI {
  props: CaptionsProps;
}

export interface CaptionsProps {
  /*
   * Text direction:
   * - left-to-right (ltr)
   * - right-to-left (rtl)
   */
  textDir: 'ltr' | 'rtl';
}

export interface MediaCaptionsElement extends HTMLCustomElement<Captions> {}
