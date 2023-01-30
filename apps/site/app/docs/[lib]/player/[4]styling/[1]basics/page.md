---
title: Basics
description: Introduction to styling with Vidstack Player.
---

# {% $frontmatter.title %}

In this section, we'll cover the basics on how you can style elements with CSS based on specific
media states.

## Introduction

The player exposes media state as attributes and CSS variables on the `<media-player>` element:

```html
<media-player
  paused
  seeking
  waiting
  can-load
  can-play
  ...
  style="--media-current-time: 500; --media-duration: 1000; ..."
>
  <!-- ... -->
</media-player>
```

You can use the presence and absence of these attributes to style children of the
`<media-player>` element with CSS. Here's a few simple examples:

```css {% title="player.css" copy=true %}
/* Apply styles to .foo class when media is paused. */
media-player[paused] .foo {
}

/* Apply styles to .bar class when media is _not_ paused. */
media-player:not([paused]) .bar {
}

/** Scale the .baz class based on the % of playback progress. */
.baz {
  transform-origin: left;
  transform: scaleX(calc(var(--media-current-time) / var(--media-duration)));
  will-change: transform;
}
```

[`[attr]`](https://developer.mozilla.org/en-US/docs/Web/CSS/Attribute_selectors) selects
elements based on the presence or value of an attribute, and the [`:not()`](https://developer.mozilla.org/en-US/docs/Web/CSS/:not)
pseudo-class represents elements that do _not_ match a list of selectors. We can combine these to
create powerful selectors based on the media state being exposed and updated on the `<media-player>`
element.

## Media Attributes

Here's a reference table that displays all the media attributes that are set on the `<media-player>`
element.

{% component this="../.tables/attrs-table.md" /%}

## Media CSS Variables

Here's a reference table that displays all the media CSS variables that are set on the `<media-player>`
element.

{% component this="../.tables/vars-table.md" /%}
