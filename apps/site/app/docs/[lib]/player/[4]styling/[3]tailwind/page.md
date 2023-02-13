---
title: Tailwind CSS
description: Introduction to using Vidstack Player with Tailwind.
---

# {% $frontmatter.title %}

In this section, we'll get you up and running with our Tailwind CSS plugin.

## Why?

If you're a fan of Tailwind CSS like we are, then you _really_ don't want to be forced to create
a `.css` file to handle random outlier cases. It not only slows you down and breaks your flow,
but it also goes against all the
[advantages of using utility classes](https://adamwathan.me/css-utility-classes-and-separation-of-concerns).

## Installation

You can register the plugin by adding the following to `tailwind.config.js`:

```js {% title="tailwind.config.js" copyHighlight=true highlight="2" %}
module.exports = {
  plugins: [require('vidstack/tailwind.cjs')],
};
```

## Usage

The `<media-player>` element exposes media state as HTML attributes and CSS vars like so:

```html
<media-player
  paused
  waiting
  seeking
  can-play
  ...
  style="--media-current-time: 500; --media-duration: 1000; ..."
>
  <!-- ... -->
</media-player>
```

The tailwind plugin provides media variants which can be used to prefix utilities so they're
applied when a given media state is active.

{% code_snippet name="tw-good" /%}

## Media Variants

{% component this="../.tables/variants-table.md" /%}

### Not Variants

All [media variants](#media-variants) can be prefixed with `not-` to negate the selector.
Classes with this prefix will be transformed into `media-player:not([state])` selectors.

Few examples:

- `not-media-paused`: Media is in the play state (not paused).
- `not-media-playing`: Media playback is not active (not playing).
- `not-media-can-play`: Media is not ready for playback (not can play).

```html
<!-- Input -->
<div class="not-media-paused:opacity-0"></div>
```

```css
/* Output */
media-player:not([paused]) .not-media-paused\:opacity-0 {
  opacity: 0;
}
```

## Media CSS Variables

You can take advantage of [arbitrary values](https://tailwindcss.com/docs/adding-custom-styles#using-arbitrary-values)
if you're using Tailwind CSS v3+ and use the following CSS media variables.

{% component this="../.tables/vars-table.md" /%}
