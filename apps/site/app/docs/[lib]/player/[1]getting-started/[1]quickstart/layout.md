{% component this="./PathManager.svelte" /%}

# Quickstart

This section will get you up and running with the library. You'll find specific instructions below
depending on the type of installation method (NPM or CDN), library (HTML, React, etc.), and provider
(Audio, Video, HLS, etc.) you opt to use.

## Browser Support

{% callout type="info" %}
We support at _minimum_ ~92.74% of users tracked on [caniuse](https://caniuse.com).
{% /callout %}

Ensure the following browser support table is suitable for your application. We've built the
library for the modern web; thus, we try to avoid bloated polyfills and outdated environments as
much as possible. At the moment, we only support browsers that fully implement
the [Custom Elements V1](https://caniuse.com/custom-elementsv1).

We've tried to be conservative with these numbers; take this as a lower bound. We likely support a
greater range of browsers and versions, but we won't note it here until we test it; if you're not
sure, best try it yourself and let us know!

{% browsers_list /%}

## Player Installation

{% steps %}

{% step orientation="vertical" %}

### Select Install Method {% slot="title" %}

{% select_install_method /%}

{% if_install_method is="npm" %}

{% install_npm /%}

{% /if_media_provider %}

{% if_install_method is="cdn" %}

{% install_cdn /%}

{% /if_media_provider %}

{% /step %}

{% step orientation="vertical" %}

### Select JS Library {% slot="title" %}

{% select_js_lib /%}

{% if_js_lib is="html" %}
The `HTML` option refers to our [Web Components](https://developer.mozilla.org/en-US/docs/Web/Web_Components)
library. Our custom elements can be used anywhere with the simple drop of an import or CDN link as
they're natively supported by browsers. This option is best when writing plain HTML or using a
JS library such as [Angular](https://angularjs.org). Native web components have
[excellent support](https://custom-elements-everywhere.com) in most libraries.
{% /if_js_lib %}

{% if_js_lib is="react" %}
The React integration will provide a seamless experience when working with [React](https://reactjs.org)
and frameworks like [Next.js](https://nextjs.org).
{% /if_js_lib %}

{% /step %}

{% step orientation="vertical" %}

### Select Media Provider {% slot="title" %}

{% select_media_provider /%}

{% if_media_provider is="audio" %}
Embed sound content into documents via the native `audio` element.
{% /if_media_provider %}

{% if_media_provider is="video" %}
Embed video content into documents via the native `video` element.
{% /if_media_provider %}

{% if_media_provider is="hls" %}
Embed video content into documents via the native `video` element. This
provider also enables streaming video using the HTTP Live Streaming (HLS) protocol.
[HLS isn't widely supported](https://caniuse.com/?search=hls) yet, but we use the popular
[hls.js](https://github.com/video-dev/hls.js) library to ensure it works anywhere
[Media Source Extensions (MSE) are supported](https://caniuse.com/mediasource), which accounts
for ~96.42% of users tracked on caniuse.
{% /if_media_provider %}

{% /step %}

<slot />

{% step orientation="horizontal" %}

### Add Global Types {% slot="title" %}

{% slot name="description" %}
Add global Vidstack types if you're using TypeScript.
{% /slot %}

```json {% title="tsconfig.json" copyHighlight=true highlight="3" %}
{
  "compilerOptions": {
    "types": ["vidstack/globals"]
  }
}
```

{% /step %}

{% /steps %}

Congratulations, you're done 🎉 You might not see anything yet and that's okay because you
haven't designed a UI! You can quickly try showing the [`native controls`](#media-controls) to see
if everything is working.

## Media Controls

By default, we'll remove the controls on the underlying `<audio>` or `<video>` element as we
expect a custom user interface (UI) to be presented. Set the `controls` property on the provider
component if you'd like to display the native UI controls like so:

{% code_snippet name="controls" highlight="html:3-4|react:7-8" /%}

## Media Loading

The following media loading strategies are available:

- `eager`: Load media immediately - use when media needs to be interactive as soon as possible.
- `idle`: Load media once the page has loaded and the `requestIdleCallback` is fired - use when media is
  lower priority and doesn't need to be interactive immediately.
- `visible` **(default)**: Load media once it has entered the visual viewport - use when media is below the fold and you prefer
  delaying loading until it's required.
- `custom`: Load media when the `startLoadingMedia()` method is called _or_ the `media-start-loading`
  event is dispatched - use when you need fine control of when media should begin loading.

{% code_snippet name="loading-idle" highlight="html:2|react:6" /%}

Here's another example using a custom loading strategy:

{% code_snippet name="loading-custom" highlight="html:5,10|react:12,17" /%}

## Media Autoplay

We manually handle autoplay so we can detect when it fails. Therefore, ensure you set `autoplay` on
the provider component instead of the underlying media element like so:

{% code_snippet name="autoplay" highlight="html:1|react:5" /%}

{% callout type="danger" %}
The `autoplay` attribute on the `<audio>` or `<video>` element will take priority over the
`preload` attribute. Never set this attribute because it will break the loading process.
{% /callout %}

## Media Poster

You can declare a second poster in your markup like so:

{% code_snippet name="seo-poster" highlight="html:2-3|react:7-8" /%}

The one on the Vidstack provider element is the poster that you expect your users to load and see.
The other on the `<video>` element is shown temporarily as the primary poster loads, or if
JavaScript is disabled by a client or crawler (i.e., search engine).

You can choose to load a low-res image that the user will see while the main poster is loading or
a `124x70` (or greater) sized image explicitly designed to show in search results.

{% callout type="info" %}
See the [Structured Video Data](https://developers.google.com/search/docs/advanced/structured-data/video)
documentation by Google to learn how to explicitly provide rich information about your videos.
{% /callout %}

## Media Sizing

By default, the browser will use the [intrinsic size](https://developer.mozilla.org/en-US/docs/Glossary/Intrinsic_Size)
of the loaded media to set the dimensions of the provider. As media loads over the network,
the element will jump from the default size to the intrinsic media size, triggering a layout shift
which is a [poor user experience indicator](https://web.dev/cls) for both your users and search
engines (i.e., Google).

To avoid a layout shift, we recommend use an aspect ratio container which holds a fixed ratio
(e.g., `16/9`) like so:

{% code_snippets name="sizing" highlight="" copy=true copySteps=true highlight="html:2,6-8|react:1,6" /%}

{% callout type="tip" %}
Ideally the ratio set should match the ratio of the media content itself (i.e., intrinsic aspect ratio)
otherwise you'll end up with a letterbox template (empty black bars on the left/right of the media).
{% /callout %}
