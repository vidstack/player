---
description: This component is used to enter and exit picture-in-picture mode.
---

## Usage

The `$tag:media-pip-button` component will toggle the picture-in-picture (PIP) mode of media as it's
pressed by dispatching a `media-enter-pip-request`, and `media-exit-pip-request`
event to the player.

{% code_preview name="usage" copyHighlight=true highlight="html:3|react:6" /%}

{% callout type="danger" %}
The `aria-hidden='true'` attribute will be present on this element in the event PIP cannot be
requested (not supported by environment or provider). The button's `display` property will be
set to `none`, so it'll be removed from the layout; therefore, you should account for the button
not being displayed in your design.
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
media-pip-button {
  color: pink;
  transition: opacity 0.2s ease-in;
}

/* Apply styles when media is in PIP mode. */
media-pip-button[data-pip] {
}

/* Apply styles when media is _not_ in PIP mode. */
media-pip-button:not([data-pip]) {
}

/* Apply styles when pip is not supported. */
media-pip-button[aria-hidden='true'] {
}

/* Style default icons. */
media-pip-button svg[slot='enter'] {
}
media-pip-button svg[slot='exit'] {
}
```

### Focus

```css {% copy=true %}
media-pip-button {
  /* box shadow */
  --media-focus-ring: 0 0 0 4px rgb(78 156 246);
}

/* Apply styles when focused via keyboard. */
media-pip-button[data-focus] {
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

{% code_snippet name="tailwind-tooltips" copyHighlight=true highlight="react:8-" /%}
