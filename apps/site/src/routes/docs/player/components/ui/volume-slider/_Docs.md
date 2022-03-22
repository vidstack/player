## Usage

The `<vds-volume-slider>` component extends [`<vds-slider>`](../slider/index.md) , and two-way
binds the slider's value with the provider's volume level.

The slider receives volume updates from the provider through the media store, and dispatches a
`vds-volume-change-request:ignore` event to request updating the current volume
level on the provider as the slider value changes.

The media volume range is between `0` (min) and `1` (max), but on the slider it's between `0` and
`100`. The conversion is automatically handled by this component.

<slot name="usage" />

## Styling

The `<vds-volume-slider>` component is simply a slider with some additional logic for binding to
the current volume state. We recommend reading through the [`<vds-slider>`](../slider/index.md) and
[`<vds-slider-value-text>`](../slider-value-text/index.md) docs to get an idea of how to style
it to your liking.

After copying any examples, remember to replace `<vds-slider>` with
`<vds-volume-slider>` in markup, and `vds-slider:ignore` with `vds-volume-slider:ignore` in CSS.
