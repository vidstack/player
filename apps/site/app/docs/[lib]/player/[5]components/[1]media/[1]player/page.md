---
title: Player
description: This is the top-most component in the library used to group media elements and control the flow of media state.
---

## Usage

All media elements exist inside the `$tag:media-player` component. It's main jobs are to manage
media state, dispatch media events, satisfy media requests, and expose media state through HTML
attributes and CSS properties for styling purposes.

{% code_snippet name="usage" copy=true  /%}

Most of the information you need for working with the player can be found in the **Core Concepts**
section. Here's a few important links to get you started:

- The [loading section](/docs/player/core-concepts/loading) contains information on how to
  avoid layout shifts, apply loading strategies, load media sources, and set up providers.
- Provider guides such as this one for [HLS](/docs/player/providers/hls) contain important
  information on how to set them up and use them.
- The [state management](/docs/player/core-concepts/state-management) section will guide you on
  reading/subscribing to media state, and updating it.
- The [events guide](/docs/player/core-concepts/events) will explain how to use events and
  teach foundational concepts such as requests and triggers.
- The [media outlet](/docs/player/components/layout/outlet) plays an vital role in rendering,
  it's best to understand it before designing your player.
- The [styling guide](/docs/player/core-concepts/styling) is a complete introduction to
  styling elements and components within the player.
- Finally, the [API reference](/docs/player/components/media/player/api) contains
  all the details you need about the player such as the properties, methods, and events available.

## Connect Event

The `<media-player>` element will fire a `media-player-connect` event that will bubble up the
DOM so you can obtain a reference to it when it's ready:

{% code_snippet name="connect-event" copy=true  /%}

## Media Store

👉 See [State Management](/docs/player/core-concepts/state-management) docs for more information.

{% code_snippet name="media-store" copy=true  /%}

## Data Attributes

All media data attributes that are set on the `<media-player>` element that can be used
for styling with CSS:

```css
/* Example: apply styles when media is playing. */
media-player[data-playing] {
}
```

{% component this="../../../[2]core-concepts/.tables/attrs-table.md" /%}

## Breakpoints

The following data attributes are set to help with styling the player at certain sizes:

- `data-bp-x`: Horizontal breakpoint that updates based on the player width.
- `data-bp-y`: Vertical breakpoint that updates based on the player height.

You can then use CSS to style the player and children based on the current breakpoint:

```css
/* width <600px */
media-player[data-bp-x='sm'] {
}

/* 600px ≤ width < 980 */
media-player[data-bp-x='md'] {
}

/* width ≥ 980 */
media-player[data-bp-x='lg'] {
}

/* height <380px */
media-player[data-bp-y='sm'] {
}

/* 380px ≤ height < 600 */
media-player[data-bp-y='md'] {
}

/* height ≥ 600 */
media-player[data-bp-y='lg'] {
}
```

You can customize the default breakpoints like so:

{% code_snippet name="breakpoints" /%}
