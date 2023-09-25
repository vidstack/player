import { ChapterTitle } from '@vidstack/react';

export function Title() {
  return (
    <span className="inline-block flex-1 overflow-hidden text-ellipsis whitespace-nowrap px-2 text-sm font-medium text-white/70">
      <span className="mr-1">|</span>
      <ChapterTitle />
    </span>
  );
}
