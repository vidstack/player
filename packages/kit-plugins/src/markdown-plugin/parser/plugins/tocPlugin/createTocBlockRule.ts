import type { RuleBlock } from 'markdown-it/lib/parser_block';

/**
 * Forked and modified from `markdown-it-toc-done-right`.
 *
 * - Remove the `inlineOptions` support.
 * - Use `markdown-it` default renderer to render token whenever possible.
 *
 * @see https://github.com/nagaozen/markdown-it-toc-done-right
 */
export const createTocBlockRule = ({ pattern }: { pattern: RegExp }): RuleBlock => {
  return (state, startLine, endLine, silent): boolean => {
    // If it's indented more than 3 spaces, it should be a code block.
    if (state.sCount[startLine] - state.blkIndent >= 4) {
      return false;
    }

    const pos = state.bMarks[startLine] + state.tShift[startLine];
    const max = state.eMarks[startLine];

    /**
     * Use whitespace as a line tokenizer and extract the first token to test against the
     * placeholder anchored pattern, rejecting if `false`.
     */
    const lineFirstToken = state.src.slice(pos, max).split(' ')[0];
    if (!pattern.test(lineFirstToken)) return false;

    if (silent) return true;

    state.line = startLine + 1;

    const tokenOpen = state.push('toc_open', 'TableOfContents', 1);
    tokenOpen.markup = '';
    tokenOpen.map = [startLine, state.line];

    const tokenClose = state.push('toc_close', 'TableOfContents', -1);
    tokenClose.markup = '';

    return true;
  };
};
