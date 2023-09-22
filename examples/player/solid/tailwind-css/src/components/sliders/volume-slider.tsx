import { SliderPreview } from './slider-preview';
import { SliderThumb } from './slider-thumb';

export function VolumeSlider() {
  return (
    <media-volume-slider class="group relative mx-[7.5px] inline-flex h-10 w-full max-w-[80px] cursor-pointer touch-none select-none items-center outline-none aria-hidden:hidden">
      {/* Track */}
      <div class="ring-media-focus absolute left-0 top-1/2 z-0 h-[5px] w-full -translate-y-1/2 rounded-sm bg-white/30 group-data-[focus]:ring-4" />
      {/* Track Fill */}
      <div class="track-fill bg-media-brand absolute left-0 top-1/2 z-10 h-[5px] w-[var(--slider-fill)] -translate-y-1/2 rounded-sm will-change-[width]" />
      <SliderThumb />
      <SliderPreview noClamp>
        <media-slider-value
          class="rounded-sm bg-black px-2 py-px text-[13px] font-medium"
          type="pointer"
          format="percent"
        />
      </SliderPreview>
    </media-volume-slider>
  );
}
