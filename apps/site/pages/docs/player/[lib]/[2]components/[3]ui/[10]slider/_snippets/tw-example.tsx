import { Slider } from '@vidstack/player/react';

function MySlider() {
  return (
    <Slider className="relative h-6 w-full bg-gray-200">
      {/* Slider Thumb. */}
      <div
        className="
          position interactive:left-[var(--vds-pointer-percent)]
          absolute top-0 left-[var(--vds-fill-percent)]
          h-4 w-4 -translate-x-1/2 transform bg-gray-400
          will-change-[left]
        "
      />
    </Slider>
  );
}
