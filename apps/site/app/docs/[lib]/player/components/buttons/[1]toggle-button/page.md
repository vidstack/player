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
media-toggle-button {
  /* box shadow */
  --media-focus-ring: 0 0 0 4px rgb(78 156 246);
}

/* Apply styles when focused via keyboard. */
media-toggle-button[data-focus] {
}
```

### CSS Variables

The following snippet contains a complete list of CSS variables and their default values. Any
of the variables can be set to adjust the default button and tooltip styles:

```css {% copy=true %}
media-player {
  --media-button-color: #f5f5f5;
  --media-button-border-radius: 0;
  --media-button-size: 48px;
  --media-button-hover-transform: scale(1.1);

  --media-button-icon-size: 66.66%;
  --media-button-icon-border-radius: 2px;

  --media-tooltip-font-size: 13px;
  --media-tooltip-font-weight: 500;
  --media-tooltip-color: hsl(0, 0%, 80%);
  --media-tooltip-bg-color: black;
  --media-tooltip-padding: 2.5px 8px;
  --media-tooltip-border-radius: 2px;
  --media-tooltip-x-offset: 8px;
  --media-tooltip-y-offset: 8px;
}
```

## Tailwind

The following is a headless example using Tailwind:

{% code_snippet name="tailwind" copyHighlight=true highlight="react:3-" /%}

### Tooltips

The following extends the example above with tooltips:

{% code_snippet name="tailwind-tooltips" copyHighlight=true highlight="react:3-" /%}
