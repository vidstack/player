---
title: Styling
description: Introduction to styling with Vidstack Player.
---

# {% $frontmatter.title %}

In this section, we'll cover the basics on how you can style DOM elements and components in this
library with CSS.

## Styling Elements

Vidstack Player enables styling _any child element_ of the player with CSS based on the current
media state. This is made possible by exposing media state as data attributes on
the `<media-player>` element like so:

```html
<!-- These attrs are reflected by the player. -->
<media-player data-paused data-seeking data-waiting data-can-load data-can-play ...>
  <!-- Style child elements with CSS based on media state above. -->
</media-player>
```

You can use the presence and/or absence of these media data attributes to style children of the
`<media-player>` element with CSS. Here's a few simple examples:

```css {% title="player.css" copy=true %}
/* Apply styles to `foo` class when media is paused. */
media-player[data-paused] .foo {
}

/* Apply styles to `bar` class when media is _not_ paused. */
media-player:not([data-paused]) .bar {
}
```

{% callout type="info" %}
See our [media attributes](/docs/player/components/media/player#data-attributes) reference table
for a complete list with descriptions.
{% /callout %}

The [`[attr]`](https://developer.mozilla.org/en-US/docs/Web/CSS/Attribute_selectors) selector will
select elements based on the presence or value of an attribute, and the
[`:not()`](https://developer.mozilla.org/en-US/docs/Web/CSS/:not) pseudo-class represents
elements that do _not_ match a list of selectors. You can combine attributes and selectors to
express newer and more powerful conditional selectors like so:

```css {% title="player.css" copy=true %}
/* AND conditional style. */
/* Apply styles when media playback has ended and user is idle. */
media-player[data-user-idle][data-ended] {
}

/* OR conditional style. */
/* Apply styles if media is not ready for playback or it's buffering. */
media-player:not([data-can-play]),
media-player[data-waiting] {
}
```

Styling elements in the ways we've seen thus far is used and applied throughout the entire library.
You'll regularly reach for these techniques when building your own media UI elements or customizing
player components provided by us. In the next section, we'll look at a variety of ways you can
style media components.

## Styling Components

All components in Vidstack are built as [Custom Elements](https://developer.mozilla.org/en-US/docs/Web/Web_Components/Using_custom_elements). All of our framework integrations will also register and render custom
elements under the hood. This means you can style them just as you would any other another DOM
element - see [Styling Elements](#styling-elements) for an introduction.

```html
<!-- This is just a good old DOM element! -->
<media-player></media-player>
<!-- Framework integration will also render the above ^ -->
<MediaPlayer></MediaPlayer>
```

### Defaults or Headless?

You can either decide to use our components completely unstyled (i.e., [headless](#headless)) or
import our [default styles](#default-styles) to get moving quickly.

Keep in mind that there's many ways to easily customize our components even if you decide to use the
default styles. Before you decide, check out the [customizing](#customizing) section, and
browse the docs for each component to see if the defaults are flexible enough for your needs. If
you'd still prefer building from scratch then head over to the [headless](#headless) section.

### Default Styles

To speed up development, we provide default styles out of the box for all components which
can be imported like so:

```js {% copy=true %}
import 'vidstack/styles/defaults.css';
```

You can also individually import only the styles you need like so:

```js {% copy=true %}
import 'vidstack/styles/base.css';
import 'vidstack/styles/ui/buttons.css';
import 'vidstack/styles/ui/buffering.css';
import 'vidstack/styles/ui/captions.css';
import 'vidstack/styles/ui/tooltips.css';
import 'vidstack/styles/ui/live.css';
import 'vidstack/styles/ui/sliders.css';
import 'vidstack/styles/ui/menus.css';
```

#### `vidstack/styles/base.css`

Custom Elements have absolutely no styling by default including display or position properties.
This makes them awkward to work with out of the box. Our base styles provide the very basics such
as `display`, `position`, and `:focus` styles. We strongly recommend you include this file.

#### `vidstack/styles/ui/*`

The styles located in the `styles/ui` directory contains default styles for all components
organized by role (e.g., `buttons.css` or `sliders.css`). This includes: basic color,
sizing buttons, positioning icons, size/position of track/thumb for sliders, and more.
Include these files if you don't want to spend time building components from scratch.

### Customizing

Our components have been designed to be extremely easy to customize. Here's all the ways you
can customize them:

#### CSS Overrides

Our components _don't_ use Shadow DOM. Firstly, this is to ensure our library can SSR and load
without a flash of unstyled content (FOUC). The second reason is so you can easily target any
element within the `<media-player>` with CSS and override styles.

```css
/* Select and override anything inside the player! */

media-player {
  /* ... */
}

media-player video {
  /* ... */
}

media-play-button svg {
  /* ... */
}
```

#### Slots

Slots enable easily replacing parts of an existing component. Unlike traditional slots used
with Shadow DOM, you can use CSS to override our internal slot styles:

{% code_snippets name="slots" css=true /%}

#### Parts

Parts enable easily targeting and applying/overriding styles to specific child elements with CSS:

```css
media-time-slider [part='track'] {
  /* ... */
}

media-time-slider [part='track-fill'] {
  /* ... */
}

media-time-slider [part='thumb'] {
  /* ... */
}
```

#### CSS Variables

[CSS variables](https://developer.mozilla.org/en-US/docs/Web/CSS/Using_CSS_custom_properties)
enable easily setting specific key properties of a component:

```css
media-time-slider {
  --media-slider-height: 48px;
  --media-slider-thumb-size: 15px;
  --media-slider-track-height: 5px;
  /* ... */
}
```

Refer to each component's docs to find out what slots, parts, and CSS variables are available for
customization. For now, you can head down to the "[What's Next](#what-s-next)" section to find out
what some good next steps are.

### Headless

The headless option is best when you want completely unstyled components. This particularly handy
when working with [Tailwind](docs/player/core-concepts/tailwind) as you can copy/paste examples from
our docs and adjust as desired. Do note that components will still be fully-accessible and
perform their expected function (e.g., the play button will toggle media playback) - they'll
just be unstyled.

However, it's also important to know that our components and their parts are styled
to be extremely flexible and [easy to override](#customizing), so the default styles are still a
great option even when using Tailwind.

If you decide to go headless, we recommend only importing the base styles like so:

```js {% copy=true %}
import 'vidstack/styles/base.css';
```

Here's a crude example on how it might look styling a play button from scratch:

{% code_snippets name="headless" css=true /%}

Refer to each component's docs to learn more about styling them headless.

## What's Next?

Now that you've familiarized yourself with how styling elements and components works, you can start
building! The best place is to start with styling any of the following:

- [`$tag:media-player`](/docs/player/components/layout/player): The player is responsive by default
  but you might want to set a specific width or aspect ratio to prevent layout shifts.
- [`$tag:media-outlet`](/docs/player/components/layout/outlet): Generally the outlet can be left
  as-is, but it is important you understand what role it plays in your design.
- [Controls](/docs/player/components/layout/outlet) is a great place to start as most media
  components are generally grouped and shown/hidden together.

From there you're free to start exploring all of our components by scrolling down through the
sidebar on your left. They're organized into categories by their role (e.g., display, buttons,
sliders, etc.) and each contains docs on everything you need for using and customizing them. Enjoy!

👉 Using Tailwind? Check out our [plugin](/docs/player/core-concepts/tailwind)!
