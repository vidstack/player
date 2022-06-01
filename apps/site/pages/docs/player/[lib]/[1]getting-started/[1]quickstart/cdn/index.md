---
layout: quickstart
title: Video Player Installation (CDN)
description: Instructions to get your video player up and running through a CDN.
---

{% step %}

### Register Elements {% slot="title" %}

{% slot name="description" %}
Add the following `script` tags to register the custom media elements.
{% /slot %}

```html {% copyHighlight=true highlight="4-7" %}
<!DOCTYPE html>
<html>
  <head>
    <script
      type="module"
      src="https://cdn.jsdelivr.net/npm/@vidstack/player@next/dist-cdn/bundle.js"
    ></script>
  </head>
  <!-- ... -->
</html>
```

You can register specific elements like so:

```html {% copy=true %}
<script
  type="module"
  src="https://cdn.jsdelivr.net/npm/@vidstack/player@next/dist-cdn/define/vds-media.js"
></script>
<script
  type="module"
  src="https://cdn.jsdelivr.net/npm/@vidstack/player@next/dist-cdn/define/vds-video.js"
></script>
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
