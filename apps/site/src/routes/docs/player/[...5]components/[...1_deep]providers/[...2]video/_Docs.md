---
description: This provider enables video playback via the HTML5 video element.
---

## Usage

The video provider is used to embed video content into documents via the
native [`<video>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/video) element.

<slot name="usage" />

:::stackblitz_example name="usage"
:::

### Multiple Sources

The list of [supported media formats](https://developer.mozilla.org/en-US/docs/Web/Media/Formats)
varies from one browser to the other. You should either provide your video in a single format
that all the relevant browsers support, or provide multiple video sources in enough different
formats that all the browsers you need to support are covered.

<slot name="multiple-sources" />

:::stackblitz_example name="multiple-sources"
:::
