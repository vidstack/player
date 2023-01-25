---
title: Loading Media
description: How to correctly handle loading media with Vidstack Player.
---

# {% $frontmatter.title %}

In this section, we'll look at how you can avoid layout shifts and apply different media loading
strategies.

## Avoiding Layout Shifts

By default, the browser will use the [intrinsic size](https://developer.mozilla.org/en-US/docs/Glossary/Intrinsic_Size)
of the loaded media to set the dimensions of the provider. As media loads over the network,
the element will jump from the default size to the intrinsic media size, triggering a layout shift
which is a [poor user experience indicator](https://web.dev/cls) for both your users and search
engines (i.e., Google).

To avoid a layout shift, we recommend use an aspect ratio container which holds a fixed ratio
(e.g., `16/9`) like so:

{% code_snippets name="sizing" /%}

{% if_js_lib is="html" %}

```css {% copy=true %}
vds-media {
  --media-width: 1920px;
  --media-aspect-ratio: 16 / 9;
}

.media-container {
  background-color: black;
  width: var(--media-width);
  height: calc(var(--media-width) / var(--media-aspect-ratio));
}
```

{% /if_js_lib %}

Ideally the ratio set should match the ratio of the media content itself (i.e., intrinsic aspect ratio)
otherwise you'll end up with a letterbox template (empty black bars on the left/right of the media).

## Loading Strategies

A loading strategy enables specifying when media should begin loading. Loading media too early
can effectively slow down your entire application, so choose wisely. The following media loading
strategies are available:

- `eager`: Load media immediately - use when media needs to be interactive as soon as possible.
- `idle`: Load media once the page has loaded and the `requestIdleCallback` is fired - use when media is
  lower priority and doesn't need to be interactive immediately.
- `visible`: Load media once it has entered the visual viewport - use when media is below the fold and you prefer
  delaying loading until it's required.
- `custom`: Load media when the `startLoading()` method is called _or_ the `media-start-loading`
  event is dispatched - use when you need fine control of when media should begin loading.

{% code_snippet name="loading-idle" highlight="html:1|react:4" /%}

### Custom Loading Strategy

Here's another example using a custom loading strategy:

{% code_snippet name="loading-custom" highlight="html:5,9|react:10,14" /%}
