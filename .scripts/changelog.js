import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const changeLogPath = path.resolve(__dirname, '../CHANGELOG.md');
const content = fs.readFileSync(changeLogPath, 'utf-8');

fs.writeFileSync(
  changeLogPath,
  content.replace(/github.com\/mihar-22\/(vidstack|player)/g, 'github.com/vidstack/vidstack'),
);
