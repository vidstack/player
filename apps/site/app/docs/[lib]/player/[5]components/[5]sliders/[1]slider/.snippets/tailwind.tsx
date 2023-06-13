<MediaSlider
  className="group mx-2.5 flex h-12 items-center"
  trackClass="absolute top-1/2 left-0 z-0 h-1 w-full -translate-y-1/2 bg-[#5a595a] outline-none group-data-[focus]:ring-4 group-data-[focus]:ring-blue-400"
  trackFillClass="absolute top-1/2 left-0 z-20 h-1 w-[var(--slider-fill-percent)] -translate-y-1/2 bg-white will-change-[width]"
  thumbContainerClass="absolute top-0 left-[var(--slider-fill-percent)] z-20 h-full w-5 -translate-x-1/2 group-data-[dragging]:left-[var(--slider-pointer-percent)]"
  thumbClass="absolute top-1/2 left-0 h-5 w-5 -translate-y-1/2 rounded-full bg-white opacity-0 transition-opacity duration-150 ease-in group-data-[interactive]:opacity-100"
>
  <div
    className="absolute bottom-full left-[var(--preview-left)] flex -translate-x-1/2 items-center justify-center rounded-sm bg-black px-2.5 py-px text-white/80 opacity-0 transition-opacity duration-200 ease-out group-data-[interactive]:opacity-100 group-data-[interactive]:ease-in"
    slot="preview"
  >
    <MediaSliderValue type="pointer" format="percent" />
  </div>
</MediaSlider>;
