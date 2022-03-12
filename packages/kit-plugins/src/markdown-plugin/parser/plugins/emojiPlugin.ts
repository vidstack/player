import type { PluginSimple } from 'markdown-it';
import rawEmojiPlugin from 'markdown-it-emoji';

export const emojiPlugin: PluginSimple = (parser) => {
  return rawEmojiPlugin(parser);
};
