---
title: Basics
description: Introduction to styling with Vidstack Player.
---

# {% $frontmatter.title %}

In this section, we'll cover the basics on how you can style elements with CSS based on specific
media states.

## Introduction

The player exposes media state as attributes and CSS variables on the `<vds-media>` element:

```html
<vds-media
  paused
  seeking
  waiting
  can-load
  can-play
  ...
  style="--media-current-time: 500; --media-duration: 1000; ..."
>
  <!-- ... -->
</vds-media>
```

You can use the presence and absence of these attributes to style children of the
`<vds-media>` element with CSS. Here's a few simple examples:

```css {% title="player.css" copy=true %}
/* Apply styles to .foo class when media is paused. */
vds-media[paused] .foo {
}

/* Apply styles to .bar class when media is _not_ paused. */
vds-media:not([paused]) .bar {
}

/** Scale the .baz class based on the % of playback progress. */
.baz {
  transform-origin: left;
  transform: scaleX(calc(var(--media-current-time) / var(--media-duration)));
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

{% component this="../.tables/attrs-table.md" /%}

## Media CSS Variables

Here's a reference table that displays all the media CSS variables that are set on the `<vds-media>`
element.

{% component this="../.tables/vars-table.md" /%}
