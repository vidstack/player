---
layout: quickstart
title: Video Player Installation
description: Instructions to get your video player installed and on-screen using HTML.
---

{% step %}

### Install NPM Package {% slot="title" %}

{% slot name="description" %}
Install `@vidstack/player` and dependencies via NPM.
{% /slot %}

```bash {% copy=true %}
npm i lit @vidstack/player@next
```

{% /step %}

{% step %}

### Register Elements {% slot="title" %}

{% slot name="description" %}
Register the custom media elements. The `.js` extension is required for the package export map
to work.
{% /slot %}

```js {% copy=true %}
import '@vidstack/player/define/vds-media.js';
import '@vidstack/player/define/vds-video.js';
```

{% /step %}

{% step %}

### Add Player Markup {% slot="title" %}

{% slot name="description" %}
Add the following player HTML boilerplate to get started.
{% /slot %}

```html {% copy=true %}
<vds-media>
  <vds-video poster="https://media-files.vidstack.io/poster.png">
    <video src="https://media-files.vidstack.io/720p.mp4" preload="none"></video>
  </vds-video>
</vds-media>
```

{% /step %}
