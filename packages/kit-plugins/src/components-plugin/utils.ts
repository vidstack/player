import { kebabToTitleCase } from '@vidstack/foundation';
import { basename, dirname } from 'path';

const titleDict = {
  Hls: 'HLS',
  Youtube: 'YouTube',
};

function formatTitle(name: string) {
  return titleDict[name] ?? name;
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
