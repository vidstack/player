---
description: This component is used to display the current live status of the stream.
---

## Usage

The `$tag:media-live-button` component displays the current live status of the stream. This
includes whether it's live, at the live edge, or not live. In addition, this component is a button
during live streams and will skip ahead to the live edge when pressed.

{% code_preview name="usage" copyHighlight=true highlight="react:6" /%}

{% callout type="warning" %}
This component will contain no content, sizing, or role when the current stream is _not_ live.
{% /callout %}

## Slots

Slots are available for providing custom content depending on the current live status:

{% code_snippet name="slots" copy=true /%}

## Styling

```css
/* Apply styles to indicator. */
media-live-button {
}

/* Apply styles when stream is live. */
media-live-button[data-live] {
}

/* Apply styles when stream is _not_ live. */
media-live-button:not([data-live]) {
}

/* Apply styles when stream is at live edge. */
media-live-button[data-live-edge] {
}

/* Style default parts. */
media-live-button [part='container'] {
}
media-live-button [part='text'] {
}
```

### Focus

```css
media-live-button {
  /* box shadow */
  --media-focus-ring: 0 0 0 4px rgb(78 156 246);
}

/* Apply styles when focused via keyboard. */
media-live-button[data-focus] {
}
```

### CSS Variables

The following snippet contains a complete list of CSS variables and their default values. Any
of the variables can be set to adjust the default live indicator styles:

```css {% copy=true %}
media-player {
  --media-live-button-width: 40px;
  --media-live-button-height: 40px;
  --media-live-button-bg: #8a8a8a;
  --media-live-button-border-radius: 2px;
  --media-live-button-color: #161616;
  --media-live-button-font-size: 12px;
  --media-live-button-font-weight: 600;
  --media-live-button-letter-spacing: 1.5px;
  --media-live-button-padding: 1px 4px;

  --media-live-button-edge-bg: #dc2626;
  --media-live-button-edge-color: #f5f5f5;
}
```

## Tailwind

The following is a headless example using Tailwind:

{% code_snippet name="tailwind" copy=true /%}
