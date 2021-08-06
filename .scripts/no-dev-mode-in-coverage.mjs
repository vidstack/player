import fastGlob from 'fast-glob';
import { readFileSync } from 'fs';
import { dirname, resolve } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

const rootDir = resolve(__dirname, '../');

const files = fastGlob.sync('src/**/*.{js,ts}');

function printCodeFrame(file, lines, lineNo, length) {
  console.log('\n--------------------------------------------\n');

  console.log(`\x1b[4m${file}\x1b[0m\n`);

  const startLineNo = lineNo - length / 2 - 1;
  const endLineNo = lineNo + length / 2;

  for (let i = startLineNo; i <= endLineNo; i += 1) {
    if (i >= 0 && i < lines.length) {
      console.log(`${i === lineNo ? '' : '\x1b[2m'}${i}:`, lines[i], '\x1b[0m');
    }
  }

  console.log('\n');
}

files.forEach((file) => {
  const absPath = resolve(rootDir, file);
  const content = readFileSync(absPath).toString();
  const lines = content.split('\n');

  let errors = 0;

  lines.forEach((line, lineNo) => {
    const isDevModeStart = /DEV_MODE/.test(line) && !line.includes('import');

    if (
      isDevModeStart &&
      !/\/\* c8 ignore (start|next) \*\//.test(lines[lineNo - 1])
    ) {
      printCodeFrame(file, lines, lineNo, 10);
      errors += 1;
    }

    if (isDevModeStart && /\/\* c8 ignore start \*\//.test(lines[lineNo - 1])) {
      let lineCount = lineNo + 1;
      let foundStop = false;

      while (
        !foundStop &&
        lineCount < lines.length &&
        !/\/\* c8 ignore start \*\//.test(lines[lineCount])
      ) {
        if (/\/\* c8 ignore stop \*\//.test(lines[lineCount])) {
          foundStop = true;
        }

        lineCount += 1;
      }

      if (!foundStop) {
        printCodeFrame(file, lines, lineNo, 10);
        console.error(
          '\x1b[41mMissing corresponding `/* c8 ignore stop */` \x1b[0m'
        );
        errors += 1;
      }
    }
  });

  if (errors > 0) {
    console.error(
      '\n\x1b[41mThere are development lines (`DEV_MODE`) not excluded from test coverage.\x1b[0m'
    );

    process.exit(1);
  }
});

process.exit(0);
