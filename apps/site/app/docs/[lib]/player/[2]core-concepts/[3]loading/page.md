---
title: Loading Media
description: How to correctly handle loading media with Vidstack Player.
---

# {% $frontmatter.title %}

In this section, we'll look at how to handle loading media and how the source/provider selection
process works.

## Avoiding Layout Shifts

By default, the browser will use the [intrinsic size](https://developer.mozilla.org/en-US/docs/Glossary/Intrinsic_Size)
of the loaded media to set the dimensions of the provider. As media loads over the network,
the element will jump from the default size to the intrinsic media size, triggering a layout shift
which is a [poor user experience indicator](https://web.dev/cls) for both your users and search
engines (i.e., Google).

To avoid a layout shift, we recommend setting the aspect ratio prop like so:

{% code_snippets name="sizing" /%}

{% if_js_lib is="html" %}

```css {% copy=true %}
media-player {
  /* Set aspect ratio here as well to avoid any initial layout shift. */
  --media-aspect-ratio: 16 / 9;
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

## Loading Source

The player can accept one or more media sources. We recommend providing `type` information for
each source so the correct provider is selected.

{% code_snippet name="loading-source" /%}

In addition, the player accepts both audio and video [source objects](/docs/player/providers/video#source-objects).
This includes `MediaStream`, `MediaSource`, `Blob`, and `File`.

{% code_snippet name="loading-source-object" /%}

### Extensions/Types

The following is a list of supported media extensions and types for each provider:

- **Audio Extension:** m4a, m4b, mp4a, mpga, mp2, mp2a, mp3, m2a, m3a, wav, weba, aac, oga, spx
- **Audio Type:** audio/mpeg, audio/ogg, audio/3gp, audio/mp4, audio/webm, audio/flac, audio/object
- **Video Extension:** mp4, ogg, ogv, webm, mov, m4v
- **Video Type:** video/mp4, video/webm, video/3gp, video/ogg, video/avi, video/mpeg
- **HLS Extension:** m3u8
- **HLS Type:** application/vnd.apple.mpegurl, audio/mpegurl, audio/x-mpegurl, application/x-mpegurl,
  video/x-mpegurl, video/mpegurl, application/mpegurl

### Selection Process

The source selection process is as follows:

1. Detect a change on the `src` attr/prop.
2. Normalize `src` into an array of `MediaSrc` objects (`{src, type}`). If a [source object](/docs/player/providers/video#source-objects) is provided, the `type` will default to `video/object`, otherwise `unknown`.
3. The `$event:sources-change` event is fired.
4. Walk through each source at a time in order and attempt to find a provider who can play it.
   The `canPlay` method on each provider loader will check if the media extension or `type`
   can be played. The first loader to return `true` will be promoted to active.
5. The `$event:source-change` event is fired - the current source will be `null` if no provider
   was matched.
6. Start the [provider loading process](#provider-loading).

{% code_snippet name="selection-process" /%}

## Provider Loading

Providers are auto-selected during the source selection process and dynamically
loaded via a [`MediaProviderLoader`](https://github.com/vidstack/player/blob/main/packages/vidstack/src/player/media/providers/types.ts#L14). The loader is responsible for determining whether the underlying provider can play a given
source, dynamically loading the provider when needed, and rendering content inside the `<media-provider>`.
Rendered output includes `<audio>`, `<video>`, and `<iframe>` elements.

When a provider is selected via the [source selection](#selection-process) process, it will go
through the following setup process:

1. Destroy the old provider if it's no longer active and fire `$event:provider-change` event
   with detail set to `null`.
2. The loader will attempt to preconnect any URLs for the current provider or source.
3. The `$event:provider-loader-change` event is fired.
4. Wait for the new media provider loader to render so the underlying element (e.g., `<video>`) is
   ready.
5. The loader will dynamically import and initialize the provider instance.
6. The `$event:provider-change` event is fired - this is the best time to configure the
   provider before it runs through setup.
7. Once the specified [loading strategy](#loading-strategies) has resolved, the provider `setup`
   method is called. This step generally involves loading required libraries and attaching event
   listeners.
8. The `$event:provider-setup` event is fired.
9. Finally, the `loadSource` method is called on the provider with the selected source.

It's important to note that if the provider has not changed during a source change, then the setup
process will be skipped and simply the new source will be loaded (step 9).

{% code_snippet name="provider-loading" /%}
