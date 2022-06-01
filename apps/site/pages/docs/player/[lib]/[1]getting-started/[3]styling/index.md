---
title: 'Styling - Custom'
description: Introduction to custom styling with Vidstack Player.
---

In this section, we'll cover the basics on how you can easily put together a custom UI with
Vidstack Player.

## Introduction

All UI elements in the library are headless, meaning they contain no styling out of the box. It's
up to you how they look, as they only provide some core functionality. For example,
the `$tag:vds-play-button` component will dispatch play and pause requests when pressed, but other than
that, it is completely blank.

The player exposes media state as attributes and CSS variables on the `<vds-media>` element (aka
`<Media>` component):

```html
<vds-media
  paused
  seeking
  waiting
  can-load
  can-play
  ...
  style="--vds-current-time: 500; --vds-duration: 1000; ..."
>
  <!-- ... -->
</vds-media>
```

You can use the presence and absence of these attributes to style children of the
`<vds-media>` element with CSS. Here's a quick example where we add a controls container and
hide it based on some media state:

{% code_snippet name="intro" highlight="html:2-4|react:6" /%}

```css {% title="player.css" copy=true %}
.media-controls {
  display: flex;
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  min-height: 48px;
  opacity: 1;
  transition: opacity ease 300ms;
  /* Position above media provider. */
  z-index: 1;
}

/* Avoid double controls on iOS when in fullscreen. */
vds-media[hide-ui] .media-controls {
  opacity: 0;
  visibility: hidden;
}

/*
 * Hide controls if either user is idle, or media is not
 * ready for playback.
 */
vds-media[user-idle] .media-controls,
vds-media:not([can-play]) .media-controls {
  opacity: 0;
}
```

[`[attr]`](https://developer.mozilla.org/en-US/docs/Web/CSS/Attribute_selectors) selects
elements based on the presence or value of an attribute, and the [`:not()`](https://developer.mozilla.org/en-US/docs/Web/CSS/:not)
pseudo-class represents elements that do _not_ match a list of selectors. We can combine these to
create powerful selectors based on the media state being exposed and updated on the
`<vds-media>` element.

## Media Attributes

Here's a reference table that displays all the media attributes that are set on the `<vds-media>`
element.

{% component file="./_tables/attrs-table.md" /%}

## Media CSS Variables

Here's a reference table that displays all the media CSS variables that are set on the `<vds-media>`
element.

{% component file="./_tables/vars-table.md" /%}
