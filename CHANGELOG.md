## [0.1.1](https://github.com/mihar-22/vidstack/compare/v0.1.0...v0.1.1) (2023-01-25)

### Bug Fixes

- **react:** do not mangle `__html` prop ([774b36d](https://github.com/mihar-22/vidstack/commit/774b36db7d3c83773efd5c143807b3bf8b99333d))

# [0.1.0](https://github.com/mihar-22/vidstack/compare/v0.0.1...v0.1.0) (2023-01-24)

### Bug Fixes

- force bump ([bb9dae4](https://github.com/mihar-22/vidstack/commit/bb9dae45f64791a1bad7b321194729d7ba81ce71))
- **react:** bump react deps to 18 ([712bb8e](https://github.com/mihar-22/vidstack/commit/712bb8ea982951c7281efada5d02bcef281860fe))
- **react:** dev export should come after server exports ([a65611c](https://github.com/mihar-22/vidstack/commit/a65611cfadce4ca15619db79dbf86303cf0eda46))
- **react:** doc links are invalid ([be33f4e](https://github.com/mihar-22/vidstack/commit/be33f4ebc9d416971efd5a82fb458d7bd9190cca))
- **react:** ensure components are attached on mount ([e0886e8](https://github.com/mihar-22/vidstack/commit/e0886e8b8c4f23d0b696310cf1e54de1f09ff405))
- **react:** mark all components as pure ([e5c4cb5](https://github.com/mihar-22/vidstack/commit/e5c4cb549e29ee5428cba078d287a003cade27b6))
- **react:** preserve player state when required during mount/unmount ([1c6ced1](https://github.com/mihar-22/vidstack/commit/1c6ced1c02634efe3d85a27229596d41c125fc09))
- **react:** rework state management hooks ([38a182f](https://github.com/mihar-22/vidstack/commit/38a182fff252d5d712666f3bbfbb26aaa236ea34))
- **react:** setup not run when remounting child scope ([1388b51](https://github.com/mihar-22/vidstack/commit/1388b51aaf70d00594653b9de327cf08270bb2a7))
- **react:** use media state not preserving state on remount ([1dc33f3](https://github.com/mihar-22/vidstack/commit/1dc33f31c9a1c27f93fd88e108d58747f59df42b))
- **vidstack:** `define/*` exports are not set ([83af301](https://github.com/mihar-22/vidstack/commit/83af3014c7e08a1cf8b7a463ec7290d0e27e6fb0))
- **vidstack:** `hlsConfig` -> `config` ([96037ff](https://github.com/mihar-22/vidstack/commit/96037ff3067089454821d8a2514392d4e4b479fd))
- **vidstack:** `hlsLibrary` -> `library` ([10e5ffc](https://github.com/mihar-22/vidstack/commit/10e5ffce2608753dc3bf6a791dedf13aa67caa81))
- **vidstack:** `ios-fullscreen` -> `ios-controls` ([19f564a](https://github.com/mihar-22/vidstack/commit/19f564a3c3567d800084ebcccd8642f6c6163db5))
- **vidstack:** `startLoadingMedia` -> `startLoading` ([b429e99](https://github.com/mihar-22/vidstack/commit/b429e99a8674b25038147145a9830c3ea0d4ebdb))
- **vidstack:** copy controller props over to media store during ssr ([f678d07](https://github.com/mihar-22/vidstack/commit/f678d071ed0c8089b092899ea48a5ec7d954741d))
- **vidstack:** correctly resolve html provider default slot ([da51399](https://github.com/mihar-22/vidstack/commit/da51399d8d2706280c39c6c6ee58a1125c09cf55))
- **vidstack:** dev export should come after server exports ([d4fd9f3](https://github.com/mihar-22/vidstack/commit/d4fd9f3567349fa9b22a9c71b3ccc78b5b4ca4f2))
- **vidstack:** ensure browser support checks dont run on server ([8652e9e](https://github.com/mihar-22/vidstack/commit/8652e9e462d4f5f7d13a7bea76651f4b3b10918f))
- **vidstack:** init media store ([82ccd51](https://github.com/mihar-22/vidstack/commit/82ccd51d123db0ee148e2d4ad7f89b5abe839015))
- **vidstack:** invalid doc links ([3aa3993](https://github.com/mihar-22/vidstack/commit/3aa3993b47dc2d0cf005942cb1ee0f996f6a7eb3))
- **vidstack:** load native poster if no hide request is fired ([fc8990c](https://github.com/mihar-22/vidstack/commit/fc8990c3f46aa898ee8a75f37a69df3acd17a29c))
- **vidstack:** prefix media request events with `Media` ([9103cf6](https://github.com/mihar-22/vidstack/commit/9103cf6edfcc49e88afdc384301e43856445055f))
- **vidstack:** set/update poster on underlying html media element ([313f83e](https://github.com/mihar-22/vidstack/commit/313f83ec27af7f5dbb29fe5b67a7c883d99d5e12))
- **vidstack:** slider preview not working on safari ([d37ed5a](https://github.com/mihar-22/vidstack/commit/d37ed5a29c2db18859391ce885e49ff01a2e70f6))
- **vidstack:** strip `hls-` prefix from provider events and attach correctly ([95c3673](https://github.com/mihar-22/vidstack/commit/95c3673b1bfe768aad5e06c7c6e2228c4f4f1ad4))

### Features

- lift all media state and events up to `<vds-media>` ([82db8f3](https://github.com/mihar-22/vidstack/commit/82db8f30385d76ca8d6576ae909a704ff0f00522))
- **react:** new `useMediaProviderElement` hook ([0dffbbb](https://github.com/mihar-22/vidstack/commit/0dffbbbb41051740b97812e4f4d3864d89798347))

## [0.0.1](https://github.com/mihar-22/vidstack/compare/v0.0.0...v0.0.1) (2023-01-18)

### Features

- migration to maverick ([#700](https://github.com/mihar-22/vidstack/issues/700)) ([f3b07d3](https://github.com/mihar-22/vidstack/commit/f3b07d3b35d7d1cb442e5eaf77e79ce0f6f70996))
