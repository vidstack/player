---
title: HLS
description: This provider enables streaming media using the HTTP Live Streaming (HLS) protocol.
---

# HLS

This provider is used to embed streamable video content into documents using the native
[`<video>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/video) element, and supports
streaming media using the [HTTP Live Streaming (HLS)](https://en.wikipedia.org/wiki/HTTP_Live_Streaming) protocol.

## Install

You'll need to install `hls.js` if you're using the HLS provider locally (e.g., not over a CDN):

```bash {% copy=true %}
npm i hls.js
```

## Usage

{% code_preview name="usage" size="medium" copy=true /%}

## Loading `hls.js`

The HLS provider will default to loading the light version of `hls.js` from [JSDelivr](https://jsdelivr.com). We load
the default bundle in development, and the minified version in production.

{% code_snippet name="loading-hls" copyHighlight=true highlight="html:6-9|react:8-11" /%}

{% callout type="info" %}
You can point `library` at any URL that re-exports `hls.js@^1.0`. This means you can use your
own server or CDN if desired.
{% /callout %}

### Importing `hls.js`

You can also load `hls.js` by statically, or dynamically importing it and setting the `library`
property on the provider like so:

{% code_snippet name="import-hls" copyHighlight=true highlight="html:8-11|react:9-12" /%}

### Load Events

The provider will fire the following events on `<media-player>` while loading `hls.js`:

- `$event:hls-lib-load-start`: Fired when we begin downloading the library.
- `$event:hls-lib-loaded`: Fired when the library has been loaded.
- `$event:hls-lib-load-error`: Fired when the library _fails_ to download.

These events are fired regardless of how you decide to load the library (i.e., import or CDN).

## Configuring `hls.js`

You can configure `hls.js` using the `config` property on the provider like so:

{% code_snippet name="configure-hls" copyHighlight=true highlight="html:6|react:8" /%}

## Instance

You can obtain a reference to the `hls.js` instance like so:

{% code_snippet name="hls-instance" copyHighlight=true highlight="html:6-7|react:8-9" /%}

## Events

All [`hls.js` events](https://github.com/video-dev/hls.js/blob/master/docs/API.md#runtime-events)
can be listened to directly off the `$tag:media-player` component. Some examples include:

- `Hls.Events.MEDIA_ATTACHED` -> `$event:hls-media-attached`
- `Hls.Events.MANIFEST_LOADED` -> `$event:hls-manifest-loaded`
- `Hls.Events.LEVEL_SWITCHING` -> `$event:hls-level-switching`

{% code_snippet name="hls-events" /%}

All HLS event types are prefixed with `HLS` and end with `Event` like so:

```ts {% copy=true %}
import {
  type HLSLevelSwitchingEvent,
  type HLSManifestLoadedEvent,
  type HLSMediaAttachedEvent,
} from 'vidstack';
```

You can find a complete list of HLS events in the [`<media-player>` API reference](/docs/player/components/layout/player/api#events--hls-lib-load-start).
