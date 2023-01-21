---
title: HLS Player Installation
description: Instructions to get your HLS player installed and on-screen using React.
---

{% step %}

### Install NPM Package {% slot="title" %}

{% slot name="description" %}
Install dependencies via NPM.
{% /slot %}

```bash {% copy=true %}
npm i vidstack @vidstack/react
```

{% /step %}

{% step %}

### Import Components {% slot="title" %}

{% slot name="description" %}
Import media components into the `jsx` or `tsx` file where you'll be building your player.
{% /slot %}

```js {% copy=true %}
import 'vidstack/styles/base.css';
// the following styles are optional - remove to go headless.
import 'vidstack/styles/ui/buttons.css';
import 'vidstack/styles/ui/sliders.css';

import { HlsVideo, Media } from '@vidstack/react';
```

{% /step %}

{% step %}

### Add Player Markup {% slot="title" %}

{% slot name="description" %}
Add the following player JSX boilerplate to get started.
{% /slot %}

```jsx {% copy=true %}
<Media controls poster="https://media-files.vidstack.io/poster.png" view="video">
  {/* ^ remove `controls` attribute if you're designing a custom UI */}
  <HLSVideo>
    <video src="https://media-files.vidstack.io/hls/index.m3u8" preload="none" data-video="0" />
  </HLSVideo>
</Media>
```

{% /step %}
