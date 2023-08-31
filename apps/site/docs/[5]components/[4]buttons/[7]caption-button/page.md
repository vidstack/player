---
description: This component is used to toggle the visibility of the current captions text track.
---

## Usage

The `$tag:media-caption-button` component will toggle the `mode` of the current captions text track
when pressed by dispatching a `media-text-track-change-request` event to the player. The mode will
toggle between `showing` and `disabled`.

{% code_preview name="usage" copyHighlight=true highlight="html:3|react:6" /%}

{% callout type="danger" %}
The `aria-hidden='true'` attribute will be present on this element in the event no text tracks with a
kind of `captions` or `subtitles` exists. The button's `display` property will be set to `none`,
so it'll be removed from the layout; therefore, you should account for the button not being
displayed in your design.
{% /callout %}

## Key Shortcuts

Keyboard shortcuts can be specified either through the
[global key shortcuts](/docs/player/core-concepts/keyboard#configuring-shortcuts) config, or on the
component like so:

{% code_snippet name="key-shortcuts" /%}

👉 See the [`aria-keyshortcuts`](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Attributes/aria-keyshortcuts)
docs for more information.

## Custom Icons

Here's an example containing a custom enter and exit icon:

{% code_snippet name="custom-icons" copyHighlight=true highlight="react:3-" /%}

## Tooltips

[Tooltips](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Roles/tooltip_role) can
be provided like so:

{% code_preview name="tooltips" size="small" copyHighlight=true highlight="react:3-" /%}

## Styling

You can override the default styles with CSS like so:

```css {% copy=true %}
media-caption-button {
  color: pink;
  transition: opacity 0.2s ease-in;
}

/* Apply styles when captions is on. */
media-caption-button[data-pressed] {
}

/* Apply styles when captions is _not_ on. */
media-caption-button:not([data-pressed]) {
}

/* Apply styles when captions is not supported. */
media-caption-button[aria-hidden='true'] {
}

/* Style default icons. */
media-caption-button svg[slot='on'] {
}
media-caption-button svg[slot='off'] {
}
```

### Focus

```css {% copy=true %}
media-caption-button {
  /* box shadow */
  --media-focus-ring: 0 0 0 4px rgb(78 156 246);
}

/* Apply styles when focused via keyboard. */
media-caption-button[data-focus] {
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
