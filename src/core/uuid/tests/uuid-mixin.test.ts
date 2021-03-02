import '../../fakes/vds-fake-media-provider';

import { expect } from '@open-wc/testing';

import { buildFakeMediaProvider } from '../../fakes/helpers';

describe('uuid mixin', () => {
  it('should create new uuid', async () => {
    const provider = await buildFakeMediaProvider();
    expect(provider.uuid).to.exist;
    expect(provider).to.have.attribute('uuid', provider.uuid);
  });
});
