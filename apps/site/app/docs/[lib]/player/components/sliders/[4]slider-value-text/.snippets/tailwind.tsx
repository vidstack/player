// Any slider will work with this example.
<MediaTimeSlider>
  {/* ... */}
  <SliderPreview>
    <MediaSliderValueText type="pointer" format="time" />
  </SliderPreview>
</MediaTimeSlider>;

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
