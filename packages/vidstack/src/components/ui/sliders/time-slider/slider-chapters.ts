import debounce from 'just-debounce-it';
import {
  Component,
  computed,
  createScope,
  effect,
  method,
  onDispose,
  peek,
  prop,
  scoped,
  signal,
  useState,
  type ReadSignalRecord,
  type Scope,
} from 'maverick.js';
import { animationFrameThrottle, listenEvent } from 'maverick.js/std';
import type { VTTCue } from 'media-captions';

import { observeActiveTextTrack } from '../../../../core';
import { useMediaContext, type MediaContext } from '../../../../core/api/media-context';
import type { TextTrack } from '../../../../core/tracks/text/text-track';
import { round } from '../../../../utils/number';
import type { SliderState } from '../slider/api/state';
import { TimeSlider } from './time-slider';

/**
 * Used to create predefined sections within a time slider interface based on the currently
 * active chapters text track.
 *
 * @docs {@link https://www.vidstack.io/docs/player/components/sliders/slider-chapters}
 */
export class SliderChapters extends Component<SliderChaptersProps, {}, SliderChaptersCSSVars> {
  static props: SliderChaptersProps = {
    disabled: false,
  };

  private _media!: MediaContext;
  private _sliderState!: ReadSignalRecord<SliderState>;
  private _updateScope?: Scope;

  private _titleRef: HTMLElement | null = null;
  private _refs: HTMLElement[] = [];

  private _$track = signal<TextTrack | null>(null);
  private _$cues = signal<VTTCue[]>([]);

  private _activeIndex = signal(-1);
  private _activePointerIndex = signal(-1);
  private _bufferedIndex = 0;

  @prop
  get cues() {
    return this._$cues();
  }

  @prop
  get activeCue(): VTTCue | null {
    return this._$cues()[this._activeIndex()] || null;
  }

  @prop
  get activePointerCue(): VTTCue | null {
    return this._$cues()[this._activePointerIndex()] || null;
  }

  protected override onSetup(): void {
    this._media = useMediaContext();
    this._sliderState = useState(TimeSlider.state);
  }

  protected override onAttach(el: HTMLElement): void {
    observeActiveTextTrack(this._media.textTracks, 'chapters', this._setTrack.bind(this));
    effect(this._onTrackChange.bind(this));
  }

  protected override onConnect(): void {
    onDispose(() => this._reset.bind(this));
  }

  protected override onDestroy(): void {
    this._setTrack(null);
  }

  @method
  setRefs(refs: HTMLElement[]) {
    this._refs = refs;
    this._updateScope?.dispose();
    if (this._refs.length === 1) {
      const el = this._refs[0];
      el.style.width = '100%';
      el.style.setProperty('--chapter-fill', 'var(--slider-fill)');
      el.style.setProperty('--chapter-progress', 'var(--slider-progress)');
    } else if (this._refs.length > 0) {
      scoped(() => this._watch(), (this._updateScope = createScope()));
    }
  }

  private _setTrack(track: TextTrack | null) {
    if (peek(this._$track) === track) return;
    this._reset();
    this._$track.set(track);
  }

  private _reset() {
    this._refs = [];
    this._$cues.set([]);
    this._activeIndex.set(-1);
    this._activePointerIndex.set(-1);
    this._bufferedIndex = 0;
    this._updateScope?.dispose();
  }

  private _watch() {
    if (!this._refs.length) return;
    effect(this._watchContainerWidths.bind(this));
    effect(this._watchFillPercent.bind(this));
    effect(this._watchPointerPercent.bind(this));
    effect(this._watchBufferedPercent.bind(this));
  }

  private _watchContainerWidths() {
    let cue: VTTCue,
      cues = this._$cues(),
      endTime = cues[cues.length - 1].endTime;

    for (let i = 0; i < cues.length; i++) {
      cue = cues[i];
      if (this._refs[i]) {
        this._refs[i].style.width = round(((cue.endTime - cue.startTime) / endTime) * 100, 3) + '%';
      }
    }
  }

  private _watchFillPercent() {
    let { liveEdge, ended } = this._media.$state,
      { fillPercent, value } = this._sliderState,
      cues = this._$cues(),
      isLiveEdge = liveEdge(),
      prevActiveIndex = peek(this._activeIndex),
      currentChapter = cues[prevActiveIndex];

    let currentActiveIndex = isLiveEdge
      ? this._$cues.length - 1
      : this._findActiveChapterIndex(
          currentChapter ? (currentChapter.startTime <= peek(value) ? prevActiveIndex : 0) : 0,
          fillPercent(),
        );

    if (isLiveEdge || ended() || !currentChapter) {
      this._updateFillPercents(0, cues.length, '100%');
    } else if (currentActiveIndex > prevActiveIndex) {
      this._updateFillPercents(prevActiveIndex, currentActiveIndex, '100%');
    } else if (currentActiveIndex < prevActiveIndex) {
      this._updateFillPercents(currentActiveIndex + 1, prevActiveIndex + 1, '0%');
    }

    const percent = isLiveEdge
      ? '100%'
      : this._calcPercent(cues[currentActiveIndex], fillPercent()) + '%';

    this._updateFillPercent(this._refs[currentActiveIndex], percent);

    this._activeIndex.set(currentActiveIndex);
  }

