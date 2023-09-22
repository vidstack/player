import { SliderChapters } from './slider-chapters';
import { SliderPreview } from './slider-preview';
import { SliderThumb } from './slider-thumb';

export function TimeSlider(props: TimeSliderProps) {
  return (
    <media-time-slider class="group relative mx-[7.5px] inline-flex h-10 w-full cursor-pointer touch-none select-none items-center outline-none">
      <SliderChapters />
      <SliderThumb />
      <SliderPreview thumbnails={props.thumbnails}>
        <div class="mt-2 text-sm" data-part="chapter-title" />
        <media-slider-value class="text-[13px]" type="pointer" format="time" />
      </SliderPreview>
    </media-time-slider>
  );
}

export interface TimeSliderProps {
  thumbnails?: string;
}
