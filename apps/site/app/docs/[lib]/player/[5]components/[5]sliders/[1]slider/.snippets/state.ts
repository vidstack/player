const slider = document.querySelector('media-slider');

slider.onAttach(() => {
  const {
    focusing,
    dragging,
    pointing,
    interactive,
    fillPercent,
    previewPercent,
    // ...
  } = slider.state;
});
