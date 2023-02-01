---
title: HLS Player Installation
description: Instructions to get your HLS player installed and on-screen using HTML.
---

{% step %}

### Install NPM Package {% slot="title" %}

{% slot name="description" %}
Install `vidstack` and dependencies via NPM.
{% /slot %}

```bash {% copy=true %}
npm i hls.js vidstack
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

```js {% copy=true %}
// the `.js` extension is required.
import 'vidstack/define/media-player.js';
```

{% /step %}

{% step %}

### Add Player Markup {% slot="title" %}

{% slot name="description" %}
Add the following player HTML boilerplate to get started.
{% /slot %}

```html {% copy=true %}
<!-- remove `controls` attribute if you're designing a custom UI -->
<media-player
  src="https://media-files.vidstack.io/hls/index.m3u8"
  poster="https://media-files.vidstack.io/poster.png"
  controls
>
  <media-outlet></media-outlet>
</media-player>
```

{% /step %}
