---
description: Register player plugin to add `media-*` variants to Tailwind CSS.
---

# Tailwind

In this section you'll learn how to install our Tailwind CSS plugin and how to use it.

## Why?

If you're a fan of Tailwind CSS like we are, then you _really_ don't want to be forced to create
a `.css` file to handle random outlier cases. It not only slows you down and breaks your flow,
but it also goes against all the
[advantages of using utility classes](https://adamwathan.me/css-utility-classes-and-separation-of-concerns).

## Installation

You can register the plugin by adding the following to `tailwind.config.js`:

```js:title=tailwind.config.js:copy-highlight{3}
module.exports = {
  plugins: [
		require('@vidstack/player/tailwind.cjs'),
  ]
}
```

## Usage

The player exposes media state on the `vds-media-ui` element. For example:

```html
<vds-video-player src="...">
  <vds-media-ui
    media-paused
    media-waiting
    media-can-play
    ...
    style="--vds-media-current-time: 500; --vds-media-duration: 1000; ..."
  >
    <!-- ... -->
  </vds-media-ui>
</vds-video-player>
```

Media state is exposed as attributes and CSS properties on `vds-media-ui` so you can style your
player elements without being forced to write JS.

:::no
If we were to write vanilla CSS to show and hide icons inside a play button, it might look
something like this:
:::

```css
.media-play-icon,
[media-paused] .media-pause-icon {
  opacity: 0;
}

.media-pause-icon,
[media-paused] .media-play-icon {
  opacity: 100;
}
```

:::yes
Using the Tailwind plugin, we could rewrite it like so:
:::

```html{4-7}
<vds-video-player src="...">
	<vds-media-ui>
		<vds-play-button>
			<!-- Pause Icon. -->
			<svg class="media-paused:opacity-0 opacity-100"></svg>
			<!-- Play Icon. -->
			<svg class="media-paused:opacity-100 opacity-0"></svg>
		</vds-play-button>
	</vds-media-ui>
</vds-video-player>
```

Isn't that so much easier to comprehend? Well that's basically the plugin in a nutshell,
we'll leave the rest to your imagination. In the next sections, you'll find out more about
each of the variants and CSS variables available when using our plugin.

## Media Variants

<script>
import MediaAttrsTable from '$components/reference/MediaAttrsTable.md';
</script>

<MediaAttrsTable title="Variant" />

## Media CSS Variables

You can take advantage of [arbitrary values](https://tailwindcss.com/docs/adding-custom-styles#using-arbitrary-values)
if you're using Tailwind CSS v3+ and use the following CSS media variables.

<script>
import MediaVarsTable from '$components/reference/MediaVarsTable.md';
</script>

<MediaVarsTable />

## Media Example

The following example showcases a track with a fill inside indicating the amount of
playback time that has passed. When the media is buffering (indicated by the `media-waiting` variant)
we change the fill background color.

```html
<div class="relative h-6 w-full bg-gray-200">
  <div
    class="
			media-waiting:bg-sky-500 absolute top-0 left-0 h-full w-full
			origin-left
			scale-x-[calc(var(--vds-media-current-time)/var(--vds-media-duration))]
			transform bg-gray-400 will-change-transform
		"
  ></div>
</div>
```
