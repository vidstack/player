import { expect } from '@open-wc/testing';

import { buildFakeMediaProvider } from '../../fakes/fakes.helpers';

describe('uuid mixin', () => {
  it('should create new uuid', async () => {
    const provider = await buildFakeMediaProvider();
    expect(provider.uuid).to.exist;
    expect(provider).to.have.attribute('uuid', provider.uuid);
  });
});
