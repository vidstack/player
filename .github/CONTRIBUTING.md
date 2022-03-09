# Contributing

First off, thank you for taking the time to contribute to Vidstack ❤️

## 💭 Knowledge

- Code is written in [TypeScript][typescript].
- We use [Lit][lit] to build [Web Components][web-components].
- Story files (visual testing) are written using [Svelte][svelte].

## 🎒 Getting Started

### Install

Let's setup our machine. The only software you'll need to install is:

- [node](https://nodejs.org/en/download)
- [git](https://git-scm.com/downloads)
- [volta](https://docs.volta.sh/guide) or [nvm](https://github.com/nvm-sh/nvm) (we recommend volta)

They're very easy to install, just follow the links and you should be up and running in no time.

### Fork & Clone

Next, head over to the [Player repository on GitHub][vds-player] and click the `Fork` button in the
top right corner. After the project has been forked, run the following commands in your terminal...

```bash
# Replace {github-username} with your GitHub username.
$: git clone https://github.com/{github-username}/player vds-player --depth=1

$: cd vds-player

$: npm install
```

**OPTIONAL:** Now it'll help if we keep our `main` branch pointing at the original repository and
make pull requests from the forked branch.

```bash
# Add the original repository as a "remote" called "upstream".
$: git remote add upstream git@github.com:vidstack/player.git

# Fetch the git information from the remote.
$: git fetch upstream

# Set your local main branch to use the upstream main branch whenver you run `git pull`.
$: git branch --set-upstream-to=upstream/main main

# Run this when we want to update our version of main.
$: git pull
```

### Node

Once you're done, set your Node version to match the required version by the repo. If you've
installed `volta` then it will automatically pin it, and if you're using `nvm` simply run `nvm use`
from the project root.

## 🧪 Testing

### Unit

For unit tests, you can create a `*.test.ts` file, and run `npm run test` or
`npm run test:watch` in the terminal. This project uses [Vitest][vitest] for writing/running
unit tests. To learn more about writing unit tests, follow the link to the Vitest site,
and see other tests in the repo.

### Visual

We currently use [Vitebook][vitebook] (Storybook alternative) for visual testing. You can
run `npm run vitebook:dev` to launch the development environment. Refer to other story files
(`.story.svelte`) in the repo to learn how to create one.

## ✍️ Commit

This project uses [semantic commit messages][semantic-commit-style] to automate package releases.
Simply refer to the link, and check out existing commits to get an idea of how to write your message.

```bash
# Add all changes to staging to be committed.
$: git add .

# Commit changes.
$: git commit -m '(fix|feat): your commit message'

# Push changes up to GitHub.
$: git push
```

## 🎉 Pull Request

When you're all done, head over to the [repository][vds-player] and click the big green
`Compare & Pull Request` button. This will appear after you've pushed changes to your fork.

Don't expect your PR to be accepted immediately, or accepted at all. Give the community time to
vet it and see if it should be merged. Please don't be disheartened if it's not accepted. Your
contribution is appreciated more then you can imagine, and even a failed PR can teach us a lot ❤️

[typescript]: https://www.typescriptlang.org
[lit]: https://lit.dev
[web-components]: https://developer.mozilla.org/en-US/docs/Web/Web_Components
[vitest]: https://vitest.dev
[vitebook]: https://github.com/vitebook/vitebook
[vds-player]: https://github.com/vidstack/player
[semantic-commit-style]: https://gist.github.com/joshbuchea/6f47e86d2510bce28f8e7f42ae84c716
[pr-beginner-series]: https://app.egghead.io/courses/how-to-contribute-to-an-open-source-project-on-github
[svelte]: https://svelte.dev
