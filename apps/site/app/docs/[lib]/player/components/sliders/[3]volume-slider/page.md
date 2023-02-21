---
description: This component is used to create a range input for controlling the volume of media.
---

📖 The [`$tag:media-slider`](/docs/player/components/sliders/slider) guide contains background
documentation that can be used when working with the volume slider component.

## Usage

The `$tag:media-volume-slider` component receives volume updates from the provider through the media
store, and dispatches a `media-volume-change-request` event to request updating the current volume
level on the provider as the slider value changes.

The media volume range is between `0` (min) and `1` (max), but on the slider it's between `0` and
`100`. The conversion is automatically handled by this component.

{% code_preview name="usage" copyHighlight=true highlight="html:3|react:7" /%}

## Preview

{% code_preview name="preview" size="small" copyHighlight=true highlight="html:2|react:7" /%}

## Styling

You can override the default styles with CSS like so:

```css {% copy=true %}
/* CSS vars are available for simple customization. */
media-volume-slider {
  /* Default values are shown below. */
  --media-slider-height: 48px;
  --media-slider-thumb-size: 14px;
  --media-slider-focused-thumb-size: calc(var(--thumb-size) * 1.1);
  --media-slider-track-height: 4px;
  --media-slider-focused-track-height: calc(var(--track-height) * 1.25);
}

/* Apply styles when device pointer is within slider bounds. */
media-volume-slider[pointing] {
}

/* Apply styles when slider thumb is being dragged. */
media-volume-slider[dragging] {
}

/* Shorthand for both dragging and pointing. */
media-volume-slider[interactive] {
}
```

### Parts

```css {% copy=true %}
/* Apply styles to all tracks. */
media-volume-slider [part~='track'] {
}

/* Apply styles to track when interactive. */
media-volume-slider[interactive] [part~='track'] {
}

/* Apply styles to track fill (played portion of slider). */
media-volume-slider [part~='track-fill'] {
}

/* Apply styles to track progress (buffered). */
media-volume-slider [part~='track-progress'] {
}

/* Apply styles to thumb container. */
media-volume-slider [part='thumb-container'] {
}

/* Apply styles to slider thumb. */
media-volume-slider [part='thumb'] {
}
```

### Focus

```css {% copy=true %}
/* Apply styles when focused via keyboard. */
media-volume-slider:focus-visible {
  outline: 1px auto purple;
}

/* Polyfill applies this class. */
media-volume-slider.focus-visible {
  outline: 1px auto purple;
}
```

### Previews

```css
/* CSS vars are available for simple customization. */
media-volume-slider {
  /* Default values are shown below. */
  --media-slider-preview-width: var(--computed-width);
  --media-slider-preview-gap: calc(var(--computed-height) + 8px);
}

/** Override default preview styles. */
media-volume-slider [slot='preview'] {
}
```

## Tailwind

📖 The `$tag:media-slider` [Tailwind guide](/docs/player/components/sliders/slider#tailwind)
contains background documentation on working with sliders.

A complete volume slider example built with Tailwind:

{% code_snippet name="tailwind" copy=true /%}

{% callout type="tip" %}
All of this code is reusable across other slider implementations.
{% /callout %}
