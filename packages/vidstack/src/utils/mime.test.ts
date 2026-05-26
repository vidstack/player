import { canGoogleCastSrc } from './mime';

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
