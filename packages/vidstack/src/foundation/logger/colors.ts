const LOCAL_STORAGE_KEY = '@vidstack/log-colors';

const savedColors = init();

export function getLogColor(key: string): string | undefined {
  return savedColors.get(key);
}

export function saveLogColor(key: string, { color = generateColor(), overwrite = false } = {}) {
  if (!__DEV__) return;
  if (!savedColors.has(key) || overwrite) {
    savedColors.set(key, color);
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(Object.entries(savedColors)));
  }
}

function generateColor() {
  return `hsl(${Math.random() * 360}, 55%, 70%)`;
}

function init(): Map<string, string> {
  if (!__DEV__) return new Map();

  let colors;

  try {
    colors = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY)!);
  } catch {
    // no-op
  }

  return new Map(Object.entries(colors ?? {}));
}
