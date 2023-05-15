---
description: This component is used to mute and unmute media.
---

## Usage

The `$tag:media-mute-button` component will toggle the `muted` state of media as it's pressed by
dispatching a `media-mute-request`, and `media-unmute-request` event to the player.

{% code_preview name="usage" copyHighlight=true highlight="html:3|react:6" /%}

## Key Shortcuts

Keyboard shortcuts can be specified either through the
[global key shortcuts](/docs/player/core-concepts/keyboard#configuring-shortcuts) config, or on the
component like so:

{% code_snippet name="key-shortcuts" /%}

👉 See the [`aria-keyshortcuts`](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Attributes/aria-keyshortcuts)
docs for more information.

## Custom Icons

Here's an example containing custom muted and volume icons:

{% code_snippet name="custom-icons" copyHighlight=true highlight="react:3-" /%}

## Tooltips

[Tooltips](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Roles/tooltip_role) can
be provided like so:

{% code_preview name="tooltips" size="small" copyHighlight=true highlight="react:3-" /%}

## Styling

You can override the default styles with CSS like so:

```css {% copy=true %}
media-mute-button {
  color: pink;
  transition: opacity 0.2s ease-in;
}

/* Apply styles when media is muted. */
media-mute-button[data-volume='muted'] {
}

/* Apply styles when media is _not_ muted. */
media-mute-button:not([data-volume='muted']) {
}

/* Apply styles when media volume is low (0% < x < 50%). */
media-mute-button[data-volume='low'] {
}

/* Apply styles when media volume is high (≥50%). */
media-mute-button[data-volume='high'] {
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
media-mute-button {
  /* box shadow */
  --media-focus-ring: 0 0 0 4px rgb(78 156 246);
}

/* Apply styles when focused via keyboard. */
media-mute-button[data-focus] {
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
