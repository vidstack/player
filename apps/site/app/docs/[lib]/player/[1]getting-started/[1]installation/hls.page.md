---
title: HLS Player Installation
description: Instructions to get your HLS player installed and on-screen using HTML.
---

{% step %}

## Install NPM Package {% slot="title" %}

{% slot name="description" %}
Install `vidstack` and dependencies via NPM.
{% /slot %}

```bash {% copy=true %}
npm i hls.js vidstack
```

{% /step %}

{% step %}

## Register Elements {% slot="title" %}

{% slot name="description" %}
Register the custom media elements and base styles.
{% /slot %}

{% import_components /%}

You can also register specific elements like so:

```js {% copy=true %}
// the `.js` extension is required.
import 'vidstack/define/media-player.js';
```

{% /step %}

{% step %}

## Add Player Markup {% slot="title" %}

{% slot name="description" %}
Add the following player HTML boilerplate to get started.
{% /slot %}

{% player_markup /%}

{% /step %}

{% step orientation="horizontal" %}

## Add Global Types {% slot="title" %}

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
