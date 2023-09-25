import { useEffect, useState } from 'react';

import * as Slider from '@radix-ui/react-slider';
import {
  formatTime,
  Thumbnail,
  useMediaRemote,
  useMediaState,
  useSliderPreview,
} from '@vidstack/react';

export function Volume() {
  const volume = useMediaState('volume'),
    canSetVolume = useMediaState('canSetVolume'),
    remote = useMediaRemote();

  if (!canSetVolume) return null;

  return (
    <Slider.Root
      className="group relative inline-flex h-10 w-full max-w-[80px] cursor-pointer touch-none select-none items-center outline-none"
      value={[volume * 100]}
      onValueChange={([value]) => {
        remote.changeVolume(value / 100);
      }}
    >
      <Slider.Track className="h-[5px] w-full rounded-sm bg-white/30 relative">
        <Slider.Range className="bg-media-brand absolute h-full rounded-sm will-change-[width]" />
      </Slider.Track>
      <Slider.Thumb className="block h-[15px] w-[15px] rounded-full border border-[#cacaca] bg-white outline-none opacity-0 ring-white/40 transition-opacity group-hocus:opacity-100 focus:opacity-100 focus:ring-4 will-change-[left]" />
    </Slider.Root>
  );
}

export interface TimeSliderProps {
  thumbnails?: string;
}

export function Time({ thumbnails }: TimeSliderProps) {
  const time = useMediaState('currentTime'),
    canSeek = useMediaState('canSeek'),
    duration = useMediaState('duration'),
    seeking = useMediaState('seeking'),
    remote = useMediaRemote(),
    step = (1 / duration) * 100,
    [value, setValue] = useState(0),
    { previewRootRef, previewRef, previewValue } = useSliderPreview({
      clamp: true,
      offset: 6,
      orientation: 'horizontal',
    }),
    previewTime = (previewValue / 100) * duration;

  // Keep slider value in-sync with playback.
  useEffect(() => {
    if (seeking) return;
    setValue((time / duration) * 100);
  }, [time, duration]);

  return (
    <Slider.Root
      className="group relative inline-flex h-9 w-full cursor-pointer touch-none select-none items-center outline-none"
      value={[value]}
      disabled={!canSeek}
      step={Number.isFinite(step) ? step : 1}
      ref={previewRootRef}
      onValueChange={([value]) => {
        setValue(value);
        remote.seeking((value / 100) * duration);
      }}
      onValueCommit={([value]) => {
        remote.seek((value / 100) * duration);
      }}
    >
      <Slider.Track className="h-[5px] w-full rounded-sm bg-white/30 relative">
        <Slider.Range className="bg-media-brand absolute h-full rounded-sm will-change-[width]" />
      </Slider.Track>

      <Slider.Thumb className="block h-[15px] w-[15px] rounded-full border border-[#cacaca] bg-white outline-none opacity-0 ring-white/40 transition-opacity group-hocus:opacity-100 focus:opacity-100 focus:ring-4 will-change-[left]" />

      {/* Preview */}
      <div
        className="flex flex-col items-center absolute opacity-0 data-[visible]:opacity-100 transition-opacity duration-200 will-change-[left]"
        ref={previewRef}
      >
        {thumbnails ? (
          <Thumbnail.Root
            src={thumbnails}
            time={previewTime}
            className="block mb-2 h-[var(--thumbnail-height)] max-h-[160px] min-h-[80px] w-[var(--thumbnail-width)] min-w-[120px] max-w-[180px] overflow-hidden border border-white bg-black"
          >
            <Thumbnail.Img />
          </Thumbnail.Root>
        ) : null}
        <span className="text-[13px]">{formatTime(previewTime)}</span>
      </div>
    </Slider.Root>
  );
}
