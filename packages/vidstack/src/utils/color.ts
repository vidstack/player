export function hexToRgb(hex: string) {
  const { style } = new Option();
  style.color = hex;
  return style.color.match(/\((.*?)\)/)![1].replace(/,/g, ' ');
}
