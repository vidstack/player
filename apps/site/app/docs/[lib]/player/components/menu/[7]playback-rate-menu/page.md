---
title: Playback Rate Menu
description: Display menu options to the user so they can change the current playback rate.
---

## Usage

The playback rate menu components handle rendering playback rate options
as radio buttons and updating the player when a rate is selected. It can be used standalone
or as a submenu.

{% code_preview name="usage" size="large" copyHighlight=true highlight="html:6-9|react:15-21" /%}

## Custom Button

A custom playback rate menu button can be provided like so:

{% code_snippet name="custom-button" copyHighlight=true highlight="html:2-8|react:2-8" /%}

## Styling

```css {% copy=true %}
/* Apply styles to menu container. */
media-menu {
}

/* Apply styles to button when menu is open. */
media-playback-rate-menu-button[aria-expanded='true'] {
}

/* Apply styles to default back arrow icon. */
media-playback-rate-menu-button [slot='close-icon'] {
}

/* Apply styles to default icon. */
media-playback-rate-menu-button [slot='icon'] {
}

/* Apply styles to default label text. */
media-playback-rate-menu-button [slot='label'] {
}

/* Apply styles to default hint text. */
media-playback-rate-menu-button [slot='hint'] {
}

/* Apply styles to default open chevron icon. */
media-playback-rate-menu-button [slot='open-icon'] {
}

/* Apply styles to floating panel when menu is open. */
media-playback-rate-menu-items[aria-hidden='false'] {
}

/* Apply styles to checked radio item. */
media-playback-rate-menu-items media-radio[aria-checked='true'] {
}
media-playback-rate-menu-items media-radio[aria-checked='true'] [part='check'] {
}
```

### Focus

```css
media-playback-rate-menu-button[data-focus] {
}

media-playback-rate-menu-items media-radio[data-focus] {
}
```

### CSS Variables

See the [menu CSS variables](/docs/player/components/menu/menu#css-variables) for simple
customization of the default menu styles.

## Tailwind

{% code_snippet name="tailwind" copy=true /%}
