import { computed, effect, onDispose, peek, type ReadSignal } from 'maverick.js';
import { animationFrameThrottle } from 'maverick.js/std';
import { VTTCue } from 'media-captions';

import { round } from '../../../../utils/number';
import type { MediaStore } from '../../../core/api/store';
import type { SliderStore } from '../slider/api/store';

export class SliderChaptersRenderer {
  protected _chapters: VTTCue[] = [];
  protected _refs: HTMLElement[] = [];
  protected _activeChapterIndex = 0;
  protected _bufferedChapterIndex = 0;

  constructor(
    protected _media: MediaStore,
    protected _slider: SliderStore,
    protected _onChange: (chapter: string) => void,
  ) {}

  render(cues: ReadonlyArray<VTTCue> | undefined, $class: ReadSignal<string | null>) {
    return cues?.length ? (
      <div class={$class()} part="chapters">
        {this._renderChapters(cues)}
      </div>
    ) : null;
  }

  protected _renderChapters(cues: ReadonlyArray<VTTCue>) {
    this._chapters = this._fillChapterGaps(cues);

    const firstChapter = this._chapters[0];
    this._onChange(firstChapter.startTime === 0 ? firstChapter.text : '');

    for (let i = 0; i < this._chapters.length; i++) this._refs.push(this._renderChapter());

    this._updateContainerWidths();
    effect(this._watchFillPercent.bind(this));
    effect(this._watchPointerPercent.bind(this));
    effect(this._watchBufferedPercent.bind(this));

    onDispose(() => {
      this._refs = [];
      this._activeChapterIndex = 0;
      this._bufferedChapterIndex = 0;
    });

    return this._refs;
  }

  protected _renderChapter() {
    return (
      <div part="chapter-container">
        <div part="chapter">
          <div part="track" />
          <div part="track track-fill" style="width: 0%;" />
          <div part="track track-progress" style="width: 0%;" />
        </div>
      </div>
    ) as HTMLDivElement;
  }

  protected _getChapterTrackFill(container: HTMLElement) {
    return container!.firstChild!.firstChild!.nextSibling as HTMLElement;
  }

  protected _getChapterTrackProgress(container: HTMLElement) {
    return container!.firstChild!.lastChild as HTMLElement;
  }

  protected _getChaptersEndTime() {
    return this._chapters[this._chapters.length - 1].endTime;
  }

  protected _updateContainerWidths() {
    let cue: VTTCue,
      endTime = this._getChaptersEndTime();
    for (let i = 0; i < this._chapters.length; i++) {
      cue = this._chapters[i];
      this._refs[i].style.width = round(((cue.endTime - cue.startTime) / endTime) * 100, 3) + '%';
    }
  }

  protected _watchFillPercent() {
    let { fillPercent, value, pointing } = this._slider,
      currentChapter = this._chapters[this._activeChapterIndex],
      activeIndex = this._findActiveChapterIndex(
        currentChapter.startTime <= peek(value) ? this._activeChapterIndex : 0,
        fillPercent(),
      );

    if (activeIndex > this._activeChapterIndex) {
      this._updateTrackFillWidths(this._activeChapterIndex, activeIndex, '100%');
    } else if (activeIndex < this._activeChapterIndex) {
      this._updateTrackFillWidths(activeIndex + 1, this._activeChapterIndex + 1, '0%');
    }

    if (!peek(pointing) && this._activeChapterIndex !== activeIndex) {
      this._onChange(this._chapters[activeIndex].text);
    }

    let trackFill = this._getChapterTrackFill(this._refs[activeIndex]),
      percent = this._calcChapterPercent(this._chapters[activeIndex], fillPercent()) + '%';
    if (trackFill.style.width !== percent) trackFill.style.width = percent;

    this._activeChapterIndex = activeIndex;
  }

  protected _watchPointerPercent() {
    let { pointing, pointerPercent } = this._slider;
    if (!pointing()) return;
    const activeIndex = this._findActiveChapterIndex(0, pointerPercent());
    this._onChange(this._chapters[activeIndex].text);
  }

  protected _updateTrackFillWidths(start: number, end: number, width: string) {
    for (let i = start; i < end; i++) this._getChapterTrackFill(this._refs[i]).style.width = width;
  }

  protected _findActiveChapterIndex(startIndex: number, percent: number) {
    let chapterPercent = 0;

    for (let i = startIndex; i < this._chapters.length; i++) {
      chapterPercent = this._calcChapterPercent(this._chapters[i], percent);
      if (chapterPercent >= 0 && chapterPercent < 100) return i;
    }

    return 0;
  }

  protected _watchBufferedPercent() {
    this._updateBufferedPercent(this._bufferedPercent());
  }

  protected _updateBufferedPercent = animationFrameThrottle((bufferedPercent: number) => {
    let width: number;
    for (let i = this._bufferedChapterIndex; i < this._refs.length; i++) {
      width = this._calcChapterPercent(this._chapters[i], bufferedPercent);
      this._getChapterTrackProgress(this._refs[i]).style.width = width + '%';
      if (width < 100) {
        this._bufferedChapterIndex = i;
        break;
      }
    }
  });

  protected _bufferedPercent = computed(this._calcMediaBufferedPercent.bind(this));
  protected _calcMediaBufferedPercent() {
    const { bufferedEnd, duration } = this._media;
    return round(Math.min(bufferedEnd() / Math.max(duration(), 1), 1), 3) * 100;
  }

  protected _calcChapterPercent(cue: VTTCue, percent: number) {
    const lastChapter = this._chapters[this._chapters.length - 1],
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

  protected _fillChapterGaps(cues: ReadonlyArray<VTTCue>) {
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
