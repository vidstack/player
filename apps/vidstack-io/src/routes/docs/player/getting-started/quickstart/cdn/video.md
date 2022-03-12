---
title: Video Player Installation (CDN)
description: Instructions to get your video player up and running through a CDN.
---

!!!step :title=Register Element :desc=Add the following `script` tag to register the `vds-video-player` custom element.

```html:copy-highlight{4}
<!doctype html>
<html>
<head>
	<script type="module" src="https://cdn.jsdelivr.net/npm/@vidstack/player/dist-cdn/define/vds-video-player.js"></script>
</head>
<body>
	<!-- ... -->
</body>
</html>
```

!!!

!!!step :title=Add Player Markup :desc=Add the following player HTML boilerplate to get started.

```html:copy
<vds-video-player
	src="https://media-files.vidstack.io/hls/index.m3u8"
	poster="https://media-files.vidstack.io/poster.png"
	controls
	loading="lazy"
>
	<!-- `<source>` and `<track>` elements can go here. -->
	<vds-media-ui slot="ui">
  	<!-- UI elements go here. -->
	</vds-media-ui>
</vds-video-player>
```

!!!
