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

### Options

The plugin accepts options for configuring prefixes on variants provided by Vidstack:

```js {% title="tailwind.config.js" copyHighlight=true highlight="3-5" %}
module.exports = {
  plugins: [
    require('vidstack/tailwind.cjs')({
      prefix: 'media', // paused:... -> media-paused:...
    }),
  ],
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

```html
<!-- example -->
<div class="paused:opacity-0"></div>
```

{% component this="../.tables/variants-table.md" /%}

### Not Variants

All [media variants](#media-variants) can be prefixed with `not-` to negate the selector.
Classes with this prefix will be transformed into `media-player:not([state])` selectors.

Few examples:

- `not-paused`: Media is in the play state (not paused).
- `not-playing`: Media playback is not active (not playing).
- `not-can-play`: Media is not ready for playback (not can play).

```html
<!-- input -->
<div class="not-paused:opacity-0"></div>
```

```css
/* output */
media-player:not([paused]) .not-paused\:opacity-0 {
  opacity: 0;
}
```

## Media CSS Variables

You can take advantage of [arbitrary values](https://tailwindcss.com/docs/adding-custom-styles#using-arbitrary-values)
if you're using Tailwind CSS v3+ and use the following CSS media variables.

{% component this="../.tables/vars-table.md" /%}

```html
<!-- example -->
<div
  class="origin-left scale-x-[calc(var(--media-current-time)/var(--media-duration))] transform"
></div>
```
