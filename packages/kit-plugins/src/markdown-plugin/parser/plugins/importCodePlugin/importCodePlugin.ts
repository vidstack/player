import type { PluginSimple } from 'markdown-it';

import type { MarkdownParserEnv } from '../../types';
import { createImportCodeBlockRule } from './createImportCodeBlockRule';
import { resolveImportCode } from './resolveImportCode';

export const importCodePlugin: PluginSimple = (parser) => {
  // Add `import_code` block rule.
  parser.block.ruler.before('fence', 'import_code', createImportCodeBlockRule(), {
    alt: ['paragraph', 'reference', 'blockquote', 'list'],
  });

  // Add `import_code` renderer rule.
  parser.renderer.rules.import_code = (tokens, idx, options, env: MarkdownParserEnv, slf) => {
    const token = tokens[idx];

    // Use imported code as token content.
    const { importFilePath, importCode } = resolveImportCode(token.meta, env);
    token.content = importCode;

    // Extract imported files to env.
    if (importFilePath) {
      const importedFiles = env.importedFiles || (env.importedFiles = []);
      importedFiles.push(importFilePath);
    }

    // Render the `import_code` token as a fence token.
    return parser.renderer.rules.fence!(tokens, idx, options, env, slf);
  };
};
