---
title: References
description: Handy styling references when working with Vidstack Player.
---

# {% $frontmatter.title %}

In this section, we've included handy tables that you can use as reference when styiling media
elements or components.

## Media Attributes

Here's a reference table that displays all the media attributes that are set on the `<media-player>`
element:

```html
<!-- Media attributes are reflected by the player. -->
<media-player can-play paused ...></media-player>
```

{% component this="../.tables/attrs-table.md" /%}

## Media CSS Variables

Here's a reference table that displays all the media CSS variables that are set on the `<media-player>`
element:

```html
<!-- Media CSS variables are set by the player. -->
<media-player style="--media-current-time: 100; ..."></media-player>
```

{% component this="../.tables/vars-table.md" /%}
