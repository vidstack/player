import { computed, effect, root, signal, type Dispose, type ReadSignal } from 'maverick.js';
import {
  camelToKebabCase,
  EventsTarget,
  isString,
  kebabToCamelCase,
  listenEvent,
  unwrap,
} from 'maverick.js/std';

import { useMediaContext } from './api/media-context';
import { mediaState, type MediaState, type MediaStore } from './api/player-state';

const globalEval = eval;

const equalsRE = /:\s+'?"?(.*?)'?"?\)/g,
  notRE = /\s+not\s+/g,
  andRE = /\s+and\s+/g,
  orRE = /\s+or\s+/g,
  pxRE = /(\d)px/g;

export class PlayerQueryList extends EventsTarget<PlayerQueryListEvents> {
  static create = (query: string | ReadSignal<string>) => {
    const media = useMediaContext();
    return new PlayerQueryList(media.$state, query);
  };

  private _query: string | ReadSignal<string>;
  private _mediaStore: MediaStore;
  private _evaluation = signal('true');
  private _mediaProps = new Set<keyof MediaState>();
  private _mediaMatches = signal(true);
  private _dispose!: Dispose;

  get query(): string {
    return unwrap(this._query);
  }

  readonly $matches = computed<boolean>(() => {
    let currentEval = this._evaluation();
    if (currentEval === 'never') return false;

    for (const prop of this._mediaProps) {
      const value = this._mediaStore[prop](),
        replaceValue = isString(value) ? `'${value}'` : value + '';
      currentEval = currentEval.replace(camelToKebabCase(prop), replaceValue);
    }

    return globalEval(`!!(${currentEval})`) && this._mediaMatches();
  });

  get matches(): boolean {
    return this.$matches();
  }

  constructor(store: MediaStore, query: string | ReadSignal<string>) {
    super();

    this._query = query;
    this._mediaStore = store;

    root((dispose) => {
      effect(this._watchQuery.bind(this));
      effect(this._watchMatches.bind(this));
      this._dispose = dispose;
    });
  }

  private _watchQuery() {
    const query = this.query;
    if (query === '') return;

    if (query === 'never') {
      this._evaluation.set(query);
      return;
    }

    const queryList = query.trim().split(/\s*,\s*/g),
      mediaQueries = queryList.filter((q) => q.startsWith('@media')).join(','),
      playerQueries = queryList.filter((q) => !q.startsWith('@media'));

    if (mediaQueries.length) {
      const mediaQuery = window.matchMedia(mediaQueries.replace(/@media\s/g, '')),
        onChange = () => void this._mediaMatches.set(mediaQuery.matches);
      onChange();
      listenEvent(mediaQuery, 'change', onChange);
    }

    if (playerQueries.length) {
      const evaluation = this._buildQueryEval(playerQueries),
        validProps = Object.keys(mediaState.record);

      for (const query of evaluation.matchAll(/\(([-a-zA-Z]+)\s/g)) {
        const prop = kebabToCamelCase(query[1]);
        if (validProps.includes(prop)) {
          this._mediaProps.add(prop as keyof MediaState);
        }
      }

      this._evaluation.set(evaluation);
    }

    return () => {
      this._mediaProps.clear();
      this._evaluation.set('true');
      this._mediaMatches.set(true);
    };
  }

  private _watchMatches() {
    this.$matches();
    this.dispatchEvent(new Event('change'));
  }

  private _buildQueryEval(queryList: string[]) {
    return queryList
      .map(
        (query) =>
          '(' +
          query
            .replace(equalsRE, ' == "$1")')
            .replace(notRE, '!')
            .replace(andRE, ' && ')
            .replace(orRE, ' || ')
            .replace(pxRE, '$1')
            .trim() +
          ')',
      )
      .join(' || ');
  }

  destroy() {
    this._dispose();
  }
}

export interface PlayerQueryListEvents {
  change: PlayerQueryListChangeEvent;
}

export interface PlayerQueryListChangeEvent extends Omit<Event, 'target'> {
  target: PlayerQueryList;
}
