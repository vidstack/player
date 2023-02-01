---
description: This component is used to create an input for controlling a range of values.
---

## Usage

The `$tag:media-slider` component is a custom-built range input that is cross-browser friendly,
ARIA friendly, mouse/touch-friendly and easily style-able. The slider allows users to input
numeric values between a minimum and maximum value.

Other sliders in the library such as `$tag:media-time-slider` and `$tag:media-volume-slider`
extend the `$tag:media-slider` component with additional functionality based on their use-case. All
documentation on this page, particularly around styling and subscriptions, is valid for all sliders.

{% code_preview name="usage" size="xsmall" copyHighlight=true highlight="html:3|react:5" /%}

## Subscribe

The slider has a store that keeps track of the running slider state. The store enables you to
subscribe directly to specific state changes, rather than listening to potentially multiple DOM
events and binding it yourself.

{% code_snippet name="subscribe" copy=true /%}

## Styling

You can override the default styles with CSS like so:

```css {% copy=true %}
/* CSS vars are available for simple customization. */
media-slider {
  /* Default values are shown below. */
  --media-slider-height: 48px;
  --media-slider-thumb-size: 14px;
  --media-slider-focused-thumb-size: calc(var(--thumb-size) * 1.1);
  --media-slider-track-height: 4px;
  --media-slider-focused-track-height: calc(var(--track-height) * 1.25);
}

/* Apply styles when device pointer is within slider bounds. */
media-slider[pointing] {
}

/* Apply styles when slider thumb is being dragged. */
media-slider[dragging] {
}

/* Shorthand for both dragging and pointing. */
media-slider[interactive] {
}
```

### Parts

```css {% copy=true %}
/* Apply styles to all tracks. */
media-slider [part~='track'] {
}

/* Apply styles to track when interactive. */
media-slider[interactive] [part~='track'] {
}

/* Apply styles to track fill (played portion of slider). */
media-slider [part~='track-fill'] {
}

/* Apply styles to track progress (buffered). */
media-slider [part~='track-progress'] {
}

/* Apply styles to thumb container. */
media-slider [part='thumb-container'] {
}

/* Apply styles to slider thumb. */
media-slider [part='thumb'] {
}
```

### Focus

```css {% copy=true %}
/* Apply styles when focused via keyboard. */
media-slider:focus-visible {
  outline: 1px auto purple;
}

/* Polyfill applies this class. */
media-slider.focus-visible {
  outline: 1px auto purple;
}
```

### Attributes

The attributes listed in the table below are applied to a slider element when valid. You can
use the presence, or absence of these attributes to style the slider and any of it's children as
desired.

| Attribute     | Description                                           |
| ------------- | ----------------------------------------------------- |
| `dragging`    | Slider thumb is currently being dragged.              |
| `pointing`    | Device pointer (mouse/touch) is within slider bounds. |
| `interactive` | Either dragging or pointing is true.                  |

```html
<media-slider dragging interactive />
```

### CSS Variables

The CSS variables listed in the table below can be used to style your own slider. The `fill`
variables represent the current value, and the `pointer` variables represent the current value
at the device pointer (mouse/thumb).

| Variable                   | Description                                                |
| -------------------------- | ---------------------------------------------------------- |
| `--slider-fill-value`      | Slider fill amount (e.g., `30`).                           |
| `--slider-fill-rate`       | The fill value expressed as a ratio (e.g., `0.3`).         |
| `--slider-fill-percent`    | The fill rate expressed as a percentage (e.g., `30%`).     |
| `--slider-pointer-value`   | Fill amount up to the device pointer (e.g., `30`).         |
| `--slider-pointer-rate`    | The pointer value expressed as a ratio (e.g., `0.3`).      |
| `--slider-pointer-percent` | The pointer rate expressed as a percentage. (e.g., `30%`). |

## Tailwind

The following section is for Tailwind CSS users who have installed our [Tailwind Plugin](/docs/player/styling/tailwind).

### Variants {% id="tw-variants" %}

All the [attributes listed above](#attributes) are exposed as variants:

```html
<div class="pointing:bg-indigo-300 dragging:bg-indigo-500" />
```

### CSS Variables {% id="tw-css-vars" %}

You can take advantage of [arbitrary values](https://tailwindcss.com/docs/adding-custom-styles#using-arbitrary-values)
if you're using Tailwind CSS v3+ and use the [CSS variables listed above](#css-variables).

```html
<div class="left-[var(--slider-fill-percent)]" />
```

## Previews

{% code_preview name="preview" size="small" copyHighlight=true highlight="html:2|react:4" /%}

### Styling

```css
/* CSS vars are available for simple customization. */
media-slider {
  /* Default values are shown below. */
  --media-slider-preview-width: var(--computed-width);
  --media-slider-preview-gap: calc(var(--computed-height) + 8px);
}

/** Override default preview styles. */
media-slider [slot='preview'] {
}
```
