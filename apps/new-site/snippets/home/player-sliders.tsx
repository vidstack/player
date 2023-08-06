import clsx from 'clsx';
import React from 'react';
import { TimeSlider, VolumeSlider } from '@vidstack/react';

export function Volume() {
  return (
    <VolumeSlider.Root className="group mx-2.5 flex h-12 items-center w-16">
      <VolumeSlider.Track className="w-full absolute top-1/2 left-0 -translate-y-1/2 bg-white/30" />
      <VolumeSlider.TrackFill
        className={clsx(
          'w-[var(--slider-fill)] absolute top-1/2 left-0',
          '-translate-y-1/2 bg-white z-10',
        )}
      />

      <VolumeSlider.Thumb
        className={clsx(
          'absolute top-0 left-[var(--slider-fill)] z-20 h-full w-5',
          '-translate-x-1/2 group-data-[dragging]:left-[var(--slider-pointer)]',
        )}
      />

      <VolumeSlider.Preview
        className="opacity-0 data-[showing]:opacity-100 transition-opacity"
        overflow
      >
        <VolumeSlider.Value className="px-px py-2.5 text-white bg-black rounded-sm" />
      </VolumeSlider.Preview>
    </VolumeSlider.Root>
  );
}

export function Time() {
  return (
    <TimeSlider.Root className="group mx-2.5 flex h-12 items-center w-full">
      <TimeSlider.Chapters className="relative flex items-center w-full h-full">
        {(cues, forwardRef) =>
          cues.map((cue) => (
            <div
              className="relative flex items-center w-full h-full rounded-sm"
              key={cue.startTime}
              ref={forwardRef}
            >
              <TimeSlider.Track className="absolute top-1/2 left-0 -translate-y-1/2 bg-white/30" />
              <TimeSlider.TrackFill
                className={clsx(
                  'w-[var(--chapter-fill)] absolute top-1/2 left-0',
                  '-translate-y-1/2 bg-white z-20',
                )}
              />
              <TimeSlider.Progress
                className={clsx(
                  'w-[var(--chapter-progress)] absolute top-1/2 left-0',
                  '-translate-y-1/2 bg-white/50 z-10',
                )}
              />
            </div>
          ))
        }
      </TimeSlider.Chapters>

      <TimeSlider.Thumb
        className={clsx(
          'absolute top-0 left-[var(--slider-fill)] z-20 h-full w-5',
          '-translate-x-1/2 group-data-[dragging]:left-[var(--slider-pointer)]',
        )}
      />

      <TimeSlider.Preview className="flex flex-col opacity-0 data-[showing]:opacity-100 transition-opacity">
        <TimeSlider.Thumbnail.Root className="min-w-[120px] aspect-video bg-black">
          <TimeSlider.Thumbnail.Img className="w-full" />
        </TimeSlider.Thumbnail.Root>

        <TimeSlider.ChapterTitle className="text-white bg-black/10 text-sm mt-1" />
        <TimeSlider.Value className="px-px py-2.5 text-white bg-black/10 rounded-sm" />
      </TimeSlider.Preview>
    </TimeSlider.Root>
  );
}
