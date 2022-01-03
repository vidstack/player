# Contributing

First off, thank you for taking the time to contribute to Vidstack ❤️

## 💭 Knowledge

### TypeScript

It's important to note early on that this project is written with [TypeScript][typescript]. If
you're unfamiliar with it or any strongly typed languages such as Java then this may be a slight
roadblock. However, there's never a truly perfect time to start learning it, so ... why not today!

### LitElement

This project uses [lit-element][lit-element] to build [Web Components][web-components].

## 🎒 Getting Started

### Install

Let's setup our machine. The only software you'll need to install is:

- [node](https://nodejs.org/en/download)
- [git](https://git-scm.com/downloads)

They're very easy to install, just follow the links and you should be up and running in no time.

### Project Setup

**Working on your first Pull Request?** You can learn how from this free series
[How to Contribute to an Open Source Project on GitHub][pr-beginner-series].

Head over to the [repository][vds-elements] on GitHub and click the Fork button in the top
right corner. After the project has been forked, run the following commands in your terminal:

```bash
# Replace {github-username} with your GitHub username.
$: git clone https://github.com/{github-username}/elements vds-elements --depth=1

$: cd vds-elements

# Create a branch for your PR, replace {issue-no} with the GitHub issue number.
$: git checkout -b issue-{issue-no}
```

Now it'll help if we keep our `main` branch pointing at the original repository and make
pull requests from the forked branch.

```bash
# Add the original repository as a "remote" called "upstream".
$: git remote add upstream git@github.com:vidstack/elements.git

# Fetch the git information from the remote.
$: git fetch upstream

# Set your local main branch to use the upstream main branch whenver you run `git pull`.
$: git branch --set-upstream-to=upstream/main main

# Run this when we want to update our version of main.
$: git pull
```

## 🧪 Test

### Unit

For unit tests you can simply create a `*.test.ts` file next to the file you are testing and
run `npm run test` or `npm run test:watch` in the terminal. This project uses
[Web Test Runner][web-test-runner] for writing/running unit tests. To learn more about
writing unit tests follow the link to the Web Test Runner site, and see other tests in the project.

## ✍️ Commit

This project uses [semantic commit messages][semantic-commit-style] to automate package releases.
Simply refer to the link, and also see existing commits to get an idea of how to write your message.

```bash
# Add all changes to staging to be committed.
$: git add .

# Commit changes.
$: git commit -m 'your commit message'

# Push changes up to GitHub.
$: git push
```

## 🎉 Pull Request

When you're all done head over to the [repository][vds-elements], and click the big green
`Compare & Pull Request` button that should appear after you've pushed changes to your fork.

Don't expect your PR to be accepted immediately or even accepted at all. Give the community time to
vet it and see if it should be merged. Please don't be disheartened if it's not accepted. Your
contribution is appreciated more then you can imagine, and even a failed PR can teach us a lot ❤️

[typescript]: https://www.typescriptlang.org
[lit-element]: https://lit-element.polymer-project.org/guide
[web-components]: https://developer.mozilla.org/en-US/docs/Web/Web_Components
[web-test-runner]: https://modern-web.dev/docs/test-runner/overview
[vds-elements]: https://github.com/vidstack/elements
[semantic-commit-style]: https://gist.github.com/joshbuchea/6f47e86d2510bce28f8e7f42ae84c716
[pr-beginner-series]: https://app.egghead.io/courses/how-to-contribute-to-an-open-source-project-on-github
