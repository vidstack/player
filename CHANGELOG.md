## [0.5.3](/compare/v0.5.2...v0.5.3) (2023-05-13)

### Bug Fixes

- allow menu button/items to connect to existing menu 56d853e
- improve handling of misaligned time slider chapters cc5b164
- **react:** omit duplicate react event callbacks 652d547
- **react:** resolve ssr/hydration issues 4697bee
- reflect gesture props as attrs for styling 2ff0991
- vtt parser should only accept whitelisted settings 077f659

## [0.5.2](/compare/v0.5.1...v0.5.2) (2023-05-12)

### Bug Fixes

- **react:** resolve correct event callback types d477db9
- thumbnail get time is not bound c5168d9

### Features

- text track content can be passed in directly as string 7f3aba9

## [0.5.1](/compare/v0.5.0...v0.5.1) (2023-05-12)

### Bug Fixes

- **react:** fast refresh breaking media outlet 63ee99a
- **react:** player not attached in child components on connect f1162e4

### Features

- **react:** export all component props ebc5e6a

# [0.5.0](/compare/v0.4.5...v0.5.0) (2023-05-12)

📝 [RELEASE NOTES](https://github.com/vidstack/player/discussions/832)

### Bug Fixes

- `data-hidden` -> `aria-hidden` 73d857d
- add `role` to player component 33388e4
- add captions css variables 08ffdaa
- add live indicator css variables dbae587
- add required aria attrs on captions overlay 5b0f2f0
- add slider css variables dae03fb
- add time css variables e8dea99
- allow one default text track per kind ae3003c
- aspect ratio setting should not be applied in fullscreen d0701b8
- check gesture is in bounds before queueing f3525ea
- correctly resolve thumbnail image relative to given src 512aaec
- detach text renderer when removed c67b594
- ensure display none on svgs is applied 48c3ceb
- null track on audio track change event dfca7af, closes #828 #829
- parse captions ms timestamp correctly b1634dd
- **react:** add `part` jsx attr to dom elements e96f8e1
- set `credentials` when fetching slider thumbnails 658e235
- set credentials when fetching tracks based on `crossorigin` 1315aa7
- time slider events re-connecting multiple times on setup 3c4fef3

### Features

- add missing chevron/arrow media icons 9f32bf8
- bump all dependencies e55842c
- migrate to jassub for `.ass` rendering (#810) d6c9c8f, closes #810
- new `<media-buffering-indicator>` component 4e9432d
- new `<media-chapters-menu-items>` ecbf921, closes #830
- new `<media-gesture>` component 072b62d, closes #755
- new `<media-thumbnail>` component 35f628d, closes #831
- new `<media-tooltip>` component 44bd97d
- new `title` prop on player dcbee0b
- new class forwarding props on sliders 6c4bfaa
- new maverick component system 4c22863
- new menu components c90648a, closes #822 #54 #60 #61 #62 #823 #824 #825 #826
- support `json` text tracks type b2fd876
- time slider chapters 2c2014d, closes #805
- vertical volume slider fcf313c, closes #804

## [0.4.5](https://github.com/vidstack/player/compare/v0.4.4...v0.4.5) (2023-04-23)

### Bug Fixes

- add finite check for pointer rate in slider video ([#808](https://github.com/vidstack/player/issues/808)) ([377d2a4](https://github.com/vidstack/player/commit/377d2a4cc1e42fa88bb766f44ba7f69c9e422ff2))
- bump `maverick` to `0.33.1` ([0f1c5ae](https://github.com/vidstack/player/commit/0f1c5ae000582f4839c0dd1fd1e2870bdacd5e17))
- chrome does not detect keyframes inserted before playhead ([c2ba7be](https://github.com/vidstack/player/commit/c2ba7bea0d6cb13a39b222d6b5162d31351e6ba3))
- pin maverick version ([a988a18](https://github.com/vidstack/player/commit/a988a18562908b274c4932573de9df3a48e0186e))
- position captions correctly when scrolled out of view ([b161e74](https://github.com/vidstack/player/commit/b161e746760bc341c75f8af9a583fd8745a069ac))
- should not pass `null` to native text renderer ([e1e487f](https://github.com/vidstack/player/commit/e1e487fc1ef6200d612dabade576a4bd31389a2e)), closes [#811](https://github.com/vidstack/player/issues/811) [#814](https://github.com/vidstack/player/issues/814)
- use width to scale slider fill/progress tracks ([995d82d](https://github.com/vidstack/player/commit/995d82d62d8551758eb991826250913d78be5d63))
- waiting not triggered when seeking while paused ([2d50b59](https://github.com/vidstack/player/commit/2d50b59e733ce50c6fce6bed9084b2a4fec21b1e))

## [0.4.4](https://github.com/vidstack/player/compare/v0.4.3...v0.4.4) (2023-04-11)

### Bug Fixes

- accept relative thumbnail urls without starting slash ([7784063](https://github.com/vidstack/player/commit/77840637b9aba192458e9d864fcbff52ec482d8d))
- add box shadow transition to default slider thumb ([3c844a1](https://github.com/vidstack/player/commit/3c844a15c17b577142f5670e151b2f70fb17d389))
- adjust default captions cue background ([cd3f543](https://github.com/vidstack/player/commit/cd3f543bbcb3451fb552b639fa3ac4ad47d39120))
- adjust slider track and progress default colors ([5a62567](https://github.com/vidstack/player/commit/5a6256740072543e68c52559e6feda0c50714059))
- avoid overlapping default tracks on iphone ([3334f7b](https://github.com/vidstack/player/commit/3334f7b49149f758cea93431566a2e63cf0bca83))
- detecting pip/fullscreen on iphone not working ([c0b3810](https://github.com/vidstack/player/commit/c0b3810c1e0c385616d5a1e678daf523dc1cf02d))
- handle text tracks edge cases on iphone ([3da422c](https://github.com/vidstack/player/commit/3da422ca0d77c20f30c426914f12f7a6d7c92cf0))
- hide track progress on volume slider ([81277a4](https://github.com/vidstack/player/commit/81277a44a8a6d13bf952561b1d39c7a601811e0a))
- hls.js freezing if setting same audio track ([0f26c6c](https://github.com/vidstack/player/commit/0f26c6cea1b7555fc2d447eedfca60852af6b49d))
- key press on toggle button should prevent default ([b2e5d1e](https://github.com/vidstack/player/commit/b2e5d1e657fc81db5494045881b8fa77a14a3fc5))
- keyboard seeking with native controls not working ([d5404bb](https://github.com/vidstack/player/commit/d5404bbce24cc8642d092cc6d6b7f29a6fd30be3)), closes [#803](https://github.com/vidstack/player/issues/803)
- minify `items` list field ([0d19867](https://github.com/vidstack/player/commit/0d19867d3eaa354b415a7714a0dd098612fe8b0f))
- move default left/right tooltips inward to stay in view ([586cfad](https://github.com/vidstack/player/commit/586cfadaeb2f640c0526f0fbe3391966a659ff03))
- multiple `<track>` elements are not being included ([16acabe](https://github.com/vidstack/player/commit/16acabeb35ee20672a9a616f594a5858fe8d38a9))
- set active player immediately when key target document ([389bcde](https://github.com/vidstack/player/commit/389bcde0f4eec192386713f71bee503a73cae0e6))
- smaller default slider preview gap ([0c2d8b1](https://github.com/vidstack/player/commit/0c2d8b1bd891734586f2449e52273cf981c39f84))
- smaller default tooltip gap ([0682579](https://github.com/vidstack/player/commit/06825799e1db2776abfbb58241e0c15b07469ef2))
- use box shadow for focus ring ([578e418](https://github.com/vidstack/player/commit/578e418e2f3beea6a1740a719e87fa0bab0b9f48))

### Features

- add replay slot to play button ([cfe2993](https://github.com/vidstack/player/commit/cfe2993cc7729830d5a7fac218a2a9156fd34401))
- new `padMinutes` option on time and slider value ([b78a49a](https://github.com/vidstack/player/commit/b78a49a2545bef3924586b5fa4d89fa957377ade)), closes [#794](https://github.com/vidstack/player/issues/794)

## [0.4.3](https://github.com/vidstack/player/compare/v0.4.2...v0.4.3) (2023-04-07)

### Bug Fixes

- invalid media state reset during provider swap ([3674dac](https://github.com/vidstack/player/commit/3674dac13c225d1f5b18db26e2fd5647c20fb319))
- min-w/h on buttons makes it harder to style ([2672bd5](https://github.com/vidstack/player/commit/2672bd5dc63d5b105f4f45dffe1d7e9f6140d7cc))
- **react:** hls callbacks are not being called ([914d90c](https://github.com/vidstack/player/commit/914d90c65ee0e0ee37aa04f17e25d774d4bfbd57))
- remove default bg color on outlet when view type audio ([caa43a0](https://github.com/vidstack/player/commit/caa43a0016a054c50058d8c09935263acf91b4b4))
- source change not loading new provider ([f3f5bc1](https://github.com/vidstack/player/commit/f3f5bc1d1a3efc3715ba94d219f773f2c5856e05))
- time slider value/video should wait for can play ([c3be82a](https://github.com/vidstack/player/commit/c3be82a0f36cdeefcb5c4402aa7df4b22ce7300d))
- avoid conflicting keys with native media element ([480dced](https://github.com/vidstack/player/commit/480dcedea50b054c2743b20673892249b1ec1845)), closes [#788](https://github.com/vidstack/player/issues/788)
- ignore plays calls before media is ready ([463bda5](https://github.com/vidstack/player/commit/463bda5444bb08ea0e222b3db50501aea24705b9))

### Features

- new `<media-caption-button>` component ([12379d4](https://github.com/vidstack/player/commit/12379d4cdc46a4a6d9376dae766f3c467203fe24)), closes [#44](https://github.com/vidstack/player/issues/44)
- new `<media-captions>` component ([27f3649](https://github.com/vidstack/player/commit/27f36491e4f2a9ebe876f88477630658748d3d60)), closes [#25](https://github.com/vidstack/player/issues/25)
- support `<source>` and `<track>` elements ([6a16373](https://github.com/vidstack/player/commit/6a16373eb3a063128904a034ddb94f756b8659cc))
- text tracks support ([4b4d146](https://github.com/vidstack/player/commit/4b4d146dc19630f0d5fb823d757e9a362003ae88)), closes [#22](https://github.com/vidstack/player/issues/22)
- add array index accessor on list objects ([72f1ac0](https://github.com/vidstack/player/commit/72f1ac0146a8a8f9c5119560751a3fcc57890f1a))
- audio tracks support ([58b96ce](https://github.com/vidstack/player/commit/58b96ceed4a2bfd28aebeacdb30c002512543f5f)), closes [#23](https://github.com/vidstack/player/issues/23)
- new `<media-pip-button>` ([df97a0d](https://github.com/vidstack/player/commit/df97a0dc9be845ff70da16602f22e014e4b09514)), closes [#41](https://github.com/vidstack/player/issues/41)
- picture-in-picture support ([8709645](https://github.com/vidstack/player/commit/870964563be98dd1fa4a5ea8a20f64b7d874784a)), closes [#21](https://github.com/vidstack/player/issues/21)
- playback rate support ([6eace92](https://github.com/vidstack/player/commit/6eace92364060564793b4c7503a34bdc79e607b4)), closes [#18](https://github.com/vidstack/player/issues/18)
- video quality support ([2fcdcf8](https://github.com/vidstack/player/commit/2fcdcf86c07217a3440401b450fe85de5da65e03)), closes [#19](https://github.com/vidstack/player/issues/19)

## [0.4.2](https://github.com/vidstack/player/compare/v0.4.1...v0.4.2) (2023-03-06)

### Bug Fixes

- airplay not working with hlsjs ([1a5a6b1](https://github.com/vidstack/player/commit/1a5a6b17a6442ed36f3235b4d055a6aa128ecea2)), closes [#790](https://github.com/vidstack/player/issues/790)
- avoid conflicting keyboard shortcuts with native controls ([14ae6a3](https://github.com/vidstack/player/commit/14ae6a38a0630bdf4b4309201561110add639173)), closes [#788](https://github.com/vidstack/player/issues/788)
- canplay not fired on multiple hls source changes ([d0e4d72](https://github.com/vidstack/player/commit/d0e4d722dd18ba42c046d1ccb2296bac6d9c4120))
- detect live dvr based on hls playlist type ([3c8786b](https://github.com/vidstack/player/commit/3c8786b1ec8875b26ee0063815a421ba96eb28bd))
- improve slider keyboard support ([b0fc69e](https://github.com/vidstack/player/commit/b0fc69ebe9ce0b2750f5cbb29db192febf2d93e8))
- keyboard seeking not working while playing ([fb6114c](https://github.com/vidstack/player/commit/fb6114c7a94b9e5ba8ea06c66afeb54b7bc091c5))
- moved store props on slider instance to `state` ([d4046fc](https://github.com/vidstack/player/commit/d4046fca96148b1b5b9455ce0e26abe77984b1a5))
- play event is not fired when autoplay is set ([b0a3b58](https://github.com/vidstack/player/commit/b0a3b58ada8ecea1f443085b801a747d7e74b81f))
- src change throwing error ([24f98b6](https://github.com/vidstack/player/commit/24f98b6b8db7b3386a9e738f09673f79185f9081))

## [0.4.1](https://github.com/vidstack/player/compare/v0.4.0...v0.4.1) (2023-03-03)

### Bug Fixes

- `max-width` should be unset on slider video part ([bb96e5f](https://github.com/vidstack/player/commit/bb96e5f2283e83664394278f58e35a6f92c3c13e))
- slider video should respect `canLoad` and handle late ready state ([7bfc8ba](https://github.com/vidstack/player/commit/7bfc8ba22094c71b053a81507a75bedb1d799566))
- update slider preview position on focus ([5018871](https://github.com/vidstack/player/commit/5018871c1692e99d81be51fbb50684c15c69ae8e)), closes [#787](https://github.com/vidstack/player/issues/787)

# [0.4.0](https://github.com/vidstack/player/compare/v0.3.3...v0.4.0) (2023-03-03)

### Bug Fixes

- apply interactive state to slider via keyboard ([39f7c54](https://github.com/vidstack/player/commit/39f7c543f2f23bedefb717812329745a96adb8b3))
- configure hls low latency mode based on stream type ([a96a3a8](https://github.com/vidstack/player/commit/a96a3a81b5741361dae85b418bc84bceaf177fba))
- default to 60 seconds for min dvr window based on guidelines ([50f3a9b](https://github.com/vidstack/player/commit/50f3a9b81891f9ae658147eb8bd2222c96d584d1))
- focus outline offset should match thumb size on slider ([1ebe8a0](https://github.com/vidstack/player/commit/1ebe8a0a6b8cc029a053b602da79f46a7e00fc35))
- improved slider keyboard support ([6239bc6](https://github.com/vidstack/player/commit/6239bc6ffad8199f70a7f14d0c02526771711ed0)), closes [#776](https://github.com/vidstack/player/issues/776)
- remove `img-` attr prefix for `<media-poster>` ([ba27b77](https://github.com/vidstack/player/commit/ba27b77a9c2f240aa4b30dce81d92c363a7832eb))
- remove default border radius on buttons ([d153f89](https://github.com/vidstack/player/commit/d153f890c72c9b58b2ee53c008d5428309dde1bd))
- rename `<media-slider-value-text>` -> `<media-slider-value>` ([bf26141](https://github.com/vidstack/player/commit/bf26141851ad82fc7a10a31f298ce4a1331d2cb8))
- rename `bufferedAmount` to `bufferedEnd` ([9b01edf](https://github.com/vidstack/player/commit/9b01edfbc9e89d50836ff3b3139e8d0e1c4d682f))
- rename `error` attr to `hidden` on `<media-slider-video>` ([3150484](https://github.com/vidstack/player/commit/315048455d1e56c351b466ac2f534de98d12f087))
- rename `keyboardStep` to `keyStep` on slider components ([2a6ea7a](https://github.com/vidstack/player/commit/2a6ea7a1ef351bdb4d5d8d719f1a2c36243ca7b0))
- rename `seekableAmount` to `seekableEnd` ([6e32e06](https://github.com/vidstack/player/commit/6e32e068149daad2a0c0d4f1dc94b667e3a60def))
- rename var `--media-buffered-amount` to `--media-buffered-end` ([77fee5a](https://github.com/vidstack/player/commit/77fee5acb8e1c12e9ef4013847bf0449b2965ff2))
- rename var `--media-seekable-amount` to `--media-seekable-end` ([5a41129](https://github.com/vidstack/player/commit/5a411293919ec4e3b840a7d2020586e5a6d01d31))
- retrieve buffered amount when can play is fired ([fd19012](https://github.com/vidstack/player/commit/fd190126df9d8545626de5c9dba08a79c81096a6))
- revise live stream support api ([db656db](https://github.com/vidstack/player/commit/db656db71a63c846418a0bb27c84ebf04052d699))
- smoother keyboard seeking on time slider ([07d06de](https://github.com/vidstack/player/commit/07d06deeadcdaab347e9d26cee83b27bdb3177e8))

### Features

- add `live` and `live-edge` tailwind media variants ([2d9e6ae](https://github.com/vidstack/player/commit/2d9e6ae8aad994119713e15aff48f4e9ca050c02))
- add keyboard support ([2b96b38](https://github.com/vidstack/player/commit/2b96b38689e4370fa2cdeedd4c34d59265709d11)), closes [#84](https://github.com/vidstack/player/issues/84)
- expose `live-edge` attribute on `<media-player>` ([d8d891f](https://github.com/vidstack/player/commit/d8d891f64e0fd8db16e68fb59a7cb34a8e14ee71))
- expose `live` attr on `<media-player>` ([9970c03](https://github.com/vidstack/player/commit/9970c03277e4004a09270546e485f9b930bd7234))
- live stream support ([a840a4a](https://github.com/vidstack/player/commit/a840a4a155307cfe9c8d20b26d41c44a0871a90c)), closes [#775](https://github.com/vidstack/player/issues/775) [#265](https://github.com/vidstack/player/issues/265)
- new `--media-buffered-start` var ([2fca996](https://github.com/vidstack/player/commit/2fca9967cd0833451cab389d1bc7096213509199))
- new `--media-seekable-start` var ([d57c7ba](https://github.com/vidstack/player/commit/d57c7baf85d123fd7a2aee1ca8e5e65fa044a363))
- new `<media-live-indicator>` component ([68abac1](https://github.com/vidstack/player/commit/68abac102ba7820c7952ff55eb2231d13361f744)), closes [#734](https://github.com/vidstack/player/issues/734)
- new `<media-seek-button>` component ([894c630](https://github.com/vidstack/player/commit/894c6306fed9a4b79fef599f526596ce7c497058)), closes [#758](https://github.com/vidstack/player/issues/758)
- new `<media-slider-thumbnail>` component ([a3629e3](https://github.com/vidstack/player/commit/a3629e3c4d0a482eb05da251e5950d9d2c34d771)), closes [#763](https://github.com/vidstack/player/issues/763)
- new `bufferedStart` media state prop ([371d9c0](https://github.com/vidstack/player/commit/371d9c010bcbd964faae68440dc83c792d5d9ab8))
- new `currentLiveTime` media state prop ([d49b995](https://github.com/vidstack/player/commit/d49b995ecbbcd7c05cc111f8fdd05bd4eb1a80ae))
- new `liveEdge` media state prop ([173be30](https://github.com/vidstack/player/commit/173be3085370d488b6b9af71b4106f093b3b4461))
- new `liveTolerance` player prop ([107b1b1](https://github.com/vidstack/player/commit/107b1b1fcf441db280384080289bb04641cba3ff))
- new `liveWindow` media state prop ([d55fd50](https://github.com/vidstack/player/commit/d55fd501a80eeb96d57e920c579731efa0850b28))
- new `media-live-edge-request` event ([91232e0](https://github.com/vidstack/player/commit/91232e00fc1787c8bb0afea1741020d0e30262ed))
- new `minLiveDVRWindow` media state ([fde19c4](https://github.com/vidstack/player/commit/fde19c4a63a5a89b1fb2d2e69f8251080cdf2088))
- new `seekableStart` media state prop ([e1dc9fa](https://github.com/vidstack/player/commit/e1dc9fa5ed90f31645922a57e8a2a8251983e3dc))
- new `seekToLiveEdge` player method ([d63ff65](https://github.com/vidstack/player/commit/d63ff656d04143dba283be7b745d54e923991b68))
- new `streamType` player prop ([a182aa3](https://github.com/vidstack/player/commit/a182aa3b17505bfd998f0cc38fa86e20b45a2b8b))
- new `styles/defaults.css` file ([60e1aac](https://github.com/vidstack/player/commit/60e1aacf97ed0c7d854a7052d99e49eb0263ccc7))
- new `userBehindLiveEdge` media state prop ([1efe954](https://github.com/vidstack/player/commit/1efe9548c0af9efb40c3d6b7f39737aa6885ed6c))
- new seek backward/forward icons ([6ab58d2](https://github.com/vidstack/player/commit/6ab58d2104d042cc74e484af259767fcbf47c924))
- readonly atttrs on components are now data-attrs ([631ee19](https://github.com/vidstack/player/commit/631ee1912524adc067fb4acc058c1e4496633e93))
- refactor media attributes to data attributes ([be705e2](https://github.com/vidstack/player/commit/be705e2572ec163b52ec0829b27273fa3f3acbf2))
- tooltips support ([b187829](https://github.com/vidstack/player/commit/b187829eedc2b39b9d50f36673443e3e5f0386dd)), closes [#754](https://github.com/vidstack/player/issues/754)

## [0.3.3](https://github.com/vidstack/player/compare/v0.3.2...v0.3.3) (2023-02-26)

### Bug Fixes

- slider video shrinking at edge ([9de215a](https://github.com/vidstack/player/commit/9de215a2ea8fd3811ac5d3d34d9992d5906cff3d))
- user idle not removed on playback end ([1af57e4](https://github.com/vidstack/player/commit/1af57e4e88ed90d51380f5fa30cc50db4d4d0289)), closes [#783](https://github.com/vidstack/player/issues/783)

## [0.3.2](https://github.com/vidstack/player/compare/v0.3.1...v0.3.2) (2023-02-18)

### Bug Fixes

- `media-icons` not bundled in cdn dist ([28aba5f](https://github.com/vidstack/player/commit/28aba5f21c92b36d4f4a74114eff431f1dbe68ad)), closes [#780](https://github.com/vidstack/player/issues/780)

## [0.3.1](https://github.com/vidstack/player/compare/v0.3.0...v0.3.1) (2023-02-17)

### Bug Fixes

- no matching version for `media-icons` ([2e285ef](https://github.com/vidstack/player/commit/2e285ef5442bead09bf69ee6e69b8b2891d6e346)), closes [#779](https://github.com/vidstack/player/issues/779)

# [0.3.0](https://github.com/vidstack/player/compare/v0.2.3...v0.3.0) (2023-02-17)

### Bug Fixes

- support `bundler` ts module resolution ([e5635eb](https://github.com/vidstack/player/commit/e5635ebf759698f0960b2fe397e1e51376903aef)), closes [#771](https://github.com/vidstack/player/issues/771)
- svg icons inside button should scale ([66be655](https://github.com/vidstack/player/commit/66be655228bd648d5790a6b7576b1489b8264b4d)), closes [#743](https://github.com/vidstack/player/issues/743)
- define imports are not included in prod ([99866f2](https://github.com/vidstack/player/commit/99866f2bc48288f7c98fa25464203e6c0aa495be)), closes [#773](https://github.com/vidstack/player/issues/773)
- duration nan on source change ([ba51c0d](https://github.com/vidstack/player/commit/ba51c0db1a4fc566bd91e162b8d6662b87f5eda4)), closes [#774](https://github.com/vidstack/player/issues/774)
- prevent playback immediately ending on seek request ([84f4065](https://github.com/vidstack/player/commit/84f4065d6d6cbdc516f3e88e1d2c84fc24de7039))

### Features

- new media icon component ([4290501](https://github.com/vidstack/player/commit/4290501d82ddcc414b50ae4e32c4b09887a09ddf)), closes [#744](https://github.com/vidstack/player/issues/744)
- new media icons catalog ([a303804](https://github.com/vidstack/player/commit/a3038044762c953f53ccf37cdc990ec95d6ab110)), closes [#745](https://github.com/vidstack/player/issues/745)
- add `currentSrc` alias ([5dfa19c](https://github.com/vidstack/player/commit/5dfa19ceacb551ec3025a78846a952e3555b5fec))
- add blob uri support ([3c333db](https://github.com/vidstack/player/commit/3c333dbac7d282a36231db42000d957983c4e8f8)), closes [#762](https://github.com/vidstack/player/issues/762)
- element type checks ([775f074](https://github.com/vidstack/player/commit/775f074a5597b97cab87af0c1db4bfe425a47ac6)), closes [#741](https://github.com/vidstack/player/issues/741)
- media prefix on tailwind variants is now optional ([b3e2546](https://github.com/vidstack/player/commit/b3e2546f734b52e6586a6b132668017d1c778d2f)), closes [#742](https://github.com/vidstack/player/issues/742)
- new `buffering` tailwind media variant ([e65f93d](https://github.com/vidstack/player/commit/e65f93d46917207164904d12cf28860a7688dcf0)), closes [#742](https://github.com/vidstack/player/issues/742)
- new `can-control` tailwind variant ([962e458](https://github.com/vidstack/player/commit/962e458a2817bb16e3d025ed4e53feff53e3aea6)), closes [#742](https://github.com/vidstack/player/issues/742)
- tailwind not variants ([e7ce50e](https://github.com/vidstack/player/commit/e7ce50e6604977ede7c80fe2d4ab354aafb4abe1)), closes [#739](https://github.com/vidstack/player/issues/739)
- tailwind variant prefixes now configurable and empty by default ([7d10a48](https://github.com/vidstack/player/commit/7d10a4813ddb739749aa23e232d07238ae9987e9)), closes [#742](https://github.com/vidstack/player/issues/742)

## [0.2.3](https://github.com/vidstack/player/compare/v0.2.2...v0.2.3) (2023-02-06)

### Bug Fixes

- add docs to the media remote control ([3bcf3d3](https://github.com/vidstack/player/commit/3bcf3d378da87118f4c8cdaacffed617677941d0))
- default to loading full version of `hls.js` - more reliable ([efcb11b](https://github.com/vidstack/player/commit/efcb11bc248f90b88c0bb2617c1ae356ff473d84))
- hls provider not working in devtools on iphone view ([7217412](https://github.com/vidstack/player/commit/72174121115ac511011ac81a0186ac04fea6d97c))
- multiple players freezing page ([91e23b6](https://github.com/vidstack/player/commit/91e23b6684f75b35166056ffaa2b03ead95e5bc3)), closes [#731](https://github.com/vidstack/player/issues/731)

## [0.2.2](https://github.com/vidstack/player/compare/v0.2.1...v0.2.2) (2023-02-03)

### Bug Fixes

- **react:** aspect ratio not working - attr not reflected ([593ad6c](https://github.com/vidstack/player/commit/593ad6ce6e5154fb7939d71ff56cf8b0e3dff16e))

## [0.2.1](https://github.com/vidstack/player/compare/v0.2.0...v0.2.1) (2023-02-03)

### Bug Fixes

- add `define/media-outlet` empty file to avoid confusion ([fa4a558](https://github.com/vidstack/player/commit/fa4a558c201dd6854a0e4b6721477c9bbd5d9288))
- fire `provider-setup` after hls has loaded lib ([2d67029](https://github.com/vidstack/player/commit/2d67029e192482e5f9c20403671599bc04da6b28))
- hls does not ssr because it fails current checks ([5bb30d1](https://github.com/vidstack/player/commit/5bb30d1282fb467aae7827d05eb90a9df14cd9b9))
- hls dynamic imports are not set correctly ([87486ad](https://github.com/vidstack/player/commit/87486ad353d9f71babb0af00a540410a111990d2))
- slider value text and time not updating post-hydration ([f0b1aac](https://github.com/vidstack/player/commit/f0b1aac3866859890d2a2d3f6d5c1d2755c09fa1))
- static hls import not initialized ([47d532b](https://github.com/vidstack/player/commit/47d532bbf07a2c2138cc8e0642e8909c1b96868e))

# [0.2.0](https://github.com/vidstack/player/compare/v0.1.5...v0.2.0) (2023-02-02)

### Bug Fixes

- **react:** `useMediaState` -> `useMediaStore` ([1cc1551](https://github.com/vidstack/player/commit/1cc1551dc3915459baf5c85f4eb91331a3c719f5))
- **react:** hooks not subscribing to ref on mount ([269cb70](https://github.com/vidstack/player/commit/269cb70a78011956fe4b2b5e362a605051e7d929))
- **react:** mount instance once during dev ([331cbf8](https://github.com/vidstack/player/commit/331cbf89dcd9e940542b924179eec8f717566ecc))
- **react:** source selection process hanging ([e52ecb5](https://github.com/vidstack/player/commit/e52ecb5dd736b61e3ba5f8286444507c87906e00))
- `view` attr no longer required ([da37ffc](https://github.com/vidstack/player/commit/da37ffcc22ac46b2c4eb763a865c5eda2e0a10a0))
- not updating correctly on source+provider change ([b9f316a](https://github.com/vidstack/player/commit/b9f316a089c4b333155229317a3919df58374940))
- provider loader should test audio/video src type ([131fb08](https://github.com/vidstack/player/commit/131fb08279ca16fca86f9b4f0043a82e89875b61))
- sliders not working on touch ([68d4c2b](https://github.com/vidstack/player/commit/68d4c2b77eac739a4ba4ab29698446252c6daaf3))

### Features

- `vds-*` -> `media-*` tag prefix ([867b926](https://github.com/vidstack/player/commit/867b926d2a6a9c22c07d45ff8e57a23ba61f70d1))
- new slider subscribe method and react hook ([7644ae2](https://github.com/vidstack/player/commit/7644ae2a2e70f50f7267822e74169e694debd6f9))
- `MediaRemoteControl` no longer requires target/destroy ([1ee1a44](https://github.com/vidstack/player/commit/1ee1a44aba1fae8e19af37e7999486eddbdaac41))
- `src` can now also accept `Blob`, `MediaSource`, `MediaStream` ([623dfea](https://github.com/vidstack/player/commit/623dfea52988b0ce4aae6bcc1e4c5af603a12024))
- allow provider type on player to be narrowed without ts ([b0203c6](https://github.com/vidstack/player/commit/b0203c628ac79d7644fba64b4e64be1fcd3c1964))
- new `<media-slider>` component ([6b1dc45](https://github.com/vidstack/player/commit/6b1dc45cebacdd547668cc7e9d83a0f8a5db43f8))
- new `<media-toggle-button>` component ([88d4e51](https://github.com/vidstack/player/commit/88d4e51d8237c3971932b7238dd297cf0274a9bd))
- rework media subscriptions ([b7a1564](https://github.com/vidstack/player/commit/b7a1564a9cd83f56326f916e7175cf9c9ae25b2d))
- rework providers ([f921b2b](https://github.com/vidstack/player/commit/f921b2b845c40f27e30345874060fb80fccccd47))

## [0.1.5](https://github.com/vidstack/player/compare/v0.1.4...v0.1.5) (2023-01-27)

### Bug Fixes

- **react:** remote not attached to media due to mount order ([62207b0](https://github.com/vidstack/player/commit/62207b08277e09db6e6483eec3c76c8b1aa13dd2))

### Features

- include component doc links in vscode custom data ([072586b](https://github.com/vidstack/player/commit/072586bcdb00448f3670baca24a1e4c53dac1989))

## [0.1.4](https://github.com/vidstack/player/compare/v0.1.3...v0.1.4) (2023-01-26)

### Bug Fixes

- `<vds-media>` props are not in-sync with media store ([1ae9047](https://github.com/vidstack/player/commit/1ae90478614634a808982eb318d768b9f51c6f7f))
- better html support for `MediaRemoteControl` ([0def947](https://github.com/vidstack/player/commit/0def94700c27274d28127404d2f40bb59a47d319))
- idling not working as expected ([9e3764c](https://github.com/vidstack/player/commit/9e3764c4dcec962bd021811deea67930d79c65fa))

### Features

- new toggle methods on `MediaRemoteControl` ([647bbc3](https://github.com/vidstack/player/commit/647bbc3b9a2c0a5792e1eda5e18491868c203ce2))

## [0.1.3](https://github.com/vidstack/player/compare/v0.1.2...v0.1.3) (2023-01-25)

### Bug Fixes

- add `MediaOrientationChangeEvent` type ([4c67ae2](https://github.com/vidstack/player/commit/4c67ae2b190f316bc9d43773a4f6bbb251bfe7a4))
- fullscreen events should not bubble similar to other media events ([4e9bd32](https://github.com/vidstack/player/commit/4e9bd3269b51af13ac27f914afeec844778cb426))
- simplify screen orientation events ([c922d15](https://github.com/vidstack/player/commit/c922d152890d88be32f9becccd9f61903a3e9bb9))

## [0.1.2](https://github.com/vidstack/player/compare/v0.1.1...v0.1.2) (2023-01-25)

### Bug Fixes

- `user-idle` attribute is not being applied ([45a5531](https://github.com/vidstack/player/commit/45a553125a7c24b3a6b62719f20eaf2b588f92a6))

## [0.1.1](https://github.com/vidstack/player/compare/v0.1.0...v0.1.1) (2023-01-25)

### Bug Fixes

- **react:** do not mangle `__html` prop ([774b36d](https://github.com/vidstack/player/commit/774b36db7d3c83773efd5c143807b3bf8b99333d))

# [0.1.0](https://github.com/vidstack/player/compare/v0.0.1...v0.1.0) (2023-01-24)

### Bug Fixes

- force bump ([bb9dae4](https://github.com/vidstack/player/commit/bb9dae45f64791a1bad7b321194729d7ba81ce71))
- **react:** bump react deps to 18 ([712bb8e](https://github.com/vidstack/player/commit/712bb8ea982951c7281efada5d02bcef281860fe))
- **react:** dev export should come after server exports ([a65611c](https://github.com/vidstack/player/commit/a65611cfadce4ca15619db79dbf86303cf0eda46))
- **react:** doc links are invalid ([be33f4e](https://github.com/vidstack/player/commit/be33f4ebc9d416971efd5a82fb458d7bd9190cca))
- **react:** ensure components are attached on mount ([e0886e8](https://github.com/vidstack/player/commit/e0886e8b8c4f23d0b696310cf1e54de1f09ff405))
- **react:** mark all components as pure ([e5c4cb5](https://github.com/vidstack/player/commit/e5c4cb549e29ee5428cba078d287a003cade27b6))
- **react:** preserve player state when required during mount/unmount ([1c6ced1](https://github.com/vidstack/player/commit/1c6ced1c02634efe3d85a27229596d41c125fc09))
- **react:** rework state management hooks ([38a182f](https://github.com/vidstack/player/commit/38a182fff252d5d712666f3bbfbb26aaa236ea34))
- **react:** setup not run when remounting child scope ([1388b51](https://github.com/vidstack/player/commit/1388b51aaf70d00594653b9de327cf08270bb2a7))
- **react:** use media state not preserving state on remount ([1dc33f3](https://github.com/vidstack/player/commit/1dc33f31c9a1c27f93fd88e108d58747f59df42b))
- `define/*` exports are not set ([83af301](https://github.com/vidstack/player/commit/83af3014c7e08a1cf8b7a463ec7290d0e27e6fb0))
- `hlsConfig` -> `config` ([96037ff](https://github.com/vidstack/player/commit/96037ff3067089454821d8a2514392d4e4b479fd))
- `hlsLibrary` -> `library` ([10e5ffc](https://github.com/vidstack/player/commit/10e5ffce2608753dc3bf6a791dedf13aa67caa81))
- `ios-fullscreen` -> `ios-controls` ([19f564a](https://github.com/vidstack/player/commit/19f564a3c3567d800084ebcccd8642f6c6163db5))
- `startLoadingMedia` -> `startLoading` ([b429e99](https://github.com/vidstack/player/commit/b429e99a8674b25038147145a9830c3ea0d4ebdb))
- copy controller props over to media store during ssr ([f678d07](https://github.com/vidstack/player/commit/f678d071ed0c8089b092899ea48a5ec7d954741d))
- correctly resolve html provider default slot ([da51399](https://github.com/vidstack/player/commit/da51399d8d2706280c39c6c6ee58a1125c09cf55))
- dev export should come after server exports ([d4fd9f3](https://github.com/vidstack/player/commit/d4fd9f3567349fa9b22a9c71b3ccc78b5b4ca4f2))
- ensure browser support checks dont run on server ([8652e9e](https://github.com/vidstack/player/commit/8652e9e462d4f5f7d13a7bea76651f4b3b10918f))
- init media store ([82ccd51](https://github.com/vidstack/player/commit/82ccd51d123db0ee148e2d4ad7f89b5abe839015))
- invalid doc links ([3aa3993](https://github.com/vidstack/player/commit/3aa3993b47dc2d0cf005942cb1ee0f996f6a7eb3))
- load native poster if no hide request is fired ([fc8990c](https://github.com/vidstack/player/commit/fc8990c3f46aa898ee8a75f37a69df3acd17a29c))
- prefix media request events with `Media` ([9103cf6](https://github.com/vidstack/player/commit/9103cf6edfcc49e88afdc384301e43856445055f))
- set/update poster on underlying html media element ([313f83e](https://github.com/vidstack/player/commit/313f83ec27af7f5dbb29fe5b67a7c883d99d5e12))
- slider preview not working on safari ([d37ed5a](https://github.com/vidstack/player/commit/d37ed5a29c2db18859391ce885e49ff01a2e70f6))
- strip `hls-` prefix from provider events and attach correctly ([95c3673](https://github.com/vidstack/player/commit/95c3673b1bfe768aad5e06c7c6e2228c4f4f1ad4))

### Features

- lift all media state and events up to `<vds-media>` ([82db8f3](https://github.com/vidstack/player/commit/82db8f30385d76ca8d6576ae909a704ff0f00522))
- **react:** new `useMediaProviderElement` hook ([0dffbbb](https://github.com/vidstack/player/commit/0dffbbbb41051740b97812e4f4d3864d89798347))

## [0.0.1](https://github.com/vidstack/player/compare/v0.0.0...v0.0.1) (2023-01-18)

### Features

- migration to maverick ([#700](https://github.com/vidstack/player/issues/700)) ([f3b07d3](https://github.com/vidstack/player/commit/f3b07d3b35d7d1cb442e5eaf77e79ce0f6f70996))
