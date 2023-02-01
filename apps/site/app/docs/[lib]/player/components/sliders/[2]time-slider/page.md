---
description: This component is used to create a range input for controlling the current time of playback.
---

## Usage

The `$tag:media-time-slider` component receives time updates from the provider through the media store,
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

```css {% copy=true %}
/* CSS vars are available for simple customization. */
media-time-slider {
  /* Default values are shown below. */
  --media-slider-height: 48px;
  --media-slider-thumb-size: 14px;
  --media-slider-focused-thumb-size: calc(var(--thumb-size) * 1.1);
  --media-slider-track-height: 4px;
  --media-slider-focused-track-height: calc(var(--track-height) * 1.25);
}

/* Apply styles when device pointer is within slider bounds. */
media-time-slider[pointing] {
}

/* Apply styles when slider thumb is being dragged. */
media-time-slider[dragging] {
}

/* Shorthand for both dragging and pointing. */
media-time-slider[interactive] {
}
```

### Parts

```css {% copy=true %}
/* Apply styles to all tracks. */
media-time-slider [part~='track'] {
}

/* Apply styles to track when interactive. */
media-time-slider[interactive] [part~='track'] {
}

/* Apply styles to track fill (played portion of slider). */
media-time-slider [part~='track-fill'] {
}

/* Apply styles to track progress (buffered). */
media-time-slider [part~='track-progress'] {
}

/* Apply styles to thumb container. */
media-time-slider [part='thumb-container'] {
}

/* Apply styles to slider thumb. */
media-time-slider [part='thumb'] {
}
```

### Focus

```css {% copy=true %}
/* Apply styles when focused via keyboard. */
media-time-slider:focus-visible {
  outline: 1px auto purple;
}

/* Polyfill applies this class. */
media-time-slider.focus-visible {
  outline: 1px auto purple;
}
```

## Previews

{% code_preview name="preview" copyHighlight=true highlight="html:2|react:7" /%}

### Grouping

{% code_preview name="preview-group" copyHighlight=true highlight="html:2-5|react:12-15" /%}

### Styling

```css
/* CSS vars are available for simple customization. */
media-time-slider {
  /* Default values are shown below. */
  --media-slider-preview-width: var(--computed-width);
  --media-slider-preview-gap: calc(var(--computed-height) + 8px);
}

/** Override default preview styles. */
media-time-slider [slot='preview'] {
}
```
