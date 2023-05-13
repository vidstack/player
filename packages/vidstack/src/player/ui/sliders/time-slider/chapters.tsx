import type { ReadSignal } from 'maverick.js';
import type { VTTCue } from 'media-captions';

import type { MediaStore } from '../../../core/api/store';
import type { SliderStore } from '../slider/api/store';

export class SliderChaptersRenderer {
  protected _chapters: VTTCue[] = [];

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

    return this._chapters.map((cue, i) => {
      const $width = this._computeWidth.bind(this, cue),
        $fill = this._computeFill.bind(this, cue),
        $buffered = this._computeBuffered.bind(this, cue);
      return (
        <div
          part="chapter-container"
          $cssvar:width={$width()}
          $cssvar:slider-fill-percent={$fill()}
          $cssvar:media-buffered-percent={$buffered()}
        >
          <div part="chapter">
            <div part="track" />
            <div part="track track-fill" />
            <div part="track track-progress" />
          </div>
        </div>
      );
    });
  }

  protected _computeWidth(cue: VTTCue) {
    const lastChapter = this._chapters[this._chapters.length - 1];
    return ((cue.endTime - cue.startTime) / lastChapter.endTime) * 100 + '%';
  }

  protected _computeFill(cue: VTTCue) {
    let percent = this._calcChapterPercent(cue, this._slider.fillPercent()),
      currentPercent = percent;

    if (this._slider.pointing()) {
      currentPercent = this._calcChapterPercent(cue, this._slider.pointerPercent());
    }

    if (currentPercent > 0 && currentPercent < 100) {
      this._onChange(cue.text);
    }

    return percent + '%';
  }

  protected _computeBuffered(cue: VTTCue) {
    const percent = (this._media.bufferedEnd() / this._media.duration()) * 100;
    return this._calcChapterPercent(cue, percent) + '%';
  }

  protected _percentToTime(percent: number) {
    return Math.round((percent / 100) * this._media.duration());
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

  protected _calcChapterPercent(cue: VTTCue, percent: number) {
    const lastChapter = this._chapters[this._chapters.length - 1],
      startPercent = (cue.startTime / lastChapter.endTime) * 100,
      endPercent = (cue.endTime / lastChapter.endTime) * 100;
    return Math.max(
      0,
      percent >= endPercent ? 100 : ((percent - startPercent) / (endPercent - startPercent)) * 100,
    );
  }
}
