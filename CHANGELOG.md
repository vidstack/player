# Changelog

All notable changes to this project will be documented in this file.

## [unreleased]

### ✨ Features

#### Player

- new `sliderChaptersMinWidth` layouts prop ([441c54e](https://github.com/vidstack/player/commit/441c54e08f4c9e02b97c1d274801493e5dc7aca3))
- allow json to be passed directly to track `content` prop ([f20e904](https://github.com/vidstack/player/commit/f20e904311b99714a325d0ede1a57b7432379e50))
- new `clipStartTime` and `clipEndTime` player props ([f190651](https://github.com/vidstack/player/commit/f1906515ccd103c0ef6e40d6bb11317fc45d8e53))
- new `disabled` prop on gesture component ([0a1cc02](https://github.com/vidstack/player/commit/0a1cc022595f994f2113c0639284b2de7f25eb0e))
- new `posterLoad` player prop ([ea2a9e7](https://github.com/vidstack/player/commit/ea2a9e76d71067e864e660b78c620650ddc3cdd9))
- new `load="play"` player option ([1b7389c](https://github.com/vidstack/player/commit/1b7389c6d11da5eb0c964b0e540e68af9db026d6))
- new `storageKey` player prop ([b397859](https://github.com/vidstack/player/commit/b3978594384945e759f02ee6ac2bc59a6265fa0d))

#### Player (React)

- default layout slots ([209d400](https://github.com/vidstack/player/commit/209d40034784f4a8c43729e8ff4efc1730484f59))

### 🐛 Bug Fixes

#### Player

- call ready state on text track with content only ([d3aad91](https://github.com/vidstack/player/commit/d3aad91abf67141034bf67d3b1906e9aa750fc54))
- fill last slider chapter gap based on duration difference ([32ed5d5](https://github.com/vidstack/player/commit/32ed5d55e95690e281849c17db83cc69ca0f2912))
- youtube should fire seeking and not play on initial seek ([5f11163](https://github.com/vidstack/player/commit/5f11163e48b451d2a3b1fa4291408a083d09c99e))
- vimeo should fire seeking ([298be0c](https://github.com/vidstack/player/commit/298be0c3bd30eb0d2e917ef60be6359d4ccacf4d))
- remotion provider should fire seeking ([5c4c359](https://github.com/vidstack/player/commit/5c4c3590b2f2f9f6ba2e25e8299da8b242cf18ed))
- improve looping behaviour ([23fd34f](https://github.com/vidstack/player/commit/23fd34ff9559feea418362321294c5acb27c01ee))
- accessibility warning on iframes ([51e3697](https://github.com/vidstack/player/commit/51e3697e98124dcfcadbd392c26d581658fc06be))
- switching src on cdn throwing ([5565724](https://github.com/vidstack/player/commit/55657244097d7579d512687845b22398bcd9f054))
- include tooltip left/right default theme styles ([80ad732](https://github.com/vidstack/player/commit/80ad732f6f301ab307f3c9067de6cf0ed4186340))

#### Player (React)

- default chapters menu should use compact layout when no thumbnails ([809098e](https://github.com/vidstack/player/commit/809098ec9ab2d6a68f4fb74d98b982f9a94b249f))
- click callbacks not working in menus ([fcb938f](https://github.com/vidstack/player/commit/fcb938fa420f871d2fb833a65e1b66f12da94f44))

## [1.9.8-next](https://github.com/vidstack/player/releases/tag/v1.9.8-next) (2023-12-15)

### 🐛 Bug Fixes

#### Player

- vimeo playing and progress events not fired ([a3fceac](https://github.com/vidstack/player/commit/a3fceacd46f953bb921abae527015719ce28a2c4))

#### Player (React)

- unexpected token `{` in iOS<17 ([5720ce3](https://github.com/vidstack/player/commit/5720ce369b868bdaf5ebbcd718b5e26e4069fa25))

## [1.9.7-next](https://github.com/vidstack/player/releases/tag/v1.9.7-next) (2023-12-13)

### 🐛 Bug Fixes

#### Player

- queue media requests ([01649b3](https://github.com/vidstack/player/commit/01649b333fd638e6c91c7f0d960df6942dc32f4f))
- identify unique captions tracks ([4b6b3a5](https://github.com/vidstack/player/commit/4b6b3a5aea63583c24debe0aff5476ab83d1a0cc))
- add hls network error retry logic ([be67987](https://github.com/vidstack/player/commit/be67987bada5f09dbddad68b7b168f08af17fb60))

#### Player (React)

- resolve invalid dom properties warning ([39e440d](https://github.com/vidstack/player/commit/39e440d47a09a01ab3b9361334d301d33ade89af))

## [1.9.6-next](https://github.com/vidstack/player/releases/tag/v1.9.6-next) (2023-12-12)

### 🐛 Bug Fixes

#### Player

- render captions when using embeds ([d20eba6](https://github.com/vidstack/player/commit/d20eba6bd4cd4d90d637ed51f5b37eb7a39fdde0))

## [1.9.5-next](https://github.com/vidstack/player/releases/tag/v1.9.5-next) (2023-12-12)

### 🐛 Bug Fixes

#### Player

- update maverick to `0.41.1` ([a646d4b](https://github.com/vidstack/player/commit/a646d4bc1cacf37c64541d807ed6c10696c4d3b6))

#### Player (React)

- add correct remotion component doc links ([2d68c89](https://github.com/vidstack/player/commit/2d68c89cea0db487c50e29d480d0e4f1f461c3e2))
- apply `asChild` when used on remotion components ([60385c3](https://github.com/vidstack/player/commit/60385c3efe1f38b40389dd766c80ba1ee987f222))

## [1.9.4-next](https://github.com/vidstack/player/releases/tag/v1.9.4-next) (2023-12-11)

### 🐛 Bug Fixes

#### Player

- cdn breaking due to mangle cache being created late ([6cd1dee](https://github.com/vidstack/player/commit/6cd1deea0307eddd7b3b28b734ada422021a4fe9))

## [1.9.3-next](https://github.com/vidstack/player/releases/tag/v1.9.3-next) (2023-12-10)

### 🎨 Styling

#### Player (React)

- refactor player callbacks ([8524a6d](https://github.com/vidstack/player/commit/8524a6d41aa3436cf50bf364513144595c9e5a03))
- refactor remotion provider ([ccbbff3](https://github.com/vidstack/player/commit/ccbbff3bc52294ed97b60097be1c82205b1f76f9))

### 🐛 Bug Fixes

#### Player

- use mangle cache for deterministic chunks ([48b8324](https://github.com/vidstack/player/commit/48b8324a8b814006a108fb8d48f6c1d4a6504bfb))
- chapters menu should update on cue changes ([574a0a3](https://github.com/vidstack/player/commit/574a0a326ef16c57a97702e39aef91b7b3d62c15))

## [1.9.2-next](https://github.com/vidstack/player/releases/tag/v1.9.2-next) (2023-12-09)

### 🐛 Bug Fixes

#### Player

- initialize muted/volume correctly when using instance setters ([87561b2](https://github.com/vidstack/player/commit/87561b2f564a27a3c4dd7baa31bbd368a9be857d))

#### Player (React)

- stable waiting detection in remotion provider ([4ca23a8](https://github.com/vidstack/player/commit/4ca23a8331c487e754aca02429ced31170f59f73))

## [1.9.1-next](https://github.com/vidstack/player/releases/tag/v1.9.1-next) (2023-12-08)

### 🐛 Bug Fixes

#### Player

- fire seeked event when vimeo video paused ([a8131a1](https://github.com/vidstack/player/commit/a8131a14244fd477a82f8f07f5274dc28f96ff8b))

#### Player (React)

- move remotion to completely separate entry ([6a74780](https://github.com/vidstack/player/commit/6a747800258b75ff9e5101ead35f191ff9032db8))
- remotion provider should fire seeked ([d9322ee](https://github.com/vidstack/player/commit/d9322eecdb9ae5c66bbb1289d93cb85c31b2eaf9))

## [1.9.0-next](https://github.com/vidstack/player/releases/tag/v1.9.0-next) (2023-12-08)

### ✨ Features

#### Player (React)

- remotion provider ([955d1ec](https://github.com/vidstack/player/commit/955d1ecd8aac175ebee4e3634ed71e53f6e15241))

### 🐛 Bug Fixes

#### Player

- maintain volume state across provider changes ([902a666](https://github.com/vidstack/player/commit/902a6667a0bbe58e51aa417f0af4fadc78ed7ea2))

#### Player (React)

- use slider hooks throwing on setup ([6088de7](https://github.com/vidstack/player/commit/6088de7471d204757a6c69f00c23019a6591ed4a))

## [1.8.3-next](https://github.com/vidstack/player/releases/tag/v1.8.3-next) (2023-12-04)

### 🐛 Bug Fixes

#### Player

- prefer setting attrs on spinner elements ([1be676a](https://github.com/vidstack/player/commit/1be676a7074c375ba25db2919ea6aabd886b0d05))

## [1.8.2-next](https://github.com/vidstack/player/releases/tag/v1.8.2-next) (2023-12-04)

### 🐛 Bug Fixes

#### Player

- mute button not working with vimeo provider ([b387e8f](https://github.com/vidstack/player/commit/b387e8f2fbbdd5644a6053cc0e22b4a048c5cf67))

## [1.8.1-next](https://github.com/vidstack/player/releases/tag/v1.8.1-next) (2023-12-02)

### 🐛 Bug Fixes

#### Player

- only apply default aspect ratio to video view ([9b95a50](https://github.com/vidstack/player/commit/9b95a501957781e48f1db03d4e753e4c3badb64d))

## [1.8.0-next](https://github.com/vidstack/player/releases/tag/v1.8.0-next) (2023-12-02)

### ✨ Features

#### Player

- new `hideControlsOnMouseLeave` player prop ([a481351](https://github.com/vidstack/player/commit/a481351524e5b79707f039de328a9ca9d428a865))
- new `selector` tailwind plugin option ([e051bd2](https://github.com/vidstack/player/commit/e051bd271c5ad13f28a898d61baec8c4f99ee255))
- new spinner component ([e0b0ab1](https://github.com/vidstack/player/commit/e0b0ab1424c8a61e9a687b731a52eac20eea460a))
- expose `hideOnMouseLeave` prop on controls component ([7eeabdd](https://github.com/vidstack/player/commit/7eeabddbd28f7e114a57ebea7d2a627adc8ad430))

### 🐛 Bug Fixes

#### Player

- set default aspect ratio of 16/9 ([0e385a2](https://github.com/vidstack/player/commit/0e385a2cbd030050c9a70c80533398193e151df0))
- remove const enum usage to simplify bundled output ([fff8c36](https://github.com/vidstack/player/commit/fff8c3601430352c4f9dd088c00b3488657ca7fa))
- only fullscreen video view by default on mobile ([b58616a](https://github.com/vidstack/player/commit/b58616add372e50191652486b405f0751fdeb403))
- title not updating after init ([1c82248](https://github.com/vidstack/player/commit/1c8224831789935ec562b9db1c630dffe85f33b9))
- cursor should not dissapear while starting ([273d30b](https://github.com/vidstack/player/commit/273d30be296223f9cba7cd3e9709b3400443ba25))

## [1.7.0-next](https://github.com/vidstack/player/releases/tag/v1.7.0-next) (2023-11-30)

### ✨ Features

#### Player

- vimeo provider ([42d0730](https://github.com/vidstack/player/commit/42d07302bd435c89eb7b1456e5b00883c2d33c7c))

### 🐛 Bug Fixes

#### Player

- disable click/touchstart event when toggles are disabled ([7c1ce4d](https://github.com/vidstack/player/commit/7c1ce4d41b4dbac117a4e98df870a95851435094))
- clear media layout children correctly ([67aa63c](https://github.com/vidstack/player/commit/67aa63c9efe2032f65d4b277bdf9fce2b3e21114))

#### Player (React)

- speed normal label not using translations ([1b72abc](https://github.com/vidstack/player/commit/1b72abccf04e114d63142d423e515d0e8fa23daa))
- updating current time on page transitions throws ([ed8b646](https://github.com/vidstack/player/commit/ed8b64694f2b5a74518ca2d82467a763feefbb2d))

## [1.6.2-next](https://github.com/vidstack/player/releases/tag/v1.6.2-next) (2023-11-26)

### 🐛 Bug Fixes

#### Player

- add gap between default slider chapter title and value ([8d58a80](https://github.com/vidstack/player/commit/8d58a800552a6ef18c9d7c4cb3e8e9c874cc792e))
- chapter title not initialized correctly ([ad1bc47](https://github.com/vidstack/player/commit/ad1bc475c651e16a66f5dbeb7eb259ab221cb31b))
- media layout not cloning templates correctly ([a258f34](https://github.com/vidstack/player/commit/a258f3444601096b0296ae94322efc21da4c972b))

## [1.6.1-next](https://github.com/vidstack/player/releases/tag/v1.6.1-next) (2023-11-24)

### 🐛 Bug Fixes

#### Player

- youtube provider chunk not split ([85dfa1a](https://github.com/vidstack/player/commit/85dfa1a1c3862ec7d5ced7ff8305dd0b92305c67))

## [1.6.0-next](https://github.com/vidstack/player/releases/tag/v1.6.0-next) (2023-11-24)

### ✨ Features

#### Player

- youtube provider ([024a797](https://github.com/vidstack/player/commit/024a797c7e66c00bba65465909b97995ee3f25b9))

### 🐛 Bug Fixes

#### Player

- can use video presentation throwing ([aff2d29](https://github.com/vidstack/player/commit/aff2d29465f68861a1869e43e89c0695b9e4bc71))
- use native controls for youtube on ios safari ([23cd9a9](https://github.com/vidstack/player/commit/23cd9a9bfd5266a36d607604114a15f3e845a9fb))
- resolve a few event type trigger issues ([fc19c33](https://github.com/vidstack/player/commit/fc19c33169025e1e853b9e87b244e9c3dc49486d))

## [1.5.7-next](https://github.com/vidstack/player/releases/tag/v1.5.7-next) (2023-11-21)

### 🐛 Bug Fixes

#### Player

- webpack parse error in regions css calc ([3ca3213](https://github.com/vidstack/player/commit/3ca32136e0524c7fa65994e3c6cda0f3b0d957a8))
- add bg color to default poster theme ([766aa7a](https://github.com/vidstack/player/commit/766aa7a9f5cc22a4c567d8025f3acb51fe898b4d))
- update slider chapters when track mode toggled ([8cf48b4](https://github.com/vidstack/player/commit/8cf48b436ebc3ec394da24ce18c5273688f7f71f))
- dynamically update slider chapters ([362a1fc](https://github.com/vidstack/player/commit/362a1fc75032bf2d240860c721bd59969d78ad65))
- source select loop when using fallback header ([ec8a4f9](https://github.com/vidstack/player/commit/ec8a4f9c3c2cc121cb433176806dbf5a333ea0bb))
- do not preconnect to jsdelivr for hls when imported ([f404094](https://github.com/vidstack/player/commit/f40409432307fede0a94f124f0ec18c2933dfe56))

## [1.5.6-next](https://github.com/vidstack/player/releases/tag/v1.5.6-next) (2023-11-14)

### ✨ Features

#### Player

- include provider in can play event detail ([15a70d3](https://github.com/vidstack/player/commit/15a70d3e0e944d21c086c9823693dda35638f138))

### 🐛 Bug Fixes

#### Player

- css normalize affecting menu radios ([f5c9c67](https://github.com/vidstack/player/commit/f5c9c67add8976cac23129cb805d9ab63f7384b1))
- broken quality switch docs link ([f81d533](https://github.com/vidstack/player/commit/f81d533e617f567c5ef02e44228d915da29e6f33))
- missing closing calc bracket on placement offset ([234a34e](https://github.com/vidstack/player/commit/234a34e6cd193f1236acce6742ea534ae014e197))
- include text content height in menu height calc ([feb6627](https://github.com/vidstack/player/commit/feb66270fd615e40f9b8e54c4b3bfb84752bad20))
- accept standard child button as tooltip trigger ([5e5c1b9](https://github.com/vidstack/player/commit/5e5c1b905fcf5b256757944d19f2d687044059ef))
- add focus styles to live button default theme ([6261f18](https://github.com/vidstack/player/commit/6261f1809d02b5d0de31116c3e71ea1cd0405414))
- vertical slider thumb size is incorrect ([96f16f6](https://github.com/vidstack/player/commit/96f16f654f0d2e2342213d4b49bb3dbb1ce4d606))
- menu close icon looks slightly off ([1322167](https://github.com/vidstack/player/commit/1322167aeb4c8eb9939208c2151a58983cd946b9))
- include slider chapters css vars docs ([b38f09c](https://github.com/vidstack/player/commit/b38f09cdfec9bc96c79c3ad5feee5fe84b6599e5))
- autoplay error data attr should be boolean ([d2e1eeb](https://github.com/vidstack/player/commit/d2e1eeb4b3e63869e571720d5ee9e0552bb151f5))
- slider value attr not updating state ([b7164cc](https://github.com/vidstack/player/commit/b7164cc170848da760f717ea93f198865f78e56c))

## [1.5.5-next](https://github.com/vidstack/player/releases/tag/v1.5.5-next) (2023-11-07)

### 🐛 Bug Fixes

#### Player

- `keep-alive` jsx type should be optional ([e8a73c0](https://github.com/vidstack/player/commit/e8a73c0c8fc0f45f036c590faafd94e6c47cdc80))

## [1.5.4-next](https://github.com/vidstack/player/releases/tag/v1.5.4-next) (2023-11-07)

### 🐛 Bug Fixes

#### Player

- avoid re-appending trigger event on abort ([11ade5c](https://github.com/vidstack/player/commit/11ade5c34249362645c9deb1bc613189c02ce571))
- include `keep-alive` in framework jsx types ([b8ea805](https://github.com/vidstack/player/commit/b8ea805c43e18307087dbf29708f14d7586508ec))

## [1.5.3-next](https://github.com/vidstack/player/releases/tag/v1.5.3-next) (2023-11-07)

### 🐛 Bug Fixes

#### Player

- `playsinline` not initializing correctly ([dbf7785](https://github.com/vidstack/player/commit/dbf778560935e9d5395ba7e1720f5bf16efa9cc4))
- scroll and zoom gestures not working on iphone ([671cdaf](https://github.com/vidstack/player/commit/671cdafc2054d18a5a8bfcc8e0e415538b35ee83))

## [1.5.2-next](https://github.com/vidstack/player/releases/tag/v1.5.2-next) (2023-11-06)

### ✨ Features

#### Player

- expose `ios-controls` in tailwind ([ae56f15](https://github.com/vidstack/player/commit/ae56f15d5d467aca2789f1affbdc97d6c348a7fa))

### 🐛 Bug Fixes

#### Player

- update chapter index correctly on live streams ([8b9fa4b](https://github.com/vidstack/player/commit/8b9fa4b87fbd94bbfba519b9ce06962008fbed77))
- initial seek on live:dvr should not go to edge ([f1837ad](https://github.com/vidstack/player/commit/f1837adec7584b514cafc6e58fdb97a63c74be78))
- better handle ios controls ([5820094](https://github.com/vidstack/player/commit/582009428f60663c95aef2b67dc7c89cbf69b81d))
- native renderer might be null due to race condition ([5e2d90c](https://github.com/vidstack/player/commit/5e2d90c3ab95c564b554cbda39823bda8d3a730b))
- show slider chapters on larger mobile landscape ([7c0416a](https://github.com/vidstack/player/commit/7c0416a05ecdeacbb157813a35b88bac093b0713))
- use native poster if not playsinline on ios safari ([5009ddf](https://github.com/vidstack/player/commit/5009ddf6002ceb20809ccdb9fc34dc8f45708f14))

## [1.5.1-next](https://github.com/vidstack/player/releases/tag/v1.5.1-next) (2023-11-01)

### ✨ Features

#### Player

- add orientation request events ([2ebd688](https://github.com/vidstack/player/commit/2ebd6884efc0b8c3c3c2a941dedb0acfc3d26fb2))

### 🐛 Bug Fixes

#### Player

- add missing media event details ([e79ad85](https://github.com/vidstack/player/commit/e79ad8524a8507f897c5e6acb7b38b4375e8568b))

## [1.5.0-next](https://github.com/vidstack/player/releases/tag/v1.5.0-next) (2023-10-30)

### ✨ Features

#### Player

- thumbnails now support json ([16bdd0d](https://github.com/vidstack/player/commit/16bdd0db85cfe4969519de473da70be7e8c6ff6e))

### 🐛 Bug Fixes

#### Player (React)

- `useMediaState` throwing when given player ref ([18789bc](https://github.com/vidstack/player/commit/18789bce7aff44d3701e58a07411b9749982da40))
- `media-captions` should be safe to use on server ([b986bf8](https://github.com/vidstack/player/commit/b986bf864ee1c468dda93a827c99d71cc4b8890d))

## [1.4.9-next](https://github.com/vidstack/player/releases/tag/v1.4.9-next) (2023-10-29)

### 🐛 Bug Fixes

## [1.4.8-next](https://github.com/vidstack/player/releases/tag/v1.4.8-next) (2023-10-29)

### 🐛 Bug Fixes

#### Player

- allow multiple thumbnail images ([fa7137d](https://github.com/vidstack/player/commit/fa7137dec394ca394ef38acafe3299d561f7490c))
- clear text tracks correctly ([8e9bc7e](https://github.com/vidstack/player/commit/8e9bc7ed0e0c9d1ffb55dd02732489a741aefd9c))
- expose value setter on radio group ([bd6e123](https://github.com/vidstack/player/commit/bd6e12317d128c33535cd7937517794149390162))
- apply media queries in player query list correctly ([128151f](https://github.com/vidstack/player/commit/128151f3864a9a8213df6aa522031011a66cff0c))
- controls should only be hidden on iphone under certain conditions ([13162fd](https://github.com/vidstack/player/commit/13162fd04701e7f7807eb6c75ce6a17a42cd7a39))
- update initial duration in can play correctly ([2534cae](https://github.com/vidstack/player/commit/2534caec8d7144b173855b177ca494957b7439ff))
- spacing issue between time and slider on mobile audio layout ([c8b9f3e](https://github.com/vidstack/player/commit/c8b9f3ec2a56bfb3ec6bef2fc25b59ea71bd2848))
- add `playsInline` prop on player instance ([e2ae08e](https://github.com/vidstack/player/commit/e2ae08e8dd14d0304adda0bb5bc88a668996f4eb))
- update `playsinline` state on prop change ([4efe80b](https://github.com/vidstack/player/commit/4efe80bbbde7926de3623d733e92d470093337cc))

## [1.4.7-next](https://github.com/vidstack/player/releases/tag/v1.4.7-next) (2023-10-25)

### 🐛 Bug Fixes

#### Player

- resolve thumbnails with relative base url ([b3f4d99](https://github.com/vidstack/player/commit/b3f4d99462fed8952eb04141a7492705ad911592))
- switching providers loses muted state ([9d68484](https://github.com/vidstack/player/commit/9d6848497379ebf85248bca86108b796f5d1fff2))
- use `null` as default value for tracked error states ([7e5abdd](https://github.com/vidstack/player/commit/7e5abdddbe83f76e49bebe713b9c4e10f90ab6ce))

## [1.4.6-next](https://github.com/vidstack/player/releases/tag/v1.4.6-next) (2023-10-24)

### 🐛 Bug Fixes

#### Player

- prevent buttons from submitting a parent form (#974) ([73d2b2e](https://github.com/vidstack/player/commit/73d2b2e44e0f8b28dbfa87b07ea1aeaba21da175))
- swipe gesture interfering with scroll ([b6ee427](https://github.com/vidstack/player/commit/b6ee4274195ce9c5edb36cdde1bd184111c243d6))
- invalid autoplay tracking and freezing ([1aa4cf3](https://github.com/vidstack/player/commit/1aa4cf319b94247999af26dd69ddd81d641836e4))

#### Player (React)

- unexpected token `{` on iOS<16.4 ([e1b8d80](https://github.com/vidstack/player/commit/e1b8d80ccfff5312b7ecfcfa93991bc9345bfe37))

## [1.4.5-next](https://github.com/vidstack/player/releases/tag/v1.4.5-next) (2023-10-23)

### 🐛 Bug Fixes

#### Player

- swipe gesture freezes on android ([75e1113](https://github.com/vidstack/player/commit/75e1113ad9e1b36a4b2e037b16b6801b165c5dd5))
- respect `playsinline` on all touch devices ([ebc5771](https://github.com/vidstack/player/commit/ebc57719a02c2dfaf6fb41d5370179bd61d6c9a9))
- controls component delay overriding player prop ([35bf1e0](https://github.com/vidstack/player/commit/35bf1e0b1f4bc9bea348300e36f3392b840e68d8))
- hide controls on iphone when started and not playsinline ([99b061a](https://github.com/vidstack/player/commit/99b061aae5ec33dc1c82ade754323c634ac1f59a))
- schedule disconnect destroy at end of raf queue ([2d4b9d0](https://github.com/vidstack/player/commit/2d4b9d0a4943e96dfc4b2fcb1924eb71feb6b6d4))

#### Player (React)

- slider chapters attempting to update after destroyed ([bf082fd](https://github.com/vidstack/player/commit/bf082fd40a6012fd4e76790d8234589ee10d99fe))

## [1.4.4-next](https://github.com/vidstack/player/releases/tag/v1.4.4-next) (2023-10-20)

### 🐛 Bug Fixes

#### Player

- audio view type should display contents ([1c7c8ca](https://github.com/vidstack/player/commit/1c7c8ca73a1cd62f1a35c4c11fcb316777578da7))
- focused slider keyboard should not affect another ([1f7b216](https://github.com/vidstack/player/commit/1f7b2162a00fd44d129f0dac9bc1aa5778e33b56))
- calling raf on menu attach throws server side ([90b8f11](https://github.com/vidstack/player/commit/90b8f115e5ce614fc8105a26f7498841f832619a))

## [1.4.2-next](https://github.com/vidstack/player/releases/tag/v1.4.2-next) (2023-10-19)

### ✨ Features

#### Player

- media key callbacks ([cc559bc](https://github.com/vidstack/player/commit/cc559bc3661a3b4921345fb41187ce16bea0916c))

### 🐛 Bug Fixes

#### Player

- better slider value defaults ([9dc50fe](https://github.com/vidstack/player/commit/9dc50fef887c771d6918575025819f21a574c1c1))
- prevent page scroll when interacting with sliders via keyboard ([f2c6454](https://github.com/vidstack/player/commit/f2c645498492cf0670d590bf49ae95c7cbff7029))

## [1.4.1-next](https://github.com/vidstack/player/releases/tag/v1.4.1-next) (2023-10-19)

### 🐛 Bug Fixes

#### Player

- resolve relative hls rendition uri ([c59c8fd](https://github.com/vidstack/player/commit/c59c8fdfca982fe58033d61c94980bf3065fae8f))
- simplify resolving relative thumbnail urls ([fb7e30e](https://github.com/vidstack/player/commit/fb7e30e0d38971eb8f6c548f24baa63cbc282f69))
- keep `isHLSSupported` pure ([4eb8b77](https://github.com/vidstack/player/commit/4eb8b77d9c4a51a597468bf282526b6559917311))
- align chapter title to start ([adace29](https://github.com/vidstack/player/commit/adace293f1b2c66556dde33c0dbc2ebf72d544a9))
- updating attrs after destroyed will throw ([1e7ad2b](https://github.com/vidstack/player/commit/1e7ad2b355b6aa399d95af1da409f63c66712a61))

## [1.4.0-next](https://github.com/vidstack/player/releases/tag/v1.4.0-next) (2023-10-18)

### ✨ Features

#### Player

- add j/l to global seek keys ([d87cb18](https://github.com/vidstack/player/commit/d87cb18c099a463569eb13807a59424be47466b8))
- new speed up and slow down keyboard shortcuts ([b1c26c5](https://github.com/vidstack/player/commit/b1c26c5b167a69f5707e98716b2c1dac8970c629))

### 🐛 Bug Fixes

#### Player

- set all labels and use translations ([a5a617d](https://github.com/vidstack/player/commit/a5a617d0bfe24acc7a108f9527e1d62c6db0544b))
- lighthouse passive perf warning ([fce730f](https://github.com/vidstack/player/commit/fce730f58efcd183b691f6f7da559de5fabb806f))
- forward global keyboard events to slider correctly and bound value ([5d70279](https://github.com/vidstack/player/commit/5d7027936d47ed294b490cce5175278069fafb95))
- avoid double controls on iphone ([da5de05](https://github.com/vidstack/player/commit/da5de05ab9bd08e756e51fa0a7501296477dbcd7))

#### Player (React)

- `useThumbnails` memo error ([09b41f6](https://github.com/vidstack/player/commit/09b41f674e7264664b9fbbaeed42ff531a70a0be))

## [1.3.0-next](https://github.com/vidstack/player/releases/tag/v1.3.0-next) (2023-10-17)

### 🐛 Bug Fixes

#### Player

- improve stream type detection ([7659ac1](https://github.com/vidstack/player/commit/7659ac1915a8939e4b70524a35692a0d20192071))
- memory leak on provider change ([24f451f](https://github.com/vidstack/player/commit/24f451f811f77a55aa628cd182e9073d242f557a))
- normalize handling of time formatting across components ([6201a26](https://github.com/vidstack/player/commit/6201a26debc08a9cd3f36d454307047c5c61755e))

## [1.2.2-next](https://github.com/vidstack/player/releases/tag/v1.2.2-next) (2023-10-17)

### 🐛 Bug Fixes

#### Player

- update default layout component doc links ([5ac0697](https://github.com/vidstack/player/commit/5ac0697ea2a18f1400730632843817f10d17aaf1))
- attach gesture event triggers ([eab1553](https://github.com/vidstack/player/commit/eab1553a4a27b31d56818bcb52528b3e7deccbfd))

#### Player (React)

- add gesture event callbacks ([bbca26a](https://github.com/vidstack/player/commit/bbca26ae73256066d4949d460b8b78fd53a7cd26))

## [1.2.1-next](https://github.com/vidstack/player/releases/tag/v1.2.1-next) (2023-10-17)

### 🐛 Bug Fixes

#### Player

- update web component docs links ([0433f99](https://github.com/vidstack/player/commit/0433f99194d80b03350c89592e24c05ae5beb984))

## [1.2.0-next](https://github.com/vidstack/player/releases/tag/v1.2.0-next) (2023-10-16)

### 🐛 Bug Fixes

#### Player

- toggle button throws on press ([5278d63](https://github.com/vidstack/player/commit/5278d63f8c2c585fd71ff9f541b2c699c0b7aece))
- destroying while playing can throw errors in async paths ([65cfdd5](https://github.com/vidstack/player/commit/65cfdd51ae18d18fbc56f1822b73ea484ce6fa82))
- css reset messing up react settings menu ([df24ee5](https://github.com/vidstack/player/commit/df24ee5b6bbff8f30f73b828027875ecdcffee3f))
- focus padding not applied to popup chapters menu ([d2f4c84](https://github.com/vidstack/player/commit/d2f4c846f52156a046fd49080af72a747fa1bd9f))
- do not load hls src on dom connect ([92fa791](https://github.com/vidstack/player/commit/92fa7912009e250298d33506c2acb1a22131f189))
- slider chapters should fill all tracks when media has ended ([599eaa1](https://github.com/vidstack/player/commit/599eaa18c56d187f20ea81c8c5f3417f2ed8335b))
- add new gesture events `will-trigger` and `trigger` ([29fd986](https://github.com/vidstack/player/commit/29fd986c9cdda42f6fae6fcff7c038a8b2c8d1b5))

## [1.1.10-next](https://github.com/vidstack/player/releases/tag/v1.1.10-next) (2023-10-10)

### 🐛 Bug Fixes

#### Player

- popper align offset direction is reversed ([39fd92c](https://github.com/vidstack/player/commit/39fd92c16c6ba80b2f545a9afe3f90e26a10206f))
- text renderer throwing on cdn bundle ([8b6120b](https://github.com/vidstack/player/commit/8b6120b4e91cf6c6443d4f4d07be2b57a847870b))
- do not reset media when `keepAlive` ([a67b24f](https://github.com/vidstack/player/commit/a67b24fee9455a7cf3adf350f4fcf5f8387643c2))
- prefer `@media` over `@container` due to support ([5b9908f](https://github.com/vidstack/player/commit/5b9908fc89d3e3a39b9496e88e9ca8298acba7a8))

## [1.1.9-next](https://github.com/vidstack/player/releases/tag/v1.1.9-next) (2023-10-09)

### 🐛 Bug Fixes

#### Player

- cdn loading wrong version of media captions ([43dc2e7](https://github.com/vidstack/player/commit/43dc2e7accc80e42497b8fc19c617b4903c0c4f2))
- remounting default layout breaks ([afcac0d](https://github.com/vidstack/player/commit/afcac0d8359d19d971cf00101ff758879cf66280))
- prefer component name when logging ([5e5d698](https://github.com/vidstack/player/commit/5e5d6981ba0ab57c5ebd68ff3921ef2d8f5f70e9))

#### Player (React)

- not loading on remount ([f8f785f](https://github.com/vidstack/player/commit/f8f785f36fe16ba864c5ef53d8db961e64ff08a8))

#### React

- use vidstack pkg source code when building ([9131ef0](https://github.com/vidstack/player/commit/9131ef061e353266b4f1a703d92bf23a1c2688a9))

## [1.1.8-next](https://github.com/vidstack/player/releases/tag/v1.1.8-next) (2023-10-06)

### 🐛 Bug Fixes

#### Player

- check stream type again on can play event ([78e126e](https://github.com/vidstack/player/commit/78e126e1cff154c01a25265add1e416fb504fe46))
- fill all slider chapters when live edge ([d8283a6](https://github.com/vidstack/player/commit/d8283a6d165a7fdeaaa7393acb24ddeaea51a709))

#### Player (React)

- clean up ref instance types ([6890b58](https://github.com/vidstack/player/commit/6890b589499820ff6766c152a795d539f2055008))

## [1.1.7-next](https://github.com/vidstack/player/releases/tag/v1.1.7-next) (2023-10-04)

### 🐛 Bug Fixes

#### Player (React)

- react import missing on audio layout ([6e003a6](https://github.com/vidstack/player/commit/6e003a635071934aa7b8d097fb915b3b5fe54737))

## [1.1.5-next](https://github.com/vidstack/player/releases/tag/v1.1.5-next) (2023-10-03)

### 🐛 Bug Fixes

#### Player

- align video to center of provider container ([67fadf6](https://github.com/vidstack/player/commit/67fadf65bd90e75430ce757d643caeb7f0037794))
- hide tooltips on mobile ([e635ad0](https://github.com/vidstack/player/commit/e635ad0e58e5464d47d0135fbb9847b19bebb07b))
- show default start duration on mobile only when available ([1d3427d](https://github.com/vidstack/player/commit/1d3427daa3ee983dd76169314b1302d2d7705461))
- show buffering in default layout when stream type unknown ([cfd4670](https://github.com/vidstack/player/commit/cfd4670e6ca57358c58f7d23d2084d34868dd9f3))
- use dvh over vh for menus ([aebf75e](https://github.com/vidstack/player/commit/aebf75e4b2f49b0daea4a4ec1e4b9a8706b4fb16))
- media remote hook not working and activate dev logging ([84bfe8a](https://github.com/vidstack/player/commit/84bfe8a7b8ebb51ba56c490c5cd842b10fe79a3f))

## [1.1.4-next](https://github.com/vidstack/player/releases/tag/v1.1.4-next) (2023-10-02)

### 🐛 Bug Fixes

#### Player

- remove filling slider end gap for now ([029037b](https://github.com/vidstack/player/commit/029037b69c5c22ffdbf6c1133673ca6c14cdacb7))

## [1.1.3-next](https://github.com/vidstack/player/releases/tag/v1.1.3-next) (2023-10-02)

### 🐛 Bug Fixes

#### Player

- account for rounding filling slider chapter end gap ([8faf9fd](https://github.com/vidstack/player/commit/8faf9fd9a4469a14430b02cf585da50166177cf3))

## [1.1.2-next](https://github.com/vidstack/player/releases/tag/v1.1.2-next) (2023-10-02)

### 🐛 Bug Fixes

#### Player

- unsupported styles in captions file ([475c089](https://github.com/vidstack/player/commit/475c0895f74826207c331ce1037a057108dea77e))
- fill start/end chapter gaps correctly ([9948109](https://github.com/vidstack/player/commit/994810999824d95b133c8cea106dffd6018b6650))
- aspect ratio breaks on safari ([611a418](https://github.com/vidstack/player/commit/611a418efc1bdb63ce5427d369391671257d0ccb))
- incorrect live stream detection on safari ([392ec6e](https://github.com/vidstack/player/commit/392ec6e8412b0447d04745387a097ebdab6484d6))
- default audio layout menus not offset correctly ([1e212b8](https://github.com/vidstack/player/commit/1e212b8053872a7507c02973655abd1fbc538121))
- slider chapters are being built multiple times on init ([93f27a2](https://github.com/vidstack/player/commit/93f27a2305ef8e0d1d703070f500b73da373d129))
- `useMediaRemote` throws on init ([57c8d07](https://github.com/vidstack/player/commit/57c8d076159d326be33be52729630386d8d3088e))

## [1.1.0-next](https://github.com/vidstack/player/releases/tag/v1.1.0-next) (2023-10-01)

### ✨ Features

#### Player

- add live stream support to default layout ([622d812](https://github.com/vidstack/player/commit/622d812c921fa6f20d9386f04a98a52df3d676e2))

### 🐛 Bug Fixes

#### Player

- do not show volume slider when play button is interacted with ([757841d](https://github.com/vidstack/player/commit/757841da3efae66939c588042d9d278d598a8ccf))

## [1.0.5-next](https://github.com/vidstack/player/releases/tag/v1.0.5-next) (2023-10-01)

### 🐛 Bug Fixes

#### Player

- view type not set when initial src is hls ([a16e644](https://github.com/vidstack/player/commit/a16e64403bc22cbc06de80d3d2d63baa49c33bb7))
- log warning when autoplay fails first time ([666103b](https://github.com/vidstack/player/commit/666103b306675404e210090432f8625796d5b722))

## [1.0.4-next](https://github.com/vidstack/player/releases/tag/v1.0.4-next) (2023-09-30)

### 🐛 Bug Fixes

#### Player (React)

- initialize sources correctly during ssr ([ee688f8](https://github.com/vidstack/player/commit/ee688f8077597d0fa560ac675334f0752ac89480))

## [1.0.3-next](https://github.com/vidstack/player/releases/tag/v1.0.3-next) (2023-09-30)

### ✨ Features

#### React

- add rsc support and split up default ui audio/video ([4e390ac](https://github.com/vidstack/player/commit/4e390ac91b75996447ccce90f7ce94322937740e))

### 🐛 Bug Fixes

#### Player

- include `elements.d.ts` in package files ([e88f816](https://github.com/vidstack/player/commit/e88f816f16a1b533e1dc56c788e701be1aa93195))
- add hydration issue warning when rendering default layout ([7c902a4](https://github.com/vidstack/player/commit/7c902a4d09a78c2f0c8f3ee04db90a7bae2fc629))
- initialize `playsinline` correctly ([a73b537](https://github.com/vidstack/player/commit/a73b537a7f94f69386bcd74bc17cc9573c57b9a9))

#### Player (React)

- dispatch on latest callback prop ([3c8d196](https://github.com/vidstack/player/commit/3c8d1967dc02a1058c6f255c32e734adad332467))
- volume slider not showing ([ad1481f](https://github.com/vidstack/player/commit/ad1481f8212bbea22bebe723e383fe2c128a88da))

#### React

- small layout tweaks and fixes ([716e22c](https://github.com/vidstack/player/commit/716e22c936319c744fb7347573e2b8ba9c748d5c))
