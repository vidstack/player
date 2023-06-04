---
title: Quality Menu
description: Display menu options to the user so they can change the current video quality.
---

## Usage

The quality menu components handle rendering the current video quality options
as radio buttons and updating the player when a quality is selected. The menu will be
disabled if qualities are not available for the current media. It can be used standalone
or as a submenu.

{% code_preview name="usage" size="large" copyHighlight=true highlight="html:6-9|react:15-18" /%}

## Custom Button

A custom quality menu button can be provided like so:

{% code_snippet name="custom-button" copyHighlight=true highlight="html:2-8|react:2-8" /%}

## Styling

```css {% copy=true %}
/* Apply styles to menu container. */
media-menu {
}

/* Apply styles to button when menu is open. */
media-quality-menu-button[aria-expanded='true'] {
}

/* Apply styles to default back arrow icon. */
media-quality-menu-button [slot='close-icon'] {
}

/* Apply styles to default icon. */
media-quality-menu-button [slot='icon'] {
}

/* Apply styles to default label text. */
media-quality-menu-button [slot='label'] {
}

/* Apply styles to default hint text. */
media-quality-menu-button [slot='hint'] {
}

/* Apply styles to default open chevron icon. */
media-quality-menu-button [slot='open-icon'] {
}

/* Apply styles to floating panel when menu is open. */
media-quality-menu-items[aria-hidden='false'] {
}

/* Apply styles to checked radio item. */
media-quality-menu-items media-radio[aria-checked='true'] {
}
media-quality-menu-items media-radio[aria-checked='true'] [part='check'] {
}
```

### Focus

```css
media-quality-menu-button[data-focus] {
}

media-quality-menu-items media-radio[data-focus] {
}
```

### CSS Variables

See the [menu CSS variables](/docs/player/components/menu/menu#css-variables) for simple
customization of the default menu styles.

## Tailwind

{% code_snippet name="tailwind" copy=true /%}
