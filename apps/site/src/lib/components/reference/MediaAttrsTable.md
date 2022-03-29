<script>
export let title = 'Attribute';
export let prefix = '';
</script>

| {title}                      | Description                                        |
| ---------------------------- | -------------------------------------------------- |
| {`${prefix}-autoplay`}       | Autoplay has successfully started.                 |
| {`${prefix}-autoplay-error`} | Autoplay has failed to start.                      |
| {`${prefix}-can-load`}       | Media can begin loading.                           |
| {`${prefix}-can-play`}       | Media is ready to be played.                       |
| {`${prefix}-can-fullscreen`} | Media fullscreen is available.                     |
| {`${prefix}-ended`}          | Playback has reached the end.                      |
| {`${prefix}-error`}          | Issue with media loading/playback.                 |
| {`${prefix}-fullscreen`}     | Media is in fullscreen mode.                       |
| {`${prefix}-user-idle`}      | User is not active during playback.                |
| {`${prefix}-loop`}           | Media is set to loop back to start on end.         |
| {`${prefix}-muted`}          | Media is muted.                                    |
| {`${prefix}-paused`}         | Playback is in a paused state.                     |
| {`${prefix}-playing`}        | Playback has started or resumed.                   |
| {`${prefix}-playsinline`}    | Media should play inline by default (iOS Safari).  |
| {`${prefix}-seeking`}        | Media or user is seeking to new playback position. |
| {`${prefix}-started`}        | Media playback has started.                        |
| {`${prefix}-waiting`}        | Media is waiting for more data (i.e., buffering).  |
