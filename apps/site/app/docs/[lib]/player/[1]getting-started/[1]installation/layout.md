{% component this="./PathManager.svelte" /%}

# Installation

This section will get you up and running with the library. You'll find specific instructions below
depending on the type of installation method (NPM or CDN), library (HTML, React, etc.), and provider
(Audio, Video, HLS, etc.) you opt to use.

{% steps %}

{% step orientation="vertical" %}

## Select Install Method {% slot="title" %}

{% select_install_method /%}

{% /step %}

{% step orientation="vertical" %}

## Select JS Library {% slot="title" %}

{% select_js_lib /%}

{% /step %}

{% step orientation="vertical" %}

## Select Media Provider {% slot="title" %}

{% select_media_provider /%}

{% /step %}

{% step orientation="vertical" %}

## Select Styling {% slot="title" %}

{% select_styling /%}

{% /step %}

<slot />

{% /steps %}
