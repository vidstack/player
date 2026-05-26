import { vi } from 'vitest';

import type { VimeoOEmbedData } from './embed/misc';
import { getVimeoVideoInfo } from './utils';

it('preserves the aspect ratio for landscape Vimeo posters', async () => {
  mockOEmbed(
    createOEmbedData({
      width: 1920,
      height: 1080,
      thumbnail_url: 'https://i.vimeocdn.com/video/123456789_640.jpg',
    }),
  );

  const info = (await getVimeoVideoInfo('123', new AbortController()))!;

  expect(info.poster).to.equal('https://i.vimeocdn.com/video/123456789_1920x1080.webp');
});

it('preserves the aspect ratio for portrait Vimeo posters', async () => {
  mockOEmbed(
    createOEmbedData({
      width: 1080,
      height: 1920,
      thumbnail_url: 'https://i.vimeocdn.com/video/987654321_640.jpg',
    }),
  );

  const info = (await getVimeoVideoInfo('456', new AbortController()))!;

  expect(info.poster).to.equal('https://i.vimeocdn.com/video/987654321_1080x1920.webp');
});

it('falls back to the original thumbnail when dimensions are missing', async () => {
  const thumbnailUrl = 'https://i.vimeocdn.com/video/555555555_640.jpg';

  mockOEmbed(
    createOEmbedData({
      width: 0,
      height: 0,
      thumbnail_width: 0,
      thumbnail_height: 0,
      thumbnail_url: thumbnailUrl,
    }),
  );

  const info = (await getVimeoVideoInfo('789', new AbortController()))!;

  expect(info.poster).to.equal(thumbnailUrl);
});

function mockOEmbed(data: VimeoOEmbedData) {
  Object.defineProperty(window, 'fetch', {
    configurable: true,
    value: vi.fn(() =>
      Promise.resolve({
        json: () => Promise.resolve(data),
      }),
    ),
  });
}

function createOEmbedData(overrides: Partial<VimeoOEmbedData>): VimeoOEmbedData {
  return {
    account_type: 'basic',
    author_name: '',
    author_url: '',
    description: '',
    duration: 0,
    height: 1080,
    html: '',
    is_plus: '0',
    provider_name: 'Vimeo',
    provider_url: 'https://vimeo.com/',
    thumbnail_height: 1080,
    thumbnail_url_with_play_button: '',
    thumbnail_url: 'https://i.vimeocdn.com/video/123456789_640.jpg',
    thumbnail_width: 1920,
    title: '',
    type: 'video',
    upload_date: '',
    uri: '',
    version: '1.0',
    video_id: 0,
    width: 1920,
    ...overrides,
  };
}
