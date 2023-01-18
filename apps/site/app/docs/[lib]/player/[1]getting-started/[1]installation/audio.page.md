---
title: Audio Player Installation
description: Instructions to get your audio player installed and on-screen using HTML.
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

```js {% copy=true %}
// the `.js` extension is required.
import 'vidstack/define/vds-media.js';
import 'vidstack/define/vds-audio.js';
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
  <vds-audio controls>
    <audio src="https://media-files.vidstack.io/audio.mp3" preload="none"></audio>
  </vds-audio>
</vds-media>
```

{% /step %}
