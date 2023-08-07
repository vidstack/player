import { computed, effect, onDispose, signal, type ReadSignal } from 'maverick.js';
import { EventsTarget, isString, runAll } from 'maverick.js/std';
import { useMediaContext } from './api/media-context';
import { mediaState, type MediaState, type MediaStore } from './api/player-state';

const equalsRE = /:\s+/g,
  notRE = /\s+not\s+/g,
  andRE = /\s+and\s+/g,
  orRE = /\s+or\s+/g,
  pxRE = /(\d)px/g;

export function createPlayerQueryList(query: string) {
  const media = useMediaContext();
  return new PlayerQueryList(media.$state, query);
}

export class PlayerQueryList extends EventsTarget<PlayerQueryListEvents> {
  private _matches: ReadSignal<boolean> = signal(false);
  private _mediaStore: MediaStore;
  private _mediaQueryList: MediaQueryList | null = null;
  private _disposal: (() => void)[] = [];

  get matches(): boolean {
    return this._matches() && (this._mediaQueryList?.matches ?? true);
  }

  constructor(
    store: MediaStore,
    readonly query: string,
  ) {
    super();
    this._mediaStore = store;
    this._init();
    onDispose(this.destroy.bind(this));
  }

  private _init() {
    const queryList = this.query.trim().split(/\s*,\s*/g),
      onChange = this._onChange.bind(this);

    const mediaQueries = queryList.filter((q) => q.startsWith('@media')).join(',');
    if (mediaQueries.length) {
      this._mediaQueryList = window.matchMedia(mediaQueries);
      this._mediaQueryList.addEventListener('change', onChange);
      this._disposal.push(() => this._mediaQueryList!.removeEventListener('change', onChange));
    }

    const playerQueries = queryList.filter((q) => !q.startsWith('@media'));
    if (playerQueries.length) {
      const evaluation = this._buildQueryEval(playerQueries);

      const props = new Set<keyof MediaState>(),
        validProps = Object.keys(mediaState.record);
      for (const query of evaluation.matchAll(/\(([a-zA-Z]+)\s/g)) {
        if (validProps.includes(query[1])) {
          props.add(query[1] as keyof MediaState);
        }
      }

      if (props.size) {
        this._matches = computed(() => {
          let currentEval = evaluation;

          for (const prop of props) {
            const value = this._mediaStore[prop]();
            currentEval = currentEval.replace(prop, isString(value) ? `'${value}'` : value + '');
          }

          return eval(`!!(${currentEval})`);
        });

        this._disposal.push(
          effect(() => {
            this._matches();
            onChange();
          }),
        );
      }
    }
  }

  private _buildQueryEval(queryList: string[]) {
    return queryList
      .map(
        (query) =>
          '(' +
          query
            .replace(equalsRE, ' == ')
            .replace(notRE, '!')
            .replace(andRE, ' && ')
            .replace(orRE, ' || ')
            .replace(pxRE, '$1')
            .trim() +
          ')',
      )
      .join(' || ');
  }

  private _onChange() {
    this.dispatchEvent(new Event('change'));
  }

  destroy() {
    runAll(this._disposal, void 0);
    this._matches = signal(false);
    this._mediaQueryList = null;
  }
}

export interface PlayerQueryListEvents {
  change: PlayerQueryListChangeEvent;
}

export interface PlayerQueryListChangeEvent extends Omit<Event, 'target'> {
  target: PlayerQueryList;
}
