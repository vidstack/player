// Any slider will work with this example.
<MediaTimeSlider className="group">
  {/* ... */}
  <SliderPreview>
    <MediaSliderValue type="pointer" format="time" />
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
