---
description: This component is used to create a range input for controlling the volume of media.
---

{% callout type="info" %}
📖 The [`$tag:media-slider`](/docs/player/components/sliders/slider) guide contains background
documentation that can be used when working with the volume slider component.
{% /callout %}

## Usage

The `$tag:media-volume-slider` component receives volume updates from the provider through the media
store, and dispatches a `media-volume-change-request` event to request updating the current volume
level on the provider as the slider value changes.

The media volume range is between `0` (min) and `1` (max), but on the slider it's between `0` and
`100`. The conversion is automatically handled by this component.

{% code_preview name="usage" copyHighlight=true highlight="html:3|react:7" /%}

## Preview

{% code_preview name="preview" size="small" copyHighlight=true highlight="html:2|react:7" /%}

## Orientation

You can change the orientation of the slider to vertical by setting the `aria-orientation`
attribute like so:

{% code_preview name="vertical" size="small" copy=true /%}

## Keyboard

The volume slider will receive keyboard input when focused. The [interaction keys](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Roles/slider_role#keyboard_interactions) are based on
standard accessibility guidelines.

The `$attr:key-step` and `$attr:shift-key-multiplier` can be used to configure how much to
decrease/increase volume percentage by on key press like so:

{% code_snippet name="keyboard" copy=true /%}

In the snippet above, each keyboard step (e.g., pressing left or right arrow key) will
respectively decrease/increase volume by 5%. Holding `shift` will multiply by the
step by 2, so a change of 10%.

👉 You can [configure global volume keys](/docs/player/core-concepts/keyboard#configuring-shortcuts)
on the player.

## Styling

You can override the default styles with CSS like so:

```css {% copy=true %}
media-volume-slider {
}

/* Apply styles when device pointer is within slider bounds. */
media-volume-slider[data-pointing] {
}

/* Apply styles when slider thumb is being dragged. */
media-volume-slider[data-dragging] {
}

/* Shorthand for both dragging and pointing. */
media-volume-slider[data-interactive] {
}

/** Apply styles to preview. */
media-volume-slider [slot='preview'] {
}
```

### Parts

```css {% copy=true %}
/* Apply styles to all tracks. */
media-volume-slider [part~='track'] {
}

/* Apply styles to track when interactive. */
media-volume-slider[data-interactive] [part~='track'] {
}

/* Apply styles to track fill (played portion of slider). */
media-volume-slider [part~='track-fill'] {
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
media-volume-slider {
  /* box shadow */
  --media-focus-ring: 0 0 0 4px rgb(78 156 246);
}

/* Apply styles to slider when focused via keyboard. */
media-volume-slider[data-focus] {
}

/* Apply styles to slider track when focused via keyboard. */
media-volume-slider[data-focus] [part='track'] {
}
```

### CSS Variables

See the [slider CSS variables](/docs/player/components/sliders/slider#css-variables)
for simple customization of the default slider styles.

## Tailwind

### Horizontal

A horizontal volume slider built with Tailwind:

{% code_snippet name="tailwind" copy=true /%}

### Vertical

A vertical volume slider built with Tailwind:

{% code_snippet name="tw-vertical" copy=true /%}
