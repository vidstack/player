import { IS_CLIENT } from '../../utils/support';
import { isUndefined } from '../../utils/unit';

const LOCAL_STORAGE_KEY = '@vidstack/log-colors';

const colors = getSavedColors();

function getSavedColors(): Map<string, string> {
  if (IS_CLIENT && !isUndefined(window.localStorage)) {
    let colors = {};

    try {
      colors = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY) ?? '');
    } catch {
      // no-op
    }

    return new Map(Object.entries(colors));
  }

  return new Map();
}

export function getColor(key: string): string | undefined {
  return colors.get(key);
}

export function saveColor(
  key: string,
  { color = generateColor(), overwrite = false } = {}
) {
  if (!colors.has(key) || overwrite) {
    colors.set(key, color);
    saveColors();
  }
}

function generateColor() {
  return `hsl(${Math.random() * 360}, 55%, 70%)`;
}

function saveColors() {
  if (IS_CLIENT && !isUndefined(window.localStorage)) {
    const map = {};

    colors.forEach(function (value, key) {
      map[key] = value;
    });

    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(map));
  }
}
