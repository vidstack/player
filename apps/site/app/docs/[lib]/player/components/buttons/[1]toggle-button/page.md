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

## Styling

You can override the default styles with CSS like so:

```css {% copy=true %}
media-toggle-button {
  transition: opacity 0.2s ease-in;
}

/* Apply styles when pressed. */
media-toggle-button[pressed] {
}

/* Apply styles when _not_ pressed. */
media-toggle-button:not([pressed]) {
}
```

### Focus

```css {% copy=true %}
/* Apply styles when focused via keyboard. */
media-toggle-button:focus-visible {
  outline: 1px auto purple;
}

/* Polyfill applies this class. */
media-toggle-button.focus-visible {
  outline: 1px auto purple;
}
```

## Tailwind

The following is a headless example using Tailwind:

{% code_snippet name="tailwind" copyHighlight=true highlight="react:3-" /%}
