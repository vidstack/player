import * as React from 'react';
import { scoped } from 'maverick.js';
import { useReactScope } from 'maverick.js/react';
import { listenEvent } from 'maverick.js/std';
import { PlayerQueryList } from 'vidstack/local';

/**
 * Creates a new `PlayerQueryList` object that can then be used to determine if the
 * player and document matches the query string, as well as to monitor any changes to detect
 * when it matches (or stops matching) that query.
 *
 * A player query supports the same syntax as media queries and allows media state properties
 * to be used like so:
 *
 * ```ts
 * const matches = usePlayerQuery("(width < 680) and (streamType: on-demand)");
 * ```
 *
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/MediaQueryList}
 */
export function usePlayerQuery(query: string): boolean {
  const scope = useReactScope(),
    queryList = React.useMemo(() => scoped(() => PlayerQueryList.create(query), scope)!, [query]),
    [matches, setMatches] = React.useState(queryList.matches);

  React.useEffect(() => {
    setMatches(queryList.matches);
    return listenEvent(queryList, 'change', () => {
      setMatches(queryList.matches);
    });
  }, [query]);

  return matches;
}
