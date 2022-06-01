---
title: 'Styling - Tailwind CSS'
description: Introduction to using Vidstack Player with Tailwind.
---

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
  plugins: [require('@vidstack/player/tailwind.cjs')],
};
```

## Usage

The `<vds-media>` element exposes media state as HTML attributes and CSS properties like so:

```html
<vds-media
  paused
  waiting
  seeking
  can-play
  ...
  style="--vds-current-time: 500; --vds-duration: 1000; ..."
>
  <!-- ... -->
</vds-media>
```

{% no %}
If we were to write vanilla CSS to show and hide icons inside a play button, it might look
something like this:
{% /no %}

{% code_snippet name="tw-bad" /%}

```css
.play-icon,
.pause-icon {
  opacity: 100;
}

/* Hide play icon when media is _not_ paused. */
vds-media:not([paused]) .play-icon {
  opacity: 0;
}

/* Hide pause icon when media is paused. */
vds-media[paused] .pause-icon {
  opacity: 0;
}
```

{% yes %}
Using the Tailwind plugin, we could rewrite it like so:
{% /yes %}

{% code_snippet name="tw-good" highlight="html:4,6|react:8,10" /%}

Isn't that so much easier to comprehend? That's basically the plugin in a nutshell,
we'll leave the rest to your imagination. In the next sections, you'll find out more about
each of the variants and CSS variables available when using our plugin.

## Media Variants

{% component file="./_tables/variants-table.md" /%}

## Media CSS Variables

You can take advantage of [arbitrary values](https://tailwindcss.com/docs/adding-custom-styles#using-arbitrary-values)
if you're using Tailwind CSS v3+ and use the following CSS media variables.

{% component file="./_tables/vars-table.md" /%}

## Media Example

The following example showcases a track with a fill inside indicating the amount of
playback time that has passed. When the media is buffering (indicated by the `media-waiting` variant)
we change the fill background color.

{% code_snippet name="tw-example" /%}
