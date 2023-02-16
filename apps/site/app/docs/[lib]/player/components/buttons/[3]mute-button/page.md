---
description: This component is used to mute and unmute media.
---

## Usage

The `$tag:media-mute-button` component will toggle the `muted` state of media as it's pressed by
dispatching a `media-mute-request`, and `media-unmute-request` event to the player.

{% code_preview name="usage" copyHighlight=true highlight="html:3|react:6" /%}

## Custom Icons

Here's an example containing custom muted and volume icons:

{% code_snippet name="custom-icons" copyHighlight=true highlight="react:3-" /%}

## Styling

You can override the default styles with CSS like so:

```css {% copy=true %}
media-mute-button {
  color: pink;
  transition: opacity 0.2s ease-in;
}

/* Apply styles when media is muted. */
media-mute-button[muted] {
}

/* Apply styles when media is _not_ muted. */
media-mute-button:not([muted]) {
}

/* Apply styles when media volume is low (0% < x < 50%). */
media-mute-button[volume-low] {
}

/* Apply styles when media volume is high (≥50%). */
media-mute-button[volume-high] {
}

/* Style default icons. */
media-mute-button svg[slot='volume-muted'] {
}
media-mute-button svg[slot='volume-low'] {
}
media-mute-button svg[slot='volume-high'] {
}
```

### Focus

```css {% copy=true %}
/* Apply styles when focused via keyboard. */
media-mute-button:focus-visible {
  outline: 1px auto purple;
}

/* Polyfill applies this class. */
media-mute-button.focus-visible {
  outline: 1px auto purple;
}
```

## Tailwind

The following is a headless example using Tailwind:

{% code_snippet name="tailwind" copyHighlight=true highlight="react:3-" /%}
