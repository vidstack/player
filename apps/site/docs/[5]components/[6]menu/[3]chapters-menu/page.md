---
title: Chapters Menu
description: This component is used to display chapters inside of a menu.
---

## Usage

{% code_preview name="usage" size="large" copyHighlight=true highlight="react:4-" /%}

## Chapters Track

Chapters are set by providing a [WebVTT](https://developer.mozilla.org/en-US/docs/Web/API/WebVTT_API)
file that specifies the time ranges and respective chapter titles. It should look something like this:

```js
WEBVTT

00:00 --> 00:24
Operation Start

00:24 --> 01:14
Barbershop

...
```

The chapters menu will display the currently active text track with a kind of `chapters`. It can
be provided like so:

{% code_snippet name="track" highlight="html:3|react:3" /%}

## Thumbnails

The chapters menu will automatically display thumbnails next to chapter items when the
`thumbnails` property has been set on the player. See the docs on how to correctly set up the
[thumbnails VTT file](/docs/player/components/display/thumbnail#webvtt).

{% code_snippet name="thumbnails" highlight="1" /%}

## Styling

```css {% copy=true %}
media-chapters-menu-items {
}

/* Apply styles when there are thumbnails. */
media-chapters-menu-items[data-thumbnails] {
}

media-chapters-menu-items [part='chapter'] {
}

media-chapters-menu-items [part='chapter'][data-focus] {
}

media-chapters-menu-items [part='chapter'][aria-checked='true'] {
}

media-chapters-menu-items [part='thumbnail'] {
}

media-chapters-menu-items [part='content'] {
}

media-chapters-menu-items [part='title'] {
}

media-chapters-menu-items [part='start-time'] {
}

media-chapters-menu-items [part='duration'] {
}
```

### CSS Variables

See the [menu CSS variables](/docs/player/components/menu/menu#css-variables) for simple
customization of the default menu styles.

The following snippet contains a complete list of CSS variables and their default values. Any of
the variables can be set to adjust the default chapters menu styles:

```css {% copy=true %}
media-player {
  --media-chapters-padding: 0;
  --media-chapters-min-width: var(--media-menu-min-width);
  --media-chapters-with-thumbnails-min-width: 300px;
  --media-chapters-divider: 1px solid rgb(245 245 245 /0.15);

  /* menu item */
  --media-chapters-item-focus-margin: 4px;
  --media-chapters-item-active-border-left: unset;
  --media-chapters-item-active-bg: rgb(255 255 255 / 0.04);

  /* progress */
  --media-chapters-progress-height: 3px;
  --media-chapters-progress-bg: #f5f5f5;
  --media-chapters-progress-border-radius: 0;

  /* thumbnail */
  --media-chapters-thumbnail-gap: 12px;
  --media-chapters-thumbnail-border: 0;
  --media-chapters-thumbnail-min-width: 100px;
  --media-chapters-thumbnail-min-height: 56px;
  --media-chapters-thumbnail-max-width: 120px;
  --media-chapters-thumbnail-max-height: 68px;

  /* title */
  --media-chapters-title-color: #f5f5f5;
  --media-chapters-title-font-size: 15px;
  --media-chapters-title-font-weight: 500;
  --media-chapters-title-white-space: nowrap;

  /* start time */
  --media-chapters-start-time-padding: 1px 4px;
  --media-chapters-start-time-letter-spacing: 0.4px;
  --media-chapters-start-time-border-radius: 2px;
  --media-chapters-start-time-color: rgb(168, 169, 171);
  --media-chapters-start-time-font-size: 12px;
  --media-chapters-start-time-font-weight: 500;
  --media-chapters-start-time-bg: rgb(156 163 175 / 0.2);
  --media-chapters-start-time-gap: 6px;

  /* duration */
  --media-chapters-duration-color: rgb(245 245 245 / 0.5);
  --media-chapters-duration-bg: unset;
  --media-chapters-duration-gap: 6px;
  --media-chapters-duration-font-size: 12px;
  --media-chapters-duration-font-weight: 500;
  --media-chapters-duration-border-radius: 2px;
}
```

## Tailwind

{% code_snippet name="tailwind" copy=true /%}
