---
title: Video Player Installation
description: Instructions to get your video player installed and on-screen using HTML.
---

{% step %}

## Install NPM Package {% slot="title" %}

{% slot name="description" %}
Install `vidstack` and dependencies via NPM.
{% /slot %}

```bash {% copy=true %}
npm i vidstack
```

{% /step %}

{% step %}

## Register Elements {% slot="title" %}

{% slot name="description" %}
Register the custom media elements and base styles.
{% /slot %}

{% import_components /%}

{% /step %}

{% step %}

## Add Player Markup {% slot="title" %}

{% slot name="description" %}
Add the following player HTML boilerplate to get started.
{% /slot %}

{% player_markup /%}

{% /step %}
