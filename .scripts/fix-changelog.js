import { writeFileSync } from 'fs';
import { readFileSync } from 'fs';
import { resolve } from 'path';

const filePath = resolve(process.cwd(), 'CHANGELOG.md');
const content = readFileSync(filePath).toString();
writeFileSync(filePath, content.replace(/\.com\/(.*?)\/vidstack/g, '.com/vidstack/vidstack'));
