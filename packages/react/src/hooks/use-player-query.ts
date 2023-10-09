import * as React from 'react';

import { scoped } from 'maverick.js';
import { useReactScope } from 'maverick.js/react';
import { listenEvent } from 'maverick.js/std';
import { PlayerQueryList } from 'vidstack';

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
 * You can also use media queries:
 *
 * ```ts
 * const matches = usePlayerQuery("@media (min-width: 300px)");
 * ```
 *
 * @docs {@link https://www.vidstack.io/docs/player/api/hooks/use-player-query}
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
