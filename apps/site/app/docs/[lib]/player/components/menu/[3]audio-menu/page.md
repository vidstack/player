---
title: Audio Menu
description: Display menu options to the user so they can change the current audio track.
---

## Usage

The audio menu components handle rendering the current audio track options as radio buttons and
updating the player when a track is selected. The menu will be disabled if there no tracks. It
can be used standalone or as a submenu.

{% code_preview name="usage" size="large" copyHighlight=true highlight="html:6-9|react:8-11" /%}

## Custom Button

A custom audio menu button can be provided like so:

{% code_snippet name="custom-button" copyHighlight=true highlight="html:2-8|react:2-8" /%}

## Styling

```css {% copy=true %}
/* Apply styles to menu container. */
media-menu {
}

/* Apply styles to button when menu is open. */
media-audio-menu-button[aria-expanded='true'] {
}

/* Apply styles to default back arrow icon. */
media-audio-menu-button [slot='close-icon'] {
}

/* Apply styles to default icon. */
media-audio-menu-button [slot='icon'] {
}

/* Apply styles to default label text. */
media-audio-menu-button [slot='label'] {
}

/* Apply styles to default hint text. */
media-audio-menu-button [slot='hint'] {
}

/* Apply styles to default open chevron icon. */
media-audio-menu-button [slot='open-icon'] {
}

/* Apply styles to floating panel when menu is open. */
media-audio-menu-items[aria-hidden='false'] {
}

/* Apply styles to checked radio item. */
media-audio-menu-items media-radio[aria-checked='true'] {
}
media-audio-menu-items media-radio[aria-checked='true'] [part='check'] {
}
```

### Focus

```css
media-audio-menu-button[data-focus] {
}

media-audio-menu-items media-radio[data-focus] {
}
```

### CSS Variables

See the [menu CSS variables](/docs/player/components/menu/menu#css-variables) for simple
customization of the default menu styles.

## Tailwind

{% code_snippet name="tailwind" copy=true /%}
