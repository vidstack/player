<MediaTimeSlider
  className="group mx-[calc(var(--thumb-size)/2)] flex h-12 items-center"
  style={{ '--thumb-size': '14px', '--track-height': '4px' }}
>
  <SliderTrack />
  <SliderTrackFill />
  <SliderTrackProgress />
  <SliderThumb />
  <SliderPreview>
    <MediaSliderValue type="pointer" format="time" />
  </SliderPreview>
</MediaTimeSlider>;

function SliderTrack() {
  return (
    <div className="absolute top-1/2 left-0 z-0 h-[var(--track-height)] w-full -translate-y-1/2 bg-[#5a595a] outline-none group-data-[focus]:ring-4 group-data-[focus]:ring-blue-400"></div>
  );
}

function SliderTrackFill() {
  return (
    <div
      className="live:bg-red-500 absolute top-1/2 left-0 z-20 h-[var(--track-height)] -translate-y-1/2 w-[var(--slider-fill-percent)] bg-white will-change-[width]"
      style={{ transformOrigin: 'left center' }}
    />
  );
}

function SliderTrackProgress() {
  return (
    <div
      className="absolute top-1/2 left-0 z-10 h-[var(--track-height)] -translate-y-1/2 w-[var(--media-buffered-percent)] bg-[#878787] will-change-[width]"
      style={{ transformOrigin: 'left center' }}
    ></div>
  );
}

function SliderThumb() {
  return (
    <div className="absolute top-0 left-[var(--slider-fill-percent)] z-20 h-full w-[var(--thumb-size)] -translate-x-1/2 group-data-[dragging]:left-[var(--slider-pointer-percent)]">
      <div className="absolute top-1/2 left-0 h-[var(--thumb-size)] w-[var(--thumb-size)] -translate-y-1/2 rounded-full bg-white opacity-0 transition-opacity duration-150 ease-in group-data-[interactive]:opacity-100"></div>
    </div>
  );
}

function SliderPreview({ children }) {
  return (
    <div
      className="absolute bottom-full left-[var(--preview-left)] flex -translate-x-1/2 items-center justify-center rounded-sm bg-black px-1 py-px text-white/80 opacity-0 transition-opacity duration-200 ease-out group-data-[interactive]:opacity-100 group-data-[interactive]:ease-in"
      slot="preview"
    >
      {children}
    </div>
  );
}
