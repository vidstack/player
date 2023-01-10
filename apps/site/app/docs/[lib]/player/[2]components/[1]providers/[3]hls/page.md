---
description: This provider enables streaming media using the HTTP Live Streaming (HLS) protocol.
---

## Install

You'll need to install `hls.js` if you're using the HLS provider locally (i.e., not over a CDN):

```bash {% copy=true %}
npm i hls.js
```

## Usage

This provider is used to embed streamable video content into documents using the native
[`<video>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/video) element, and supports
streaming media using the [HTTP Live Streaming (HLS)](https://en.wikipedia.org/wiki/HTTP_Live_Streaming) protocol.
HLS streaming is [supported natively](https://caniuse.com/?search=hls) in some browsers (e.g., iOS Safari),
otherwise, we fallback to using [`hls.js`](https://github.com/video-dev/hls.js).

{% code_preview name="usage" size="medium" copy=true /%}

## Loading `hls.js`

The HLS provider will default to loading the light version of `hls.js` from [JSDelivr](https://jsdelivr.com). We load
the default bundle in development, and the minified version in production.

{% code_snippet name="loading-hls" copy=true /%}

You can point `hls-library` at any URL that re-exports `hls.js@^1.0`. This means you can use your
own server or CDN if desired.

### Importing `hls.js`

You can also load `hls.js` by statically, or dynamically importing it and setting the `hlsLibrary`
property like so:

{% code_snippet name="import-hls" copy=true  /%}

Or, you can dynamically import it like so:

{% code_snippet name="dynamic-import-hls" copy=true /%}

### Load Events

The provider will fire the following events while loading `hls.js`:

- `$event:vds-hls-lib-load-start`: Fired when we begin downloading the library.
- `$event:vds-hls-lib-loaded`: Fired when the library has been loaded.
- `$event:vds-hls-lib-load-error`: Fired when the library _fails_ to download.

These events are fired regardless of how you decide to load the library (i.e., import or CDN).

## Configuring `hls.js`

You can configure `hls.js` using the `hlsConfig` property like so:

{% code_snippet name="configure-hls" copy=true /%}

## HLS Engine

If you need access to the `hls.js` instance, you can access it off the `hlsEngine` property
on the `$tag:vds-hls` component:

{% code_snippet name="hls-engine" copy=true /%}

Listen to the `$event:vds-hls-instance` event to be notified of when it's created (called before media
is attached), and the `$event:vds-hls-destroying` event for when it will be destroyed.

{% code_snippet name="hls-engine-events" copy=true /%}

## HLS Events

All [`hls.js` events](https://github.com/video-dev/hls.js/blob/master/docs/API.md#runtime-events)
can be listened to directly off the `$tag:vds-hls` component. Some examples include:

- `Hls.Events.MEDIA_ATTACHED` -> `$event:vds-hls-media-attached`
- `Hls.Events.MANIFEST_LOADED` -> `$event:vds-hls-manifest-loaded`
- `Hls.Events.LEVEL_SWITCHING` -> `$event:vds-hls-level-switching`

{% code_snippet name="hls-events" copy=true /%}
