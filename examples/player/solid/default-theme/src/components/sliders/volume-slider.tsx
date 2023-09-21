export function VolumeSlider() {
  return (
    <media-volume-slider class="vds-slider">
      <div class="vds-slider-track" />
      <div class="vds-slider-track-fill vds-slider-track" />
      <media-slider-preview class="vds-slider-preview" noClamp>
        <media-slider-value class="vds-slider-value" type="pointer" format="percent" />
      </media-slider-preview>
      <div class="vds-slider-thumb" />
    </media-volume-slider>
  );
}
