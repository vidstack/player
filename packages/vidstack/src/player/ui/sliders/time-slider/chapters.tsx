import { effect, onDispose, type ReadSignal } from 'maverick.js';
import { animationFrameThrottle } from 'maverick.js/std';
import type { VTTCue } from 'media-captions';

import { round } from '../../../../utils/number';
import type { MediaStore } from '../../../core/api/store';
import type { SliderStore } from '../slider/api/store';

export class SliderChaptersRenderer {
  protected _chapters: VTTCue[] = [];
  protected _refs: HTMLElement[] = [];

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
    this._onChange(firstChapter && firstChapter.startTime === 0 ? firstChapter.text : '');

    const endTime = this._chapters[this._chapters.length - 1].endTime;
    for (const chapter of this._chapters) {
      const el = this._renderChapter(chapter, endTime) as HTMLDivElement;
      this._refs.push(el);
    }

    effect(this._watchBufferedPercent.bind(this));

    onDispose(() => {
      this._refs = [];
    });

    return this._refs;
  }

  protected _renderChapter(chapter: VTTCue, endTime: number) {
    const width = round(this._calcWidth(chapter, endTime), 5) + '%',
      $fill = this._calcFillPercent.bind(this, chapter);
    return (
      <div part="chapter-container" $style:width={width}>
        <div part="chapter">
          <div part="track" />
          <div part="track track-fill" $style:width={$fill()} />
          <div part="track track-progress" />
        </div>
      </div>
    );
  }

  protected _calcFillPercent(chapter: VTTCue) {
    let fillPercent = this._slider.fillPercent(),
      pointing = this._slider.pointing(),
      pointerPercent = pointing ? this._slider.pointerPercent() : fillPercent,
      percent = this._calcChapterPercent(chapter, fillPercent),
      result = percent + '%';

    if (pointing) {
      percent = this._calcChapterPercent(chapter, pointerPercent);
    }

    if (percent > 0 && percent < 100) {
      this._onChange(chapter.text);
    }

    return result;
  }

  protected _watchBufferedPercent() {
    this._updateBufferedPercent(this._calcMediaBufferedPercent());
  }

  protected _updateBufferedPercent = animationFrameThrottle((bufferedPercent: number) => {
    for (let i = 0; i < this._refs.length; i++) {
      const el = this._refs[i].querySelector('[part~="track-progress"]') as HTMLDivElement,
        percent = this._calcChapterPercent(this._chapters[i], bufferedPercent);
      el.style.width = percent + '%';
    }
  });

  protected _calcMediaBufferedPercent() {
    const { bufferedEnd, duration } = this._media;
    return Math.min(bufferedEnd() / Math.max(duration(), 1), 1) * 100;
  }

  protected _calcWidth(cue: VTTCue, endTime: number) {
    return ((cue.endTime - cue.startTime) / endTime) * 100;
  }

  protected _calcChapterPercent(cue: VTTCue, percent: number) {
    const lastChapter = this._chapters[this._chapters.length - 1],
      startPercent = (cue.startTime / lastChapter.endTime) * 100,
      endPercent = (cue.endTime / lastChapter.endTime) * 100;
    return Math.max(
      0,
      percent >= endPercent ? 100 : ((percent - startPercent) / (endPercent - startPercent)) * 100,
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
