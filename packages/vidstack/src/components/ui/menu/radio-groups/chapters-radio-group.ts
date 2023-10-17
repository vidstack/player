import {
  Component,
  effect,
  hasProvidedContext,
  method,
  peek,
  prop,
  signal,
  useContext,
} from 'maverick.js';
import { DOMEvent, isNumber, setStyle } from 'maverick.js/std';
import type { VTTCue } from 'media-captions';

import { useMediaContext, type MediaContext } from '../../../../core/api/media-context';
import type { TextTrack } from '../../../../core/tracks/text/text-track';
import { isCueActive, observeActiveTextTrack } from '../../../../core/tracks/text/utils';
import { round } from '../../../../utils/number';
import { formatSpokenTime, formatTime } from '../../../../utils/time';
import { menuContext, type MenuContext } from '../menu-context';
import type { RadioOption } from '../radio/radio';
import { RadioGroupController } from '../radio/radio-group-controller';

/**
 * This component manages media chapters inside of a radio group.
 *
 * @attr data-thumbnails - Whether thumbnails are available.
 * @docs {@link https://www.vidstack.io/docs/player/components/menu/chapters-menu}
 */
export class ChaptersRadioGroup extends Component<
  ChapterRadioGroupProps,
  {},
  ChaptersRadioGroupEvents
> {
  static props: ChapterRadioGroupProps = {
    thumbnails: '',
  };

  private _media!: MediaContext;
  private _menu?: MenuContext;
  private _controller: RadioGroupController;

  private _index = signal(0);
  private _track = signal<TextTrack | null>(null);

  @prop
  get value() {
    return this._controller.value;
  }

  @prop
  get disabled() {
    const track = this._track();
    return !track || !track.cues.length;
  }

  constructor() {
    super();
    this._controller = new RadioGroupController();
    this._controller._onValueChange = this._onValueChange.bind(this);
  }

  protected override onSetup(): void {
    this._media = useMediaContext();

    if (hasProvidedContext(menuContext)) {
      this._menu = useContext(menuContext);
    }

    const { thumbnails } = this.$props;
    this.setAttributes({
      'data-thumbnails': () => !!thumbnails(),
    });
  }

  protected override onAttach(el: HTMLElement) {
    this._menu?._attachObserver({
      _onOpen: this._onOpen.bind(this),
    });
  }

  @method
  getOptions(): ChaptersRadioOption[] {
    const track = this._track();
    if (!track) return [];
    return track.cues.map((cue, i) => ({
      cue,
      value: i + '',
      label: cue.text,
      startTime: formatTime(cue.startTime, false),
      duration: formatSpokenTime(cue.endTime - cue.startTime),
    }));
  }

  private _onOpen() {
    peek(() => this._watchCurrentTime());
  }

  protected override onConnect(el: HTMLElement) {
    effect(this._watchValue.bind(this));
    effect(this._watchCurrentTime.bind(this));
    effect(this._watchControllerDisabled.bind(this));
    observeActiveTextTrack(this._media.textTracks, 'chapters', this._track.set);
  }

  private _watchValue() {
    this._controller.value = this._getValue();
  }

  private _watchCurrentTime() {
    if (!this._menu?._expanded()) return;

    const track = this._track();

    if (!track) {
      this._index.set(-1);
      return;
    }

    const { currentTime } = this._media.$state,
      time = currentTime(),
      activeCueIndex = track.cues.findIndex((cue) => isCueActive(cue, time));

    this._index.set(activeCueIndex);

    if (activeCueIndex >= 0) {
      const cue = track.cues[activeCueIndex],
        radio = this.el!.querySelector(`[aria-checked='true']`),
        playedPercent = ((time - cue.startTime) / (cue.endTime - cue.startTime)) * 100;
      radio && setStyle(radio as HTMLElement, '--progress', round(playedPercent, 3) + '%');
    }
  }

  private _watchControllerDisabled() {
    this._menu?._disable(this.disabled);
  }

  private _getValue() {
    return this._index() + '';
  }

  private _onValueChange(value: string, trigger?: Event) {
    if (this.disabled || !trigger) return;

    const index = +value,
      cues = this._track()?.cues;

    if (isNumber(index) && cues?.[index]) {
      this._index.set(index);
      this._media.remote.seek(cues[index].startTime, trigger);
      this.dispatch('change', { detail: cues[index], trigger });
    }
  }
}

export interface ChapterRadioGroupProps {
  /**
   * The absolute or relative URL to a [WebVTT](https://developer.mozilla.org/en-US/docs/Web/API/WebVTT_API)
   * file resource.
   */
  thumbnails: string;
}

export interface ChaptersRadioGroupEvents {
  change: ChaptersRadioGroupChangeEvent;
}

/**
 * Fired when the checked radio changes.
 *
 * @detail cue
 */
export interface ChaptersRadioGroupChangeEvent extends DOMEvent<VTTCue> {
  target: ChaptersRadioGroup;
}

export interface ChaptersRadioOption extends RadioOption {
  cue: VTTCue;
  startTime: string;
  duration: string;
}
