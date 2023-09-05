export function resolveHighlightedLines(lines: number, highlights?: string): [number, number][] {
  if (!highlights) return [];
  return highlights.split(',').map((item) => {
    const range = item.split('-');
    if (range[1] === '') range[1] = lines - 1 + '';
    else if (range.length === 1) range.push(range[0]);
    return range.map((str) => Number.parseInt(str, 10)) as [number, number];
  });
}

export function isHighlightLine(highlightedLines: [number, number][], lineNumber: number): boolean {
  return highlightedLines.some(([start, end]) => lineNumber >= start && lineNumber <= end);
}
