const decodeMap = {
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

const decodeRE = /&(amp|#38|lt|#60|gt|#62|apos|#39|quot|#34);/g;

export function decodeHTML(html: string): string {
  return html.replace(decodeRE, (char) => decodeMap[char]);
}
