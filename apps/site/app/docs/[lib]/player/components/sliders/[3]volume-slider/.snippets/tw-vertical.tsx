<MediaVolumeSlider
  className="group my-2.5 flex w-12 h-full items-center"
  trackClass="absolute bottom-0 left-1/2 z-0 h-full w-1 -translate-x-1/2 bg-[#5a595a] outline-none group-data-[focus]:ring-4 group-data-[focus]:ring-blue-400"
  trackFillClass="absolute bottom-0 left-1/2 z-20 w-1 h-[var(--slider-fill-percent)] -translate-x-1/2 bg-white will-change-[height]"
  thumbContainerClass="absolute bottom-[var(--slider-fill-percent)] left-1/2 z-20 w-full h-5 -translate-x-1/2 group-data-[dragging]:bottom-[var(--slider-pointer-percent)]"
  thumbClass="absolute bottom-0 left-1/2 h-5 w-5 -translate-x-1/2 translate-y-1/2 rounded-full bg-white opacity-0 transition-opacity duration-150 ease-in group-data-[interactive]:opacity-100"
  aria-orientation="vertical"
>
  <div
    className="absolute bottom-[var(--preview-bottom)] left-full flex translate-y-1/2 items-center justify-center rounded-sm bg-black px-1 py-px text-white/80 opacity-0 transition-opacity duration-200 ease-out group-data-[interactive]:opacity-100 group-data-[interactive]:ease-in"
    slot="preview"
  >
    <MediaSliderValue type="pointer" format="percent" />
  </div>
</MediaVolumeSlider>;
