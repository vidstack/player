import { Component, effect, peek, scoped } from 'maverick.js';
import { listenEvent, setAttribute } from 'maverick.js/std';
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
  /**
   * The text to be displayed when an example caption is being shown.
   */
  exampleText: string;
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
    exampleText: 'Captions look like this.',
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
    const player = this._media.player;
    if (player) listenEvent(player, 'vds-font-change', this._onFontStyleChange.bind(this));

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
    const { textTrack, remotePlaybackState } = this._media.$state,
      track = textTrack();
    return (
      this._media.$iosControls() ||
      remotePlaybackState() === 'connected' ||
      !track ||
      !isTrackCaptionKind(track)
    );
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

    if (this._hideExampleTimer >= 0) {
      this._removeExample();
    }

    const { realCurrentTime, textTrack } = this._media.$state,
      { renderVTTCueString } = this._lib,
      time = peek(realCurrentTime),
      activeCues = peek(textTrack)!.activeCues;

    for (const cue of activeCues) {
      const displayEl = this._createCueDisplayElement(),
        cueEl = this._createCueElement();

      cueEl.innerHTML = renderVTTCueString(cue, time);

      displayEl.append(cueEl);
      this.el!.append(cueEl);
    }
  }

  private _onUpdateTimedNodes() {
    const { realCurrentTime } = this._media.$state,
      { updateTimedVTTCueNodes } = this._lib;
    updateTimedVTTCueNodes(this.el!, realCurrentTime());
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

    const { realCurrentTime, textTrack } = this._media.$state;
    this._renderer.currentTime = realCurrentTime();

    if (this._hideExampleTimer >= 0 && textTrack()?.activeCues[0]) {
      this._removeExample();
    }
  }

  private _onFontStyleChange() {
    if (this._hideExampleTimer >= 0) {
      this._hideExample();
      return;
    }

    const { textTrack } = this._media.$state;

    if (!textTrack()?.activeCues[0]) {
      this._showExample();
    } else {
      this._renderer?.update(true);
    }
  }

  private _showExample() {
    const display = this._createCueDisplayElement();
    setAttribute(display, 'data-example', '');

    const cue = this._createCueElement();
    setAttribute(cue, 'data-example', '');
    cue.textContent = this.$props.exampleText();

    display?.append(cue);
    this.el?.append(display);

    this.el?.setAttribute('data-example', '');

    this._hideExample();
  }

  private _hideExampleTimer = -1;
  private _hideExample() {
    window.clearTimeout(this._hideExampleTimer);
    this._hideExampleTimer = window.setTimeout(this._removeExample.bind(this), 2500);
  }

  private _removeExample() {
    this.el?.removeAttribute('data-example');
    if (this.el?.querySelector('[data-example]')) this.el.textContent = '';
    this._hideExampleTimer = -1;
  }

  private _createCueDisplayElement() {
    const el = document.createElement('div');
    setAttribute(el, 'data-part', 'cue-display');
    return el;
  }

  private _createCueElement() {
    const el = document.createElement('div');
    setAttribute(el, 'data-part', 'cue');
    return el;
  }
}
