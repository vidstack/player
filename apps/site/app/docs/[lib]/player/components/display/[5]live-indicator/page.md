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
/* Apply styles when focused via keyboard. */
media-live-indicator[data-focus] {
  outline: 3px solid blue;
}
```

## Tailwind

The following is a headless example using Tailwind:

{% code_snippet name="tailwind" copy=true /%}
