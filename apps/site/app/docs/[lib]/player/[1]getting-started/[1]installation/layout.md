{% component this="./PathManager.svelte" /%}

# Installation

This section will get you up and running with the library. You'll find specific instructions below
depending on the type of installation method (NPM or CDN), library (HTML, React, etc.), and provider
(Audio, Video, HLS, etc.) you opt to use.

## Player Installation

{% steps %}

{% step orientation="vertical" %}

### Select Install Method {% slot="title" %}

{% select_install_method /%}

{% if_install_method is="npm" %}

{% install_npm /%}

{% /if_install_method %}

{% if_install_method is="cdn" %}

{% install_cdn /%}

{% /if_install_method %}

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
