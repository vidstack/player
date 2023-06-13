---
description: This component is used to create an input for controlling a range of values.
---

## Usage

The `$tag:media-slider` component is a custom-built range input that is cross-browser friendly,
ARIA friendly, mouse/touch/keyboard-friendly and easily style-able. The slider allows users to input
numeric values between a minimum and maximum value.

Other sliders in the library such as `$tag:media-time-slider` and `$tag:media-volume-slider`
extend the `$tag:media-slider` component with additional functionality based on their use-case. All
documentation on this page, particularly around styling and subscriptions is valid for all sliders.

{% code_preview name="usage" size="xsmall" copyHighlight=true highlight="html:3|react:5" /%}

## Preview

The `preview` slot enables passing in any element to be displayed above the slider thumb
when being interacted with:

{% code_preview name="preview" size="small" copyHighlight=true highlight="html:2|react:4" /%}

Any element you slot in will be sized and positioned automatically by the slider. It will also
ensure the preview is correctly clamped so it doesn't go out of bounds.

## Orientation

You can change the orientation of the slider to vertical by setting the `aria-orientation`
attribute like so:

{% code_preview name="vertical" size="small" copy=true /%}

## State

You can retrieve a snapshot of the current slider state like so:

{% code_snippet name="state" copy=true /%}

## Subscribe

The slider has a store that keeps track of the running slider state. The store enables you to
subscribe directly to specific state changes, rather than listening to potentially multiple DOM
events and binding it yourself.

{% code_snippet name="subscribe" copy=true /%}

## Keyboard

The slider will receive keyboard input when focused. The [interaction keys](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Roles/slider_role#keyboard_interactions) are based on
standard accessibility guidelines.

The `$attr:key-step` and `$attr:shift-key-multiplier` can be used to configure the amount to
decrease/increase the value by on key press like so:

{% code_snippet name="keyboard" copy=true /%}

In the snippet above, each keyboard step (e.g., pressing left or right arrow key) will
respectively decrease/increase the current value by 5. Holding `shift` will multiply by the
step by 2, so a change of 10.

## Styling

You can override the default styles with CSS like so:

```css {% copy=true %}
media-slider {
}

/* Apply styles when device pointer is within slider bounds. */
media-slider[data-pointing] {
}

/* Apply styles when slider thumb is being dragged. */
media-slider[data-dragging] {
}

/* Dragging, pointing, or keyboard interaction. */
media-slider[data-interactive] {
}
```

### Parts

```css {% copy=true %}
/* Apply styles to all tracks. */
media-slider [part~='track'] {
}

/* Apply styles to track when interactive. */
media-slider[data-interactive] [part~='track'] {
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
media-slider {
  /* box shadow */
  --media-focus-ring: 0 0 0 4px rgb(78 156 246);
}

/* Apply styles to slider when focused via keyboard. */
media-slider[data-focus] {
}

/* Apply styles to slider track when focused via keyboard. */
media-slider[data-focus] [part='track'] {
}
```

### Data Attributes

The data attributes listed in the table below are applied to a slider element. You can
use the presence, or absence of these attributes to style the slider and any of it's children as
desired.

| Attribute          | Description                                           |
| ------------------ | ----------------------------------------------------- |
| `data-focus`       | Slider has keyboard focus.                            |
| `data-dragging`    | Slider thumb is currently being dragged.              |
| `data-pointing`    | Device pointer (mouse/touch) is within slider bounds. |
| `data-interactive` | Either dragging, pointing, or focus is true.          |

### CSS Variables

The following snippet contains a complete list of CSS variables and their default values. Any
of the variables can be set to adjust the default slider styles:

```css {% copy=true %}
media-player {
  --media-slider-width: 100%;
  --media-slider-height: 48px;

  --media-slider-thumb-size: 15px;
  --media-slider-thumb-bg: #fff;
  --media-slider-thumb-border: 1px solid #cacaca;
  --media-slider-thumb-border-radius: 9999px;
  --media-slider-thumb-transition: opacity 0.2s ease-in, box-shadow 0.2s ease;
  --media-slider-focused-thumb-size: calc(var(--thumb-size) * 1.1);
  --media-slider-focused-thumb-shadow: 0 0 0 4px hsla(0, 0%, 100%, 0.4);

  --media-slider-track-width: 100%;
  --media-slider-track-height: 5px;
  --media-slider-track-border-radius: 2px;
  --media-slider-track-height: 5px;
  --media-slider-track-bg: rgb(255 255 255 / 0.3);
  --media-slider-focused-track-width: 100%;
  --media-slider-focused-track-height: calc(var(--track-height) * 1.25);

  --media-slider-track-fill-bg: #fafafa;
  --media-slider-track-fill-live-bg: #dc2626;

  --media-slider-track-progress-bg: rgb(255 255 255 / 0.5);

  --media-slider-value-padding: 1px 10px;
  --media-slider-value-bg: black;
  --media-slider-value-color: hsl(0, 0%, 80%);
  --media-slider-value-gap: 8px;
  --media-slider-value-border-radius: 2px;

  --media-slider-preview-bg: unset;
  --media-slider-preview-width: var(--computed-width);
  --media-slider-preview-border-radius: 2px;
  --media-slider-preview-gap: -2px;
  --media-slider-vertical-preview-gap: 4px;

  --media-slider-chapter-title-font-size: 14px;
  --media-slider-chapter-title-color: #f5f5f5;
  --media-slider-chapter-title-bg: unset;
  --media-slider-chapter-hover-transform: scaleY(2);
  --media-slider-chapter-hover-transition: transform 0.1s cubic-bezier(0.4, 0, 1, 1);

  --media-thumbnail-bg: black;
  --media-thumbnail-border: 1px solid white;
  /* Applies when scaling thumbnails up. */
  --media-thumbnail-min-width: 120px;
  --media-thumbnail-min-height: 80px;
  /* Applies when scaling thumbnails down. */
  --media-thumbnail-max-width: 180px;
  --media-thumbnail-max-height: 160px;
}
```

The CSS variables listed in the table below can be used to style your own slider. The `fill`
variables represent the current value, and the `pointer` variables represent the current value
at the device pointer (mouse/thumb).

| Variable                   | Description                                            |
| -------------------------- | ------------------------------------------------------ |
| `--slider-fill-percent`    | Fill rate expressed as a percentage (e.g., `30%`).     |
| `--slider-pointer-percent` | Pointer rate expressed as a percentage. (e.g., `30%`). |

The slider will also apply the following CSS variables to the element in the `preview` slot:

| Variable           | Description                                                   |
| ------------------ | ------------------------------------------------------------- |
| `--preview-left`   | The clamped horizontal offset when orientation is horizontal. |
| `--preview-bottom` | The clamped vertical offset when orientation is vertical.     |
| `--preview-width`  | The computed width of the preview.                            |
| `--preview-height` | The computed height of the preview.                           |

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

The following section is for Tailwind CSS users who have installed our [Tailwind Plugin](/docs/player/core-concepts/tailwind).

### Data Attributes {% id="tw-variants" %}

All the [data attributes listed above](#data-attributes) can be used like so:

```html
<div class="group-data-[dragging]:bg-indigo-500" />
```

### CSS Variables {% id="tw-css-vars" %}

You can take advantage of [arbitrary values](https://tailwindcss.com/docs/adding-custom-styles#using-arbitrary-values)
if you're using Tailwind CSS v3+ and use the [CSS variables listed above](#css-variables).

```html
<div class="left-[var(--slider-fill-percent)]" />
```

### Example

A complete slider example built with Tailwind:

{% code_snippet name="tailwind" copy=true /%}
