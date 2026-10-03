import { canGoogleCastSrc, isAudioSrc } from './mime';

describe(isAudioSrc.name, function () {
  it('recognizes an Opus file without relying on its server MIME type', function () {
    expect(
      isAudioSrc({
        src: 'https://example.com/recording.opus?download=1',
        type: '?',
      }),
    ).to.equal(true);
  });
});

describe(canGoogleCastSrc.name, function () {
  it('accepts DASH sources by type', function () {
    expect(
      canGoogleCastSrc({
        src: 'https://example.com/manifest',
        type: 'application/dash+xml',
      }),
    ).to.equal(true);
  });

  it('accepts DASH sources by extension', function () {
    expect(
      canGoogleCastSrc({
        src: 'https://example.com/manifest.mpd',
        type: '',
      }),
    ).to.equal(true);
  });
});
