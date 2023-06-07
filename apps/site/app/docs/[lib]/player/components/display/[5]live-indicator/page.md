---
description: This component is used to display the current live status of the stream.
---

## Usage

The `$tag:media-live-indicator` component displays the current live status of the stream. This
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
media-live-indicator {
}

/* Apply styles when stream is live. */
media-live-indicator[data-live] {
}

/* Apply styles when stream is _not_ live. */
media-live-indicator:not([data-live]) {
}

/* Apply styles when stream is at live edge. */
media-live-indicator[data-live-edge] {
}

/* Style default parts. */
media-live-indicator [part='container'] {
}
media-live-indicator [part='text'] {
}
```

### Focus

```css
media-live-indicator {
  /* box shadow */
  --media-focus-ring: 0 0 0 4px rgb(78 156 246);
}

/* Apply styles when focused via keyboard. */
media-live-indicator[data-focus] {
}
```

### CSS Variables

The following snippet contains a complete list of CSS variables and their default values. Any
of the variables can be set to adjust the default live indicator styles:

```css {% copy=true %}
media-player {
  --media-live-indicator-width: 40px;
  --media-live-indicator-height: 40px;
  --media-live-indicator-bg: #8a8a8a;
  --media-live-indicator-border-radius: 2px;
  --media-live-indicator-color: #161616;
  --media-live-indicator-font-size: 12px;
  --media-live-indicator-font-weight: 600;
  --media-live-indicator-letter-spacing: 1.5px;
  --media-live-indicator-padding: 1px 4px;

  --media-live-indicator-edge-bg: #dc2626;
  --media-live-indicator-edge-color: #f5f5f5;
}
```

## Tailwind

The following is a headless example using Tailwind:

{% code_snippet name="tailwind" copy=true /%}
