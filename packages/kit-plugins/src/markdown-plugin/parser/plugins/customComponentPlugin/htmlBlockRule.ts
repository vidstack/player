import * as blockNames from 'markdown-it/lib/common/html_blocks';
import type { RuleBlock } from 'markdown-it/lib/parser_block';

import { HTML_OPEN_CLOSE_TAG_RE } from './htmlRe';
import { inlineTags } from './inlineTags';

// Forked and modified from 'markdown-it/lib/rules_block/html_block.js'

/**
 * An array of opening and corresponding closing sequences for html tags. The last array value
 * defines whether it can terminate a paragraph or not.
 */
export type HTMLBlockSequence = [RegExp, RegExp, boolean];

const HTML_SEQUENCES: HTMLBlockSequence[] = [
  [/^<(script|pre|style)(?=(\s|>|$))/i, /<\/(script|pre|style)>/i, true],
  [/^<!--/, /-->/, true],
  [/^<\?/, /\?>/, true],
  [/^<![A-Z]/, />/, true],
  [/^<!\[CDATA\[/, /\]\]>/, true],
  // MODIFIED HERE: Treat unknown tags as block tags (custom components), excluding known inline tags
  [new RegExp('^</?(?!(' + inlineTags.join('|') + ')(?![\\w-]))\\w[\\w-]*[\\s/>]'), /^$/, true],
  // eslint-disable-next-line import/namespace
  [new RegExp('^</?(' + blockNames.join('|') + ')(?=(\\s|/?>|$))', 'i'), /^$/, true],
  [new RegExp(HTML_OPEN_CLOSE_TAG_RE.source + '\\s*$'), /^$/, false],
];

export const htmlBlockRule = (customSequences: HTMLBlockSequence[] = []): RuleBlock => {
  const sequences: HTMLBlockSequence[] = [...HTML_SEQUENCES, ...customSequences];

  return (state, startLine, endLine, silent): boolean => {
    let i: number;
    let nextLine: number;
    let lineText: string;
    let pos = state.bMarks[startLine] + state.tShift[startLine];
    let max = state.eMarks[startLine];

    // if it's indented more than 3 spaces, it should be a code block
    if (state.sCount[startLine] - state.blkIndent >= 4) {
      return false;
    }

    if (!state.md.options.html) {
      return false;
    }

    if (state.src.charCodeAt(pos) !== 0x3c /* < */) {
      return false;
    }

    lineText = state.src.slice(pos, max);

    for (i = 0; i < sequences.length; i++) {
      if (sequences[i][0].test(lineText)) {
        break;
      }
    }

    if (i === sequences.length) {
      return false;
    }

    if (silent) {
      // true if this sequence can be a terminator, false otherwise
      return sequences[i][2];
    }

    nextLine = startLine + 1;

    // If we are here - we detected HTML block.
    // Let's roll down till block end.
    if (!sequences[i][1].test(lineText)) {
      for (; nextLine < endLine; nextLine++) {
        if (state.sCount[nextLine] < state.blkIndent) {
          break;
        }

        pos = state.bMarks[nextLine] + state.tShift[nextLine];
        max = state.eMarks[nextLine];
        lineText = state.src.slice(pos, max);

        if (sequences[i][1].test(lineText)) {
          if (lineText.length !== 0) {
            nextLine++;
          }
          break;
        }
      }
    }

    state.line = nextLine;

    const token = state.push('html_block', '', 0);
    token.map = [startLine, nextLine];
    token.content = state.getLines(startLine, nextLine, state.blkIndent, true);

    return true;
  };
};
