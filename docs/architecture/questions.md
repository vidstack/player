# Questions/Thoughts

- How to handle readonly properties?? -> Simple getter (`get someProperty() {}`) should be enough. 
This [Mixin][readonly-mixin] might be useful?
- Strict naming convention? paused vs. isPaused? -> Most likely stay consistent with the 
style used by native element props/attrs which is without `is`/`has`.
- Custom UI on IOS using Canvas? -> What would be the penalty of using Canvas? Memory overhead?
- Custom PIP mode with Canvas? -> Still possible to request PiP on a `MediaStream` by piping it 
into a `VideoElement`!
- Stream chunks to `indexdb`?? Maybe save content as part of a session that can be cleared whenever?
- Offline mode? -> OfflineStrategy?
- Caching -> CacheStrategy?
- Media Session? -> Later.
- Playlists?? -> Most likely external. Any consequence of leaving this for later?
- Ads? -> What happens to some UI when Ad playing? -> Leave this for later.

[readonly-mixin]: https://open-wc.org/docs/development/lit-helpers/#privately-settable-read-only-properties