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

## Preview

The `preview` slot enables passing in any element to be displayed above the slider thumb
when being interacted with:

{% code_preview name="preview" size="small" copyHighlight=true highlight="html:2|react:4" /%}

Any element you slot in will be sized and positioned automatically by the slider. It will also
ensure the preview is correctly clamped so it doesn't go out of bounds.

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
:where(media-slider:focus-visible, media-slider.focus-visible) {
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

The slider will also apply the following CSS variables to the element in the `preview` slot:

| Variable                | Description                                               |
| ----------------------- | --------------------------------------------------------- |
| `--preview-top`         | Negative vertical offset based on the preview height.     |
| `--preview-left`        | The clamped horizontal offset based on the preview width. |
| `--preview-width`       | The computed width of the preview.                        |
| `--preview-height`      | The computed height of the preview.                       |
| `--preview-width-half`  | The computed width divided in half.                       |
| `--preview-left-clamp`  | The left clamp offset based on the preview width.         |
| `--preview-right-clamp` | The right clamp offset based on the preview width.        |

### Previews

```css
/* CSS vars are available for simple customization. */
media-slider {
  /* Default values are shown below. */
  --media-slider-preview-width: var(--computed-width);
  --media-slider-preview-height: var(--computed-height);
  --media-slider-preview-gap: calc(var(--computed-height) + 8px);
}

/** Override default preview styles. */
media-slider [slot='preview'] {
}
```

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

### Exposing Parts

You can expose slider parts and override the default styles using CSS like so:

{% code_snippet name="tw-expose" copy=true /%}

### Example

A complete slider example built with Tailwind:

{% code_snippet name="tailwind" copy=true /%}

{% callout type="tip" %}

- All of this code is reusable across other slider implementations.

- Too verbose? You might prefer overriding the [default styles](#exposing-parts). Remember to
  load them first if you haven't yet.

{% /callout %}
