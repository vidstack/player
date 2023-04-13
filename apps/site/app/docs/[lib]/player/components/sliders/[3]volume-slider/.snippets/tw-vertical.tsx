<MediaVolumeSlider
  class="group my-[calc(var(--thumb-size)/2)] flex h-full w-12 items-center"
  aria-orientation="vertical"
  style={{ '--thumb-size': '0.875rem' }}
>
  <SliderTrack />
  <SliderTrackFill />
  <SliderThumb />
  <SliderPreview>
    <MediaSliderValue type="pointer" format="percent" />
  </SliderPreview>
</MediaVolumeSlider>;

function SliderTrack() {
  return (
    <div className="absolute bottom-0 left-1/2 z-0 h-full w-1 -translate-x-1/2 bg-[#5a595a] group-data-[focus]:ring-4 group-data-[focus]:ring-blue-400" />
  );
}

function SliderTrackFill() {
  return (
    <div className="absolute bottom-0 left-1/2 z-20 h-[var(--slider-fill-percent)] w-1 -translate-x-1/2 bg-white will-change-[height]" />
  );
}

function SliderThumb() {
  return (
    <div className="absolute bottom-[var(--slider-fill-percent)] left-1/2 z-20 h-[[var(--thumb-size)]] w-full -translate-x-1/2 group-data-[dragging]:bottom-[var(--slider-pointer-percent)]">
      <div className="absolute bottom-0 left-1/2 h-[var(--thumb-size)] w-[var(--thumb-size)] -translate-x-1/2 translate-y-1/2 rounded-full bg-white opacity-0 transition-opacity duration-150 ease-in group-data-[interactive]:opacity-100" />
    </div>
  );
}

function SliderPreview({ children }) {
  return (
    <div
      className="absolute bottom-[var(--preview-bottom)] left-full flex translate-y-1/2 items-center justify-center rounded-sm bg-black px-1 py-px text-white/80 opacity-0 transition-opacity duration-200 ease-out group-data-[interactive]:opacity-100 group-data-[interactive]:ease-in"
      slot="preview"
    >
      {children}
    </div>
  );
}
