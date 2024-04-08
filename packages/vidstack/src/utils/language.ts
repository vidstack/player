/**
 * Gets the language name corresponding to the provided language code.
 *
 * @param {string} langCode - The language code (e.g.,"en", "en-us", "es-es", "fr-fr").
 * @returns {string} The localized language name based on the user's preferred languages,
 *                   or `null` if the language code is not recognized.
 */
export function getLangName(langCode: string) {
  try {
    const displayNames = new Intl.DisplayNames(navigator.languages, { type: 'language' });
    const languageName = displayNames.of(langCode);
    return languageName ?? null;
  } catch (err) {
    return null;
  }
}
