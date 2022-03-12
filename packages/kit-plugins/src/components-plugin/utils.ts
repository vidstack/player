import { kebabToTitleCase } from '@vidstack/foundation';
import { basename, dirname } from 'path';

function formatTitle(name: string) {
  if (name === 'Hls') return 'HLS';
  if (name === 'Youtube') return 'YouTube';
  return name;
}

export function getComponentNameFromId(filePath: string) {
  const baseTagName = basename(dirname(filePath.replace(/\/react/, '')));
  const tagName = `vds-${baseTagName}`;
  const name = kebabToTitleCase(baseTagName);
  return {
    baseTagName,
    tagName,
    name,
    title: formatTitle(name),
  };
}
