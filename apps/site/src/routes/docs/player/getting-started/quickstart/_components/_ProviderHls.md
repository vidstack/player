Embed video content into documents via the native <code>&lt;video&gt;</code> element. This
provider also enables streaming video using the HTTP Live Streaming (HLS) protocol.
[HLS isn't widely supported](https://caniuse.com/?search=hls) yet, but we use the popular
[hls.js](https://github.com/video-dev/hls.js) library to ensure it works anywhere
[Media Source Extensions (MSE) are supported](https://caniuse.com/mediasource), which accounts
for ~96.42% of users tracked on caniuse.
