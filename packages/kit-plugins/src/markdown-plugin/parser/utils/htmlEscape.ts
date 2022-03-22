const htmlEscapeMap = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  "'": '&#39;',
  '"': '&quot;',
};

const htmlEscapeRegexp = /[&<>'"]/g;

export const htmlEscape = (str: string): string =>
  str.replace(htmlEscapeRegexp, (char) => htmlEscapeMap[char]);

const htmlUnescapeMap = {
  '&amp;': '&',
  '&#38;': '&',
  '&lt;': '<',
  '&#60;': '<',
  '&gt;': '>',
  '&#62;': '>',
  '&apos;': "'",
  '&#39;': "'",
  '&quot;': '"',
  '&#34;': '"',
};

const htmlUnescapeRegexp = /&(amp|#38|lt|#60|gt|#62|apos|#39|quot|#34);/g;

export const htmlUnescape = (str: string): string =>
  str.replace(htmlUnescapeRegexp, (char) => htmlUnescapeMap[char]);

const TEMPLATE_TAG_RE =
  /(\{#(if|each|await|key).*\})|(\{:(else|then|catch).*\})|(\{\/(if|each|key|await)\})|(\{@(html|debug).*\})/gim;
export function commentOutTemplateTags(source: string) {
  return source.replace(TEMPLATE_TAG_RE, (match) => {
    return `<!--&%& ${match} &%&-->`;
  });
}

const TEMPLATE_TAG_COMMENT_RE = /(<!--&%&\s)|(\s&%&-->)/gim;
export function uncommentTemplateTags(source: string) {
  return source.replace(TEMPLATE_TAG_COMMENT_RE, '');
}
