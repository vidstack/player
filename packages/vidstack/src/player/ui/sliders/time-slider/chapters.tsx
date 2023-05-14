import type { ReadSignal } from 'maverick.js';
import type { VTTCue } from 'media-captions';

import type { MediaStore } from '../../../core/api/store';
import type { SliderStore } from '../slider/api/store';

export class SliderChaptersRenderer {
  constructor(protected _media: MediaStore, protected _slider: SliderStore) {}

  render(cues: ReadonlyArray<VTTCue> | undefined, $class: ReadSignal<string | null>) {
    return cues?.length ? (
      <div class={$class()} part="chapters">
        {this._renderChapters(cues)}
      </div>
    ) : null;
  }

  protected _renderChapters(cues: ReadonlyArray<VTTCue>) {
    const chapters = this._fillChapterGaps(cues);
    return chapters.map((cue, i) => {
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
    return ((cue.endTime - cue.startTime) / this._media.duration()) * 100 + '%';
  }

  protected _computeFill(cue: VTTCue) {
    return this._calcChapterPercent(cue, this._percentToTime(this._slider.value())) + '%';
  }

  protected _computeBuffered(cue: VTTCue) {
    return this._calcChapterPercent(cue, this._media.bufferedEnd()) + '%';
  }

  protected _percentToTime(percent: number) {
    return Math.round((percent / 100) * this._media.duration());
  }

  protected _fillChapterGaps(cues: ReadonlyArray<VTTCue>) {
    const chapters: VTTCue[] = [];

    // Fill any time gaps where chapters are missing
    for (let i = 0; i < cues.length; i++) {
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

    return chapters;
  }

  protected _calcChapterPercent(cue: VTTCue, time: number) {
    return time >= cue.endTime
      ? 100
      : time < cue.startTime
      ? 0
      : ((time - cue.startTime) / (cue.endTime - cue.startTime)) * 100;
  }
}
