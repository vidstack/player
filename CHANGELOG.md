## [0.5.6](https://github.com/vidstack/player/compare/v0.5.5...v0.5.6) (2023-05-18)

### Bug Fixes

- **react:** hmr issue in remix ([02ac082](https://github.com/vidstack/player/commit/02ac0827e8a6a3749e1a6bb2b5c65346d00736bb))

## [0.5.5](https://github.com/vidstack/player/compare/v0.5.4...v0.5.5) (2023-05-18)

### Bug Fixes

- prevent tailwind normalization breaking menu radio check ([83e95d6](https://github.com/vidstack/player/commit/83e95d62846cfe0c82dbd851f25bd68aae0e3f2a))
- **react:** hmr element register error ([f66d78d](https://github.com/vidstack/player/commit/f66d78dfd0179eb8c09320ea998adec4adb272c8))

## [0.5.4](https://github.com/vidstack/player/compare/v0.5.3...v0.5.4) (2023-05-16)

### Bug Fixes

- observe source/track attr changes ([242dd1b](https://github.com/vidstack/player/commit/242dd1bd1b85d10d7d9265b824891c82d9b7c668))
- **react:** menu hydration issues ([0ee019f](https://github.com/vidstack/player/commit/0ee019f7b08325b340e97734c0e6dfae8d05521b))
- **react:** return array copy from store hooks ([84132b2](https://github.com/vidstack/player/commit/84132b26c0f182fcff343d2461b2dc6385ef3b37))
- **react:** tooltip attach error ([b665c4b](https://github.com/vidstack/player/commit/b665c4b8f317b1869553980e3ec3b158066b827c))
- **react:** use media player hook not updating ([a89a58c](https://github.com/vidstack/player/commit/a89a58cecdfe64c05a0e59110b969465c1771efc))
- sort quality menu items in descending order ([89f6726](https://github.com/vidstack/player/commit/89f6726cb827458197bc343e749b7f8413e52378))

### Features

- fallback to checking source headers for media type ([053f03a](https://github.com/vidstack/player/commit/053f03a63c2cb85a73a7886fc29ea3bbbab3391c))

## [0.5.3](https://github.com/vidstack/player/compare/v0.5.2...v0.5.3) (2023-05-13)

### Bug Fixes

- allow menu button/items to connect to existing menu ([56d853e](https://github.com/vidstack/player/commit/56d853e2a310411276954b87371df9664b5b95c0))
- improve handling of misaligned time slider chapters ([cc5b164](https://github.com/vidstack/player/commit/cc5b16452b0d66169a62ff997ecbb4b1c637d5c3))
- **react:** omit duplicate react event callbacks ([652d547](https://github.com/vidstack/player/commit/652d5473c2bdb04ffcb741d670301f3570582317))
- **react:** resolve ssr/hydration issues ([4697bee](https://github.com/vidstack/player/commit/4697beed0f7c666ab0dc85c2ef00cda9a45120b1))
- reflect gesture props as attrs for styling ([2ff0991](https://github.com/vidstack/player/commit/2ff0991acb870b03e5e1fccd251ddb87ac5c7ed1))
- vtt parser should only accept whitelisted settings ([077f659](https://github.com/vidstack/player/commit/077f6592563994a24ef73ac209f761c04e8d21c3))

## [0.5.2](https://github.com/vidstack/player/compare/v0.5.1...v0.5.2) (2023-05-12)

### Bug Fixes

- **react:** resolve correct event callback types ([d477db9](https://github.com/vidstack/player/commit/d477db9a61f4603f63e20c64ca3422b40232fa8f))
- thumbnail get time is not bound ([c5168d9](https://github.com/vidstack/player/commit/c5168d95cd97266dbf111dded492c4c93b6c2476))

### Features

- text track content can be passed in directly as string ([7f3aba9](https://github.com/vidstack/player/commit/7f3aba9297dcc7b8e96f8746d744c1feaf30e291))

## [0.5.1](https://github.com/vidstack/player/compare/v0.5.0...v0.5.1) (2023-05-12)

### Bug Fixes

- **react:** fast refresh breaking media outlet ([63ee99a](https://github.com/vidstack/player/commit/63ee99a422876725b3abc569c9342773a5d3a0f9))
- **react:** player not attached in child components on connect ([f1162e4](https://github.com/vidstack/player/commit/f1162e437303bf3cd1ac49bf72f05e2b4fd87738))

### Features

- **react:** export all component props ([ebc5e6a](https://github.com/vidstack/player/commit/ebc5e6a6781ba4c3c3b19ef4bfbcccfa3c9f9162))

# [0.5.0](https://github.com/vidstack/player/compare/v0.4.5...v0.5.0) (2023-05-12)

📝 [RELEASE NOTES](https://github.com/vidstack/player/discussions/832)

### Bug Fixes

- `data-hidden` -> `aria-hidden` ([73d857d](https://github.com/vidstack/player/commit/73d857d35b9b0f90186d4541d80a22f52c89afef))
- add `role` to player component ([33388e4](https://github.com/vidstack/player/commit/33388e491dee50466a087886d5e46c0d947adc98))
- add captions css variables ([08ffdaa](https://github.com/vidstack/player/commit/08ffdaa4e0daaab6a633248a8a35f72d190a7b72))
- add live indicator css variables ([dbae587](https://github.com/vidstack/player/commit/dbae587cbd8f4163a2b7ae499c2a64085e99ae53))
- add required aria attrs on captions overlay ([5b0f2f0](https://github.com/vidstack/player/commit/5b0f2f0fb5f9efc3fd64c6d2cc103a60a457947f))
- add slider css variables ([dae03fb](https://github.com/vidstack/player/commit/dae03fbcbeaeedfe999f2ae8c6f9350d58a3f7c4))
- add time css variables ([e8dea99](https://github.com/vidstack/player/commit/e8dea99fe2ac9349e32c5e04d4831740abad8161))
- allow one default text track per kind ([ae3003c](https://github.com/vidstack/player/commit/ae3003ca47c189f2010ecefc2a46afef614ea01a))
- aspect ratio setting should not be applied in fullscreen ([d0701b8](https://github.com/vidstack/player/commit/d0701b8a4f29cac4a30e3a6ddbb08ca6fb9c846f))
- check gesture is in bounds before queueing ([f3525ea](https://github.com/vidstack/player/commit/f3525eaff741a2c61a778b5096b76b1e5d352e48))
- correctly resolve thumbnail image relative to given src ([512aaec](https://github.com/vidstack/player/commit/512aaec15d85a5ac9e3e2fb7e4803a69485ec384))
- detach text renderer when removed ([c67b594](https://github.com/vidstack/player/commit/c67b594202f1945155f6340abb82561d28bc5028))
- ensure display none on svgs is applied ([48c3ceb](https://github.com/vidstack/player/commit/48c3cebd0eedcefb2de07f749acd4e370e675dcb))
- null track on audio track change event ([dfca7af](https://github.com/vidstack/player/commit/dfca7af2d8f11276cc841d17099ecfb64ebcb3ab)), closes [#828](https://github.com/vidstack/player/issues/828) [#829](https://github.com/vidstack/player/issues/829)
- parse captions ms timestamp correctly ([b1634dd](https://github.com/vidstack/player/commit/b1634dd49258118b827cd2bdb9e30c48224f85b2))
- **react:** add `part` jsx attr to dom elements ([e96f8e1](https://github.com/vidstack/player/commit/e96f8e1be780ee27a5b01718356b94dd0cabe540))
- set `credentials` when fetching slider thumbnails ([658e235](https://github.com/vidstack/player/commit/658e2356622d0b5c66c693c3860e8d91268e7655))
- set credentials when fetching tracks based on `crossorigin` ([1315aa7](https://github.com/vidstack/player/commit/1315aa7272525f11ba80ff37692d7901e3051971))
- time slider events re-connecting multiple times on setup ([3c4fef3](https://github.com/vidstack/player/commit/3c4fef3bba2ce0b458f3e45869638592c9adf737))

### Features

- add missing chevron/arrow media icons ([9f32bf8](https://github.com/vidstack/player/commit/9f32bf8e01f3de35052eeced5a63b8af8651da60))
- bump all dependencies ([e55842c](https://github.com/vidstack/player/commit/e55842c0433922adebfbb96e98b11c292fe3df0f))
- migrate to jassub for `.ass` rendering ([#810](https://github.com/vidstack/player/issues/810)) ([d6c9c8f](https://github.com/vidstack/player/commit/d6c9c8fae4a88f596531621a35c2a854f14d120d))
- new `<media-buffering-indicator>` component ([4e9432d](https://github.com/vidstack/player/commit/4e9432d36e97ee5069654c22240648bb441e1a42))
- new `<media-chapters-menu-items>` ([ecbf921](https://github.com/vidstack/player/commit/ecbf921c91e147c1a125ee2a7b96dee42b015f7e)), closes [#830](https://github.com/vidstack/player/issues/830)
- new `<media-gesture>` component ([072b62d](https://github.com/vidstack/player/commit/072b62d115ab7e247046cd691158824be172265c)), closes [#755](https://github.com/vidstack/player/issues/755)
- new `<media-thumbnail>` component ([35f628d](https://github.com/vidstack/player/commit/35f628dcc3f213de17a72cd228e6dba9f90a9479)), closes [#831](https://github.com/vidstack/player/issues/831)
- new `<media-tooltip>` component ([44bd97d](https://github.com/vidstack/player/commit/44bd97dec66c9781a50cfb6c92f30a3e82c48a1b))
- new `title` prop on player ([dcbee0b](https://github.com/vidstack/player/commit/dcbee0b25ab4c9fc40b1b3074042fd77a4c42699))
- new class forwarding props on sliders ([6c4bfaa](https://github.com/vidstack/player/commit/6c4bfaa2f36d5614a01570fc3d6bf5f2d224ec00))
- new maverick component system ([4c22863](https://github.com/vidstack/player/commit/4c228637e3e3a2a37bb010f4432420677861f2ee))
- new menu components ([c90648a](https://github.com/vidstack/player/commit/c90648ad1a005c1fbaadca7adf1578617c25d61a)), closes [#822](https://github.com/vidstack/player/issues/822) [#54](https://github.com/vidstack/player/issues/54) [#60](https://github.com/vidstack/player/issues/60) [#61](https://github.com/vidstack/player/issues/61) [#62](https://github.com/vidstack/player/issues/62) [#823](https://github.com/vidstack/player/issues/823) [#824](https://github.com/vidstack/player/issues/824) [#825](https://github.com/vidstack/player/issues/825) [#826](https://github.com/vidstack/player/issues/826)
- support `json` text tracks type ([b2fd876](https://github.com/vidstack/player/commit/b2fd876ebf652e9a02d4e6342eb22b080b7c2f9f))
- time slider chapters ([2c2014d](https://github.com/vidstack/player/commit/2c2014db09a6ef969b413582e4b767542050a344)), closes [#805](https://github.com/vidstack/player/issues/805)
- vertical volume slider ([fcf313c](https://github.com/vidstack/player/commit/fcf313cd153fc1734ab0ffd0ea6ad0efaee101db)), closes [#804](https://github.com/vidstack/player/issues/804)

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
- **vidstack:** avoid conflicting keys with native media element ([480dced](https://github.com/vidstack/player/commit/480dcedea50b054c2743b20673892249b1ec1845)), closes [#788](https://github.com/vidstack/player/issues/788)
- **vidstack:** ignore plays calls before media is ready ([463bda5](https://github.com/vidstack/player/commit/463bda5444bb08ea0e222b3db50501aea24705b9))

### Features

- new `<media-caption-button>` component ([12379d4](https://github.com/vidstack/player/commit/12379d4cdc46a4a6d9376dae766f3c467203fe24)), closes [#44](https://github.com/vidstack/player/issues/44)
- new `<media-captions>` component ([27f3649](https://github.com/vidstack/player/commit/27f36491e4f2a9ebe876f88477630658748d3d60)), closes [#25](https://github.com/vidstack/player/issues/25)
- support `<source>` and `<track>` elements ([6a16373](https://github.com/vidstack/player/commit/6a16373eb3a063128904a034ddb94f756b8659cc))
- text tracks support ([4b4d146](https://github.com/vidstack/player/commit/4b4d146dc19630f0d5fb823d757e9a362003ae88)), closes [#22](https://github.com/vidstack/player/issues/22)
- **vidstack:** add array index accessor on list objects ([72f1ac0](https://github.com/vidstack/player/commit/72f1ac0146a8a8f9c5119560751a3fcc57890f1a))
- **vidstack:** audio tracks support ([58b96ce](https://github.com/vidstack/player/commit/58b96ceed4a2bfd28aebeacdb30c002512543f5f)), closes [#23](https://github.com/vidstack/player/issues/23)
- **vidstack:** new `<media-pip-button>` ([df97a0d](https://github.com/vidstack/player/commit/df97a0dc9be845ff70da16602f22e014e4b09514)), closes [#41](https://github.com/vidstack/player/issues/41)
- **vidstack:** picture-in-picture support ([8709645](https://github.com/vidstack/player/commit/870964563be98dd1fa4a5ea8a20f64b7d874784a)), closes [#21](https://github.com/vidstack/player/issues/21)
- **vidstack:** playback rate support ([6eace92](https://github.com/vidstack/player/commit/6eace92364060564793b4c7503a34bdc79e607b4)), closes [#18](https://github.com/vidstack/player/issues/18)
- **vidstack:** video quality support ([2fcdcf8](https://github.com/vidstack/player/commit/2fcdcf86c07217a3440401b450fe85de5da65e03)), closes [#19](https://github.com/vidstack/player/issues/19)

## [0.4.2](https://github.com/vidstack/player/compare/v0.4.1...v0.4.2) (2023-03-06)

### Bug Fixes

- **vidstack:** airplay not working with hlsjs ([1a5a6b1](https://github.com/vidstack/player/commit/1a5a6b17a6442ed36f3235b4d055a6aa128ecea2)), closes [#790](https://github.com/vidstack/player/issues/790)
- **vidstack:** avoid conflicting keyboard shortcuts with native controls ([14ae6a3](https://github.com/vidstack/player/commit/14ae6a38a0630bdf4b4309201561110add639173)), closes [#788](https://github.com/vidstack/player/issues/788)
- **vidstack:** canplay not fired on multiple hls source changes ([d0e4d72](https://github.com/vidstack/player/commit/d0e4d722dd18ba42c046d1ccb2296bac6d9c4120))
- **vidstack:** detect live dvr based on hls playlist type ([3c8786b](https://github.com/vidstack/player/commit/3c8786b1ec8875b26ee0063815a421ba96eb28bd))
- **vidstack:** import slider keyboard support ([b0fc69e](https://github.com/vidstack/player/commit/b0fc69ebe9ce0b2750f5cbb29db192febf2d93e8))
- **vidstack:** keyboard seeking not working while playing ([fb6114c](https://github.com/vidstack/player/commit/fb6114c7a94b9e5ba8ea06c66afeb54b7bc091c5))
- **vidstack:** moved store props on slider instance to `state` ([d4046fc](https://github.com/vidstack/player/commit/d4046fca96148b1b5b9455ce0e26abe77984b1a5))
- **vidstack:** play event is not fired when autoplay is set ([b0a3b58](https://github.com/vidstack/player/commit/b0a3b58ada8ecea1f443085b801a747d7e74b81f))
- **vidstack:** src change throwing error ([24f98b6](https://github.com/vidstack/player/commit/24f98b6b8db7b3386a9e738f09673f79185f9081))

## [0.4.1](https://github.com/vidstack/player/compare/v0.4.0...v0.4.1) (2023-03-03)

### Bug Fixes

- **vidstack:** `max-width` should be unset on slider video part ([bb96e5f](https://github.com/vidstack/player/commit/bb96e5f2283e83664394278f58e35a6f92c3c13e))
- **vidstack:** slider video should respect `canLoad` and handle late ready state ([7bfc8ba](https://github.com/vidstack/player/commit/7bfc8ba22094c71b053a81507a75bedb1d799566))
- **vidstack:** update slider preview position on focus ([5018871](https://github.com/vidstack/player/commit/5018871c1692e99d81be51fbb50684c15c69ae8e)), closes [#787](https://github.com/vidstack/player/issues/787)

# [0.4.0](https://github.com/vidstack/player/compare/v0.3.3...v0.4.0) (2023-03-03)

### Bug Fixes

- **vidstack:** apply interactive state to slider via keyboard ([39f7c54](https://github.com/vidstack/player/commit/39f7c543f2f23bedefb717812329745a96adb8b3))
- **vidstack:** configure hls low latency mode based on stream type ([a96a3a8](https://github.com/vidstack/player/commit/a96a3a81b5741361dae85b418bc84bceaf177fba))
- **vidstack:** default to 60 seconds for min dvr window based on guidelines ([50f3a9b](https://github.com/vidstack/player/commit/50f3a9b81891f9ae658147eb8bd2222c96d584d1))
- **vidstack:** focus outline offset should match thumb size on slider ([1ebe8a0](https://github.com/vidstack/player/commit/1ebe8a0a6b8cc029a053b602da79f46a7e00fc35))
- **vidstack:** improved slider keyboard support ([6239bc6](https://github.com/vidstack/player/commit/6239bc6ffad8199f70a7f14d0c02526771711ed0)), closes [#776](https://github.com/vidstack/player/issues/776)
- **vidstack:** remove `img-` attr prefix for `<media-poster>` ([ba27b77](https://github.com/vidstack/player/commit/ba27b77a9c2f240aa4b30dce81d92c363a7832eb))
- **vidstack:** remove default border radius on buttons ([d153f89](https://github.com/vidstack/player/commit/d153f890c72c9b58b2ee53c008d5428309dde1bd))
- **vidstack:** rename `<media-slider-value-text>` -> `<media-slider-value>` ([bf26141](https://github.com/vidstack/player/commit/bf26141851ad82fc7a10a31f298ce4a1331d2cb8))
- **vidstack:** rename `bufferedAmount` to `bufferedEnd` ([9b01edf](https://github.com/vidstack/player/commit/9b01edfbc9e89d50836ff3b3139e8d0e1c4d682f))
- **vidstack:** rename `error` attr to `hidden` on `<media-slider-video>` ([3150484](https://github.com/vidstack/player/commit/315048455d1e56c351b466ac2f534de98d12f087))
- **vidstack:** rename `keyboardStep` to `keyStep` on slider components ([2a6ea7a](https://github.com/vidstack/player/commit/2a6ea7a1ef351bdb4d5d8d719f1a2c36243ca7b0))
- **vidstack:** rename `seekableAmount` to `seekableEnd` ([6e32e06](https://github.com/vidstack/player/commit/6e32e068149daad2a0c0d4f1dc94b667e3a60def))
- **vidstack:** rename var `--media-buffered-amount` to `--media-buffered-end` ([77fee5a](https://github.com/vidstack/player/commit/77fee5acb8e1c12e9ef4013847bf0449b2965ff2))
- **vidstack:** rename var `--media-seekable-amount` to `--media-seekable-end` ([5a41129](https://github.com/vidstack/player/commit/5a411293919ec4e3b840a7d2020586e5a6d01d31))
- **vidstack:** retrieve buffered amount when can play is fired ([fd19012](https://github.com/vidstack/player/commit/fd190126df9d8545626de5c9dba08a79c81096a6))
- **vidstack:** revise live stream support api ([db656db](https://github.com/vidstack/player/commit/db656db71a63c846418a0bb27c84ebf04052d699))
- **vidstack:** smoother keyboard seeking on time slider ([07d06de](https://github.com/vidstack/player/commit/07d06deeadcdaab347e9d26cee83b27bdb3177e8))

### Features

- **vidstack:** add `live` and `live-edge` tailwind media variants ([2d9e6ae](https://github.com/vidstack/player/commit/2d9e6ae8aad994119713e15aff48f4e9ca050c02))
- **vidstack:** add keyboard support ([2b96b38](https://github.com/vidstack/player/commit/2b96b38689e4370fa2cdeedd4c34d59265709d11)), closes [#84](https://github.com/vidstack/player/issues/84)
- **vidstack:** expose `live-edge` attribute on `<media-player>` ([d8d891f](https://github.com/vidstack/player/commit/d8d891f64e0fd8db16e68fb59a7cb34a8e14ee71))
- **vidstack:** expose `live` attr on `<media-player>` ([9970c03](https://github.com/vidstack/player/commit/9970c03277e4004a09270546e485f9b930bd7234))
- **vidstack:** live stream support ([a840a4a](https://github.com/vidstack/player/commit/a840a4a155307cfe9c8d20b26d41c44a0871a90c)), closes [#775](https://github.com/vidstack/player/issues/775) [#265](https://github.com/vidstack/player/issues/265)
- **vidstack:** new `--media-buffered-start` var ([2fca996](https://github.com/vidstack/player/commit/2fca9967cd0833451cab389d1bc7096213509199))
- **vidstack:** new `--media-seekable-start` var ([d57c7ba](https://github.com/vidstack/player/commit/d57c7baf85d123fd7a2aee1ca8e5e65fa044a363))
- **vidstack:** new `<media-live-indicator>` component ([68abac1](https://github.com/vidstack/player/commit/68abac102ba7820c7952ff55eb2231d13361f744)), closes [#734](https://github.com/vidstack/player/issues/734)
- **vidstack:** new `<media-seek-button>` component ([894c630](https://github.com/vidstack/player/commit/894c6306fed9a4b79fef599f526596ce7c497058)), closes [#758](https://github.com/vidstack/player/issues/758)
- **vidstack:** new `<media-slider-thumbnail>` component ([a3629e3](https://github.com/vidstack/player/commit/a3629e3c4d0a482eb05da251e5950d9d2c34d771)), closes [#763](https://github.com/vidstack/player/issues/763)
- **vidstack:** new `bufferedStart` media state prop ([371d9c0](https://github.com/vidstack/player/commit/371d9c010bcbd964faae68440dc83c792d5d9ab8))
- **vidstack:** new `currentLiveTime` media state prop ([d49b995](https://github.com/vidstack/player/commit/d49b995ecbbcd7c05cc111f8fdd05bd4eb1a80ae))
- **vidstack:** new `liveEdge` media state prop ([173be30](https://github.com/vidstack/player/commit/173be3085370d488b6b9af71b4106f093b3b4461))
- **vidstack:** new `liveTolerance` player prop ([107b1b1](https://github.com/vidstack/player/commit/107b1b1fcf441db280384080289bb04641cba3ff))
- **vidstack:** new `liveWindow` media state prop ([d55fd50](https://github.com/vidstack/player/commit/d55fd501a80eeb96d57e920c579731efa0850b28))
- **vidstack:** new `media-live-edge-request` event ([91232e0](https://github.com/vidstack/player/commit/91232e00fc1787c8bb0afea1741020d0e30262ed))
- **vidstack:** new `minLiveDVRWindow` media state ([fde19c4](https://github.com/vidstack/player/commit/fde19c4a63a5a89b1fb2d2e69f8251080cdf2088))
- **vidstack:** new `seekableStart` media state prop ([e1dc9fa](https://github.com/vidstack/player/commit/e1dc9fa5ed90f31645922a57e8a2a8251983e3dc))
- **vidstack:** new `seekToLiveEdge` player method ([d63ff65](https://github.com/vidstack/player/commit/d63ff656d04143dba283be7b745d54e923991b68))
- **vidstack:** new `streamType` player prop ([a182aa3](https://github.com/vidstack/player/commit/a182aa3b17505bfd998f0cc38fa86e20b45a2b8b))
- **vidstack:** new `styles/defaults.css` file ([60e1aac](https://github.com/vidstack/player/commit/60e1aacf97ed0c7d854a7052d99e49eb0263ccc7))
- **vidstack:** new `userBehindLiveEdge` media state prop ([1efe954](https://github.com/vidstack/player/commit/1efe9548c0af9efb40c3d6b7f39737aa6885ed6c))
- **vidstack:** new seek backward/forward icons ([6ab58d2](https://github.com/vidstack/player/commit/6ab58d2104d042cc74e484af259767fcbf47c924))
- **vidstack:** readonly atttrs on components are now data-attrs ([631ee19](https://github.com/vidstack/player/commit/631ee1912524adc067fb4acc058c1e4496633e93))
- **vidstack:** refactor media attributes to data attributes ([be705e2](https://github.com/vidstack/player/commit/be705e2572ec163b52ec0829b27273fa3f3acbf2))
- **vidstack:** tooltips support ([b187829](https://github.com/vidstack/player/commit/b187829eedc2b39b9d50f36673443e3e5f0386dd)), closes [#754](https://github.com/vidstack/player/issues/754)

## [0.3.3](https://github.com/vidstack/player/compare/v0.3.2...v0.3.3) (2023-02-26)

### Bug Fixes

- **vidstack:** slider video shrinking at edge ([9de215a](https://github.com/vidstack/player/commit/9de215a2ea8fd3811ac5d3d34d9992d5906cff3d))
- **vidstack:** user idle not removed on playback end ([1af57e4](https://github.com/vidstack/player/commit/1af57e4e88ed90d51380f5fa30cc50db4d4d0289)), closes [#783](https://github.com/vidstack/player/issues/783)

## [0.3.2](https://github.com/vidstack/player/compare/v0.3.1...v0.3.2) (2023-02-18)

### Bug Fixes

- **vidstack:** `media-icons` not bundled in cdn dist ([28aba5f](https://github.com/vidstack/player/commit/28aba5f21c92b36d4f4a74114eff431f1dbe68ad)), closes [#780](https://github.com/vidstack/player/issues/780)

## [0.3.1](https://github.com/vidstack/player/compare/v0.3.0...v0.3.1) (2023-02-17)

### Bug Fixes

- no matching version for `media-icons` ([2e285ef](https://github.com/vidstack/player/commit/2e285ef5442bead09bf69ee6e69b8b2891d6e346)), closes [#779](https://github.com/vidstack/player/issues/779)

# [0.3.0](https://github.com/vidstack/player/compare/v0.2.3...v0.3.0) (2023-02-17)

### Bug Fixes

- support `bundler` ts module resolution ([e5635eb](https://github.com/vidstack/player/commit/e5635ebf759698f0960b2fe397e1e51376903aef)), closes [#771](https://github.com/vidstack/player/issues/771)
- svg icons inside button should scale ([66be655](https://github.com/vidstack/player/commit/66be655228bd648d5790a6b7576b1489b8264b4d)), closes [#743](https://github.com/vidstack/player/issues/743)
- **vidstack:** define imports are not included in prod ([99866f2](https://github.com/vidstack/player/commit/99866f2bc48288f7c98fa25464203e6c0aa495be)), closes [#773](https://github.com/vidstack/player/issues/773)
- **vidstack:** duration nan on source change ([ba51c0d](https://github.com/vidstack/player/commit/ba51c0db1a4fc566bd91e162b8d6662b87f5eda4)), closes [#774](https://github.com/vidstack/player/issues/774)
- **vidstack:** prevent playback immediately ending on seek request ([84f4065](https://github.com/vidstack/player/commit/84f4065d6d6cbdc516f3e88e1d2c84fc24de7039))

### Features

- new media icon component ([4290501](https://github.com/vidstack/player/commit/4290501d82ddcc414b50ae4e32c4b09887a09ddf)), closes [#744](https://github.com/vidstack/player/issues/744)
- new media icons catalog ([a303804](https://github.com/vidstack/player/commit/a3038044762c953f53ccf37cdc990ec95d6ab110)), closes [#745](https://github.com/vidstack/player/issues/745)
- **vidstack:** add `currentSrc` alias ([5dfa19c](https://github.com/vidstack/player/commit/5dfa19ceacb551ec3025a78846a952e3555b5fec))
- **vidstack:** add blob uri support ([3c333db](https://github.com/vidstack/player/commit/3c333dbac7d282a36231db42000d957983c4e8f8)), closes [#762](https://github.com/vidstack/player/issues/762)
- **vidstack:** element type checks ([775f074](https://github.com/vidstack/player/commit/775f074a5597b97cab87af0c1db4bfe425a47ac6)), closes [#741](https://github.com/vidstack/player/issues/741)
- **vidstack:** media prefix on tailwind variants is now optional ([b3e2546](https://github.com/vidstack/player/commit/b3e2546f734b52e6586a6b132668017d1c778d2f)), closes [#742](https://github.com/vidstack/player/issues/742)
- **vidstack:** new `buffering` tailwind media variant ([e65f93d](https://github.com/vidstack/player/commit/e65f93d46917207164904d12cf28860a7688dcf0)), closes [#742](https://github.com/vidstack/player/issues/742)
- **vidstack:** new `can-control` tailwind variant ([962e458](https://github.com/vidstack/player/commit/962e458a2817bb16e3d025ed4e53feff53e3aea6)), closes [#742](https://github.com/vidstack/player/issues/742)
- **vidstack:** tailwind not variants ([e7ce50e](https://github.com/vidstack/player/commit/e7ce50e6604977ede7c80fe2d4ab354aafb4abe1)), closes [#739](https://github.com/vidstack/player/issues/739)
- **vidstack:** tailwind variant prefixes now configurable and empty by default ([7d10a48](https://github.com/vidstack/player/commit/7d10a4813ddb739749aa23e232d07238ae9987e9)), closes [#742](https://github.com/vidstack/player/issues/742)

## [0.2.3](https://github.com/vidstack/player/compare/v0.2.2...v0.2.3) (2023-02-06)

### Bug Fixes

- **vidstack:** add docs to the media remote control ([3bcf3d3](https://github.com/vidstack/player/commit/3bcf3d378da87118f4c8cdaacffed617677941d0))
- **vidstack:** default to loading full version of `hls.js` - more reliable ([efcb11b](https://github.com/vidstack/player/commit/efcb11bc248f90b88c0bb2617c1ae356ff473d84))
- **vidstack:** hls provider not working in devtools on iphone view ([7217412](https://github.com/vidstack/player/commit/72174121115ac511011ac81a0186ac04fea6d97c))
- **vidstack:** multiple players freezing page ([91e23b6](https://github.com/vidstack/player/commit/91e23b6684f75b35166056ffaa2b03ead95e5bc3)), closes [#731](https://github.com/vidstack/player/issues/731)

## [0.2.2](https://github.com/vidstack/player/compare/v0.2.1...v0.2.2) (2023-02-03)

### Bug Fixes

- **react:** aspect ratio not working - attr not reflected ([593ad6c](https://github.com/vidstack/player/commit/593ad6ce6e5154fb7939d71ff56cf8b0e3dff16e))

## [0.2.1](https://github.com/vidstack/player/compare/v0.2.0...v0.2.1) (2023-02-03)

### Bug Fixes

- **vidstack:** add `define/media-outlet` empty file to avoid confusion ([fa4a558](https://github.com/vidstack/player/commit/fa4a558c201dd6854a0e4b6721477c9bbd5d9288))
- **vidstack:** fire `provider-setup` after hls has loaded lib ([2d67029](https://github.com/vidstack/player/commit/2d67029e192482e5f9c20403671599bc04da6b28))
- **vidstack:** hls does not ssr because it fails current checks ([5bb30d1](https://github.com/vidstack/player/commit/5bb30d1282fb467aae7827d05eb90a9df14cd9b9))
- **vidstack:** hls dynamic imports are not set correctly ([87486ad](https://github.com/vidstack/player/commit/87486ad353d9f71babb0af00a540410a111990d2))
- **vidstack:** slider value text and time not updating post-hydration ([f0b1aac](https://github.com/vidstack/player/commit/f0b1aac3866859890d2a2d3f6d5c1d2755c09fa1))
- **vidstack:** static hls import not initialized ([47d532b](https://github.com/vidstack/player/commit/47d532bbf07a2c2138cc8e0642e8909c1b96868e))

# [0.2.0](https://github.com/vidstack/player/compare/v0.1.5...v0.2.0) (2023-02-02)

### Bug Fixes

- **react:** `useMediaState` -> `useMediaStore` ([1cc1551](https://github.com/vidstack/player/commit/1cc1551dc3915459baf5c85f4eb91331a3c719f5))
- **react:** hooks not subscribing to ref on mount ([269cb70](https://github.com/vidstack/player/commit/269cb70a78011956fe4b2b5e362a605051e7d929))
- **react:** mount instance once during dev ([331cbf8](https://github.com/vidstack/player/commit/331cbf89dcd9e940542b924179eec8f717566ecc))
- **react:** source selection process hanging ([e52ecb5](https://github.com/vidstack/player/commit/e52ecb5dd736b61e3ba5f8286444507c87906e00))
- **vidstack:** `view` attr no longer required ([da37ffc](https://github.com/vidstack/player/commit/da37ffcc22ac46b2c4eb763a865c5eda2e0a10a0))
- **vidstack:** not updating correctly on source+provider change ([b9f316a](https://github.com/vidstack/player/commit/b9f316a089c4b333155229317a3919df58374940))
- **vidstack:** provider loader should test audio/video src type ([131fb08](https://github.com/vidstack/player/commit/131fb08279ca16fca86f9b4f0043a82e89875b61))
- **vidstack:** sliders not working on touch ([68d4c2b](https://github.com/vidstack/player/commit/68d4c2b77eac739a4ba4ab29698446252c6daaf3))

### Features

- `vds-*` -> `media-*` tag prefix ([867b926](https://github.com/vidstack/player/commit/867b926d2a6a9c22c07d45ff8e57a23ba61f70d1))
- new slider subscribe method and react hook ([7644ae2](https://github.com/vidstack/player/commit/7644ae2a2e70f50f7267822e74169e694debd6f9))
- **vidstack:** `MediaRemoteControl` no longer requires target/destroy ([1ee1a44](https://github.com/vidstack/player/commit/1ee1a44aba1fae8e19af37e7999486eddbdaac41))
- **vidstack:** `src` can now also accept `Blob`, `MediaSource`, `MediaStream` ([623dfea](https://github.com/vidstack/player/commit/623dfea52988b0ce4aae6bcc1e4c5af603a12024))
- **vidstack:** allow provider type on player to be narrowed without ts ([b0203c6](https://github.com/vidstack/player/commit/b0203c628ac79d7644fba64b4e64be1fcd3c1964))
- **vidstack:** new `<media-slider>` component ([6b1dc45](https://github.com/vidstack/player/commit/6b1dc45cebacdd547668cc7e9d83a0f8a5db43f8))
- **vidstack:** new `<media-toggle-button>` component ([88d4e51](https://github.com/vidstack/player/commit/88d4e51d8237c3971932b7238dd297cf0274a9bd))
- **vidstack:** rework media subscriptions ([b7a1564](https://github.com/vidstack/player/commit/b7a1564a9cd83f56326f916e7175cf9c9ae25b2d))
- **vidstack:** rework providers ([f921b2b](https://github.com/vidstack/player/commit/f921b2b845c40f27e30345874060fb80fccccd47))

## [0.1.5](https://github.com/vidstack/player/compare/v0.1.4...v0.1.5) (2023-01-27)

### Bug Fixes

- **react:** remote not attached to media due to mount order ([62207b0](https://github.com/vidstack/player/commit/62207b08277e09db6e6483eec3c76c8b1aa13dd2))

### Features

- **vidstack:** include component doc links in vscode custom data ([072586b](https://github.com/vidstack/player/commit/072586bcdb00448f3670baca24a1e4c53dac1989))

## [0.1.4](https://github.com/vidstack/player/compare/v0.1.3...v0.1.4) (2023-01-26)

### Bug Fixes

- **vidstack:** `<vds-media>` props are not in-sync with media store ([1ae9047](https://github.com/vidstack/player/commit/1ae90478614634a808982eb318d768b9f51c6f7f))
- **vidstack:** better html support for `MediaRemoteControl` ([0def947](https://github.com/vidstack/player/commit/0def94700c27274d28127404d2f40bb59a47d319))
- **vidstack:** idling not working as expected ([9e3764c](https://github.com/vidstack/player/commit/9e3764c4dcec962bd021811deea67930d79c65fa))

### Features

- **vidstack:** new toggle methods on `MediaRemoteControl` ([647bbc3](https://github.com/vidstack/player/commit/647bbc3b9a2c0a5792e1eda5e18491868c203ce2))

## [0.1.3](https://github.com/vidstack/player/compare/v0.1.2...v0.1.3) (2023-01-25)

### Bug Fixes

- **vidstack:** add `MediaOrientationChangeEvent` type ([4c67ae2](https://github.com/vidstack/player/commit/4c67ae2b190f316bc9d43773a4f6bbb251bfe7a4))
- **vidstack:** fullscreen events should not bubble similar to other media events ([4e9bd32](https://github.com/vidstack/player/commit/4e9bd3269b51af13ac27f914afeec844778cb426))
- **vidstack:** simplify screen orientation events ([c922d15](https://github.com/vidstack/player/commit/c922d152890d88be32f9becccd9f61903a3e9bb9))

## [0.1.2](https://github.com/vidstack/player/compare/v0.1.1...v0.1.2) (2023-01-25)

### Bug Fixes

- **vidstack:** `user-idle` attribute is not being applied ([45a5531](https://github.com/vidstack/player/commit/45a553125a7c24b3a6b62719f20eaf2b588f92a6))

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
- **vidstack:** `define/*` exports are not set ([83af301](https://github.com/vidstack/player/commit/83af3014c7e08a1cf8b7a463ec7290d0e27e6fb0))
- **vidstack:** `hlsConfig` -> `config` ([96037ff](https://github.com/vidstack/player/commit/96037ff3067089454821d8a2514392d4e4b479fd))
- **vidstack:** `hlsLibrary` -> `library` ([10e5ffc](https://github.com/vidstack/player/commit/10e5ffce2608753dc3bf6a791dedf13aa67caa81))
- **vidstack:** `ios-fullscreen` -> `ios-controls` ([19f564a](https://github.com/vidstack/player/commit/19f564a3c3567d800084ebcccd8642f6c6163db5))
- **vidstack:** `startLoadingMedia` -> `startLoading` ([b429e99](https://github.com/vidstack/player/commit/b429e99a8674b25038147145a9830c3ea0d4ebdb))
- **vidstack:** copy controller props over to media store during ssr ([f678d07](https://github.com/vidstack/player/commit/f678d071ed0c8089b092899ea48a5ec7d954741d))
- **vidstack:** correctly resolve html provider default slot ([da51399](https://github.com/vidstack/player/commit/da51399d8d2706280c39c6c6ee58a1125c09cf55))
- **vidstack:** dev export should come after server exports ([d4fd9f3](https://github.com/vidstack/player/commit/d4fd9f3567349fa9b22a9c71b3ccc78b5b4ca4f2))
- **vidstack:** ensure browser support checks dont run on server ([8652e9e](https://github.com/vidstack/player/commit/8652e9e462d4f5f7d13a7bea76651f4b3b10918f))
- **vidstack:** init media store ([82ccd51](https://github.com/vidstack/player/commit/82ccd51d123db0ee148e2d4ad7f89b5abe839015))
- **vidstack:** invalid doc links ([3aa3993](https://github.com/vidstack/player/commit/3aa3993b47dc2d0cf005942cb1ee0f996f6a7eb3))
- **vidstack:** load native poster if no hide request is fired ([fc8990c](https://github.com/vidstack/player/commit/fc8990c3f46aa898ee8a75f37a69df3acd17a29c))
- **vidstack:** prefix media request events with `Media` ([9103cf6](https://github.com/vidstack/player/commit/9103cf6edfcc49e88afdc384301e43856445055f))
- **vidstack:** set/update poster on underlying html media element ([313f83e](https://github.com/vidstack/player/commit/313f83ec27af7f5dbb29fe5b67a7c883d99d5e12))
- **vidstack:** slider preview not working on safari ([d37ed5a](https://github.com/vidstack/player/commit/d37ed5a29c2db18859391ce885e49ff01a2e70f6))
- **vidstack:** strip `hls-` prefix from provider events and attach correctly ([95c3673](https://github.com/vidstack/player/commit/95c3673b1bfe768aad5e06c7c6e2228c4f4f1ad4))

### Features

- lift all media state and events up to `<vds-media>` ([82db8f3](https://github.com/vidstack/player/commit/82db8f30385d76ca8d6576ae909a704ff0f00522))
- **react:** new `useMediaProviderElement` hook ([0dffbbb](https://github.com/vidstack/player/commit/0dffbbbb41051740b97812e4f4d3864d89798347))

## [0.0.1](https://github.com/vidstack/player/compare/v0.0.0...v0.0.1) (2023-01-18)

### Features

- migration to maverick ([#700](https://github.com/vidstack/player/issues/700)) ([f3b07d3](https://github.com/vidstack/player/commit/f3b07d3b35d7d1cb442e5eaf77e79ce0f6f70996))

# [0.0.0](https://github.com/vidstack/player/compare/796cbf79f1ca8b346d2a00e79a5b1a1e8be07828...v0.0.0) (2022-12-02)

### Bug Fixes

- `_logger` statement leaking to production ([1a6c914](https://github.com/vidstack/player/commit/1a6c914c6b4827c358a99bf7c78685dc653983b2)), closes [#463](https://github.com/vidstack/player/issues/463)
- `<vds-media-ui>` blocks gestures ([a68fb19](https://github.com/vidstack/player/commit/a68fb1904274d9c9362d2cfe5b4223940d671179))
- `button` should match dimensions of host `vds-toggle-button` element ([9e2610f](https://github.com/vidstack/player/commit/9e2610fc9a8208604cd127a0e0d5208da627e984))
- `canplay` event not fired on iOS ([7e5ce45](https://github.com/vidstack/player/commit/7e5ce45fbb6327b14223aea65bad654602154312))
- `error` should return `error` context value ([655e701](https://github.com/vidstack/player/commit/655e70178c05ba2e5f9d478cf575b43451a5874f))
- `isFunction` does not correctly validate async functions ([4e40a42](https://github.com/vidstack/player/commit/4e40a429290ac0ad44eac61debf51325cdb3778b)), closes [#421](https://github.com/vidstack/player/issues/421)
- `mediaContext.live` should return `boolean` not tuple ([7f4b052](https://github.com/vidstack/player/commit/7f4b05281e972181c7d57035c1fe624c963ec230))
- `mediaEventListener` waiting for wrong connect event ([9c4b3d3](https://github.com/vidstack/player/commit/9c4b3d38e2458921493dae6070becc0315b1b61c))
- `node_modules` ignored by npm when included in `dist` dir ([d4f775e](https://github.com/vidstack/player/commit/d4f775ec72a7906380735696e518c81845c9e76c))
- `originEvent` should return self if no `originalEvent` ([2da6736](https://github.com/vidstack/player/commit/2da6736ccc355121a76ed2f3d3b02cd037c30060))
- `paused`, `muted`, `src`, and `poster` attrs not in-sync ([6beca8b](https://github.com/vidstack/player/commit/6beca8b46810ab4c9f5df3d72fc737e7a73cf1b9))
- `repeat` and `priority` attrs on `<vds-gesture>` not converted to number ([6e4f1b0](https://github.com/vidstack/player/commit/6e4f1b0d2569cc536a1d0d20b0a8ffd5d9a6f9ca))
- `seeked` and `vds-seeked` should not be dispatched while seeking ([9ecd4cf](https://github.com/vidstack/player/commit/9ecd4cf5267e740f1603244ef5721eef855932ec)), closes [#437](https://github.com/vidstack/player/issues/437)
- `vds-ended` not firing ([040af3f](https://github.com/vidstack/player/commit/040af3f331645b762428d26ce1eacaf2bf3d96f9)), closes [#464](https://github.com/vidstack/player/issues/464)
- `vds-fullscreen-change` not dispatched from controller ([7160c34](https://github.com/vidstack/player/commit/7160c345e7443538587fbcdc19dd36e365b605bf)), closes [#438](https://github.com/vidstack/player/issues/438)
- `vds-replay` should not fire when seeking after ended ([dc8c426](https://github.com/vidstack/player/commit/dc8c4263468adfe685d76fa0e05891d19e0b6dcd))
- `vds-waiting` trigger event not added to `vds-play` event ([04c4c38](https://github.com/vidstack/player/commit/04c4c389cd6bdc3f2dd7b8e9cd23a3ba3aa276a0))
- `waiting` context should be set to `false` when playback ends ([f5db2ef](https://github.com/vidstack/player/commit/f5db2ef8d12d143bb2ada905f2ec4c97d0732660))
- add `module` key to `package.json` ([5bc1195](https://github.com/vidstack/player/commit/5bc1195a0a24d00af6816ee59151d37f901639f9))
- add `vds-` prefix to media CSS props ([db9b840](https://github.com/vidstack/player/commit/db9b840e8224e4bc443540eb5020a6ac35b32206))
- add keywords to package.json ([6833f55](https://github.com/vidstack/player/commit/6833f55ded56d94e6b36c025b1e0c0c4dabd0e62))
- add typescript support for export paths ([f39afd3](https://github.com/vidstack/player/commit/f39afd35e24eba34851d2da031b4dd68e05c3ec5))
- attempt 1 to improve detecting ended state ([b2c124d](https://github.com/vidstack/player/commit/b2c124d630864238f1173f854197162323f2cc40))
- attempt 2 at improving ended state detection ([4093d8b](https://github.com/vidstack/player/commit/4093d8bb9029235a0c817a6d60932ca5f98f017d))
- attempt 3 at improving ended state detection ([0922d7a](https://github.com/vidstack/player/commit/0922d7afdaf935272a931b9ff5a9de04f1ae24d2))
- autoplay not handled after initial update ([6da208c](https://github.com/vidstack/player/commit/6da208cbed81a9b98e2290f0c382e45c1bd75f17))
- autoplay retrying more than max limit ([40159f5](https://github.com/vidstack/player/commit/40159f586f800e55d235fa7379663bc4421bd2ee))
- avoid infinite trigger events on `vds-can-play` event ([7a108f4](https://github.com/vidstack/player/commit/7a108f4d4bc2d3e14bf27d728d7e784d6af8bce0))
- **base/context:** `consumeContext` decorator should not redefine ([653bf2c](https://github.com/vidstack/player/commit/653bf2cbc21f1b6efb16b74b20ccee4db1086753))
- **base/context:** add `debug` option for backwards compatibility ([fc37940](https://github.com/vidstack/player/commit/fc37940dd1e540c7c4dd7dcf2e6cabd390767438))
- **base/context:** consumers intializing on wrong constructors ([5b2c91f](https://github.com/vidstack/player/commit/5b2c91fe57d35cc87db65aabc2c7f48f855eb0d3))
- broken exports paths in `package.json` ([34a5d48](https://github.com/vidstack/player/commit/34a5d489a1b2a8669d9251be618d78fdc32c470c))
- browsers fire `canplay` and `canplaythrough` more than once ([63a6dba](https://github.com/vidstack/player/commit/63a6dba9572dc95a539f912574168a5cb07cd233))
- **bundle:** add missing `ui/controls/controls` imports ([e8b6876](https://github.com/vidstack/player/commit/e8b68761a6d8c153b664fdfc75017f469c40f421))
- **bundle:** add missing audio provider exports ([9452bab](https://github.com/vidstack/player/commit/9452babf9ea8c1cd03f0f67d19a2e6cb8230d895))
- **bundle:** add missing scrubber subcomponent exports ([ca176d1](https://github.com/vidstack/player/commit/ca176d15c77530d24ace4fc65fd0e79ffff1c436))
- **bundle:** include entry point `.d.ts` file ([fa69315](https://github.com/vidstack/player/commit/fa69315767b534607003c93a4fe31853b9ea2655))
- bundling fails because `default` exports should be last ([34b2ce5](https://github.com/vidstack/player/commit/34b2ce581636d2a84c219f2cbaf3c64d6a1ac4a0))
- change required/recommended node version ([3c3e017](https://github.com/vidstack/player/commit/3c3e0177cfe8aa4a7c0d318c28b674cef9caf69e))
- circular dep between logger and context ([9e581ed](https://github.com/vidstack/player/commit/9e581ed1a1a112c6e12ca8eb703ec18a7bfe8e02)), closes [#462](https://github.com/vidstack/player/issues/462)
- **ci:** test releasing off next branch ([#99](https://github.com/vidstack/player/issues/99)) ([587d2cc](https://github.com/vidstack/player/commit/587d2ccb36b0e004aed8dc71c6311c59d04aa404))
- clean up aspect ratio implementation ([e8b9027](https://github.com/vidstack/player/commit/e8b90277df0b50f5d5dad30bcd21dbc1d5cb0ed0))
- cleanup removed scrubber types ([4de7b25](https://github.com/vidstack/player/commit/4de7b250ff6417e79126910c530d3c9e521ef105))
- cleanup stories and patch small ui-related issues ([79bad18](https://github.com/vidstack/player/commit/79bad184c28a788d4067fcc0a47cff8886183fde))
- clear pending media requests on disconnect ([e42c1b4](https://github.com/vidstack/player/commit/e42c1b4a9a1258e940cb0ea1407b4bb01425990a))
- complex type kebab-case attrs not set in some frameworks ([dbf97ba](https://github.com/vidstack/player/commit/dbf97ba7d906e06da439d611074ea64387361c7d)), closes [#583](https://github.com/vidstack/player/issues/583)
- context not working if used on class getter/setter ([af2108b](https://github.com/vidstack/player/commit/af2108b3630b92d19af1234236ed1dd00dff0f24))
- **core/provider:** `hasPlaybackRoughlyEnded` returns `true` if duration is not set ([99e8ea0](https://github.com/vidstack/player/commit/99e8ea0549512e1125a846ba8320e155db5241c7))
- **core:** `seeking` context should be soft reset ([d9ba816](https://github.com/vidstack/player/commit/d9ba81686caaa102048e3e2f7a7f7c9294a03c72))
- **core:** media provider not initialized error when importing from core ([248b848](https://github.com/vidstack/player/commit/248b8484d2689d3e3a431405f24ff6b4624e2163))
- **core:** set internal player component methods to protected access ([2f3f31f](https://github.com/vidstack/player/commit/2f3f31fc7aea23180ab232d6d058776b50538c38))
- **core:** user events must bubble up through shadow dom to reach provider ([d549d4d](https://github.com/vidstack/player/commit/d549d4d7cb0a90ba56da775105c1d2e708704943))
- correct exported types and include short `define` export ([de21cfe](https://github.com/vidstack/player/commit/de21cfef3cd60e3e196fb8f65e726e4c16e8e7f7))
- default to light version of `hls.js` ([33e5bd1](https://github.com/vidstack/player/commit/33e5bd1a875f94e00703c96ad17a2e6ea3b6476b))
- do not actively update `currentTime` while seeking ([e56009c](https://github.com/vidstack/player/commit/e56009c9c70446eaf8c853eb3a95c06d40e6b34e))
- do not include source maps in release ([22f8c01](https://github.com/vidstack/player/commit/22f8c0161dbc6e0da0afe815bd5bafddae7f8ef3))
- dont update engine property if not changed ([dbe1dba](https://github.com/vidstack/player/commit/dbe1dba7f977f5f67bc7f7e90a94483622629c2c))
- downgrade hls.js from ^1.0.0 to ^0.14.17 due to instability ([b98f69f](https://github.com/vidstack/player/commit/b98f69fcf29e61a0a27d27dd70b9093ec006a3bd))
- drop `<vds-buffering-indicator>` ([0f96143](https://github.com/vidstack/player/commit/0f96143d503a9870e71644bf18cc3563f55729ed)), closes [#582](https://github.com/vidstack/player/issues/582)
- drop `<vds-scrubber-* />` components ([f09abf1](https://github.com/vidstack/player/commit/f09abf19976ffe35aae19c9b014df866f12df605)), closes [#614](https://github.com/vidstack/player/issues/614)
- drop `<vds-seekable-progress-bar />` ([dda4b17](https://github.com/vidstack/player/commit/dda4b170049229c2cdf617407e54a7e2df1fd395)), closes [#609](https://github.com/vidstack/player/issues/609)
- drop `<vds-time-* />` components ([97e3769](https://github.com/vidstack/player/commit/97e376937fd0783f4394890b50f78b6bf9da7b2c)), closes [#608](https://github.com/vidstack/player/issues/608) [#610](https://github.com/vidstack/player/issues/610)
- drop `clsx` in favour of `classMap` ([ea809cd](https://github.com/vidstack/player/commit/ea809cd6b92b06364acc9654b62a3166f55248ff))
- drop `exports` field due to lack of typescript support ([2b10227](https://github.com/vidstack/player/commit/2b10227eab4aba8ad04bec61af23f601a8d7cdbb))
- drop generic provider argument on `MediaControllerElement` ([e644f1a](https://github.com/vidstack/player/commit/e644f1a8ae5488cdaa97c9c9306a6a48e962b1c4))
- drop inline `type` usage to support TS>=4.3.5 ([5df29ed](https://github.com/vidstack/player/commit/5df29ed38d4fb34f4c41659040d178779ec8bf3a))
- drop node requirement from `>=16` to `>=14.9` ([c8ac432](https://github.com/vidstack/player/commit/c8ac432e0adbcb4ba8adcf479d949e5262fb4f21))
- **eliza:** ensure all properties are included in analysis ([32fa9b0](https://github.com/vidstack/player/commit/32fa9b0d0da54dee28babb9ee6f835ac846b49bd))
- ensure controller targets can be set for framework support ([501856b](https://github.com/vidstack/player/commit/501856b238ab8003aae62a4066e2cc6b64bd67c7))
- expose media attrs and css props on `<vds-media-ui>` ([843dc3d](https://github.com/vidstack/player/commit/843dc3d8f6718830d914f3f2875acf4791ae9f2b)), closes [#581](https://github.com/vidstack/player/issues/581)
- fire `vds-started` once playback begins ([5d1a4d3](https://github.com/vidstack/player/commit/5d1a4d3aea687e75defb205be444ca6785a38618))
- follow lit guidelines on publishing ([d88fc6f](https://github.com/vidstack/player/commit/d88fc6fe8b982900d79dd5d3479fa0e6dff423e5))
- force new release on `next` dist-tag ([f0dfb3b](https://github.com/vidstack/player/commit/f0dfb3b2289a0e8444463bdf03b07e40a103ff92))
- **foundation/context:** events in iOS 12/13 are objects (not instances of a class) ([af22c03](https://github.com/vidstack/player/commit/af22c03657809e6f1eadae9b6e748c582892174d))
- **foundation/events:** getters/methods are not defined for events on iOS 12/13 ([a77348e](https://github.com/vidstack/player/commit/a77348ed9eeb4425e3c87d09d1b2576319d743d4))
- **foundation:** `listen` function not imported by `FullscreenController` ([7324416](https://github.com/vidstack/player/commit/73244162d03530117ebefd2b0841e030be060156)), closes [#637](https://github.com/vidstack/player/issues/637)
- **foundation:** external just lib dependencies ([3affd80](https://github.com/vidstack/player/commit/3affd80409689bdeaa62c0ef603dc0a479354f63))
- **foundation:** request queue should be flushed in-order ([977f5bd](https://github.com/vidstack/player/commit/977f5bd3d73eb9e78d9b57db75300337dc8dc358))
- fullscreen broken on ios safari ([689feb0](https://github.com/vidstack/player/commit/689feb0327a9e90ebb96ed99a07b9c9489a74be6))
- fullscreen error events should bubble ([b913102](https://github.com/vidstack/player/commit/b913102ed32985e87a47a3148660852696f169a7)), closes [#438](https://github.com/vidstack/player/issues/438)
- fullscreen event listeners not attached correctly ([99f74a0](https://github.com/vidstack/player/commit/99f74a0eed7212511e5b6f9a04aff6d8e33b1ee8))
- handle lazy media src change correctly when passed as `<source>` ([0a55ff8](https://github.com/vidstack/player/commit/0a55ff811929f7d1ac52097dfc975d2b6d69dce9))
- improve `currentTime` accuracy ([1e1aa73](https://github.com/vidstack/player/commit/1e1aa733a7ebd74104112a0064ba1656ede477e7))
- improve default styles ([fac7d7a](https://github.com/vidstack/player/commit/fac7d7ad8e955d17bf9c33b386bed915165aaaf2))
- improve focus styling of toggle button and slider ([3b6fc51](https://github.com/vidstack/player/commit/3b6fc5105a04545839a82af66c89c2dc2fc366fe))
- improve keyboard support on toggle buttons ([97368cd](https://github.com/vidstack/player/commit/97368cd9c995297ea44439a34d36be63cda7d04d))
- improve media error event handling ([bfdf790](https://github.com/vidstack/player/commit/bfdf79065555ae1b6b09d96a3edbcbe23fc3d443))
- improve media event handling flow in controller ([ffb1fd5](https://github.com/vidstack/player/commit/ffb1fd5ce09e40b38309630c124684156ab5105f))
- improve request queue and disposal bin logging ([859dcd0](https://github.com/vidstack/player/commit/859dcd02f83f943ff02f233b488f6cc9cdddd714))
- improve ts exports type detection ([fc42ded](https://github.com/vidstack/player/commit/fc42ded6cff4151c57570b6f9dade4d3516f27ee))
- include `bundle/define.js` in `sideEffects` field ([3993313](https://github.com/vidstack/player/commit/3993313d312ab7ed99d3cd8ab588e77c0ca078b5))
- include `index.js` in `dist` ([fc370b6](https://github.com/vidstack/player/commit/fc370b61637066d9a7d0253f198579185c09bcde))
- include media ui in exports ([9f223e5](https://github.com/vidstack/player/commit/9f223e563abde1bf11e67f783d09ae3ca25c01e1))
- include screen orientation events in media events ([f4fd62c](https://github.com/vidstack/player/commit/f4fd62cb32e696b9d8e2ff4aaf93d65fa07c612a))
- include shared dir in package distribution ([620265b](https://github.com/vidstack/player/commit/620265b4976957ab4805beda6392cf898055080d))
- include src files in npm package ([6e38efd](https://github.com/vidstack/player/commit/6e38efdf504792ad116814a3cc8738edc1d47c24))
- incorrect return type on `contextProviders` in `WithContext` mixin ([6d33ca2](https://github.com/vidstack/player/commit/6d33ca2f81b790ea1a4c96e01a0b095345c46bee))
- **kit-plugins:** incorrectly escaping `<` and `>` symbols in `<code>` ([849387e](https://github.com/vidstack/player/commit/849387e3fac11ce7aba238ae6e82bd886e3a5524))
- main/module fields should point inside bundle dir ([9a74459](https://github.com/vidstack/player/commit/9a744594e3705bd74959f73ef7cb001c012604d9))
- make `<vds-slider />` headless ([eb0c2b3](https://github.com/vidstack/player/commit/eb0c2b32aaa92b21de32e1aab62c91d9a0f27165)), closes [#612](https://github.com/vidstack/player/issues/612)
- mark `lit` as external in dev/prod builds correctly ([27f45ab](https://github.com/vidstack/player/commit/27f45ab924b6c232992128ea8914f882d9be0ece))
- media does not automatically fill aspect ratio container ([c50b9a8](https://github.com/vidstack/player/commit/c50b9a869616a089c1a68753b9c0aaa55a2c08d3))
- media ended store is not updated ([10ef1c3](https://github.com/vidstack/player/commit/10ef1c382e3b15529ce0890954b7ee35c106e71a))
- media ready log is not levelled ([0b381a0](https://github.com/vidstack/player/commit/0b381a09b605314c7c0a782081935ef63726b45f))
- **media/controller:** call seek on media provider when seeking request received ([#374](https://github.com/vidstack/player/issues/374)) ([fb8fe23](https://github.com/vidstack/player/commit/fb8fe23afa5696780d1706d658a9790626863cd9))
- **media/controller:** copy context values before injecting on media provider ([e54d49e](https://github.com/vidstack/player/commit/e54d49e668f08c5e7616670bc547b06e4cdfc76f))
- **media/controller:** fix mapped types becoming properties and not methods ([aa3a740](https://github.com/vidstack/player/commit/aa3a740010232471c6a2757c7c70f2912604b95d))
- **media/controller:** fullscreen property not reflecting true state ([#375](https://github.com/vidstack/player/issues/375)) ([348b8b1](https://github.com/vidstack/player/commit/348b8b1a4c6b9986955275a4cdce8a7a1c0ffcd2))
- **media/controller:** lower snap to end threshold ([5f05273](https://github.com/vidstack/player/commit/5f052738f774a893e283cde4484f0d61680529a8))
- **media/controller:** should update global log level ([0ff324f](https://github.com/vidstack/player/commit/0ff324f2c42b860d0c74d2ad09883027923b72b5))
- **media/provider:** `canRequestFullscreen` context is never updated ([36aab34](https://github.com/vidstack/player/commit/36aab34b41307ac48860b1fea17acddd6ac83bfc))
- **media/provider:** do not reset media request queue ([fac3ac4](https://github.com/vidstack/player/commit/fac3ac45f816ce4e10dfa5e8e43af0e23b83f8b2))
- **media/provider:** initial provider queue is reset prior to first render ([738242a](https://github.com/vidstack/player/commit/738242af96eccf0824a23e1ff9e8bac7ed7c5417))
- **media/provider:** old context provider record is not destroyed ([287ff0f](https://github.com/vidstack/player/commit/287ff0f9333553317fe84574a426ad5288c801e2))
- **media/provider:** skip first queue flush to ensure props are passed through ([7bf1d89](https://github.com/vidstack/player/commit/7bf1d89ad80ab812b1882dfcf1f4db5a174d8c03))
- **media/ui:** add missing context consumers ([6f765a7](https://github.com/vidstack/player/commit/6f765a73badf5e34e2924248c78e1a0c9f9ad350))
- **media/ui:** return type of `renderRootChildren` is invalid template type ([8083f6c](https://github.com/vidstack/player/commit/8083f6c77949468712ece312a3a55b8141139ba4))
- **media:** add `vds-fullscreen-change` event to `MediaEvents` ([85ce103](https://github.com/vidstack/player/commit/85ce103fc5023ea5f8d91c979ea3d4e45ae74871))
- **media:** cancel firing waiting if `seeked` fires ([87564b5](https://github.com/vidstack/player/commit/87564b564f7dd36b8e467313fe306226a65eaacc))
- **media:** ensure derived properties work on `MediaProviderElement` ([f10826a](https://github.com/vidstack/player/commit/f10826a493b51ed9ea0fd11cb8ee583f57afd5bd))
- **media:** major improvements to media event handling and requests ([e577c6e](https://github.com/vidstack/player/commit/e577c6ec79374e65749918becb028ac3d0a6e4fb))
- **media:** play trigger events should have priority over seeked ([f28f3a6](https://github.com/vidstack/player/commit/f28f3a60e19f16755008b006410db256d012a2c5))
- **media:** prefer shallow clone of media state to avoid circular errors ([a2154b2](https://github.com/vidstack/player/commit/a2154b27c0031fd6cf33b299769b60f3a4397b28))
- **media:** remove observed media event listeners when controller disconnects ([5b41a33](https://github.com/vidstack/player/commit/5b41a3371037bce1f434431de31eec5e03de3f66))
- **media:** safeguard against pending media requests stacking ([b9e2f73](https://github.com/vidstack/player/commit/b9e2f73d65ac87d92dee539d2716e0209f2159de))
- **media:** set `target` of media events to `MediaProviderElement` ([00505ef](https://github.com/vidstack/player/commit/00505ef1dd85ec884d6c1aac0b8dfcca06b4bdf8))
- minification is breaking decorators ([d90af7b](https://github.com/vidstack/player/commit/d90af7bb2fae83a030acc0413e988abd4c52aece))
- minify node bundles ([d551623](https://github.com/vidstack/player/commit/d55162304bdadbdc6cefa551e5070611accecd42))
- move `lit` to peer deps ([af82217](https://github.com/vidstack/player/commit/af8221742087b98e4117d6d8032fd8dd24b1a697))
- move events utils to `utils` folder ([ff45b75](https://github.com/vidstack/player/commit/ff45b75f6fd841e2f197b23716fecddb3572ab68))
- never assume native autoplay will work ([f54c3a8](https://github.com/vidstack/player/commit/f54c3a8634b34427a9928aa50395394a1e7521ef))
- normalize `vds-waiting` event when seeking ([e6f82b1](https://github.com/vidstack/player/commit/e6f82b1cc0dfaccda5acb93da193e963accc7fbc))
- **package.json:** point `types` to root `index.d.ts` ([bac0c15](https://github.com/vidstack/player/commit/bac0c154499645fc6ba5fb421c2a1d52baab0080))
- patch up missing global types ([a897b71](https://github.com/vidstack/player/commit/a897b71c31a3b555041dff25552e8ca007ba754e))
- **player-react:** clean up event callback types ([e7553f0](https://github.com/vidstack/player/commit/e7553f0d416aad736c927006607a7568956fcf0b))
- **player-react:** do not serialzie functions during ssr ([6cedf1d](https://github.com/vidstack/player/commit/6cedf1d78834964006b8544f53401c0eb93c7707))
- **player-react:** manage hook refs correctly ([1033dd4](https://github.com/vidstack/player/commit/1033dd44e7fd3c21752cf649ab9f1281b33036cb))
- **player-react:** mark components as side-effect free ([65b4684](https://github.com/vidstack/player/commit/65b4684dd8d0fc79a68ac36bfa8e85cf59937f64))
- **player-react:** nextjs ssr failing ([ec5b54c](https://github.com/vidstack/player/commit/ec5b54c0e7c3e4a5a4ebed4877b0b4a75829d5f0)), closes [#666](https://github.com/vidstack/player/issues/666)
- **player-react:** simplify react component types output ([5e0548a](https://github.com/vidstack/player/commit/5e0548a49cf62018dc7f6d1f3a06d0cb239ee4f4))
- **player:** `AspectRatioElement` css variables not set on connect ([7c03e9c](https://github.com/vidstack/player/commit/7c03e9c8647698fd9790188d552b627f1a17c845))
- **player:** `AspectRatioElement` not rendering in svelte kit ([a568064](https://github.com/vidstack/player/commit/a56806456eb07f73946f0b7054cb7887b127790d))
- **player:** `AspectRatioElement`- ensure aspect ratio is held by `<video>` element ([8d2be90](https://github.com/vidstack/player/commit/8d2be902cfb02e9917cb776134bdd222fe464c5e))
- **player:** `isHlsStream` should test all sources ([f17af0c](https://github.com/vidstack/player/commit/f17af0c474969f0ef74f638a7bd407065fe5e385))
- **player:** `muted` state should be `true` when volume equals 0 ([8f59522](https://github.com/vidstack/player/commit/8f5952252d9a28224adf1bf90a7d3065d2c5e3f6))
- **player:** add `NaN` checks for media duration ([d7d8c27](https://github.com/vidstack/player/commit/d7d8c275d3e4aeba941914e28e94357aefdaed62))
- **player:** automatically destroy media provider if no re-connect ([860ae3f](https://github.com/vidstack/player/commit/860ae3f9df7a309633627bd8bb3b80d616bba8e8))
- **player:** autoplay not working with eager loading strategy ([0c20875](https://github.com/vidstack/player/commit/0c2087552ac80d7a01a95ba587b2b89e122b1e17))
- **player:** calling `load()` on src change breaking hls ([ee01263](https://github.com/vidstack/player/commit/ee01263c762be6c1dc8ab3c32de7c1d2d3f297b2))
- **player:** catch late fullscreen support check for iOS safari ([1ee42cd](https://github.com/vidstack/player/commit/1ee42cdf9f988ef1f358353c60ece704c354d08a))
- **player:** change `ScreenOrientation` from `enum` to string literal type ([9159e55](https://github.com/vidstack/player/commit/9159e553cbfb64f08fee3eefdf9a19dd99401757))
- **player:** completely rewire fullscreen logic ([55532fc](https://github.com/vidstack/player/commit/55532fc96dd18210cb9e06f54317a53481694e32))
- **player:** connect orphan context consumers ([434c849](https://github.com/vidstack/player/commit/434c849edae88ae77167687b1841428c37c0fb96))
- **player:** current hls media src is overwritten ([565ac85](https://github.com/vidstack/player/commit/565ac852dd919753e22e50cc7399be7b93fca831))
- **player:** debounce messes up user idle tracking ([3243918](https://github.com/vidstack/player/commit/3243918b6c2b33cda7987cbfa22277354f69121b))
- **player:** detect `loop` on media element and update store ([33b992a](https://github.com/vidstack/player/commit/33b992a54a5e72d1af1a2aac87a209acae8f2141))
- **player:** do not overwrite video poster if not set ([81a5bf0](https://github.com/vidstack/player/commit/81a5bf042d675d8c8b5c82da07ffa39411b8fd26))
- **player:** drop `<vds-media-ui>` element ([d380f64](https://github.com/vidstack/player/commit/d380f640c18a1a192b8503b0c5831d8dfbfde683))
- **player:** enter page actions on `<vds-media-visibility>` not applied ([43267ee](https://github.com/vidstack/player/commit/43267eeca9fe44cd0e8dde5f7464f2b912b4b08c))
- **player:** events before dom connection not reaching media controller ([8f1f39a](https://github.com/vidstack/player/commit/8f1f39ad9cc4300edfb7885e8e916519348e6a08))
- **player:** export trigger event utility functions ([7e91d17](https://github.com/vidstack/player/commit/7e91d17e5566ebef58e885120b00fbf9a7fac5c1))
- **player:** forward fullscreen events on media provider ([134c578](https://github.com/vidstack/player/commit/134c5782ae738920346db7914dd69faef1e315cd)), closes [#658](https://github.com/vidstack/player/issues/658)
- **player:** handle muted/volume edge cases ([479bf83](https://github.com/vidstack/player/commit/479bf839e4b9cf63ab26715b841e20c074589d02))
- **player:** ignore gestures while user is idle ([c308165](https://github.com/vidstack/player/commit/c308165c128c69a3bc48e36360751806652d6226))
- **player:** imports in node context fail ([982cc2c](https://github.com/vidstack/player/commit/982cc2c7d0a6777bcb71901f1161cd01ad71f964))
- **player:** include `cdn` dir in package files ([488ca26](https://github.com/vidstack/player/commit/488ca26e07a4022fc885e5341773631f2d9296aa))
- **player:** loop property not taking effect ([e55c14f](https://github.com/vidstack/player/commit/e55c14ffe4c5b34ddae85da608a1be80ae3c4eab))
- **player:** mark side-effectful chunks ([750d311](https://github.com/vidstack/player/commit/750d31103286f43e649fd33696bc6a1f0a7c28a0))
- **player:** mark side-effectful files for bundlers ([436cd5a](https://github.com/vidstack/player/commit/436cd5a7e62ee832d54741d08be0ab37e39278d7))
- **player:** media visibility not observing correct target ([2abf0a2](https://github.com/vidstack/player/commit/2abf0a24d7b131d724fa90a483293dd30ba61370)), closes [#633](https://github.com/vidstack/player/issues/633)
- **player:** migrate from `data-` attributes to regular attributes ([b0b7caa](https://github.com/vidstack/player/commit/b0b7caaa4149a25b4a1259f9cdac6705ea923638))
- **player:** new package builds with improved ts support ([03b6862](https://github.com/vidstack/player/commit/03b686274dd665f40451ed925a3dffc8fa05d304))
- **player:** observe `playsline` changes on media element to update store ([63ca0bb](https://github.com/vidstack/player/commit/63ca0bb47fb361aff0028369599ac34c1cfe9b39))
- **player:** package types are leaking ([ab0d9c9](https://github.com/vidstack/player/commit/ab0d9c98cd893a7e159eeae040c235289023cc56)), closes [#634](https://github.com/vidstack/player/issues/634)
- **player:** prefer `pointerup` event for toggle buttons ([9c9e517](https://github.com/vidstack/player/commit/9c9e5179302f19734b56ce1ec26c77458da1bf99)), closes [#661](https://github.com/vidstack/player/issues/661)
- **player:** prefer browsers source selection algorithm ([87f6574](https://github.com/vidstack/player/commit/87f65740524fffc3cb2cce6fbec20d6e1a36c1c6))
- **player:** preserve media state across dom disconnects ([62325eb](https://github.com/vidstack/player/commit/62325ebb207e2b9320467dd5271180709c291462))
- **player:** prop reflection causing ssr mismatch with react ([fdb59f1](https://github.com/vidstack/player/commit/fdb59f193650f1ae5a2fbf5f1c0421c0f8c97b0c))
- **player:** remove `<vds-*-player>` elements ([0103cbd](https://github.com/vidstack/player/commit/0103cbd71a2da339b818f789e1b70d424671e4c0))
- **player:** remove `elements.json` from distribution ([bfd7add](https://github.com/vidstack/player/commit/bfd7add2c1748f0cf73e89b58b08a2b499d7ebd4))
- **player:** remove `slider` prefix from slider css variables ([6856ad6](https://github.com/vidstack/player/commit/6856ad60f3cdc50037e7022754b8f3f381f4c4cb))
- **player:** remove superflous `loading` property on `<vds-poster>` ([ef5e291](https://github.com/vidstack/player/commit/ef5e291ed1c0532107d8de4648fb7347d8e0ee0a))
- **player:** rename `fullscreen-target` -> `target` on `<vds-fullscreen-button>` ([169d0ad](https://github.com/vidstack/player/commit/169d0adf7805b5f360fb6d93103cda7fc3f56e79))
- **player:** rename `media-idle` to `user-idle` ([7e12d34](https://github.com/vidstack/player/commit/7e12d342e4c35bf491f0f143a8dbf40f5e7cb82d))
- **player:** rename media sync `sharedVolume` prop to `syncVolume` ([94209c8](https://github.com/vidstack/player/commit/94209c82322cdc731fcaacf2d1302948f5da25df))
- **player:** slotted styles were broken by formatter ([30f90c4](https://github.com/vidstack/player/commit/30f90c46c5c5fb57f50b4400ebf640e290e62e46))
- **player:** support bi-directional element discovery ([d72467f](https://github.com/vidstack/player/commit/d72467f88f2586f8d57f0dd90d2bd30ea169fe5a))
- **player:** toggle button cursor should default to `pointer` ([10fa41d](https://github.com/vidstack/player/commit/10fa41d5a343835332e55e005ffd6e96f3ae4896))
- **player:** unexpected fill/pointer rate on `SliderElement` when `min` > 0 ([#630](https://github.com/vidstack/player/issues/630)) ([6f12753](https://github.com/vidstack/player/commit/6f12753b9e86f33eea4a4a8311a046505c6eefa2))
- **player:** update `played` media store ([0c9f7ad](https://github.com/vidstack/player/commit/0c9f7ad0b4081ffc43c6e0fd644b7ca0f729f720))
- prefer original `ended` event over validated ([1bc7594](https://github.com/vidstack/player/commit/1bc7594c04e92b817cfa24df2e4332147621dfd6))
- prefix media event types with `Media` ([77e02c1](https://github.com/vidstack/player/commit/77e02c1179de9b40d61bf1091bf5eefac6b3f657))
- preserve modules in `dist-*` output ([5aa4515](https://github.com/vidstack/player/commit/5aa45157f0874d4c7a0c710298d7fe490cd81cb2))
- prevent `vds-play` and `vds-playing` firing when loop resets ([dab8952](https://github.com/vidstack/player/commit/dab8952a92474f820cb909ff55e762592fa57599))
- prevent media idling while slider is active ([044a649](https://github.com/vidstack/player/commit/044a649a39f856c880f832031180a10137765422))
- process media requests earlier if possible ([5766a86](https://github.com/vidstack/player/commit/5766a861e1da41ab19d3a129ebd8a11e3838d732))
- **provider/file:** replay not working on ios safari ([b9fb52b](https://github.com/vidstack/player/commit/b9fb52bb44b3ba6648b8c5041a19f1885721d020))
- **provider/file:** request re-render when src property changes ([09a34fb](https://github.com/vidstack/player/commit/09a34fb6994a3cfbefd908a1c5ee657dd69283bd))
- **provider/html5:** media events are being dispatched twice ([3300389](https://github.com/vidstack/player/commit/3300389ba566caa517870fd4c374c1a24712d7e8))
- **providers/file:** improve waiting detection ([337e70b](https://github.com/vidstack/player/commit/337e70b3f8f4f3e07c84ae6a5ce44999f1431a99))
- **providers/file:** waiting should not remain `true` when paused ([79c5efa](https://github.com/vidstack/player/commit/79c5efafd632dd34bf0204268c04f1906fc51eea))
- **providers/hls:** `hlsConfig` object should be partial config ([34696a7](https://github.com/vidstack/player/commit/34696a7011b50486a2531ac88580fe008a15ba00))
- **providers/hls:** do not load `hls.js` if environment not supported ([7336b10](https://github.com/vidstack/player/commit/7336b10310014fae2665daad64b1f3700eb825b3))
- **providers/hls:** hls config type should be partial ([973f8a3](https://github.com/vidstack/player/commit/973f8a37770194c4a4f72d30dcbd020820c27ec5))
- **providers/hls:** incorrectly detecting native hls support ([2ebad37](https://github.com/vidstack/player/commit/2ebad3757183418f8ab6b486e795baf63d13e00a))
- **providers/hls:** native hls streams not attaching correctly ([8772f57](https://github.com/vidstack/player/commit/8772f573ef9abb90e85b10346767e73ac3c464c2))
- **providers/hls:** only attach hls engine if current media is hls based ([88f6c06](https://github.com/vidstack/player/commit/88f6c0620678e0272a5f24f7dee6deaa1ec9026a))
- **providers/hls:** remove repetitive log for setting video `src` ([bdf0149](https://github.com/vidstack/player/commit/bdf0149900e093462f9f0492d85002032846ecdb))
- **providers/hls:** use hls.js when possible to enforce consistency and avoid issues on android chrome ([640b7b6](https://github.com/vidstack/player/commit/640b7b62694a944269e2e44629257a8c1308441a))
- **providers/html5:** `load` must be called on iOS when `src` changes ([f3bcb4d](https://github.com/vidstack/player/commit/f3bcb4d656253f2a5ab401794c8ca0b0feb64791))
- **providers/html5:** ensure only one set of time updates are running at any given time ([85944cd](https://github.com/vidstack/player/commit/85944cda0e135961594d9284e92a872af12a326a))
- **providers/html5:** fire final time update when media ends ([21a49cc](https://github.com/vidstack/player/commit/21a49cc5acc04f8f6391ac6fdfe173c5b25e7f9b))
- **providers/html5:** resolve `currentTime` having greater precision than `duration` ([5dbde8f](https://github.com/vidstack/player/commit/5dbde8fc8da9ab34497495882a0e33c9b1bf8762))
- **providers/video:** fullscreen toggle not working on ios safari ([0ad9970](https://github.com/vidstack/player/commit/0ad9970f8428a9ac4f56c7aae62b26aca09c6d77))
- **providers/video:** improve fullscreen support check on iOS ([99d7db0](https://github.com/vidstack/player/commit/99d7db08ce2d200885e8396b17545834236263d2))
- **providers/video:** root element not adjusting to video natural size ([e4566bb](https://github.com/vidstack/player/commit/e4566bb36e32eb357d8446765f877689e83f821e))
- **providers/video:** video max height not filling window ([c0a74c4](https://github.com/vidstack/player/commit/c0a74c493854094ecdcea10d996e3530f2aa3d13))
- **providers:** attribute names for media/video should match spec ([a088ddd](https://github.com/vidstack/player/commit/a088ddd9324335f6d2338bc6f125ac92e283f73c))
- **react:** better event types inference + component docs ([08d24b9](https://github.com/vidstack/player/commit/08d24b99915525c6da08cd48dc96dfff1e74abaa))
- reduce bundle size by not re-exporting all utils ([a0169d9](https://github.com/vidstack/player/commit/a0169d9aef928257f3f298dbe61550703fb418c5))
- reduce bundle size by not re-exporting unnecessary styles ([f26163c](https://github.com/vidstack/player/commit/f26163c8c5411d9f2a8fd1b3478542407a1c4422))
- reduce media idle delay default down to `2000ms` ([f6a815c](https://github.com/vidstack/player/commit/f6a815c8941d283b8c72624902a8a1dde752dc27))
- refactor `<vds-media-text />` into `<vds-time />` ([71dc76e](https://github.com/vidstack/player/commit/71dc76e988dc09e16c0d6b89c154fd3e2bc163e2)), closes [#608](https://github.com/vidstack/player/issues/608) [#610](https://github.com/vidstack/player/issues/610)
- refactor autoplay logic and remove unintended side-effects ([d7065f1](https://github.com/vidstack/player/commit/d7065f1dcfa8b0c62308d4045cd4decef340cc64))
- refactor controller naming `target` -> `ref` ([b118aba](https://github.com/vidstack/player/commit/b118aba70dc3ec75146d018b7af9c3df9376112d))
- refactor events away from classes to support iOS 12/13 ([9a37ab7](https://github.com/vidstack/player/commit/9a37ab794cafcd64c2dcce8ecdf4de982ed78c74))
- refactor fullscreen and screen orientation api ([a9c977a](https://github.com/vidstack/player/commit/a9c977ae248d5bae1b70fc952e96368c48a5f4f4))
- reflect additional `Html5MediaElement` attributes ([1bd08bc](https://github.com/vidstack/player/commit/1bd08bc1296cb407645d35d5d7289c51f51e6b73))
- remove `.ts` extension when importing custom elements into react wrapper ([18e6eb0](https://github.com/vidstack/player/commit/18e6eb0a2aa14d27f1fa06a58e39859e92def0fd))
- remove `<vds-scrim>` ([3dfbe2c](https://github.com/vidstack/player/commit/3dfbe2cef0ab3941d3d5af05d4001ece97198852)), closes [#582](https://github.com/vidstack/player/issues/582)
- remove blue tap highlight on chrome mobile ([676f809](https://github.com/vidstack/player/commit/676f80981440bf2c6c306e26d86fdd02f7e96f88))
- remove duplicate imports in `define/dangerously-all` ([73e5e7a](https://github.com/vidstack/player/commit/73e5e7a22e071faed94e0c55a22dbbe3448cde66))
- remove global `define` (not recommended) ([866925c](https://github.com/vidstack/player/commit/866925cd8336f496d5d6682043e97622cad870fc))
- remove invalid export statements from `ui/index.ts` ([11a24e4](https://github.com/vidstack/player/commit/11a24e46550fac6af123e65535753cbecee7ae4e))
- remove redundant `MediaElement` ([d269297](https://github.com/vidstack/player/commit/d269297e1f8e7fd5686d5f307ac5b6ea08f0fd8b))
- rename `canRequestFullscreen` -> `canFullscreen` ([253f472](https://github.com/vidstack/player/commit/253f472d9728ad90a66c6fce0b2c0f44920ea825))
- rename `createHostedRequestQueue` -> `hostRequestQueue` ([f479cf6](https://github.com/vidstack/player/commit/f479cf68b4b1df6d5293eaad7df1a449bad81a8f))
- rename `dispatchDiscoveryEvents` -> `discover` ([2d57950](https://github.com/vidstack/player/commit/2d57950e5025da6fb0dfd11d58b3b3f824274b04))
- rename `elements.html-data.json` -> `vscode.html-data.json` ([8fac8da](https://github.com/vidstack/player/commit/8fac8da70882ee2fa5aa92637bc74b322fa501a7))
- rename `hostedEventListener` -> `eventListener` ([23456e5](https://github.com/vidstack/player/commit/23456e548934be93469026eed15df77bef68900a))
- rename `hostedMediaEventListener` -> `mediaEventListener` ([a98d51f](https://github.com/vidstack/player/commit/a98d51f29515baecd3ebdce5a8e68279ff921201))
- rename `hostedMediaStoreSubscription` -> `mediaStoreSubscription` ([a2e614c](https://github.com/vidstack/player/commit/a2e614cf58882252678647b15272b9d19ae3d317))
- rename `hostedStoreRecordSubscription` -> `storeRecordSubscription` ([d142592](https://github.com/vidstack/player/commit/d14259250593c19e5e2fe4a18880569fd7790932))
- rename `hostedStoreSubscription` -> `storeSubscription` ([01bec4f](https://github.com/vidstack/player/commit/01bec4f23b33ee3a50a624ea3965b951b30edb13))
- rename `intersection-enter-delay` to `viewport-enter-delay` ([2c9a9e8](https://github.com/vidstack/player/commit/2c9a9e8cc03b09a9d689898afc9d422b604c2574))
- rename `isNonNativeHlsStreamingPossible` -> `isHlsjsSupported` ([f547f05](https://github.com/vidstack/player/commit/f547f05c6a1ed08199f36de7738bece271a7d0c4))
- rename `loading-strategy` to `loading` - matching native `<img />` ([adc84f3](https://github.com/vidstack/player/commit/adc84f31aad673be9a20276981ff9657fac4dcdc))
- rename `originalEvent` to `triggerEvent` ([4d08a37](https://github.com/vidstack/player/commit/4d08a37d929444263ffb452f14137c521c6e005a))
- rename `provider.mediaStore` -> `provider.store` ([ac6cf7f](https://github.com/vidstack/player/commit/ac6cf7fc105c07659df4f895bc84c62ca066ee0b))
- rename `shared-playback` to `single-playback` on `<vds-media-sync>` ([25b887d](https://github.com/vidstack/player/commit/25b887d07b4994eed3b1c7f9af3c60282167b69f))
- rename `slider.sliderStore` -> `slider.store` ([c0563e8](https://github.com/vidstack/player/commit/c0563e86a35ce2eb46bc2926acd20b5dc596922c))
- rename globals file from `global.d.ts` to `globals.d.ts` ([04b0813](https://github.com/vidstack/player/commit/04b08134752e36510480abd2234719def366cc9a))
- replace `node_modules` in `dist-prod` to avoid consumer bundling issues ([ae8c670](https://github.com/vidstack/player/commit/ae8c670635cddb79d3d2cf6d5db12a101499daee))
- request update after any native media event is handled ([86082e1](https://github.com/vidstack/player/commit/86082e136d38d45b50265118fb150ac9d362385d))
- request update if autoplay has failed ([70bba58](https://github.com/vidstack/player/commit/70bba58cd3a145aa71ca48a678635555c5686159))
- requests are executed twice on media controller handler ([976cbfa](https://github.com/vidstack/player/commit/976cbfa2e243e9f83e952e4af0b62c10a6fb7dee))
- reset `autoplayError` when `src` changes ([0801f81](https://github.com/vidstack/player/commit/0801f813ee9b17a48884ebe1cbdfc34fc00ff497))
- resolve a few type issues when consuming package ([68cc02d](https://github.com/vidstack/player/commit/68cc02d93b0dfb46f9dbd498247e523c348f4156))
- resolve additional type issues for consumers ([f650c7a](https://github.com/vidstack/player/commit/f650c7ab21274ceffd62444cb2d8b4a06bae8d0e))
- screen orientation events should bubble ([feb978f](https://github.com/vidstack/player/commit/feb978f798208240e62041ba35965a856a76e47b))
- scrubber preview video should playinline on ios ([cb836d1](https://github.com/vidstack/player/commit/cb836d17923cc226670f682291e5fb7ed208bacc))
- seeked should not be playing trigger when not playing ([16cd99d](https://github.com/vidstack/player/commit/16cd99d3cf611646e2c54f716e5a751831a5b879))
- set better default styles for `<vds-slider-video>` ([b513aca](https://github.com/vidstack/player/commit/b513aca9461201c5b7aee3c16590a0ddf58fdbab))
- set default log level to `silent` ([70fd202](https://github.com/vidstack/player/commit/70fd2027916be3d822fdaa27315dcb34b53e4fbb))
- set es target version to `es2017` for compatability with modern browers ([c6e3695](https://github.com/vidstack/player/commit/c6e3695d80702a9c66e36e04ab90f407bfb2c8ae))
- set max height on video element ([632cb86](https://github.com/vidstack/player/commit/632cb8696661237cb2d456e20b8a2a68d679ae5c))
- set slightly better defaults for audio/video ([572c394](https://github.com/vidstack/player/commit/572c3942825fcd2b71200d90cd42de05ffbd7ce9))
- simplify styling `vds-media-ui` when media is ready ([9f42cf7](https://github.com/vidstack/player/commit/9f42cf7dc8d03a9ebf71dd6bf9d022926e5e749a))
- simplify styling of toggle buttons ([68d623e](https://github.com/vidstack/player/commit/68d623ead09a25794525b9881427e93b4bf4d77d))
- simplify styling scrubber element ([bec5094](https://github.com/vidstack/player/commit/bec5094c15570c5a065a031821aa729bc51a92b1))
- simplify styling seekable progress bar ([3697a4a](https://github.com/vidstack/player/commit/3697a4a164aba3d8a753efa99294fe053bb3b081))
- simplify styling slider elements ([0784f97](https://github.com/vidstack/player/commit/0784f9756811fc634eede3fb085b25b493a4c071))
- simplify ui container by merging `ControlsElement` into `MediaUiElement` ([7fad866](https://github.com/vidstack/player/commit/7fad866fa734d299dd0b4bda8c8d5bbda36cd533))
- **site:** controls styling example conflicting with others ([12cfcdd](https://github.com/vidstack/player/commit/12cfcdd836bb6ed0e3e9ec29f15ed579406df43b))
- **site:** include missing cdn quickstart pages in prod ([7ce55cd](https://github.com/vidstack/player/commit/7ce55cdedd20c3cf37c894ffe25749736ed3b535))
- **site:** incorrect jsx event names ([32a9ba2](https://github.com/vidstack/player/commit/32a9ba2304295015dda3d332444527983f13e4d6))
- **site:** missing quickstart provider html files in build ([adcd811](https://github.com/vidstack/player/commit/adcd811a1cc235a699661f0bf87fed7b355f7945))
- **site:** next/prev buttons breaking on small mobile ([c3e880f](https://github.com/vidstack/player/commit/c3e880f1dab343bf18daed1c6084e53da7d4669c))
- **site:** only scroll contain on larger screens ([e863567](https://github.com/vidstack/player/commit/e863567e9d886bf1bafdd01137fcf52bbe2053e3))
- **site:** trailing slashes always on ([e8c7093](https://github.com/vidstack/player/commit/e8c709345efbc6b481c168166aecfcbd59fca755))
- **site:** turn off clean urls ([1ba67c1](https://github.com/vidstack/player/commit/1ba67c1b0235d72ba0caff1136ed469fc6d717bc))
- **site:** update docsearch facet filters when changed ([6e64c9a](https://github.com/vidstack/player/commit/6e64c9a98e349acb97f7a6fa468efc05e4ffd875))
- stop logging noisy time update events for now ([bbb92c8](https://github.com/vidstack/player/commit/bbb92c8d341239dd16f5fd88de69bdb03b39f1a8))
- temp remove package `"type": "module"` ([45f6689](https://github.com/vidstack/player/commit/45f6689cbec346d02f4df09915185e2be2df379f))
- types not exporting global definitions correctly ([953bd60](https://github.com/vidstack/player/commit/953bd60b1b0fb3de9452e075a6d36e7860bf2e8a))
- **ui/buffering-indicator:** add back removed `globals.ts` file ([710faf5](https://github.com/vidstack/player/commit/710faf5fb2668b931c80bcb21fd81ee764063174))
- **ui/controls/scrubber:** `--vds-scrubber-preview-time` not updating correctly ([a061cc3](https://github.com/vidstack/player/commit/a061cc38bf54aa8b024db0c8f6aa4d3a708210c2))
- **ui/controls/scrubber:** attach original events to user seeking/seeked events ([4369321](https://github.com/vidstack/player/commit/4369321e9b2650a36b4d21ef905704cb0bdfcf5d))
- **ui/controls/scrubber:** dont hide preview when pointer leaves but still dragging ([121b32b](https://github.com/vidstack/player/commit/121b32b8bdb7a698191eb3cc442c6d6a14b07bac))
- **ui/controls/scrubber:** media should not play when seeking without dragging ([2c9be8c](https://github.com/vidstack/player/commit/2c9be8c354ad70dcf39631030a668082c7c41389))
- **ui/controls/scrubber:** not functioning properly at all ([a17ef25](https://github.com/vidstack/player/commit/a17ef25241817478bdde0f32f95c0e8f2ddeaf9f))
- **ui/controls/scrubber:** prevent preview flickering on tap ([76f08ff](https://github.com/vidstack/player/commit/76f08ff556622dc9f5ec74ccfaed0a52c37282bc))
- **ui/controls/scrubber:** preview position not updating when pointer leaves track ([facf378](https://github.com/vidstack/player/commit/facf378c3d10e4a83341d0da924db772b9149ba5))
- **ui/controls/scrubber:** preview showing context incorrectly toggled ([6f97f43](https://github.com/vidstack/player/commit/6f97f4339feb4c3fc51f7d3eb3d8e5cef1851cca))
- **ui/controls/scrubber:** remove scrubbing to end detection for now (too buggy) ([6826e50](https://github.com/vidstack/player/commit/6826e50ddd0b9579fce941486d8ce4466e0aa115))
- **ui/controls/scrubber:** scrubber time update event class missing `event` postfix ([be06fd7](https://github.com/vidstack/player/commit/be06fd7ae5388cefbe2c0d253ca39601644cb7b2))
- **ui/controls/scrubber:** set better default slider steps ([3b7ded4](https://github.com/vidstack/player/commit/3b7ded4bed9da378532ddcbda713965c9e0993ea))
- **ui/controls/scrubber:** set more sensible defaults for steps ([e837b38](https://github.com/vidstack/player/commit/e837b38228363ae7fbc863f5ee2519f56a77a4e9))
- **ui/controls/scrubber:** smooth out dragging scrubber ([46898ec](https://github.com/vidstack/player/commit/46898ec50a2a652e7ad9ef2987fffadab8dcdf3b))
- **ui/controls/scrubber:** smooth out scrubbing ([1467e26](https://github.com/vidstack/player/commit/1467e26966d3b98b223cd76a9c321db827424eb5))
- **ui/controls/scrubber:** thumb hopping when seeking and current time is not immediately updated ([5029ffc](https://github.com/vidstack/player/commit/5029ffc361b660079eb879e776789fb9065e51f3))
- **ui/controls/scrubber:** time is not accurate due to rounding when scrubber has seeked ([f3afb0c](https://github.com/vidstack/player/commit/f3afb0ca8484ef314dca7861e12cd307798d1fa8))
- **ui/controls/slider:** contain slider thumb on edges ([e4ebf29](https://github.com/vidstack/player/commit/e4ebf290f925e49a04bd48491060ae57a447db10))
- **ui/controls/slider:** improve keyboard support ([7fa86ba](https://github.com/vidstack/player/commit/7fa86ba64e47718626c87d8a956ae810b026ce65))
- **ui/controls/slider:** prevent text highlighting when dragging thumb ([aba6cf3](https://github.com/vidstack/player/commit/aba6cf35809bd54d0061533f1ef5239905a40d56))
- **ui/controls/toggle:** remove on/off slot name properties (internal details) ([f7261ea](https://github.com/vidstack/player/commit/f7261ea77b6da7282977972dbdb339113618c39b))
- **ui/fullscreen-button:** add logic for hiding button when not supported ([4c59d48](https://github.com/vidstack/player/commit/4c59d4818464d378ef5c8fe488c5660bd4a379fd))
- **ui/play-button:** apply `media-ended` attribute ([1778126](https://github.com/vidstack/player/commit/1778126c2296b64109279332f5e079828c13889f))
- **ui/scrubber:** `pause-while-dragging` attr not forwarded ([b6061bf](https://github.com/vidstack/player/commit/b6061bf77468792cb9c8fc4ecba799659e6719b6))
- **ui/scrubber:** dont hide preview on drag end if still hovering ([91fbe14](https://github.com/vidstack/player/commit/91fbe145b718418de8d040bf1692c7bba20ee48a))
- **ui/scrubber:** pointer, slider and preview events not heard ([722afd2](https://github.com/vidstack/player/commit/722afd2a0f55262830f2eae62e765fdfa4c31dcf))
- **ui/scrubber:** typo in attribute `value-tex` -> `value-text` ([ce117e1](https://github.com/vidstack/player/commit/ce117e1e41b0dba26b1d9d880f30e7aba4e05526))
- **ui/slider:** dragging on mobile not working - drags page ([3fc1258](https://github.com/vidstack/player/commit/3fc12584bae96a05daa6ee56727181bb598c04b4))
- **ui/time-slider:** set better default steps that handles short media ([efc836f](https://github.com/vidstack/player/commit/efc836f6da21a5d4ece383c55ecf33c9046af0c9))
- **ui/ui:** improve naming of audio/video part names on ui component ([84ff454](https://github.com/vidstack/player/commit/84ff454cde158fadca117b8039c75a3922f4bb2f)), closes [#133](https://github.com/vidstack/player/issues/133)
- **ui/ui:** remove pointer-events none ([a682b1b](https://github.com/vidstack/player/commit/a682b1b7aa34e5d06e1e650aefea8fde06b73e97)), closes [#133](https://github.com/vidstack/player/issues/133)
- **ui/ui:** set pointer-events to none on host ([0c4c65a](https://github.com/vidstack/player/commit/0c4c65a42f57ef9a5b266d74dea6d4688c1b7ba9))
- **ui:** custom poster should prevent native poster rendering ([4fff98b](https://github.com/vidstack/player/commit/4fff98bf65ba1b1900538471e1f5d341b7b3698d))
- **ui:** host elements should apply default `hidden` styles ([779ee53](https://github.com/vidstack/player/commit/779ee53f42bd35a52a444b0c7bf8d506bf4ca458))
- **ui:** keyboard not updating time slider ([8770ab3](https://github.com/vidstack/player/commit/8770ab39bbbf3f2a06bc452ff321b4fc202c9bd1))
- **ui:** refactor time slider to use value instead of % ([b4d5aa1](https://github.com/vidstack/player/commit/b4d5aa1028d19946c29ef012e420351500524fd5))
- **ui:** refactor volume slider internals ([c97b127](https://github.com/vidstack/player/commit/c97b1275d3d9808ce12223a06f6f8f560bc71eee))
- **ui:** set `target` of slider events to `SliderElement` ([06f8b97](https://github.com/vidstack/player/commit/06f8b976ea85c57c25f2afb6fc544826e4be84e1))
- **ui:** set interactable elements to default min width/height 48px ([bd19f48](https://github.com/vidstack/player/commit/bd19f4848afbedef31561b44b235917a3503ea1e))
- update `waiting` to false once media has seeked ([998b2f5](https://github.com/vidstack/player/commit/998b2f5183f041cdc162d11e527f70683eb0ba37))
- update media `ended` state when seeking back playback ended ([7c58497](https://github.com/vidstack/player/commit/7c58497f28841e6fb866cea1e06756edd100fb42))
- update warn/error emojis so they work in console ([ffad9d9](https://github.com/vidstack/player/commit/ffad9d9f3e278aeba2d0681f84877845109e0c22))
- use better default styles for foundational elements ([7f258a5](https://github.com/vidstack/player/commit/7f258a52c64b6bcd6d8fa3de448b7ab4a8e6feb3))
- **utils/dom:** bridged elements should remove attr if null ([d9adbdf](https://github.com/vidstack/player/commit/d9adbdff582313e5afb77497750afb0882663238))
- **utils/object:** prefer parent definitions over proxy ([2607cb9](https://github.com/vidstack/player/commit/2607cb928a0a523037090c64fd52b521b776795b))
- workaround type errors due to typescript not supporting npm `exports` field yet ([d9de7e9](https://github.com/vidstack/player/commit/d9de7e91cd4894d67e9978ba604cc8b85081397b))

### Code Refactoring

- canPlayType should return native result type ([97d9e89](https://github.com/vidstack/player/commit/97d9e8910beb0051e2dfed7afdaf5df7fee7946c)), closes [#138](https://github.com/vidstack/player/issues/138)
- hyphenate all event names for better readability ([357d953](https://github.com/vidstack/player/commit/357d953a1f90955c1d975efa709bcb2f10a8d13c))
- remove input device api ([#107](https://github.com/vidstack/player/issues/107)) ([26907d2](https://github.com/vidstack/player/commit/26907d246f42f4d681678a867126eefb9ef460fa))
- reserve `build` method prefix for builder/factory methods ([464c18f](https://github.com/vidstack/player/commit/464c18fef4e02309cc2f9ffc5b21af59e275df23))
- vds event init should be more spec-ish ([833753d](https://github.com/vidstack/player/commit/833753d7842bd307413f775710224c355d3342d1))

### Features

- `_` safe protected/private class fields to improve minification ([fe6225f](https://github.com/vidstack/player/commit/fe6225f92348360152d5c84888dd6294d7400b04))
- `@vidstack/elements` -> `@vidstack/player` ([da6b197](https://github.com/vidstack/player/commit/da6b19757f0d485db193ebec3c1f02b01e459d0e))
- `hls.js` 1.0 support 🎉 ([f3ac886](https://github.com/vidstack/player/commit/f3ac8868db4883b7c5c6f240a0ebb7d29c2772c6)), closes [#591](https://github.com/vidstack/player/issues/591)
- `MediaIdleController` ([090ab2a](https://github.com/vidstack/player/commit/090ab2a6e7b04b9b8b65de9c46396acb1cbb0272))
- add `debug` option to context provider options ([27d76a5](https://github.com/vidstack/player/commit/27d76a53f5dea3569299f77fc74cef59dca926a5))
- add `logLevel` property to media provider element ([6c41af8](https://github.com/vidstack/player/commit/6c41af846ce5bdf830e81c935bbc0d14fc7241e2))
- add `media-seeking` attr to `vds-media-ui` ([60dea3c](https://github.com/vidstack/player/commit/60dea3c29e9a1759c879b276ae353fbf4c450fdb))
- add `media-seeking` attr to `vds-play-button` ([3c24d8a](https://github.com/vidstack/player/commit/3c24d8a333dfc32f591cb7b9464d00942f4bf57b))
- add `requestEvent` to `vds-replay` event ([bb2fab8](https://github.com/vidstack/player/commit/bb2fab8c661ebbb4a3344471bcb8fa5ab8daf8fb))
- add `triggerEvent` to `vds-replay` event ([f24b283](https://github.com/vidstack/player/commit/f24b2836f6d5cc114f320dfee1e6439ab4f8e7eb))
- add `vds-media-sync` to all definitions ([095afa2](https://github.com/vidstack/player/commit/095afa227470d990e7b7f1d5f9f5c6ed9db2abef))
- add `vds-media-visibility` to all definitions ([5d2e009](https://github.com/vidstack/player/commit/5d2e00954291430ebf433b7303ce7bb07f271760))
- add detailed levelled logging in dev ([5afa940](https://github.com/vidstack/player/commit/5afa940dbe1aa5588f73cce2eba147a23b72e668))
- add intersection/page enter action delays ([a9ba6c6](https://github.com/vidstack/player/commit/a9ba6c69c24e6b8fdf6ed571fc84e605894f6d3e))
- add live context and event ([#266](https://github.com/vidstack/player/issues/266)) ([5a00eba](https://github.com/vidstack/player/commit/5a00eba90a472af76bdb91cbd6c31f108c4cefc8))
- add media styling attrs to `ControlsElement` ([baa2dc4](https://github.com/vidstack/player/commit/baa2dc4b59ddd21e6bc0c6b9997b794cbc461681))
- add new `bundle/` to quickly load/test elements from CDN ([b8124ef](https://github.com/vidstack/player/commit/b8124ef3ec3cc78c3c3469c8c12ba1797e09330a))
- allow `hls.js` to be dynamically imported ([8fc3df1](https://github.com/vidstack/player/commit/8fc3df1b2691ff4c6bb96363edfd23c5629ae169))
- allow `RequestKey` to be a symbol in `RequestQueue` ([6aed5a6](https://github.com/vidstack/player/commit/6aed5a69f68839747a2d408216a656f584bcfcbf))
- allow media request events to be listened on `hostedMediaEventListener` ([c9430d0](https://github.com/vidstack/player/commit/c9430d0c4984d1806b98ec6cc802087533374336))
- attach media request events to `triggerEvent` chain ([dc8b5d8](https://github.com/vidstack/player/commit/dc8b5d88ac8bb849eb364cc620904e6d27f37391))
- autoplay fail detection ([2f017b2](https://github.com/vidstack/player/commit/2f017b21965c86dc97af3f7c278c6d25467e0358))
- basic media provider ([#102](https://github.com/vidstack/player/issues/102)) ([22bc29c](https://github.com/vidstack/player/commit/22bc29cab6cf3eaa195e11a5c1eb3c0c36144f2d)), closes [#5](https://github.com/vidstack/player/issues/5)
- basic player component ([#97](https://github.com/vidstack/player/issues/97)) ([0fca243](https://github.com/vidstack/player/commit/0fca24369c568b21ddee523adbe8e3cc964b5206)), closes [#8](https://github.com/vidstack/player/issues/8)
- boot strategy ([#101](https://github.com/vidstack/player/issues/101)) ([b363f89](https://github.com/vidstack/player/commit/b363f89f5eac1deeaec616c33d90c22cc769b4f5)), closes [#4](https://github.com/vidstack/player/issues/4)
- build and distribute typescript declaration files ([04c976f](https://github.com/vidstack/player/commit/04c976f0d83702027be9a8918b304033dfa71050))
- **bundle:** include `utils/*` in main export ([0be3747](https://github.com/vidstack/player/commit/0be3747e73af123453ea93ff3802bc5ace5a4661))
- comply with html media element spec ([#160](https://github.com/vidstack/player/issues/160)) ([5f88b60](https://github.com/vidstack/player/commit/5f88b60a04fe81de1101f93eefcc8d25260799af))
- controls support ([#301](https://github.com/vidstack/player/issues/301)) ([302b382](https://github.com/vidstack/player/commit/302b382156b817e17cbcb087d14a5cb738538f2b))
- **core:** new player error property/context for spec-compliance ([e832b2f](https://github.com/vidstack/player/commit/e832b2faae8e116e55e276aa05eeffa05c0829a2))
- **core:** new playsinline property ([eae1857](https://github.com/vidstack/player/commit/eae185762539039d92486d5b85673985a87078ee))
- enable media idle state to paused/resumed ([ecc5b88](https://github.com/vidstack/player/commit/ecc5b88479ed1159d9dd14f1e8b13e92666708c2))
- **foundation/context:** make `WithContext` optional when using context decorators ([3a6b12c](https://github.com/vidstack/player/commit/3a6b12cb5812c271873360774d0f9268b62af0d0))
- fullscreen support ([#152](https://github.com/vidstack/player/issues/152)) ([e75a030](https://github.com/vidstack/player/commit/e75a030b78265a7625243f53f45f92e49f2b83eb))
- handle loading media on change ([#109](https://github.com/vidstack/player/issues/109)) ([326f6f5](https://github.com/vidstack/player/commit/326f6f5e37fd32ce5cbc2f3c1cddea9411c8a091))
- hls provider ([#117](https://github.com/vidstack/player/issues/117)) ([81d7ed5](https://github.com/vidstack/player/commit/81d7ed5543859fec889730ecbb21976b037b88df))
- improve determining ended state and when to fire replay ([89e3710](https://github.com/vidstack/player/commit/89e37107975f13b673010d6da217572003279dcf)), closes [#147](https://github.com/vidstack/player/issues/147)
- include `elements.json` (metadata file) in package distribution ([59a5b6f](https://github.com/vidstack/player/commit/59a5b6f281b0562f4dfb6e4d1c5f958deff7c9d4))
- include dev and prod `iife` bundles ([ea0e064](https://github.com/vidstack/player/commit/ea0e0647461b71001fc6195e5c32add990d514d4))
- include production version ([083c379](https://github.com/vidstack/player/commit/083c37982f41d39b2b8616f4a8619f5adadc3495))
- include vscode custom html data ([d1b4245](https://github.com/vidstack/player/commit/d1b4245ae4e632bb2f93be7493c05802993c1f60)), closes [#584](https://github.com/vidstack/player/issues/584)
- log controls/fullscreen changes on media controller ([dd00df5](https://github.com/vidstack/player/commit/dd00df50470063e56e9bc6bded45f138b7168f99))
- log vds media events ([1de4cc0](https://github.com/vidstack/player/commit/1de4cc04b72e977c7cca10250cc7b6a91949b213))
- logger rework ([#533](https://github.com/vidstack/player/issues/533)) ([d2a0e27](https://github.com/vidstack/player/commit/d2a0e27c3261294db7a5f2b1073a5289dd0fbde6))
- loop support ([#140](https://github.com/vidstack/player/issues/140)) ([6c8f616](https://github.com/vidstack/player/commit/6c8f616eb1fb96764e1c5d2f8f4c7f8eac93ab42)), closes [#93](https://github.com/vidstack/player/issues/93)
- major internals cleanup ([#529](https://github.com/vidstack/player/issues/529)) ([3c47a4e](https://github.com/vidstack/player/commit/3c47a4ec20bbacfa0e56dd49486617c67823a98a))
- media controller bridge ([#300](https://github.com/vidstack/player/issues/300)) ([f46d295](https://github.com/vidstack/player/commit/f46d29590fce76abd8a43bb486bc54c9166e5ace))
- media file provider ([#110](https://github.com/vidstack/player/issues/110)) ([4990d10](https://github.com/vidstack/player/commit/4990d10ba0ec9bc8cf5fcbd1ae376f8e4e38f210))
- media management ([#558](https://github.com/vidstack/player/issues/558)) ([7d0e2d7](https://github.com/vidstack/player/commit/7d0e2d77c7bb18dc7373d1ce6beb04fbed5407aa))
- **media/container:** make media slot optional ([2872d56](https://github.com/vidstack/player/commit/2872d56ab7aeefac20420625e94d26b960a2901a))
- **media:** integrate controls and idle manager into media controller ([616362c](https://github.com/vidstack/player/commit/616362c49edcee23e62f254aebafc7b81868fefe))
- **media:** refactor media event observer and add decorator form ([ccb4345](https://github.com/vidstack/player/commit/ccb43451fb198b140f7c909351890ac4a4c05b66))
- mock media provider ([#103](https://github.com/vidstack/player/issues/103)) ([b624320](https://github.com/vidstack/player/commit/b6243206030da44c497849805d89d37083b84120)), closes [#6](https://github.com/vidstack/player/issues/6)
- new `[@watch](https://github.com/watch)Context` decorator ([d8759a3](https://github.com/vidstack/player/commit/d8759a3382a0ec7054a1779b36e33e56aedeb92e))
- new `<vds-media-text />` component ([ef4fa34](https://github.com/vidstack/player/commit/ef4fa34b26c61e3fc77a4fa22541e821b74bdd87)), closes [#610](https://github.com/vidstack/player/issues/610)
- new `<vds-slider-value-text />` component ([e2b3b28](https://github.com/vidstack/player/commit/e2b3b287a4aef5907edd224604eea2f215727060)), closes [#611](https://github.com/vidstack/player/issues/611)
- new `canLoad` and `loadingStrategy` properties ([8f50658](https://github.com/vidstack/player/commit/8f506581f90f995651c2bab4f2e2f0c25309c38c))
- new `ContextConsumerManager` ([2a7ba85](https://github.com/vidstack/player/commit/2a7ba8551bc3f59bf23ed5ff3d0e8741560bc426))
- new `EventListenerController` ([72a4a86](https://github.com/vidstack/player/commit/72a4a865f947e3ae7228c630aaedee764686c0e0))
- new `live` media context ([a9d5758](https://github.com/vidstack/player/commit/a9d57589e5b18fe457c4434875989eaa4358dc80))
- new `MediaEventObserver` ([0cb3267](https://github.com/vidstack/player/commit/0cb32674e9f5ee191942be77e898cb2ac21b63c5))
- new `mediaProviderConnectedQueue` on media controller ([e862e65](https://github.com/vidstack/player/commit/e862e658928f926de4ea8ad5c4018daa77a3b753))
- new `ScrubberPreviewVideoElement` ([1fb5347](https://github.com/vidstack/player/commit/1fb53479fe4fdc6b62ce40ccf2954090c81acfd7))
- new `shouldRequestUpdate` for context consumers ([7ce8fe9](https://github.com/vidstack/player/commit/7ce8fe982e1d5b727cd40458e1623a10eef9a5a0))
- new `vds-aspect-ratio` element ([8462465](https://github.com/vidstack/player/commit/84624651c9a6582eec70e3a481464d19513dcbfe))
- new `vds-looped` event ([4ffc1be](https://github.com/vidstack/player/commit/4ffc1be7df885e1f8f5aeb9af5cd96d4d5b73e70))
- new audio provider ([c869fb8](https://github.com/vidstack/player/commit/c869fb8266cf7ac79c089b5a2870f19b1d541bba))
- new buffering indicator component ([#139](https://github.com/vidstack/player/issues/139)) ([97bc42a](https://github.com/vidstack/player/commit/97bc42a543f34536d103ac5e98330530e75fc12a)), closes [#58](https://github.com/vidstack/player/issues/58)
- new context binding controllers for styling ([c3e24e5](https://github.com/vidstack/player/commit/c3e24e518f941ad6cadae87b19eb249b4b496caf))
- new immutable snapshot of media state via `mediaState` property ([1961f3e](https://github.com/vidstack/player/commit/1961f3e6622215fa0a89146ce0df511620c5e433))
- new media controller architecture ([#270](https://github.com/vidstack/player/issues/270)) ([6e7d23d](https://github.com/vidstack/player/commit/6e7d23d1c47f534896f293fe1cc55073fa790945))
- new mute toggle component ([#134](https://github.com/vidstack/player/issues/134)) ([679ed8e](https://github.com/vidstack/player/commit/679ed8e57ab012c28e6b1bde181e49f6f06b95b9)), closes [#35](https://github.com/vidstack/player/issues/35)
- new playback toggle component ([#130](https://github.com/vidstack/player/issues/130)) ([cf0a358](https://github.com/vidstack/player/commit/cf0a3581ecd5d899e8862ac020151e12f0c13a98)), closes [#32](https://github.com/vidstack/player/issues/32)
- new player elements to simplify integration ([15edc57](https://github.com/vidstack/player/commit/15edc57dddcdea505538ed5be1338076d0e83cac))
- new scrubber component ([#149](https://github.com/vidstack/player/issues/149)) ([5344e79](https://github.com/vidstack/player/commit/5344e796453f32f8b62ce33998d3775b7e451363)), closes [#50](https://github.com/vidstack/player/issues/50) [#92](https://github.com/vidstack/player/issues/92)
- new scrubber preview context ([a30ea09](https://github.com/vidstack/player/commit/a30ea0975f1477241435d5707c1a7fc3dc59532e))
- new slider component ([#145](https://github.com/vidstack/player/issues/145)) ([ee7ad95](https://github.com/vidstack/player/commit/ee7ad956c3620dac9ba9794f2b01f6e4d62f4305)), closes [#48](https://github.com/vidstack/player/issues/48)
- new time components ([#135](https://github.com/vidstack/player/issues/135)) ([5bcc8a6](https://github.com/vidstack/player/commit/5bcc8a6ec3fc22e7e4c1674470c8bddbd80d98d0)), closes [#66](https://github.com/vidstack/player/issues/66) [#67](https://github.com/vidstack/player/issues/67) [#68](https://github.com/vidstack/player/issues/68) [#69](https://github.com/vidstack/player/issues/69)
- new toggle control component ([7970b1d](https://github.com/vidstack/player/commit/7970b1d14fbb3ab239d0720d1795cf4819ed8e1e))
- new toggle fullscreen component ([#162](https://github.com/vidstack/player/issues/162)) ([d79c82c](https://github.com/vidstack/player/commit/d79c82c74834e47925b008f770fbea82e1e904d6))
- normalize `vds-playing` event behaviour and attach trigger ([2d5e2c7](https://github.com/vidstack/player/commit/2d5e2c7216627243987ec9cf71a0187acd8e70d7))
- **player-react:** add ssr/hydration support ([93269d4](https://github.com/vidstack/player/commit/93269d40647531d2552341aa536fc05a52f1b327))
- **player-react:** media hooks ([368246f](https://github.com/vidstack/player/commit/368246f914a98c06730b2ee4e240d6bb30ba0980))
- **player:** add `aria-busy` attribute based on media can play state ([367f509](https://github.com/vidstack/player/commit/367f509e5574d978d092c7ff1cab083858e363e5))
- **player:** contain media styles ([8aecd9c](https://github.com/vidstack/player/commit/8aecd9cfc9ce916fdaa246c10bfd65506e70e0bb))
- **player:** media controller can now be parent of media provider ([76d8fe8](https://github.com/vidstack/player/commit/76d8fe86b83f1ec490f4dad8162f29b8cbc28b6f))
- **player:** move `dist-cdn` to `cdn` ([8d2c60b](https://github.com/vidstack/player/commit/8d2c60bb65ef405bc977a69336d7614fda8d53f0))
- **player:** move js framework integrations to own packages ([15051cf](https://github.com/vidstack/player/commit/15051cf7bb0fce459cb81237f6c64fefaa751918))
- **player:** new `<vds-media>` element ([0f72b10](https://github.com/vidstack/player/commit/0f72b10026f1d86805d91e7c66f72baf966efe40))
- **player:** new `fullscreen-target` attribute on `FullscreenButtonElement` ([ac7721d](https://github.com/vidstack/player/commit/ac7721d61e6c5edae18da450cbb57098723bb511))
- **player:** new `idle` loading strategy ([92bca7f](https://github.com/vidstack/player/commit/92bca7f79a605993c72351ee05c3204e8a392c4d))
- **player:** new custom loading trigger event `vds-start-loading` ([9f9bc55](https://github.com/vidstack/player/commit/9f9bc5521536932960505f04e42f8abda5d2fd6c))
- **player:** new hard `destroy` method on media provider elements ([f713d06](https://github.com/vidstack/player/commit/f713d0681edf8c63012bf69e402741550eaeff53))
- **player:** new svelte component wrappers ([0133f51](https://github.com/vidstack/player/commit/0133f51859dd18674abf7afa8b5848a267a9639f))
- **player:** progressively enhanced media ([3492c76](https://github.com/vidstack/player/commit/3492c76c920083b6639220f93a6ed1ec303f592d))
- **player:** register `<vds-media>` as discoverable ([03c3e3b](https://github.com/vidstack/player/commit/03c3e3b054c8c2b31cdb848987fb39cff0e99a3c))
- **player:** remove experimental sticker on `vds-media-sync` ([fa4d487](https://github.com/vidstack/player/commit/fa4d4876d653e194b947971b087eeffdb4105084))
- **player:** shorter media attr names on `<vds-media>` ([4e7c680](https://github.com/vidstack/player/commit/4e7c6807eebfa9744051e66302671be8e839b7d2))
- **player:** svelte wrappers can forward all slots to custom element ([288bb9a](https://github.com/vidstack/player/commit/288bb9a73a08c5d97108f31fde3417f3bb7623cf))
- prepare for mission func-one ([#3](https://github.com/vidstack/player/issues/3)) ([796cbf7](https://github.com/vidstack/player/commit/796cbf79f1ca8b346d2a00e79a5b1a1e8be07828))
- **providers/file:** allow <source>/<track> to be passed in via <slot> ([8716b94](https://github.com/vidstack/player/commit/8716b94dfa8fbdf51b56389e8f33e2c85d4dcb46))
- re-dispatch native media events for spec-compliance ([a00fc59](https://github.com/vidstack/player/commit/a00fc59af16c77b4be452515a0e5e9cea8280f3a))
- react support 🎉 ([6dec35a](https://github.com/vidstack/player/commit/6dec35ac13cac220bf84bcb78a24f2feb1214da9)), closes [#585](https://github.com/vidstack/player/issues/585)
- reduce some logging noise when level set to `info` ([3100ca9](https://github.com/vidstack/player/commit/3100ca9d35e3fb22b1ba264fa493518f7307601b))
- refactor media provider bridge ([4d5c12c](https://github.com/vidstack/player/commit/4d5c12cbc6e367a90e190f7c1fbefadf3cf485c7))
- refactor scrubber ([3d4c8d7](https://github.com/vidstack/player/commit/3d4c8d7de0c1d749d0936ef2a7794bc4d80c30ce))
- register `<vds-media-ui>` when registering player elements ([0380357](https://github.com/vidstack/player/commit/0380357ad04890b625064511872d03d635e09cba))
- scrim component ([#366](https://github.com/vidstack/player/issues/366)) ([434d9f1](https://github.com/vidstack/player/commit/434d9f1f2866524fdf8cc20bdb6d38eccbe098c7))
- separate slider drag value from current value ([c801da1](https://github.com/vidstack/player/commit/c801da109a9e6c3cd331e687db90972d943c89bb))
- **site:** pre 1.0 redesign ([5f575f8](https://github.com/vidstack/player/commit/5f575f8b65137629ad5636b4550bc3e6ada985d8))
- split page/viewport media visibility actions ([8aba33b](https://github.com/vidstack/player/commit/8aba33b9551623b90657b2f501cdc1e08b76e082))
- stage-1 of progressively enhanced hls support ([#377](https://github.com/vidstack/player/issues/377)) ([75db01d](https://github.com/vidstack/player/commit/75db01d19d1a30bff8a3bd19fac159f8368b7742))
- tailwind plugin for media/slider attrs ([3e9b9de](https://github.com/vidstack/player/commit/3e9b9de07d440f0c7208c45b1488dab0eedff66d)), closes [#598](https://github.com/vidstack/player/issues/598)
- **ui/\*:** add element getters + static css parts property ([21f608f](https://github.com/vidstack/player/commit/21f608f580ab8932d3127b151947f011f9497a13))
- **ui/buffering-indicator:** add missing styles ([2a7fb28](https://github.com/vidstack/player/commit/2a7fb2885e3a46222dba3e88af4f60a81c137796))
- **ui/buffering-indicator:** new `media-ended` attribute for styling ([0f8a188](https://github.com/vidstack/player/commit/0f8a1886fc6aa1d2f182fca340bb96b2a38db5d4))
- **ui/buffering-indicator:** refactor to use attributes ([172f052](https://github.com/vidstack/player/commit/172f0528b23c090226460502e39d87494e16e820))
- **ui/controls/control:** new control component ([#122](https://github.com/vidstack/player/issues/122)) ([0d30a96](https://github.com/vidstack/player/commit/0d30a96756fb2b121cd2b95d17eaeec97e77dd59)), closes [#28](https://github.com/vidstack/player/issues/28)
- **ui/controls/scrubber:** new events ([4ec8638](https://github.com/vidstack/player/commit/4ec86386f14d3c9c670d8b570ce8de2f79c3f70d))
- **ui/controls/toggle:** new toggle component ([#129](https://github.com/vidstack/player/issues/129)) ([1eaf710](https://github.com/vidstack/player/commit/1eaf710341930327db1a39afe3624b2194e6d180)), closes [#29](https://github.com/vidstack/player/issues/29)
- **ui/time/time:** monospace numbers so they dont jiggle ([4c50b32](https://github.com/vidstack/player/commit/4c50b32c93df24a0da4e9e0863b15176d5d11d63))
- **ui/ui:** new ui component ([#121](https://github.com/vidstack/player/issues/121)) ([ae0ff6e](https://github.com/vidstack/player/commit/ae0ff6eaa7e6058c68bf9bd878fefc77ff1804b8)), closes [#59](https://github.com/vidstack/player/issues/59)
- **ui:** introduce `media-*` attributes for styling ([ad055f1](https://github.com/vidstack/player/commit/ad055f130239f12dc69ae846f6d7450b5243bedb))
- **ui:** new `<vds-gesture />` component ([4ff06c5](https://github.com/vidstack/player/commit/4ff06c5bae2d9849180bdd49d077f78c44c4e8c7)), closes [#592](https://github.com/vidstack/player/issues/592)
- **ui:** new `<vds-poster />` component ([304e6ea](https://github.com/vidstack/player/commit/304e6eaf2124720d3850933b262a1d6069b09f2e)), closes [#589](https://github.com/vidstack/player/issues/589)
- **ui:** new `<vds-slider-video />` component ([e8d4259](https://github.com/vidstack/player/commit/e8d425939ea21c18ebf8b2f6a48cccc7f8eb8f0e)), closes [#613](https://github.com/vidstack/player/issues/613)
- **ui:** new `ScrubberPreviewTimeElement` ([9d17a6c](https://github.com/vidstack/player/commit/9d17a6c545dd038b8df8dab8e9e806daa9cd65ac))
- update bundle to include new components ([a497fc9](https://github.com/vidstack/player/commit/a497fc990e50b40f3ff992d5b95d8633ef3e75f5))
- upgrade `hls.js` 0.13.3 -> 1.0.0 ([46adeb8](https://github.com/vidstack/player/commit/46adeb8dabd0f7458c2c34d695529b24164f8ed4))
- **utils/promise:** add `timedPromise` function ([e7ef828](https://github.com/vidstack/player/commit/e7ef8280f3c035f2df3844138184ea6bb89036e1))
- video provider ([#111](https://github.com/vidstack/player/issues/111)) ([9cd009b](https://github.com/vidstack/player/commit/9cd009b8a3fee6ee5b0be619929c55ad3f303e07)), closes [#11](https://github.com/vidstack/player/issues/11)
- volume slider control ([#345](https://github.com/vidstack/player/issues/345)) ([85c2584](https://github.com/vidstack/player/commit/85c2584429e31c0987559e82719078b8ba608ad2))

### BREAKING CHANGES

- Events will not bubble up through shadow DOM by default
- event names are now separated by a hyphen `-`
- `canPlayType()` now returns a native result type via an enum `CanPlayType` instead of a boolean. This is to better align with the native HTMLMediaElement response type.

In addition, a new `shouldPlayType()` method has taken on the existing functionaliy of `canPlayType()` and returns a boolean. It'll return `true` if `canPlayType()` returns `Maybe` or `Probably`.

- Renamed the following component methods that were incorrectly using the build
  prefix:

* `build*ClassAttr` -> `get*ClassAttr`
* `build*PartAttr` -> `get*PartAttr`
* `build*StyleMap` -> `get*StyleMap`
  -> `build*ExportsPartAttr` -> `get*ExportsPartAttr`

`*` refers to any character (repeated 0 - many times).

- The following player properties/context/events were removed:

* `inputDevice`
* `isTouchInputDevice`
* `isMouseInputDevice`
* `isKeyboardInputDevice`
* `vds-input-device-change`

The following were removed from `utils/dom`:

- `InputDevice`
- `onInputDeviceChange`
