---
description: This component is used to seek playback forwards or backwards.
---

## Usage

The `$tag:media-seek-button` component will seek the current time of media forwards or backwards
as it's pressed by dispatching a `media-seek-request` event to the player.

{% code_preview name="usage" copyHighlight=true highlight="html:3|react:7" /%}

## Custom Icons

Here's an example containing a custom backward and forward icon:

{% code_snippet name="custom-icons" copyHighlight=true highlight="react:3-" /%}

## Styling

You can override the default styles with CSS like so:

```css {% copy=true %}
media-seek-button {
  color: pink;
  transition: opacity 0.2s ease-in;
}

/* Apply styles when seeking forward. */
media-seek-button:not([seconds*='-']) {
}

/* Apply styles when seeking backward. */
media-seek-button[seconds*='-'] {
}

/* Style default icons. */
media-seek-button svg[slot='backward'] {
}
media-seek-button svg[slot='forward'] {
}
```

### Focus

```css {% copy=true %}
/* Apply styles when focused via keyboard. */
media-seek-button:focus-visible {
  outline: 1px auto purple;
}

/* Polyfill applies this class. */
media-seek-button.focus-visible {
  outline: 1px auto purple;
}
```

## Tailwind

The following is a headless example using Tailwind:

{% code_snippet name="tailwind" copyHighlight=true highlight="react:3-" /%}
