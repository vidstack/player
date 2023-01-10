export function uppercaseFirstLetter(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export function lowercaseFirstLetter(str: string) {
  return str.charAt(0).toLowerCase() + str.slice(1);
}

export function kebabToTitleCase(str: string) {
  return uppercaseFirstLetter(str.replace(/-./g, (x) => ' ' + x[1].toUpperCase()));
}

export function camelToKebabCase(str: string) {
  return str.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
}

export function kebabToCamelCase(str: string) {
  return str.replace(/-./g, (x) => x[1].toUpperCase());
}

export function kebabToPascalCase(str: string) {
  return kebabToTitleCase(str).replace(/\s/g, '');
}

export function camelToTitleCase(str: string) {
  return uppercaseFirstLetter(str.replace(/([A-Z])/g, ' $1'));
}
