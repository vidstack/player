import { HLSProviderLoader } from './loader';

describe('HLSProviderLoader.load', function () {
  afterEach(function () {
    Reflect.deleteProperty(document, 'pictureInPictureEnabled');
  });

  it('does not construct the provider with a null target if unmounted during import', async function () {
    Object.defineProperty(document, 'pictureInPictureEnabled', {
      configurable: true,
      value: true,
    });

    const loader = new HLSProviderLoader(),
      video = document.createElement('video'),
      ctx = { notify() {} } as any;

    loader.target = video;

    const load = loader.load(ctx);
    loader.target = null as any;

    const provider = await load;

    expect(provider).to.have.property('type', 'hls');
    expect(provider.video).to.equal(video);
  });
});
