<MediaTimeSlider className="group">
  {/* ... */}
  <SliderPreview>
    <MediaSliderVideo src="https://media-files.vidstack.io/240p.mp4" />
  </SliderPreview>
</MediaTimeSlider>;

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
