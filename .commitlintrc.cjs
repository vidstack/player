const fs = require('fs');
const path = require('path');
const kleur = require('kleur');

const apps = fs.readdirSync(path.resolve(__dirname, 'apps'));
const packages = fs.readdirSync(path.resolve(__dirname, 'packages'));
const ignore = new Set(['.DS_Store']);
const validScopes = ['root', ...apps, ...packages].filter((scope) => !ignore.has(scope));

module.exports = {
  extends: ['@commitlint/config-conventional'],
  ignores: [(commit) => commit === ''],
  rules: {
    'vidstack-scope': [2, 'always'],
  },
  plugins: [
    {
      rules: {
        'vidstack-scope': ({ scope }) => {
          return [
            validScopes.includes(scope),
            [
              kleur.red(`Invalid commit scope: ${kleur.bold(`${scope}`)}`),
              `\n${kleur.bold('Valid scopes:')} ${kleur.cyan(validScopes.join(', '))}`,
              `\n${kleur.bold('Examples:')} ${[
                kleur.cyan('\n\n- chore(root): update `pnpm-lock.yaml`'),
                kleur.cyan('- feat(player): new play button element `vds-play-button`'),
                kleur.cyan('- fix(vidstack-io): missing title on markdown pages\n\n'),
              ].join('\n')}`,
            ].join('\n'),
          ];
        },
      },
    },
  ],
  helpUrl: 'https://github.com/vidstack/vidstack/.github/CONTRIBUTING.md',
};
