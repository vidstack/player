---
description: This component is used to create a range input for controlling the current time of playback.
---

## Usage

The `$tag:vds-time-slider` component receives time updates from the provider through the media store,
and actively dispatches a `media-seeking-request` event (throttled to once per `100ms`) as the
slider value changes.

Seeking requests let the media controller know that the user is actively seeking but they haven't
determined the final playback position they want to seek to. When the user stops dragging the
slider, a `media-seek-request` event will be fired to request updating the current playback time
to the slider's value.

The slider's range is assumed to be in seconds between `0` (min) and length of media (max).

{% code_preview name="usage" copyHighlight=true highlight="html:3|react:7" /%}

## Styling

You can override the default styles with CSS like so:

```css
/* CSS vars are available for simple customization. */
vds-time-slider {
  /* Default values are shown below. */
  --media-slider-height: 48px;
  --media-slider-thumb-size: 14px;
  --media-slider-focused-thumb-size: calc(var(--thumb-size) * 1.1);
  --media-slider-track-height: 4px;
  --media-slider-focused-track-height: calc(var(--track-height) * 1.25);
}

/* Apply styles when device pointer is within slider bounds. */
vds-time-slider[pointing] {
}

/* Apply styles when slider thumb is being dragged. */
vds-time-slider[dragging] {
}

/* Shorthand for both dragging and pointing. */
vds-time-slider[interactive] {
}

/* Apply styles to all tracks. */
vds-time-slider [part~='track'] {
}

/* Apply styles to track when interactive. */
vds-time-slider[interactive] [part~='track'] {
}

/* Apply styles to track fill (played portion of slider). */
vds-time-slider [part~='track-fill'] {
}

/* Apply styles to track progress (buffered). */
vds-time-slider [part~='track-progress'] {
}

/* Apply styles to thumb container. */
vds-time-slider [part='thumb-container'] {
}

/* Apply styles to slider thumb. */
vds-time-slider [part='thumb'] {
}
```

## Previews

{% code_preview name="preview" copyHighlight=true highlight="html:2|react:7" /%}

### Grouping

{% code_preview name="preview-group" copyHighlight=true highlight="html:2-5|react:7-10" /%}

### Styling

```css
/* CSS vars are available for simple customization. */
vds-time-slider {
  /* Default values are shown below. */
  --media-slider-preview-width: var(--computed-width);
  --media-slider-preview-gap: calc(var(--computed-height) + 8px);
}

/** Override default preview styles. */
vds-time-slider [slot='preview'] {
}
```
