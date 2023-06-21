import {
  computed,
  createScope,
  effect,
  onDispose,
  peek,
  scoped,
  signal,
  ViewController,
  type Scope,
} from 'maverick.js';
import { animationFrameThrottle } from 'maverick.js/std';
import { VTTCue } from 'media-captions';

import { useMediaContext } from '../../../../core/api/media-context';
import type { MediaStore } from '../../../../core/api/player-state';
import type { TextTrack } from '../../../../core/tracks/text/text-track';
import { round } from '../../../../utils/number';
import type { SliderState } from '../slider/api/state';
import type { TimeSliderProps } from './time-slider';

export class SliderChaptersRenderer extends ViewController<TimeSliderProps, SliderState> {
  private _media!: MediaStore;

  private _track: TextTrack | null = null;
  private _refs: HTMLElement[] = [];

  private _cues: VTTCue[] = [];
  private _$cues = signal<VTTCue[]>(this._cues);

  private _activeIndex = signal(-1);
  private _activePointerIndex = signal(-1);
  private _bufferedIndex = 0;

  protected override onSetup(): void {
    this._media = useMediaContext().$state;
  }

  protected override onConnect(): void {
    this._build();
    onDispose(this._reset.bind(this));
  }

  get cues() {
    return this._$cues();
  }

  get activeCue(): VTTCue | null {
    return this._cues[this._activeIndex()] || null;
  }

  get activePointerCue(): VTTCue | null {
    return this._cues[this._activePointerIndex()] || null;
  }

  setTrack(track: TextTrack | null) {
    if (this._track === track) return;
    this._track = track;
    this._reset();
    this._build();
  }

  private _updateScope?: Scope;
  addRefs(refs: HTMLElement[]) {
    this._refs = refs;
    this._updateScope?.dispose();
    if (this._refs.length === 1) {
      const el = this._refs[0];
      el.style.width = '100%';
      el.style.setProperty('--chapter-fill', 'var(--slider-fill)');
      el.style.setProperty('--chapter-progress', 'var(--slider-progress)');
    } else if (this._refs.length > 0) {
      scoped(() => this._update(), (this._updateScope = createScope()));
    }
  }

  private _build() {
    if (!this._track?.cues.length || this._cues.length) return;

    const chapters = this._fillGaps(this._track.cues);
    this._cues = chapters;
    this._$cues.set(chapters);

    if (chapters[0].startTime === 0) {
      this._activeIndex.set(0);
    }
  }

  private _reset() {
    if (!this._cues.length) return;
    this._refs = [];
    this._cues = [];
    this._$cues.set(this._cues);
    this._activeIndex.set(-1);
    this._activePointerIndex.set(-1);
    this._bufferedIndex = 0;
    this._updateScope?.dispose();
  }

  private _update() {
    this._updateContainerWidths();
    effect(this._watchFillPercent.bind(this));
    effect(this._watchPointerPercent.bind(this));
    effect(this._watchBufferedPercent.bind(this));
  }

  private _getEndTime() {
    return this._cues[this._cues.length - 1].endTime;
  }

  private _updateContainerWidths() {
    let cue: VTTCue,
      endTime = this._getEndTime();
    for (let i = 0; i < this._cues.length; i++) {
      cue = this._cues[i];
      this._refs[i].style.width = round(((cue.endTime - cue.startTime) / endTime) * 100, 3) + '%';
    }
  }

  private _watchFillPercent() {
    let { fillPercent, value } = this.$state,
      prevActiveIndex = peek(this._activeIndex),
      currentChapter = this._cues[prevActiveIndex],
      currentActiveIndex = this._findActiveChapterIndex(
        currentChapter.startTime <= peek(value) ? prevActiveIndex : 0,
        fillPercent(),
      );

    if (currentActiveIndex > prevActiveIndex) {
      this._updateFillPercents(prevActiveIndex, currentActiveIndex, '100%');
    } else if (currentActiveIndex < prevActiveIndex) {
      this._updateFillPercents(currentActiveIndex + 1, prevActiveIndex + 1, '0%');
    }

    const percent = this._calcPercent(this._cues[currentActiveIndex], fillPercent()) + '%';
    this._updateFillPercent(this._refs[currentActiveIndex], percent);

    this._activeIndex.set(currentActiveIndex);
  }

  private _watchPointerPercent() {
    let { pointing, pointerPercent } = this.$state;

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

  private _updateFillPercent(ref: HTMLElement, percent: string) {
    ref.style.setProperty('--chapter-fill', percent);
  }

  private _findActiveChapterIndex(startIndex: number, percent: number) {
    let chapterPercent = 0;

    for (let i = startIndex; i < this._cues.length; i++) {
      chapterPercent = this._calcPercent(this._cues[i], percent);
      if (chapterPercent >= 0 && chapterPercent < 100) return i;
    }

    return 0;
  }

  private _watchBufferedPercent() {
    this._updateBufferedPercent(this._bufferedPercent());
  }

  private _updateBufferedPercent = animationFrameThrottle((bufferedPercent: number) => {
    let percent: number;
    for (let i = this._bufferedIndex; i < this._refs.length; i++) {
      percent = this._calcPercent(this._cues[i], bufferedPercent);
      this._refs[i].style.setProperty('--chapter-progress', percent + '%');
      if (percent < 100) {
        this._bufferedIndex = i;
        break;
      }
    }
  });

  private _bufferedPercent = computed(this._calcMediaBufferedPercent.bind(this));
  private _calcMediaBufferedPercent() {
    const { bufferedEnd, duration } = this._media;
    return round(Math.min(bufferedEnd() / Math.max(duration(), 1), 1), 3) * 100;
  }

  private _calcPercent(cue: VTTCue, percent: number) {
    const lastChapter = this._cues[this._cues.length - 1],
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
    return chapters;
  }
}