  private _watchPointerPercent() {
    let { pointing, pointerPercent } = this._sliderState;

    if (!pointing()) {
      this._activePointerIndex.set(-1);
      return;
    }

    const activeIndex = this._findActiveChapterIndex(0, pointerPercent());
    this._activePointerIndex.set(activeIndex);
  }

  private _updateFillPercents(start: number, end: number, percent: string) {
    for (let i = start; i < end; i++) this._updateFillPercent(this._refs[i], percent);
  }

  private _updateFillPercent(ref: HTMLElement | null, percent: string) {
    ref && ref.style.setProperty('--chapter-fill', percent);
  }

  private _findActiveChapterIndex(startIndex: number, percent: number) {
    let chapterPercent = 0,
      cues = this._$cues();

    for (let i = startIndex; i < cues.length; i++) {
      chapterPercent = this._calcPercent(cues[i], percent);
      if (chapterPercent >= 0 && chapterPercent < 100) return i;
    }

    return 0;
  }

  private _watchBufferedPercent() {
    this._updateBufferedPercent(this._bufferedPercent());
  }

  private _updateBufferedPercent = animationFrameThrottle((bufferedPercent: number) => {
    let percent: number,
      cues = this._$cues();

    for (let i = this._bufferedIndex; i < this._refs.length; i++) {
      percent = this._calcPercent(cues[i], bufferedPercent);
      this._refs[i]?.style.setProperty('--chapter-progress', percent + '%');
      if (percent < 100) {
        this._bufferedIndex = i;
        break;
      }
    }
  });

  private _bufferedPercent = computed(this._calcMediaBufferedPercent.bind(this));
  private _calcMediaBufferedPercent() {
    const { bufferedEnd, duration } = this._media.$state;
    return round(Math.min(bufferedEnd() / Math.max(duration(), 1), 1), 3) * 100;
  }

  private _calcPercent(cue: VTTCue, percent: number) {
    const cues = this._$cues();

    if (cues.length === 0) return 0;

    const lastChapter = cues[cues.length - 1],
      startPercent = (cue.startTime / lastChapter.endTime) * 100,
      endPercent = (cue.endTime / lastChapter.endTime) * 100;

    return Math.max(
      0,
      round(
        percent >= endPercent
          ? 100
          : ((percent - startPercent) / (endPercent - startPercent)) * 100,
        3,
      ),
    );
  }

  private _fillGaps(cues: ReadonlyArray<VTTCue>) {
    const chapters: VTTCue[] = [];

    // Fill any time gaps where chapters are missing.
    if (cues[0].startTime !== 0) {
      chapters.push(new window.VTTCue(0, cues[0].startTime, ''));
    }

    // Fill any time gaps where chapters are missing.
    for (let i = 0; i < cues.length - 1; i++) {
      const currentCue = cues[i],
        nextCue = cues[i + 1];
      chapters.push(currentCue);
      if (nextCue) {
        const timeDiff = nextCue.startTime - currentCue.endTime;
        if (timeDiff > 0) {
          chapters.push(new window.VTTCue(currentCue.endTime, currentCue.endTime + timeDiff, ''));
        }
      }
    }

    chapters.push(cues[cues.length - 1]);

    // const { duration } = this._media.$state;
    // if (Math.abs(cues[cues.length - 1].endTime - duration()) > 1) {
    //   chapters.push(new window.VTTCue(cues[cues.length - 1].endTime, duration(), ''));
    // }

    return chapters;
  }

  private _onTrackChange() {
    // Might run the "load" track event after the component is destroyed.
    if (!this.scope) return;

    const { disabled } = this.$props;
    if (disabled()) return;

    const track = this._$track();

    if (track) {
      const onCuesChange = this._onCuesChange.bind(this);
      onCuesChange();
      onDispose(listenEvent(track, 'add-cue', onCuesChange));
      onDispose(listenEvent(track, 'remove-cue', onCuesChange));
    }

    this._titleRef = this._findChapterTitleRef();
    if (this._titleRef) effect(this._onChapterTitleChange.bind(this));

    return () => {
      if (this._titleRef) {
        this._titleRef.textContent = '';
        this._titleRef = null;
      }
    };
  }

  private _onCuesChange = debounce(
    () => {
      const track = peek(this._$track);
      if (!this.scope || !track || !track.cues.length) return;
      this._$cues.set(this._fillGaps(track.cues));
      this._activeIndex.set(0);
    },
    150,
    true,
  );

  private _onChapterTitleChange() {
    const cue = this.activePointerCue || this.activeCue;
    if (this._titleRef) this._titleRef.textContent = cue?.text || '';
  }

  private _findParentSlider() {
    let node = this.el;
    while (node && node.getAttribute('role') !== 'slider') {
      node = node.parentElement;
    }
    return node;
  }

  private _findChapterTitleRef() {
    const slider = this._findParentSlider();
    return slider ? slider.querySelector<HTMLElement>('[data-part="chapter-title"]') : null;
  }
}

export interface SliderChaptersProps {
  /**
   * Whether chapters should be disabled.
   */
  disabled: boolean;
}

export interface SliderChaptersCSSVars {
  /**
   * The percentage of the chapter that is filled.
   */
  readonly 'chapter-fill': string;
  /**
   * The percentage of the chapter that has been buffered.
   */
  readonly 'chapter-progress': string;
}
