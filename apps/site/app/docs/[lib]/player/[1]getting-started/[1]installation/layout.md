{% component this="./PathManager.svelte" /%}

# Installation

This section will get you up and running with the library. You'll find specific instructions below
depending on the type of installation method (NPM or CDN), library (HTML, React, etc.), and provider
(Audio, Video, HLS, etc.) you opt to use.

{% steps %}

{% step orientation="vertical" %}

## Select Install Method {% slot="title" %}

{% select_install_method /%}

{% /step %}

{% step orientation="vertical" %}

## Select JS Library {% slot="title" %}

{% select_js_lib /%}

{% /step %}

{% step orientation="vertical" %}

## Select Media Provider {% slot="title" %}

{% select_media_provider /%}

{% /step %}

{% step orientation="vertical" %}

## Select Styling {% slot="title" %}

{% select_styling /%}

{% /step %}

<slot />

{% /steps %}

## Customizing Skins

See the [Skins docs](/docs/player/core-concepts/skins) for further skin customization options.

## Media Icons

**This step is optional.** Media Icons is a collection of icons we've designed at Vidstack to help
with building audio and video player user interfaces. If you plan on building your components up
yourself (i.e., _not_ using a skin or any defaults), then you can follow the instructions below to
start using our icons.

First, install the [`media-icons`](https://github.com/vidstack/media-icons) package:

```bash
npm i media-icons
```

{% if_js_lib is="html" %}

Next, import icons:

```ts {% copy=true %}
import 'vidstack/icons';
```

Finally, use them like so:

```html {% copy=true %}
<media-icon type="chromecast" />
```

👉 Preview the entire collection in our [media icons catalog](/media-icons?lib=html).

{% /if_js_lib %}

{% if_js_lib is="react" %}

Next, import an icon:

```tsx {% copy=true %}
import { PlayIcon } from '@vidstack/react/icons';
```

Finally, use it like so:

```tsx {% copy=true %}
<PlayIcon size={40} />
```

👉 Preview the entire collection in our [media icons catalog](/media-icons?lib=react).

{% /if_js_lib %}
