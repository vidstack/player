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

## Tooltips

[Tooltips](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Roles/tooltip_role) can
be provided like so:

{% code_preview name="tooltips" size="small" copyHighlight=true highlight="react:3-" /%}

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

/* Apply styles when media seeking is not permitted (e.g., live stream). */
media-seek-button[aria-hidden='true'] {
}

/* Style default icons. */
media-seek-button svg[slot='backward'] {
}
media-seek-button svg[slot='forward'] {
}
```

### Focus

```css {% copy=true %}
media-seek-button {
  /* box shadow */
  --media-focus-ring: 0 0 0 4px rgb(78 156 246);
}

/* Apply styles when focused via keyboard. */
media-seek-button[data-focus] {
}
```

### CSS Variables

See the [toggle button CSS variables](/docs/player/components/buttons/toggle-button#css-variables)
for simple customization of the default button and tooltip styles.

## Tailwind

The following is a headless example using Tailwind:

{% code_snippet name="tailwind" copyHighlight=true highlight="react:4-" /%}

### Tooltips

The following extends the example above with tooltips:

{% code_snippet name="tailwind-tooltips" copyHighlight=true highlight="react:4-" /%}
