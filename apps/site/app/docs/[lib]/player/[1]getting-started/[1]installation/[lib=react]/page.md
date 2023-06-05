---
title: Video Player Installation
description: Instructions to get your video player installed and on-screen using React.
---

{% step %}

## Install NPM Package {% slot="title" %}

{% slot name="description" %}
Install dependencies via NPM.
{% /slot %}

```bash {% copy=true %}
npm i vidstack @vidstack/react
```

{% /step %}

{% step %}

## Import Components {% slot="title" %}

{% slot name="description" %}
Import media components into the `jsx` or `tsx` file where you'll be building your player.
{% /slot %}

{% import_components /%}

{% /step %}

{% step %}

## Add Player Markup {% slot="title" %}

{% slot name="description" %}
Add the following player JSX boilerplate to get started.
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
