export type HighlightLinesRange = [number, number];

/**
 * Resolve highlight-lines ranges from token info.
 */
export const resolveHighlightLines = (info: string): HighlightLinesRange[] | null => {
  // Try to match highlight-lines mark.
  const match = info.match(/{([\d,-]+)}/);

  // No highlight-lines mark, return `null`.
  if (match === null) {
    return null;
  }

  // Resolve lines ranges from the highlight-lines mark.
  return match[1].split(',').map((item) => {
    const range = item.split('-');
    if (range.length === 1) {
      range.push(range[0]);
    }
    return range.map((str) => Number.parseInt(str, 10)) as HighlightLinesRange;
  });
};
