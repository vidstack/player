---
title: Video Player Installation (CDN)
description: Instructions to get your video player up and running through a CDN.
---

{% step %}

## Register Elements {% slot="title" %}

{% slot name="description" %}
Add the following `link` and `script` tags to register the custom media elements.
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
