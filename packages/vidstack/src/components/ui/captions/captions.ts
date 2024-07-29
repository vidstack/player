import { Component, effect, peek, signal } from 'maverick.js';
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

  #media!: MediaContext;

  static lib = signal<typeof import('media-captions') | null>(null);

  protected override onSetup(): void {
    this.#media = useMediaContext();
    this.setAttributes({
      'aria-hidden': $ariaBool(this.#isHidden.bind(this)),
    });
  }

  protected override onAttach(el: HTMLElement): void {
    el.style.setProperty('pointer-events', 'none');
  }

  protected override onConnect(el: HTMLElement) {
    if (!Captions.lib()) {
      import('media-captions').then((lib) => Captions.lib.set(lib));
    }

    effect(this.#watchViewType.bind(this));
  }

  #isHidden() {
    const { textTrack, remotePlaybackState, iOSControls } = this.#media.$state,
      track = textTrack();

    return (
      iOSControls() || remotePlaybackState() === 'connected' || !track || !isTrackCaptionKind(track)
    );
  }

  #watchViewType() {
    if (!Captions.lib()) return;

    const { viewType } = this.#media.$state;

    if (viewType() === 'audio') {
      return this.#setupAudioView();
    } else {
      return this.#setupVideoView();
    }
  }

  #setupAudioView() {
    effect(this.#onTrackChange.bind(this));

    this.#listenToFontStyleChanges(null);

    return () => {
      this.el!.textContent = '';
    };
  }

  #onTrackChange() {
    if (this.#isHidden()) return;

    this.#onCueChange();

    const { textTrack } = this.#media.$state;
    listenEvent(textTrack()!, 'cue-change', this.#onCueChange.bind(this));

    effect(this.#onUpdateTimedNodes.bind(this));
  }

  #onCueChange() {
    this.el!.textContent = '';

    if (this.#hideExampleTimer >= 0) {
      this.#removeExample();
    }

    const { realCurrentTime, textTrack } = this.#media.$state,
      { renderVTTCueString } = Captions.lib()!,
      time = peek(realCurrentTime),
      activeCues = peek(textTrack)!.activeCues;

    for (const cue of activeCues) {
      const displayEl = this.#createCueDisplayElement(),
        cueEl = this.#createCueElement();

      cueEl.innerHTML = renderVTTCueString(cue, time);

      displayEl.append(cueEl);
      this.el!.append(cueEl);
    }
  }

  #onUpdateTimedNodes() {
    const { realCurrentTime } = this.#media.$state,
      { updateTimedVTTCueNodes } = Captions.lib()!;

    updateTimedVTTCueNodes(this.el!, realCurrentTime());
  }

  #setupVideoView() {
    const { CaptionsRenderer } = Captions.lib()!,
      renderer = new CaptionsRenderer(this.el!),
      textRenderer = new CaptionsTextRenderer(renderer);

    this.#media.textRenderers.add(textRenderer);

    effect(this.#watchTextDirection.bind(this, renderer));
    effect(this.#watchMediaTime.bind(this, renderer));

    this.#listenToFontStyleChanges(renderer);

    return () => {
      this.el!.textContent = '';
      this.#media.textRenderers.remove(textRenderer);
      renderer.destroy();
    };
  }

  #watchTextDirection(renderer: CaptionsRenderer) {
    renderer.dir = this.$props.textDir();
  }

  #watchMediaTime(renderer: CaptionsRenderer) {
    if (this.#isHidden()) return;

    const { realCurrentTime, textTrack } = this.#media.$state;

    renderer.currentTime = realCurrentTime();

    if (this.#hideExampleTimer >= 0 && textTrack()?.activeCues[0]) {
      this.#removeExample();
    }
  }

  #listenToFontStyleChanges(renderer: CaptionsRenderer | null) {
    const player = this.#media.player;
    if (!player) return;

    const onChange = this.#onFontStyleChange.bind(this, renderer);
    listenEvent(player, 'vds-font-change', onChange);
  }

  #onFontStyleChange(renderer: CaptionsRenderer | null) {
    if (this.#hideExampleTimer >= 0) {
      this.#hideExample();
      return;
    }

    const { textTrack } = this.#media.$state;

    if (!textTrack()?.activeCues[0]) {
      this.#showExample();
    } else {
      renderer?.update(true);
    }
  }

  #showExample() {
    const display = this.#createCueDisplayElement();
    setAttribute(display, 'data-example', '');

    const cue = this.#createCueElement();
    setAttribute(cue, 'data-example', '');
    cue.textContent = this.$props.exampleText();

    display?.append(cue);
    this.el?.append(display);

    this.el?.setAttribute('data-example', '');

    this.#hideExample();
  }

  #hideExampleTimer = -1;
  #hideExample() {
    window.clearTimeout(this.#hideExampleTimer);
    this.#hideExampleTimer = window.setTimeout(this.#removeExample.bind(this), 2500);
  }

  #removeExample() {
    this.el?.removeAttribute('data-example');
    if (this.el?.querySelector('[data-example]')) this.el.textContent = '';
    this.#hideExampleTimer = -1;
  }

  #createCueDisplayElement() {
    const el = document.createElement('div');
    setAttribute(el, 'data-part', 'cue-display');
    return el;
  }

  #createCueElement() {
    const el = document.createElement('div');
    setAttribute(el, 'data-part', 'cue');
    return el;
  }
}
