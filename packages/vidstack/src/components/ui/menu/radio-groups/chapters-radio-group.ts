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
import { DOMEvent, EventsController, isNumber, listenEvent, setStyle } from 'maverick.js/std';
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

  #media!: MediaContext;
  #menu?: MenuContext;
  #controller: RadioGroupController;

  #track = signal<TextTrack | null>(null);
  #cues = signal<readonly VTTCue[]>([]);

  @prop
  get value() {
    return this.#controller.value;
  }

  @prop
  get disabled() {
    return !this.#cues()?.length;
  }

  constructor() {
    super();
    this.#controller = new RadioGroupController();
    this.#controller.onValueChange = this.#onValueChange.bind(this);
  }

  protected override onSetup(): void {
    this.#media = useMediaContext();

    if (hasProvidedContext(menuContext)) {
      this.#menu = useContext(menuContext);
    }

    const { thumbnails } = this.$props;
    this.setAttributes({
      'data-thumbnails': () => !!thumbnails(),
    });
  }

  protected override onAttach(el: HTMLElement) {
    this.#menu?.attachObserver({
      onOpen: this.#onOpen.bind(this),
    });
  }

  @method
  getOptions(): ChaptersRadioOption[] {
    const { clipStartTime, clipEndTime } = this.#media.$state,
      startTime = clipStartTime(),
      endTime = clipEndTime() || Infinity;
    return this.#cues().map((cue, i) => ({
      cue,
      value: i.toString(),
      label: cue.text,
      startTime: formatTime(Math.max(0, cue.startTime - startTime)),
      duration: formatSpokenTime(
        Math.min(endTime, cue.endTime) - Math.max(startTime, cue.startTime),
      ),
    }));
  }

  #onOpen() {
    peek(() => this.#watchCurrentTime());
  }

  protected override onConnect(el: HTMLElement) {
    effect(this.#watchCurrentTime.bind(this));
    effect(this.#watchControllerDisabled.bind(this));
    effect(this.#watchTrack.bind(this));
    watchActiveTextTrack(this.#media.textTracks, 'chapters', this.#track.set);
  }

  #watchTrack() {
    const track = this.#track();
    if (!track) return;

    const onCuesChange = this.#onCuesChange.bind(this, track);

    onCuesChange();

    new EventsController(track).add('add-cue', onCuesChange).add('remove-cue', onCuesChange);

    return () => {
      this.#cues.set([]);
    };
  }

  #onCuesChange(track: TextTrack) {
    const { clipStartTime, clipEndTime } = this.#media.$state,
      startTime = clipStartTime(),
      endTime = clipEndTime() || Infinity;
    this.#cues.set(
      [...track.cues].filter((cue) => cue.startTime <= endTime && cue.endTime >= startTime),
    );
  }

  #watchCurrentTime() {
    if (!this.#menu?.expanded()) return;

    const track = this.#track();

    if (!track) {
      this.#controller.value = '-1';
      return;
    }

    const { realCurrentTime, clipStartTime, clipEndTime } = this.#media.$state,
      startTime = clipStartTime(),
      endTime = clipEndTime() || Infinity,
      time = realCurrentTime(),
      activeCueIndex = this.#cues().findIndex((cue) => isCueActive(cue, time));

    this.#controller.value = activeCueIndex.toString();

    if (activeCueIndex >= 0) {
      requestScopedAnimationFrame(() => {
        if (!this.connectScope) return;

        const cue = this.#cues()[activeCueIndex],
          radio = this.el!.querySelector(`[aria-checked='true']`),
          cueStartTime = Math.max(startTime, cue.startTime),
          duration = Math.min(endTime, cue.endTime) - cueStartTime,
          playedPercent = (Math.max(0, time - cueStartTime) / duration) * 100;

        radio && setStyle(radio as HTMLElement, '--progress', round(playedPercent, 3) + '%');
      });
    }
  }

  #watchControllerDisabled() {
    this.#menu?.disable(this.disabled);
  }

  #onValueChange(value: string, trigger?: Event) {
    if (this.disabled || !trigger) return;

    const index = +value,
      cues = this.#cues(),
      { clipStartTime } = this.#media.$state;

    if (isNumber(index) && cues?.[index]) {
      this.#controller.value = index.toString();
      this.#media.remote.seek(cues[index].startTime - clipStartTime(), trigger);
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
