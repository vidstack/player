import { effect, peek, signal, type WriteSignal } from 'maverick.js';
import { onConnect, type CustomElementHost } from 'maverick.js/element';
import { listenEvent, setAttribute } from 'maverick.js/std';
import { VTTCue } from 'media-captions';

import type { MediaStore } from '../../media/store';
import type { TextTrack } from '../../media/tracks/text/text-track';
import type { TextTrackList } from '../../media/tracks/text/text-tracks';
import type { SliderStore } from '../slider/store';

export function setupSliderChapters(
  host: CustomElementHost,
  $slider: SliderStore,
  $media: MediaStore,
  textTracks: TextTrackList,
) {
  let $track = signal<TextTrack | null>(null);

  onConnect(() => {
    function onModeChange() {
      findChaptersTrack($track, textTracks);
    }

    onModeChange();
    listenEvent(textTracks, 'mode-change', onModeChange);

    effect(() => {
      const track = $track();

      const hasChapters = !!track?.cues.length;
      setAttribute(host.el!, 'data-chapters', hasChapters);

      if (!track) return;

      const titleEl = host.el!.querySelector('[part="chapter-title"]');
      if (!titleEl) return;

      let activeCue: VTTCue | undefined;

      effect(() => {
        if (!titleEl.isConnected) return;
        const value = $slider.interactive ? $slider.pointerValue : $slider.value,
          time = getTime(value, $media.duration),
          cue = track.cues.find((cue) => time >= cue.startTime && time <= cue.endTime);
        if (cue !== activeCue) {
          titleEl.textContent = cue?.text || '';
          activeCue = cue;
        }
      });

      return () => (titleEl.textContent = '');
    });
  });

  function $renderChaptersChildren(cues: ReadonlyArray<VTTCue>) {
    const chapters = fillChapterGaps(cues);
    return chapters.map((cue, i) => {
      const $width = () => ((cue.endTime - cue.startTime) / $media.duration) * 100 + '%',
        $fill = () => calcChapterPercent(cue, getTime($slider.value, $media.duration)) + '%',
        $buffered = () => calcChapterPercent(cue, $media.bufferedEnd) + '%';
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

  return function $renderChapters() {
    const cues = $track()?.cues;
    return cues?.length ? <div part="chapters">{$renderChaptersChildren(cues)}</div> : null;
  };
}

function getTime(percent: number, duration: number) {
  return Math.round((percent / 100) * duration);
}

function fillChapterGaps(cues: ReadonlyArray<VTTCue>) {
  const chapters: VTTCue[] = [];

  // Fill any time gaps where chapters are missing
  for (let i = 0; i < cues.length; i++) {
    const currentCue = cues[i],
      nextCue = cues[i + 1];
    chapters.push(currentCue);
    if (nextCue) {
      const timeDiff = nextCue.startTime - currentCue.endTime;
      if (timeDiff > 0) {
        chapters.push(new VTTCue(currentCue.endTime, currentCue.endTime + timeDiff, ''));
      }
    }
  }

  return chapters;
}

function findChaptersTrack($track: WriteSignal<TextTrack | null>, textTracks: TextTrackList) {
  const track = textTracks
    .toArray()
    .find((track) => track.kind === 'chapters' && track.mode === 'showing');

  if (peek($track) === track) return;

  if (!track) {
    $track.set(null);
    return;
  }

  if (track.readyState == 2) {
    $track.set(track);
  } else {
    $track.set(null);
    track.addEventListener('load', () => $track.set(track), { once: true });
  }
}

function calcChapterPercent(cue: VTTCue, time: number) {
  return time >= cue.endTime
    ? 100
    : time < cue.startTime
    ? 0
    : ((time - cue.startTime) / (cue.endTime - cue.startTime)) * 100;
}
