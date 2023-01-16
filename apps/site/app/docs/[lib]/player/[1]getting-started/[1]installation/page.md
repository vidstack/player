---
title: Video Player Installation
description: Instructions to get your video player installed and on-screen using HTML.
---

{% step %}

### Install NPM Package {% slot="title" %}

{% slot name="description" %}
Install `vidstack` and dependencies via NPM.
{% /slot %}

```bash {% copy=true %}
npm i vidstack
```

{% /step %}

{% step %}

### Register Elements {% slot="title" %}

{% slot name="description" %}
Register the custom media elements and base styles.
{% /slot %}

```js {% copy=true %}
import 'vidstack/styles/base.css';
// the following styles are optional - remove to go headless.
import 'vidstack/styles/ui/buttons.css';
import 'vidstack/styles/ui/sliders.css';

import { defineCustomElements } from 'vidstack/elements';

defineCustomElements();
```

You can register specific elements like so:

```js
// the `.js` extension is required.
import 'vidstack/define/vds-media.js';
import 'vidstack/define/vds-video.js';
```

{% /step %}

{% step %}

### Add Player Markup {% slot="title" %}

{% slot name="description" %}
Add the following player HTML boilerplate to get started.
{% /slot %}

```html {% copy=true %}
<vds-media>
  <!-- remove `controls` attribute if you're designing a custom UI -->
  <vds-video controls poster="https://media-files.vidstack.io/poster.png">
    <video src="https://media-files.vidstack.io/720p.mp4" preload="none"></video>
  </vds-video>
</vds-media>
```

{% /step %}
