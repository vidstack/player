---
title: Menu
description: This component is used to display options in a floating panel.
---

## Usage

Menu components consist of an accessible button `$tag:media-menu-button` and floating panel
of items `$tag:media-menu-items` with complete keyboard support. Menus can be used to
display player settings or auxiliary options to the user. Other menus such as `$tag:media-quality-menu` and `$tag:media-captions-menu` extend these menu components with additional features.

The menu will be displayed as a popup menu from the bottom of the screen on mobile (`<480px`
viewport width), or if a coarse pointer device (e.g., touch) input is detected and orientation
is landscape.

{% code_preview name="usage" copyHighlight=true highlight="react:4-" /%}

## Menu Position

When using the default styles, the menu can be positioned using the `position` property like
so:

{% code_snippet name="position" copy=true /%}

Valid position values include: `top`, `bottom`, `top left`, and `bottom left`.

## Button Slots

The menu button accepts an `open` and `close` slot for displaying content when the respective
menu state is active:

{% code_snippet name="button-slots" copy=true /%}

## Button Tooltip

[Tooltips](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Roles/tooltip_role) can
be provided like so:

{% code_snippet name="button-tooltip" copy=true /%}

## Rotate Icon

The `data-rotate` attribute can be added to an icon so it rotates when the menu button is pressed:

{% code_snippet name="rotate" copy=true  /%}

You can configure the rotation degrees using CSS like so:

```css
media-menu {
  --media-menu-button-icon-rotate-deg: 90deg;
}
```

## Close Target

Any element with the `slot="close-target"` attribute inside the menu on press will close the menu:

{% code_snippet name="close-target" highlight="html:4|react:4-6" /%}

## Menu Items

Menu items are generally radio groups or submenus (nested `$tag:media-menu` components).
However, you can provide other types of menu items such as links by setting the
`role="menuitem"` and `tabindex="-1"` attribute on elements like so:

{% code_snippet name="menu-items" highlight="html:5,8,11-13,16-18|react:5-7,10,13,16" /%}

## Submenus

Menu components can be nested inside each other to create submenus like so:

{% code_snippet name="submenus" copyHighlight=true highlight="html:6-16|react:10-" /%}

## Styling

```css {% copy=true %}
/* Apply styles to menu container. */
media-menu {
}

/* Apply styles to menu button when open. */
media-menu-button[aria-expanded='true'] {
}

/* Apply styles to menu floating panel when open. */
media-menu-items[aria-hidden='false'] {
}

/* Apply styles to submenus. */
media-menu-items[data-submenu] {
}

/* Apply styles to submenu when it's open. */
media-menu-items[data-submenu][aria-hidden='false'] {
}

/* Apply styles to menu items and radios. */
media-menu [role='menuitem'],
media-menu [role='menuitemradio'] {
}

/* Apply styles to checked radio items. */
media-menu [role='menuitemradio'][aria-checked='true'] {
}
media-menu [role='menuitemradio'][aria-checked='true'] [part='check'] {
}
```

### Focus

```css {% copy=true %}
media-menu {
  /* Style menu item focus ring. */
  --media-focus-ring: 0 0 0 3px rgb(78 156 246);
}

/* Apply styles to focused menu button. */
media-menu-button[data-focus] {
}

/* Apply styles to focused menu items. */
media-menu [role='menuitem'][data-focus],
media-menu [role='menuitemradio'][data-focus] {
}
```

### CSS Variables

The following snippet contains a complete list of CSS variables and their default values. Any of
the variables can be set to adjust the default menu styles:

```css {% copy=true %}
media-player {
  --media-menu-bg: rgb(10 10 10 / 0.95);
  --media-menu-padding: 10px;
  --media-menu-border: 1px solid rgb(255 255 255 / 0.1);
  --media-menu-border-radius: 8px;
  --media-menu-font-size: 15px;
  --media-menu-font-weight: 500;
  --media-menu-scrollbar-track-bg: rgb(245 245 245 / 0.08);
  --media-menu-scrollbar-thumb-bg: rgb(245 245 245 / 0.1);
  --media-menu-x-offset: 4px;
  --media-menu-y-offset: 4px;
  --media-menu-hint-color: rgba(245, 245, 245, 0.5);
  --media-menu-min-width: 260px;
  --media-menu-max-height: calc(var(--media-height) * 0.7);
  --media-menu-box-shadow: 1px 1px 1px rgb(10 10 10 / 0.5);

  --media-menu-button-icon-rotate-deg: 90deg;

  --media-menu-divider: 1px solid rgb(245 245 245 /0.15);

  --media-mobile-menu-max-height: 40vh;
  --media-mobile-menu-landscape-max-height: 70vh;

  --media-menu-top-bar-bg: rgb(10 10 10);

  /* menu items */
  --media-menu-item-color: #f5f5f5;
  --media-menu-item-border-radius: 2px;
  --media-menu-item-padding: 12px;
  --media-menu-item-hover-bg: rgb(245 245 245 / 0.08);
  --media-menu-item-icon-size: 22px;

  --media-mobile-menu-item-padding: 12px;

  /* radios */
  --media-menu-radio-check-size: 10px;
  --media-menu-radio-check-inner-size: 4px;
  --media-menu-radio-check-border: 2px solid rgb(245 245 245 / 0.5);
  --media-menu-radio-check-active-color: #f5f5f5;
  --media-menu-radio-check-active-border: 2px solid #f5f5f5;
}
```

## Tailwind

{% code_snippet name="tailwind" copy=true /%}
