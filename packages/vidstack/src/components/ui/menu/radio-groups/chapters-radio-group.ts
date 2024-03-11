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
import { DOMEvent, isNumber, listenEvent, setStyle } from 'maverick.js/std';
import type { VTTCue } from 'media-captions';

import { useMediaContext, type MediaContext } from '../../../../core/api/media-context';
import type { TextTrack } from '../../../../core/tracks/text/text-track';
import { isCueActive, watchActiveTextTrack } from '../../../../core/tracks/text/utils';
import { requestScopedAnimationFrame } from '../../../../utils/dom';
import { round } from '../../../../utils/number';
import { formatSpokenTime, formatTime } from '../../../../utils/time';
import type { ThumbnailSrc } from '../../thumbnails/thumbnail-loader';
import { menuContext, type MenuContext } from '../menu-context';
import type { RadioOption } from '../radio/radio';
import { RadioGroupController } from '../radio/radio-group-controller';

/**
 * This component manages media chapters inside of a radio group.
 *
 * @attr data-thumbnails - Whether thumbnails are available.
 * @docs {@link https://www.vidstack.io/docs/wc/player/components/menu/chapters-radio-group}
 */
export class ChaptersRadioGroup extends Component<
  ChapterRadioGroupProps,
  {},
  ChaptersRadioGroupEvents
> {
  static props: ChapterRadioGroupProps = {
    thumbnails: null,
  };

  private _media!: MediaContext;
  private _menu?: MenuContext;
  private _controller: RadioGroupController;

  private _track = signal<TextTrack | null>(null);
  private _cues = signal<readonly VTTCue[]>([]);

  @prop
  get value() {
    return this._controller.value;
  }

  @prop
  get disabled() {
    return !this._cues()?.length;
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
    const { clipStartTime, clipEndTime } = this._media.$state,
      startTime = clipStartTime(),
      endTime = clipEndTime() || Infinity;
    return this._cues().map((cue, i) => ({
      cue,
      value: i.toString(),
      label: cue.text,
      startTime: formatTime(Math.max(0, cue.startTime - startTime)),
      duration: formatSpokenTime(
        Math.min(endTime, cue.endTime) - Math.max(startTime, cue.startTime),
      ),
    }));
  }

  private _onOpen() {
    peek(() => this._watchCurrentTime());
  }

  protected override onConnect(el: HTMLElement) {
    effect(this._watchCurrentTime.bind(this));
    effect(this._watchControllerDisabled.bind(this));
    effect(this._watchTrack.bind(this));
    watchActiveTextTrack(this._media.textTracks, 'chapters', this._track.set);
  }

  protected _watchTrack() {
    const track = this._track();
    if (!track) return;

    const onCuesChange = this._onCuesChange.bind(this, track);

    onCuesChange();
    listenEvent(track, 'add-cue', onCuesChange);
    listenEvent(track, 'remove-cue', onCuesChange);

    return () => {
      this._cues.set([]);
    };
  }

  protected _onCuesChange(track: TextTrack) {
    const { clipStartTime, clipEndTime } = this._media.$state,
      startTime = clipStartTime(),
      endTime = clipEndTime() || Infinity;
    this._cues.set(
      [...track.cues].filter((cue) => cue.startTime <= endTime && cue.endTime >= startTime),
    );
  }

  private _watchCurrentTime() {
    if (!this._menu?._expanded()) return;

    const track = this._track();

    if (!track) {
      this._controller.value = '-1';
      return;
    }

    const { realCurrentTime, clipStartTime, clipEndTime } = this._media.$state,
      startTime = clipStartTime(),
      endTime = clipEndTime() || Infinity,
      time = realCurrentTime(),
      activeCueIndex = this._cues().findIndex((cue) => isCueActive(cue, time));

    this._controller.value = activeCueIndex.toString();

    if (activeCueIndex >= 0) {
      requestScopedAnimationFrame(() => {
        const cue = this._cues()[activeCueIndex],
          radio = this.el!.querySelector(`[aria-checked='true']`),
          cueStartTime = Math.max(startTime, cue.startTime),
          duration = Math.min(endTime, cue.endTime) - cueStartTime,
          playedPercent = (Math.max(0, time - cueStartTime) / duration) * 100;

        radio && setStyle(radio as HTMLElement, '--progress', round(playedPercent, 3) + '%');
      });
    }
  }

  private _watchControllerDisabled() {
    this._menu?._disable(this.disabled);
  }

  private _onValueChange(value: string, trigger?: Event) {
    if (this.disabled || !trigger) return;

    const index = +value,
      cues = this._cues(),
      { clipStartTime } = this._media.$state;

    if (isNumber(index) && cues?.[index]) {
      this._controller.value = index.toString();
      this._media.remote.seek(cues[index].startTime - clipStartTime(), trigger);
      this.dispatch('change', { detail: cues[index], trigger });
    }
  }
}

export interface ChapterRadioGroupProps {
  /**
   * The thumbnails resource.
   *
   * @see {@link https://www.vidstack.io/docs/player/core-concepts/loading#thumbnails}
   */
  thumbnails: ThumbnailSrc;
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
