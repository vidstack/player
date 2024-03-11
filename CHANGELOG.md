# Changelog

All notable changes to this project will be documented in this file.

## [unreleased]

### ✨ Features

#### Player

- audio gain support (#1145) ([c3e08c5](https://github.com/vidstack/player/commit/c3e08c57996a50c403b414b4d79b88b9deb3b0e5))
- new accessibility settings menu ([0b6470f](https://github.com/vidstack/player/commit/0b6470f0831a9536e405931cbf42790079925cfa))
- show example captions text on style change ([8ceae6b](https://github.com/vidstack/player/commit/8ceae6bee4e3de29a124f2e74d984f2391a76500))
- keyboard animations setting in default layout ([b63fa16](https://github.com/vidstack/player/commit/b63fa1624286c152c8e9e755f03a08d9a4b5ac11))
- loop setting in default layout ([5f07f55](https://github.com/vidstack/player/commit/5f07f55462057f6ff2fc5b6a337477f975fe85c9))
- media announcer ([533edc5](https://github.com/vidstack/player/commit/533edc5bbd9ff923bf3bb4b5fa31b81afce98062))
- announcements setting in default layout ([701f7ce](https://github.com/vidstack/player/commit/701f7ce21b895b8cf70972678023ca5193778b49))
- new speed slider component ([cd413ba](https://github.com/vidstack/player/commit/cd413ba578a7c8535a0fbbcb77f4566e9b1bcc22))
- new quality slider component ([e6d801a](https://github.com/vidstack/player/commit/e6d801a86fa3f0c505dffe83823d7ffe41ffaaf9))
- new default layout settings controls ([4718669](https://github.com/vidstack/player/commit/4718669117598423ae97647f33a78037a1d6d10e))
- support color preference in default theme ([0a96ec6](https://github.com/vidstack/player/commit/0a96ec6da17cda4c4bd6183b52c7c6d223fe8562))
- specify default theme color scheme ([9a10613](https://github.com/vidstack/player/commit/9a10613c9312326b00b4ec7bc4bfa0b16c76ce8e))
- add download button to default layout ([80488b6](https://github.com/vidstack/player/commit/80488b624aba6c38fa85f804496af34fc243bc5c))
- new slider steps component ([5623c98](https://github.com/vidstack/player/commit/5623c985b9b654cdf5d9695dbe19830c9302f24a))
- source qualities ([837daa0](https://github.com/vidstack/player/commit/837daa0be8230c68efdd39e2fc470c2487652746))

### 🐛 Bug Fixes

#### Player

- always include keyboard status updates ([82ec4a3](https://github.com/vidstack/player/commit/82ec4a3baf72ad3a350e9f572c6829be0dc53fb4))
- respect prefers reduced motion in default theme ([208a152](https://github.com/vidstack/player/commit/208a15295fb2c9f9ea8620284a78b57aa7b0639d))
- include provider file name hashes in cdn bundle ([5c76bbc](https://github.com/vidstack/player/commit/5c76bbc9f2e13ff23e2f061423a830cf07cc216c))
- improve volume slider popups ([07ebc12](https://github.com/vidstack/player/commit/07ebc129a295f70873e88184fb1c6116f4cc2da5))
- show title in default layout ([6adb7f4](https://github.com/vidstack/player/commit/6adb7f4f91dd93950a16c959eafb737963edc196))
- add deno to node exports ([22afcea](https://github.com/vidstack/player/commit/22afcea2ca4ab36647c1d706f75f9d2775ae54b1))
- add bun to node exports ([17afddd](https://github.com/vidstack/player/commit/17afdddcc13d014f3a84f78479cd09644dc12da1))
- show volume slider when available in small default layout ([20b9eab](https://github.com/vidstack/player/commit/20b9eab945fdcb177f665976d94dc728bbc3922a))
- include react example in source selection warning ([a3d6eb1](https://github.com/vidstack/player/commit/a3d6eb1ca16d62b00ad4e7669cd91cfaaf287efc))
- add workerd to node exports (#1198) ([dedd706](https://github.com/vidstack/player/commit/dedd706e761afaf681866e1f70155187a359b9bc))
- stop expensive updates when not visible ([be96bd2](https://github.com/vidstack/player/commit/be96bd29206b25b75a49dccba4e80e46fbdc2253))
- narrow player src types ([82988ca](https://github.com/vidstack/player/commit/82988ca75d42efc143688a2154fa6009b8e237a9))

#### Player (React)

- rename `DefaultKeyboardActionDisplay` to `DefaultKeyboardDisplay` ([9d573f9](https://github.com/vidstack/player/commit/9d573f984642629c7595911d2c621da404742b17))
- slider callbacks not firing ([a4fe4e0](https://github.com/vidstack/player/commit/a4fe4e0b8dd748dd6bc04a5372bd4d816f212197))

## [1.10.9-next](https://github.com/vidstack/player/releases/tag/v1.10.9-next) (2024-02-20)

### 🐛 Bug Fixes

#### Player

- correctly resolve current chapter index (#1174) ([275daa2](https://github.com/vidstack/player/commit/275daa2cb398775af556a6ecace52fc6b8f4ba61))
- external vimeo hls urls are not loading ([c774e5f](https://github.com/vidstack/player/commit/c774e5fb34ccdd476d94d1502b7d9c10196b47db))

## [1.10.8-next](https://github.com/vidstack/player/releases/tag/v1.10.8-next) (2024-02-20)

### ✨ Features

#### Player

- add seek keyboard animation display icons ([ff93604](https://github.com/vidstack/player/commit/ff9360455255b8e1a2e822832996655189cf7039))
- new `showMs` prop on slider value component ([4e23e26](https://github.com/vidstack/player/commit/4e23e26e3cd1f904f24308fa40abf3ca3572b9b4))
- save video quality in storage ([c8524dc](https://github.com/vidstack/player/commit/c8524dcbd919565f2e7b2532f494f4d50347ff14))

#### Player (React)

- expose controls group slots ([9e86ef2](https://github.com/vidstack/player/commit/9e86ef2c0db6766f108ff147ad24f27231a93a90))

### 🐛 Bug Fixes

#### Player

- video caption button incorrectly hidden on touch input ([dfed2dc](https://github.com/vidstack/player/commit/dfed2dc5b782d95a728d87b9077f569d5ad9b435))
- seek to live edge on play ([ed5e8ec](https://github.com/vidstack/player/commit/ed5e8ecb9d402f00b021e620627174a4b237a9ad))
- `min-live-dvr-window` attr not updating ([7491385](https://github.com/vidstack/player/commit/7491385ca5bee0cc63bac5a2275b4243cc32e97c))
- slider chapters should reset after seeking back on end ([4dd2012](https://github.com/vidstack/player/commit/4dd20127bccf179dcfd924a225de62f49e135308))
- last slider chapter not filled to end ([e804c19](https://github.com/vidstack/player/commit/e804c193fbe95d5f73a0e96b5fd89e0135216936))
- do not fetch embed poster if one is provided ([2503c5d](https://github.com/vidstack/player/commit/2503c5dfeb9c1a6787687cbfb0406804ea945b8e))
- use voice reader friendly labels ([6b9d999](https://github.com/vidstack/player/commit/6b9d99917b07333d8147c8c0272341253c82626c))

#### Player (React)

- throws on build if no player src is provided ([a26fd41](https://github.com/vidstack/player/commit/a26fd416086e3e624c747b16b7fa22e1544f7052))
- `noScrubGesture` should be optional in default layout ([a2a2f4a](https://github.com/vidstack/player/commit/a2a2f4a9a1e8ff292425dfc6771190765e653c54))

## [1.10.7-next](https://github.com/vidstack/player/releases/tag/v1.10.7-next) (2024-02-17)

### ✨ Features

#### Player (React)

- export `<DefaultVideoKeyboardActionDisplay />` ([5f5d40a](https://github.com/vidstack/player/commit/5f5d40ab57c8b5c795c4ece80e9bee9221eb4ac1))

### 🐛 Bug Fixes

#### Player

- log media errors in dev ([6cf4575](https://github.com/vidstack/player/commit/6cf4575ecdcbae2e63b84a01c685dbbd68052b83))
- restart keyboard display animations on key press ([2376735](https://github.com/vidstack/player/commit/2376735c556f93f7f71cd98c4ee43bc277010205))
- include source type attr for html providers ([9ab499e](https://github.com/vidstack/player/commit/9ab499eb630729004fe195d7b60b14210101ce66))

## [1.10.6-next](https://github.com/vidstack/player/releases/tag/v1.10.6-next) (2024-02-15)

### 🐛 Bug Fixes

#### Player

- duplicate `base.css` imports in bundler plugin ([808c490](https://github.com/vidstack/player/commit/808c4900594dac386a1d26219e656f9f88120c6d))
- `VTTContent` type missing array declarations ([7869e90](https://github.com/vidstack/player/commit/7869e900797689b303c1f4f05572e8a2399a6337))
- playback rate state not initializing correctly ([231b036](https://github.com/vidstack/player/commit/231b036bec89dd212c7d1cfc90fa326a105cce97))
- youtube provider should fire pause event on end ([35b1fb9](https://github.com/vidstack/player/commit/35b1fb9a15ca2cdbed7687ffdbb6e69c7309c913))
- default themed menu not interactable on mobile ([94b25fa](https://github.com/vidstack/player/commit/94b25faaef01c1604c2715127f48e7bf8c2a0750))
- `controls` prop setter on player instance missing ([9bfa26e](https://github.com/vidstack/player/commit/9bfa26e7576cf7d2636a5b56c5bd7145d6b8256a))
- watch menu button hint part changes ([a17239a](https://github.com/vidstack/player/commit/a17239a0e202ccd3406b75e4b995f06045c2139e))
- show thumbnail img once it has loaded ([ab86b55](https://github.com/vidstack/player/commit/ab86b559bb59e2dae3ff4ab27688e8464dafcd8e))
- pass media remote control to keyboard shortcut callbacks ([cfe2331](https://github.com/vidstack/player/commit/cfe2331ce8317f3c9005788792ef354d756a8da2))
- add separate key up and down callbacks to shortcuts ([b643602](https://github.com/vidstack/player/commit/b643602ee21abf51f38f3a7fce2f9368c31e2c37))

#### Player (React)

- poster showing broken image icon on load (#1153) ([3f00fbc](https://github.com/vidstack/player/commit/3f00fbcb914661d6803c84b483cff8a10447471e))
- setting `controls` causes warning ([8f1fe4d](https://github.com/vidstack/player/commit/8f1fe4d60a50f8b0077bd07ad8ea4f30f67e9502))

#### React

- setting prop to `undefined` should use default value ([aaf9b04](https://github.com/vidstack/player/commit/aaf9b04499fe093fd160218461e5a449e8062a0f))

## [1.10.5-next](https://github.com/vidstack/player/releases/tag/v1.10.5-next) (2024-02-06)

### ✨ Features

#### Player

- include separate default and plyr layout cdn imports ([c583cf0](https://github.com/vidstack/player/commit/c583cf0d56f819cefd8b0fca7bec95e4e5744350))

### 🐛 Bug Fixes

#### Player

- font size setting not applied in fullscreen ([2a882d0](https://github.com/vidstack/player/commit/2a882d0133e6410ec945a47969b3a80211bcae34))
- source objects failing provider loader checks ([d243793](https://github.com/vidstack/player/commit/d24379362d8eedcf0c747a46c864bef52bbbbffe))
- do not prevent f1-f12 keys from working ([6a06b57](https://github.com/vidstack/player/commit/6a06b578b98b2dda82ed9bd5d6b8ec2a6be57593))
- clipped video can not be replayed ([ad61932](https://github.com/vidstack/player/commit/ad61932d41ec2c26c0552d2a20166f5bc1064a75))
- vimeo url with `progressive_redirect` is not embed ([1cb9fee](https://github.com/vidstack/player/commit/1cb9fee7e72c965ef495fc43d05243af84cb2cbd))
- support unlisted vimeo videos ([2bfcce9](https://github.com/vidstack/player/commit/2bfcce9af5575ddc21124b9f1a9c7bbf618f42f8))
- poster showing broken image icon on load ([2684fc3](https://github.com/vidstack/player/commit/2684fc3949ace4dc2bd899d47d693d921c026c41))

#### Player (React)

- use remotion thumbnail in plyr layout preview scrub ([3651045](https://github.com/vidstack/player/commit/3651045bd53cd76b90b0fb5a9128ff1cb06ef2ce))
- remotion provider firing seeked before seeking when paused ([cd7e8da](https://github.com/vidstack/player/commit/cd7e8daccb021dccf743bb0222687504790f63ff))

## [1.10.4-next](https://github.com/vidstack/player/releases/tag/v1.10.4-next) (2024-02-03)

### ✨ Features

#### Player

- new `noScrubGesture` prop on default layout ([5de514f](https://github.com/vidstack/player/commit/5de514f3ccedc22d0d9d2c94a3525e8caae344ab))
- new `playbackRates` prop on default layout ([2c51d76](https://github.com/vidstack/player/commit/2c51d764c10b022cd73002762d7712cdbe2e72aa))

### 🐛 Bug Fixes

#### Player

- watch supported check correctly in remote playback ([5b33c7a](https://github.com/vidstack/player/commit/5b33c7a99fa5c962eaef2a97beb83cfa6a75d430))
- disable audio menu if only one option ([f464edf](https://github.com/vidstack/player/commit/f464edfd684c25f9100e62472c98417f7f7f3f07))
- seekable end of clipped videos is incorrect ([4217dfe](https://github.com/vidstack/player/commit/4217dfea2beb27e0cf96708fb048589f06874989))
- scrollbar styles not applying on chromium 121+ ([6404bfe](https://github.com/vidstack/player/commit/6404bfe75b03e24b598bbee8edaa55ca3ca26266))
- select text tracks on change and update storage correctly ([195c289](https://github.com/vidstack/player/commit/195c289683a0480c13809d89ade689b08fb6ce82))
- poster component should use inferred when none provided ([d533263](https://github.com/vidstack/player/commit/d5332639175290b5ad3fcbe8518a44476861221d))
- remove `trusted-types` from types ([c79d376](https://github.com/vidstack/player/commit/c79d376ff0e10ec07a8475d470c89862b041aa95))
- player duration prop always returns -1 ([54cbc0c](https://github.com/vidstack/player/commit/54cbc0cb54d8789741ad458284e65be735989628))
- clipped duration overwriting intrinsic duration ([3bab0d6](https://github.com/vidstack/player/commit/3bab0d626e8ea1ca4bdec0c313452d256060281d))
- thumbnails vtt json not accepted correctly ([cee73b4](https://github.com/vidstack/player/commit/cee73b4dbafaba807edc5df032eeb6555319435c))
- 0-9 key seeking stopped working ([79636c1](https://github.com/vidstack/player/commit/79636c1f568c8137f934ea3eb2bed29114b24f3f))
- airplay not working on macos safari and with hls streams ([2332626](https://github.com/vidstack/player/commit/2332626aa7dbb943d0293060e2672997bca3917b))
- expected selector error on default video layout css (#1135) ([10758dd](https://github.com/vidstack/player/commit/10758ddb91ebb2a52a265aafdb9fe433863f2378))
- resolve hls stream type when using `preferNativeHLS` ([ce73b65](https://github.com/vidstack/player/commit/ce73b65939c9487ff4a2da82ceb3fb0a6acad21f))

## [1.10.3-next](https://github.com/vidstack/player/releases/tag/v1.10.3-next) (2024-01-31)

### 🐛 Bug Fixes

#### Player

- `startTime` failing thumbnails image assertion when 0 ([1bf42cc](https://github.com/vidstack/player/commit/1bf42ccaf0de99b63c7f436fd73720c2bc5a560c))
- small default video layout controls should be lower ([d2031ca](https://github.com/vidstack/player/commit/d2031ca4337115160b506f1834e6ed4d8fba6751))
- watch airplay availability ([f7bfe28](https://github.com/vidstack/player/commit/f7bfe28610e42c2dbccf16e4d794c1a61a16ab47))
- do not set `crossorigin` for youtube/vimeo posters ([1a6f3af](https://github.com/vidstack/player/commit/1a6f3af425d7eb3f98c2edd4719f9be9b4fe3512))
- embed ui should not be focusable when no native controls ([40cc6a1](https://github.com/vidstack/player/commit/40cc6a1f1b4db634e5045f1f48bc4fa9937085d2))
- storage not working correctly with embeds ([6f3c18b](https://github.com/vidstack/player/commit/6f3c18b99e84a929a189f5a43c89e9d6394a2d48))
- do not reset playback rate on source change ([7671c89](https://github.com/vidstack/player/commit/7671c89339f10a635732b68b1b4eb7d0f8cf5239))
- track playback rate in storage ([a0379ae](https://github.com/vidstack/player/commit/a0379ae75ca056616c979b48c708689f9ab95308))
- clipped youtube embed requires two plays ([84b574f](https://github.com/vidstack/player/commit/84b574f62177ed44044a1a536bf2563a6aa79084))

## [1.10.2-next](https://github.com/vidstack/player/releases/tag/v1.10.2-next) (2024-01-30)

### 🐛 Bug Fixes

#### Player

- include `plugins.js` in package ([f077434](https://github.com/vidstack/player/commit/f077434476dff8214de2e3894905ea5cf53b4369))
- add progress live edge cssvar to plyr layout ([d2c29a4](https://github.com/vidstack/player/commit/d2c29a49d23970b5e40851dd67162959e6665ca6))
- inferred title/poster being overwritten by user provided ([083a484](https://github.com/vidstack/player/commit/083a4849d280845dc745e2cb9a7bbc72b7b3ae27))

## [1.10.1-next](https://github.com/vidstack/player/releases/tag/v1.10.1-next) (2024-01-30)

### 🐛 Bug Fixes

#### Player

- plyr layout live button spacing ([ef57fc3](https://github.com/vidstack/player/commit/ef57fc3c4b8e67db024c6f90fc550428e7482587))
- audio layout play button colors being overriden ([86819b0](https://github.com/vidstack/player/commit/86819b0bf0a1cf3f21d462d90319386da3822656))
- layout props missing in analysis ([e6c9b83](https://github.com/vidstack/player/commit/e6c9b83f1384db930b38e7357a69f794da028ce9))

## [1.10.0-next](https://github.com/vidstack/player/releases/tag/v1.10.0-next) (2024-01-30)

### ✨ Features

#### Core

- web component bundler plugins ([dfd4fa5](https://github.com/vidstack/player/commit/dfd4fa52431604d2b00a481364f213494c221f27))

#### Player

- new `sliderChaptersMinWidth` layouts prop ([441c54e](https://github.com/vidstack/player/commit/441c54e08f4c9e02b97c1d274801493e5dc7aca3))
- allow json to be passed directly to track `content` prop ([f20e904](https://github.com/vidstack/player/commit/f20e904311b99714a325d0ede1a57b7432379e50))
- new `clipStartTime` and `clipEndTime` player props ([f190651](https://github.com/vidstack/player/commit/f1906515ccd103c0ef6e40d6bb11317fc45d8e53))
- new `disabled` prop on gesture component ([0a1cc02](https://github.com/vidstack/player/commit/0a1cc022595f994f2113c0639284b2de7f25eb0e))
- new `posterLoad` player prop ([ea2a9e7](https://github.com/vidstack/player/commit/ea2a9e76d71067e864e660b78c620650ddc3cdd9))
- new `load="play"` player option ([1b7389c](https://github.com/vidstack/player/commit/1b7389c6d11da5eb0c964b0e540e68af9db026d6))
- new `storageKey` player prop ([b397859](https://github.com/vidstack/player/commit/b3978594384945e759f02ee6ac2bc59a6265fa0d))
- new `disableTimeSlider` default layout prop ([219b90e](https://github.com/vidstack/player/commit/219b90e643d13ac1cedc1eddea8ae88a67ed994e))
- new `noGestures` default layout prop ([2fff957](https://github.com/vidstack/player/commit/2fff9578490771194a3c6fe0d05a077a88435d0c))
- load chapters from vimeo embed ([8a23415](https://github.com/vidstack/player/commit/8a234151a1251e01cbb62708a6aa2c028eca8f6c))
- new `crossOrigin` prop on poster component ([ecbf277](https://github.com/vidstack/player/commit/ecbf2778e813b357ea60f37c5d81f705979f1083))
- new `crossOrigin` prop on slider video component ([d699c7b](https://github.com/vidstack/player/commit/d699c7b9eb6a583a052f60e562853f7b727f7c5c))
- new `crossOrigin` prop on thumbnail components ([72b8056](https://github.com/vidstack/player/commit/72b805680be2726c9d2286e925e7492f7c32ace9))
- support new thumbnail src types ([698e575](https://github.com/vidstack/player/commit/698e5756ace9b0a85fffaa33083f567c9f127945))
- new keyboard action display in default layout ([52890b0](https://github.com/vidstack/player/commit/52890b0373a99d32a9620d46b5e5d7734ca85d16))
- airplay support ([0f7df2f](https://github.com/vidstack/player/commit/0f7df2fa9ece6a9923c1b4c2f611e6362a8eb28e))
- google cast support ([d08d630](https://github.com/vidstack/player/commit/d08d63044a3cbb54fc278e72ef4dd3ab1a28dd0b))
- add media session api support ([da82b35](https://github.com/vidstack/player/commit/da82b35c68e24166ea2f6d619e8af18a51b1634f))
- new `storage` player prop and `MediaStorage` interface ([778ff6c](https://github.com/vidstack/player/commit/778ff6cfcef2a195934fa9d062b28b62007abf42))
- new view, stream, and remote type tailwind variants ([e15aefc](https://github.com/vidstack/player/commit/e15aefc88a71b3a097ad6d5f0bf08573ed1df455))
- font style customization menu ([4e902b6](https://github.com/vidstack/player/commit/4e902b68d6c72835d6b4cbabdb06d4d411f73505))
- expose cancellable media request events on all components ([b6d84af](https://github.com/vidstack/player/commit/b6d84afed90f249587967b531188536ba81ead92))
- include `ManagedMediaSource` support check ([ab35874](https://github.com/vidstack/player/commit/ab3587403c9e24f84156845a8539cbe875c64bc5))
- plyr layout ([622dfda](https://github.com/vidstack/player/commit/622dfda5d99c88668f7196c116878674758efccf))
- redesign default audio layout ([7ff5e65](https://github.com/vidstack/player/commit/7ff5e65f856dc48a4be903e8d41e55781108a2dd))
- new title component ([764c977](https://github.com/vidstack/player/commit/764c9778ca38c9dd137488d9e5943546adccd70e))
- new `duration` player prop ([4cf4457](https://github.com/vidstack/player/commit/4cf44577f01594ad1dedbad85050ed244de47a87))
- new `seekStep` default layout prop ([1d32867](https://github.com/vidstack/player/commit/1d328679a30fdd502c8e671a7684d9fc882da984))

#### Player (React)

- default layout slots ([209d400](https://github.com/vidstack/player/commit/209d40034784f4a8c43729e8ff4efc1730484f59))
- add remotion support to plyr layout ([9534d68](https://github.com/vidstack/player/commit/9534d68697f01250f225b8cde077bb59975b44b9))
- allow default video slots to be passed to both sizes ([5abd619](https://github.com/vidstack/player/commit/5abd61928efadf745b11c2d8f5dea7af0065c1ab))

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
- vimeo video info can be undefined (#1062) ([c8b871f](https://github.com/vidstack/player/commit/c8b871f4b00da2a0bac5a2e6bff019d734fdcf0a))
- update icon slots on all mutations ([00073a0](https://github.com/vidstack/player/commit/00073a02fdb884117b228c195df1e4cac35111ff))
- catch false postive vimeo pro detection ([29d6fa0](https://github.com/vidstack/player/commit/29d6fa05fbcc373e47232cf5412f7f1f73446fae))
- use intrisic duration for last vimeo chapter end time ([4dbe21e](https://github.com/vidstack/player/commit/4dbe21eafdba83ef5071f3be7f9eadbc8999e96d))
- rename `crossorigin` prop to `crossOrigin` ([37513ea](https://github.com/vidstack/player/commit/37513ea12c761c65f1dbbfd8280d9635be4ffb50))
- rework media request queue ([6f9c16b](https://github.com/vidstack/player/commit/6f9c16b1c9a41487233a033d2801bc1691aa5716))
- set `src` on poster image to prevent white border ([437764f](https://github.com/vidstack/player/commit/437764f6b60cf69372533f12a175abf4edc470c9))
- rename `playsinline` prop to `playsInline` ([e7cb6c5](https://github.com/vidstack/player/commit/e7cb6c5a0f8f03281673bf7d886ee9612d4c373c))
- rename `autoplay` prop to `autoPlay` ([0fc9dd7](https://github.com/vidstack/player/commit/0fc9dd72ba5d804acb3315983a5f17bff44d22f6))
- add missing load events to all providers ([446a4f4](https://github.com/vidstack/player/commit/446a4f41e7408431c745d4f81a42276666b64169))
- remove redundant default layout exports ([67de0e9](https://github.com/vidstack/player/commit/67de0e98b92596ca9193e7bfec4ae69071547fa6))
- replace player query lists with callbacks ([3644a74](https://github.com/vidstack/player/commit/3644a7471e6b58819136b7ef8159e8111f108925))
- remove player query lists ([6f1129e](https://github.com/vidstack/player/commit/6f1129ec69dc75a1cd3f6c28e1774cce1c5df2e0))
- key events not updating slider value ([a39a6fc](https://github.com/vidstack/player/commit/a39a6fc92acb594607064e8b9366c6480e043435))
- manage focus when default audio layout transitions ([87340eb](https://github.com/vidstack/player/commit/87340eb1c2d02878c117afc3a097a85f93713bb6))
- toggle captions on plyr layout should show cue ([1ea562a](https://github.com/vidstack/player/commit/1ea562a9e9a87ac368a03c94b4e590397e8e8372))
- iframe should not leak outside media provider ([ed93a31](https://github.com/vidstack/player/commit/ed93a317e4fd688a09b229f8da0e016d5430b6ab))
- switching from youtube to vimeo gets stuck ([597cef7](https://github.com/vidstack/player/commit/597cef7ad37e422a8825d479b82c29cfa9f92228))
- settings stops working via keyboard after exiting ([f4954d9](https://github.com/vidstack/player/commit/f4954d9ee350f33ff5eb492124e094a9b9c9cf79))
- vimeo not firing ended event ([fba30c9](https://github.com/vidstack/player/commit/fba30c9d8f9497852bf8bd283b8f8a7e00801575))
- check whether browser can play audio/video type ([b7ff954](https://github.com/vidstack/player/commit/b7ff954f106b906d2e9100ff91f0b98c83e435be))
- select default hls captions ([11b0c70](https://github.com/vidstack/player/commit/11b0c70df6197d5559b6d552d7d913e8d733bbe2))
- tweak remote playback tw variants ([e6c506b](https://github.com/vidstack/player/commit/e6c506b4c29189743f214e83689252a1563dc600))
- support `never` for `small-when` attr ([04955c4](https://github.com/vidstack/player/commit/04955c48c8f5a2b5e039d88b54a47c288e900d9a))

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
