## Install

You'll need to install `hls.js` if you're using the HLS provider locally (i.e., not over a CDN):

```bash:copy
npm i hls.js
```

## Usage

:::info
The HLS provider extends the API of the native `<video>` element so you can replace
it with `<vds-hls>` and it'll just work! Refer to [MDN](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/video)
for more information about the native `<video>` element.
:::

Embeds streamable video content into documents using the native `<video>` element, and streams media using
the [HTTP Live Streaming (HLS)](https://en.wikipedia.org/wiki/HTTP_Live_Streaming) protocol.
HLS streaming is [supported natively](https://caniuse.com/?search=hls) in some browsers (e.g., iOS Safari),
otherwise, we fallback to using [`hls.js`](https://github.com/video-dev/hls.js).

<slot name="usage" />

## Player

The `<vds-hls-player>` component is a light extension on top of `<vds-hls>` to enable a custom
player UI to be built. Thus, the entire HLS provider's API is available when interacting with it.

<slot name="player" />

## Loading `hls.js`

The HLS provider will default to loading the light version of `hls.js` from [JSDelivr](https://jsdelivr.com). We load
the default bundle in development, and the minified version in production.

<slot name="loading-hls" />

You can point `hls-library` at any URL that re-exports `hls.js@^1.0`. This means you can use your
own server or CDN if desired.

### Importing `hls.js`

You can also load `hls.js` by statically, or dynamically importing it and setting the `hlsLibrary`
property like so:

<slot name="importing-hls" />

Or, you can dynamically import it like so:

<slot name="dynamically-import-hls" />

### Load Events

The provider will fire the following events while loading `hls.js`:

- `vds-hls-lib-load-start`: Fired when we begin downloading the library.
- `vds-hls-lib-loaded`: Fired when the library has been loaded.
- `vds-hls-lib-load-error`: Fired when the library _fails_ to download.

These events are fired regardless of how you decide to load the library (i.e., import or CDN).

## Configuring `hls.js`

You can configure `hls.js` using the `hlsConfig` property like so:

<slot name="configuring-hls" />

## HLS Engine

If you need access to the `hls.js` instance, you can access it off the `hlsEngine` property
on the `<vds-hls>` component:

<slot name="hls-engine"  />

Listen to the `vds-hls-instance` event to be notified of when it's created (called before media
is attached), and the `vds-hls-destroying` event for when it will be destroyed.

<slot name="hls-engine-events"  />

## HLS Events

All [`hls.js` events](https://github.com/video-dev/hls.js/blob/master/docs/API.md#runtime-events)
can be listened to directly off the `<vds-hls>` component. Some examples include:

- `Hls.Events.MEDIA_ATTACHED` -> `vds-hls-media-attached`
- `Hls.Events.MANIFEST_LOADED` -> `vds-hls-manifest-loaded`
- `Hls.Events.LEVEL_SWITCHING` -> `vds-hls-level-switching`

<slot name="hls-events"  />

You can find a <ApiLink hash="events">list of all provider events</ApiLink> in the API reference.
