---
title: Audio
description: This provider enables audio playback via the HTML5 audio element.
---

# Audio

The audio provider is used to embed sound content into documents via the native
[`<audio>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/audio) element.

## Usage

{% code_preview name="usage" size="small" copy=true /%}

### Multiple Sources

The list of [supported media formats](https://developer.mozilla.org/en-US/docs/Web/Media/Formats)
varies from one browser to the other. You should either provide your video in a single format
that all the relevant browsers support, or provide multiple video sources in enough different
formats that all the browsers you need to support are covered.

{% code_snippet name="multiple-sources" copy=true /%}

### Source Objects

The `src` property on the player accepts any of the following source objects:

- [`MediaStream`](https://developer.mozilla.org/en-US/docs/Web/API/MediaStream)
- [`MediaSource`](https://developer.mozilla.org/en-US/docs/Web/API/MediaSource)
- [`Blob`](https://developer.mozilla.org/en-US/docs/Web/API/Blob)
- [`File`](https://developer.mozilla.org/en-US/docs/Web/API/File)

{% code_snippet name="src-object" copy=true highlight="html:9" /%}

## Audio Element

You can obtain a reference to the underlying `HTMLAudioElement` element like so:

{% code_snippet name="audio-element" copy=true /%}

### Event Target

The `HTMLAudioElement` can also be referenced on _all media events_ like so:

{% code_snippet name="event-target" copy=true /%}
