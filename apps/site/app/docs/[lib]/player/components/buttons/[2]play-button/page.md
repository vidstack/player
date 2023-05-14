---
description: This component is used to play and pause media.
---

## Usage

The `$tag:media-play-button` component will toggle the `paused` state of media as it's pressed by
dispatching a `media-play-request`, and `media-pause-request` event to the player.

{% code_preview name="usage" copyHighlight=true highlight="html:3|react:6" /%}

## Key Shortcuts

Keyboard shortcuts can be specified either through the
[global key shortcuts](/docs/player/core-concepts/keyboard#configuring-shortcuts) config, or on the
component like so:

{% code_snippet name="key-shortcuts" /%}

👉 See the [`aria-keyshortcuts`](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Attributes/aria-keyshortcuts)
docs for more information.

## Custom Icons

Here's an example containing a custom play and pause icon:

{% code_snippet name="custom-icons" copyHighlight=true highlight="react:3-" /%}

## Tooltips

[Tooltips](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Roles/tooltip_role) can
be provided like so:

{% code_preview name="tooltips" size="small" copyHighlight=true highlight="react:3-" /%}

## Styling

You can override the default styles with CSS like so:

```css {% copy=true %}
media-play-button {
  color: pink;
  transition: opacity 0.2s ease-in;
}

/* Apply styles when media is paused. */
media-play-button[data-paused] {
}

/* Apply styles when media is _not_ paused. */
media-play-button:not([data-paused]) {
}

/* Apply styles when media has ended. */
media-play-button[data-ended] {
}

/* Style default icons. */
media-play-button svg[slot='play'] {
}
media-play-button svg[slot='pause'] {
}
media-play-button svg[slot='replay'] {
}
```

### Focus

```css {% copy=true %}
media-play-button {
  /* box shadow */
  --media-focus-ring: 0 0 0 4px rgb(78 156 246);
}

/* Apply styles when focused via keyboard. */
media-play-button[data-focus] {
}
```

### CSS Variables

See the [toggle button CSS variables](/docs/player/components/buttons/toggle-button#css-variables)
for simple customization of the default button and tooltip styles.

## Tailwind

The following is a headless example using Tailwind:

{% code_snippet name="tailwind" copyHighlight=true highlight="react:3-" /%}

### Tooltips

The following extends the example above with tooltips:

{% code_snippet name="tailwind-tooltips" copyHighlight=true highlight="react:3-" /%}
