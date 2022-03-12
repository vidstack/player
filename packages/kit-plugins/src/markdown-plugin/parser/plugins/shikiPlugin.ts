import { type PluginSimple } from 'markdown-it';
import { getHighlighter, renderToHtml } from 'shiki';

export const createShikiPlugin: () => Promise<PluginSimple> = async () => {
  const highlighter = await getHighlighter({
    theme: 'material-palenight',
    langs: [],
  });

  return (parser) => {
    parser.options.highlight = (code, lang) => {
      const tokens = highlighter.codeToThemedTokens(code, lang);
      return renderToHtml(tokens);
    };
  };
};
