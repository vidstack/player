---
description: This component is a generic button for displaying on and off states.
---

## Usage

The `$tag:media-toggle-button` component is a generic toggle that can be used to display
on (pressed) and off (not-pressed) states.

{% code_preview name="usage" size="xsmall" copyHighlight=true highlight="react:3-" /%}

By default, the toggle will start in the off (not-pressed) state. You can start in the on state
(pressed) like so:

{% code_snippet name="default-pressed" /%}

## Tooltips

[Tooltips](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Roles/tooltip_role) can
be provided like so:

{% code_preview name="tooltips" size="small" copyHighlight=true highlight="react:3-" /%}

## Styling

You can override the default styles with CSS like so:

```css {% copy=true %}
media-toggle-button {
  transition: opacity 0.2s ease-in;
}

/* Apply styles when pressed. */
media-toggle-button[data-pressed] {
}

/* Apply styles when _not_ pressed. */
media-toggle-button:not([data-pressed]) {
}
```

### Focus

```css {% copy=true %}
/* Apply styles when focused via keyboard. */
media-toggle-button[data-focus] {
  outline: 3px solid blue;
}
```

## Tailwind

The following is a headless example using Tailwind:

{% code_snippet name="tailwind" copyHighlight=true highlight="react:3-" /%}

### Tooltips

The following extends the example above with tooltips:

{% code_snippet name="tailwind-tooltips" copyHighlight=true highlight="react:3-" /%}
