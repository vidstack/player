## Usage

The `<vds-time-slider>` component (aka scrubber) extends [`<vds-slider>`](../slider/index.md) ,
and two-way binds the slider's value with the provider's current playback time position.

The slider receives time updates from the provider through the media store, and it'll actively
dispatch a `vds-seeking-request:ignore` event
([throttled](./api.md#properties--seekingrequestthrottle) to once per `100ms`) as the slider value
changes. Seeking requests let the media controller know that the user is actively seeking, but they haven't
determined the final playback position they want to seek to. When the user stops
dragging the slider, a `vds-seek-request:ignore` event will be fired to request updating the
current playback time to the slider's value.

The slider's range is assumed to be in seconds between `0` (min) and length of media (max).

<slot name="usage" />

## Styling

The `<vds-time-slider>` component is simply a slider with some additional logic for binding to the
current playback time. We recommend reading through the [`<vds-slider>`](../slider/index.md),
[`<vds-slider-value-text>`](../slider-value-text/index.md), and [`<vds-slider-video>`](../slider-video/index.md)
docs to get an idea of how to style it to your liking.

After copying any examples, remember to replace `<vds-slider>` with
`<vds-time-slider>` in markup, and `vds-slider:ignore` with `vds-time-slider:ignore` in CSS.
