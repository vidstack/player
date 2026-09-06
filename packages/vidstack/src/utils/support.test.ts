import { canUsePictureInPicture } from './support';

describe(canUsePictureInPicture.name, function () {
  afterEach(function () {
    Reflect.deleteProperty(document, 'pictureInPictureEnabled');
  });

  it('returns false when video is null even if picture-in-picture is enabled', function () {
    Object.defineProperty(document, 'pictureInPictureEnabled', {
      configurable: true,
      value: true,
    });

    expect(canUsePictureInPicture(null)).to.equal(false);
  });

  it('returns true for a video element when picture-in-picture is enabled', function () {
    Object.defineProperty(document, 'pictureInPictureEnabled', {
      configurable: true,
      value: true,
    });

    expect(canUsePictureInPicture(document.createElement('video'))).to.equal(true);
  });

  it('returns false when the video has picture-in-picture disabled', function () {
    Object.defineProperty(document, 'pictureInPictureEnabled', {
      configurable: true,
      value: true,
    });

    const video = document.createElement('video');
    video.disablePictureInPicture = true;

    expect(canUsePictureInPicture(video)).to.equal(false);
  });
});
