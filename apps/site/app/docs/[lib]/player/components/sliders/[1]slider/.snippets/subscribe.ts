const slider = document.querySelector('media-slider');

slider.onAttach(() => {
  // Any slider state accessed will create a dependency and re-run on change.
  slider.subscribe(({ value, dragging, pointing }) => {
    //
  });
});
