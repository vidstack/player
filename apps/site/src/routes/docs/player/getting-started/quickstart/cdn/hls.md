---
title: HLS Player Installation (CDN)
description: Instructions to get your HLS player up and running through a CDN.
---

!!!step :title=Register Elements :desc=Add the following `script` tags to register the custom media elements.

```html:copy-highlight{4-5}
<!doctype html>
<html>
<head>
	<script type="module" src="https://cdn.jsdelivr.net/npm/@vidstack/player@next/dist-cdn/define/vds-media.js"></script>
	<script type="module" src="https://cdn.jsdelivr.net/npm/@vidstack/player@next/dist-cdn/define/vds-hls.js"></script>
</head>
<body>
	<!-- ... -->
</body>
</html>
```

!!!

!!!step :title=Add Player Markup :desc=Add the following player HTML boilerplate to get started.

```html:copy
<vds-media>
  <vds-hls
    loading="lazy"
    poster="https://media-files.vidstack.io/poster.png"
    preload="metadata"
  >
    <video
      controls
	    src="https://media-files.vidstack.io/hls/index.m3u8"
      poster="https://media-files.vidstack.io/poster-seo.png"
      preload="none"
    ></video>
  </vds-hls>
</vds-media>
```

!!!
