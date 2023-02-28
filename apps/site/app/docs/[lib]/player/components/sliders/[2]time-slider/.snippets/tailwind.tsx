<MediaTimeSlider
  className="mx-[calc(var(--thumb-size)/2)] flex h-12 items-center"
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
    <div className="absolute top-1/2 left-0 z-0 h-[var(--track-height)] w-full -translate-y-1/2 transform bg-[#5a595a]"></div>
  );
}

function SliderTrackFill() {
  return (
    <div
      className="live-edge:bg-red absolute top-1/2 left-0 z-20 h-[var(--track-height)] w-full -translate-y-1/2 scale-x-[var(--slider-fill-rate)] transform bg-white will-change-transform"
      style={{ transformOrigin: 'left center' }}
    />
  );
}

function SliderTrackProgress() {
  return (
    <div
      className="absolute top-1/2 left-0 z-10 h-[var(--track-height)] w-full -translate-y-1/2 scale-x-[calc(var(--media-buffered-end)/var(--media-duration))] transform bg-[#878787] will-change-transform"
      style={{ transformOrigin: 'left center' }}
    ></div>
  );
}

function SliderThumb() {
  return (
    <div className="dragging:left-[var(--slider-pointer-percent)] absolute top-0 left-[var(--slider-fill-percent)] z-20 h-full w-[var(--thumb-size)] -translate-x-1/2 transform">
      <div className="interactive:opacity-100 absolute top-1/2 left-0 h-[var(--thumb-size)] w-[var(--thumb-size)] -translate-y-1/2 transform rounded-full bg-white opacity-0 transition-opacity duration-150 ease-in"></div>
    </div>
  );
}

function SliderPreview({ children }) {
  // The `--preview-top` and `--preview-left` CSS vars are applied by the slider to the `preview`
  // slot to help with positioning. See the "Slider > CSS Variables" section for more information.
  return (
    <div
      className="interactive:ease-in interactive:opacity-100 opacity-0 absolute top-[var(--preview-top)] left-[var(--preview-left)] flex -translate-x-1/2 transform items-center justify-center rounded-sm bg-black px-2.5 py-1 text-white/80 transition-opacity duration-200 ease-out"
      slot="preview"
    >
      {children}
    </div>
  );
}
