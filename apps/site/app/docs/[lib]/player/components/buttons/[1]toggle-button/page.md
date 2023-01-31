---
description: This component is a generic button for displaying on and off states.
---

## Usage

The `$tag:media-toggle-button` component is a generic toggle that can be used to display
on (pressed) and off (not-pressed) states.

{% code_preview name="usage" size="xsmall" copy=true /%}

By default, the toggle will start in the off (not-pressed) state. You can start in the on state
(pressed) like so:

{% code_snippet name="default-pressed" /%}

## Styling

You can override the default styles with CSS like so:

```css
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
