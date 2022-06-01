---
layout: quickstart
title: HLS Player Installation
description: Instructions to get your HLS player installed and on-screen using React.
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

### Import Components {% slot="title" %}

{% slot name="description" %}
Import media components into the `jsx` or `tsx` file where you'll be building your player.
{% /slot %}

```js {% copy=true %}
import { Hls, Media } from '@vidstack/player/react';
```

{% /step %}

{% step %}

### Add Player Markup {% slot="title" %}

{% slot name="description" %}
Add the following player JSX boilerplate to get started.
{% /slot %}

```jsx {% copy=true %}
<Media>
  <Hls poster="https://media-files.vidstack.io/poster.png">
    <video src="https://media-files.vidstack.io/hls/index.m3u8" preload="none" />
  </Hls>
</Media>
```

{% /step %}
