---
title: Editor Setup
description: Editor plugins and settings that can improve the developer experience when working with Vidstack.
---

# {% $frontmatter.title %}

This section will look at editor plugins and settings that can improve the developer experience
when working with Vidstack.

## TypeScript

We've written the player library with TypeScript, and we distribute all types with the
`vidstack` package. VSCode will detect them by default, but global DOM APIs will not be
automatically updated:

```js
// ❌ The type will default to `Element` instead of `MediaPlayerElement`.
const player = document.querySelector('media-player');
```

You can resolve this by adding the following to your TypeScript configuration file:

```json {% title="tsconfig.json" copyHighlight=true highlight="3" %}
{
  "compilerOptions": {
    "types": ["vidstack/globals"]
  }
}
```

## VSCode

VSCode provides support for extending the known HTML entities through
[VSCode Custom Data](https://github.com/microsoft/vscode-custom-data). Once set up, it enables
autocomplete suggestions for custom player elements and on-hover information such as
documentation and type data.

![Before and after screenshot difference of using the VSCode custom data extension.]($lib/img/vscode-autocomplete.png)

{% steps %}

{% step %}

### Create Settings File {% slot="title" %}

{% slot name="description" %}
Create a VSCode settings JSON file at the root of your project directory.
{% /slot %}

```bash {% copy=true %}
touch .vscode/settings.json
```

{% /step %}

{% step %}

### Add Custom HTML Data {% slot="title" %}

{% slot name="description" %}
Add the custom HTML data file path to `html.customData` inside the newly created settings file.
{% /slot %}

```json {% title=".vscode/setting.json" copy=true %}
{
  "html.customData": ["./node_modules/vidstack/vscode.html-data.json"]
}
```

{% /step %}

{% /steps %}
