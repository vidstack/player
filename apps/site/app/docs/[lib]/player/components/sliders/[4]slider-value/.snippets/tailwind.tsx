// Any slider will work with this example.
<MediaTimeSlider className="group">
  {/* ... */}
  <SliderPreview>
    <MediaSliderValue type="pointer" format="time" />
  </SliderPreview>
</MediaTimeSlider>;

function SliderPreview({ children }) {
  // The `--preview-top` and `--preview-left` CSS vars are applied by the slider to the `preview`
  // slot to help with positioning. See the "Slider > CSS Variables" section for more information.
  return (
    <div
      className="absolute top-[var(--preview-top)] left-[var(--preview-left)] flex -translate-x-1/2 transform items-center justify-center rounded-sm bg-black px-2.5 py-1 text-white/80 opacity-0 transition-opacity duration-200 ease-out group-data-[interactive]:opacity-100 group-data-[interactive]:ease-in"
      slot="preview"
    >
      {children}
    </div>
  );
}