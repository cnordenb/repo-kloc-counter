[![GitHub last commit](https://img.shields.io/github/last-commit/cnordenb/repo-kloc-counter)](#)
[![language](https://img.shields.io/badge/language-JavaScript-FFFF00)](#)
[![license](https://img.shields.io/badge/license-MIT-007FFF)](LICENSE)
[![testing](https://img.shields.io/badge/testing-yes-C3FF00)](documentation/TESTS.md)
[![maintainable](https://img.shields.io/badge/maintainable-yes-00FF72)](documentation/MAINTAINER.md)

# Repo KLOC Counter

## Description

A static, client-side web app with a command-line interface that counts the KLOC (thousands of lines of code) of a public GitHub repository from its link.

## Usage

Open [cnordenb.github.io/repo-kloc-counter](https://cnordenb.github.io/repo-kloc-counter/), paste the link of a public
GitHub repository at the prompt, or just its owner and name such as `tj/commander.js`, and press Enter:

```
> https://github.com/tj/commander.js
15.5 KLOC · 171 files · 15506 lines
```

A line of code is a line that is neither blank nor only a comment, in an `.html` or `.css` file or a file whose
extension belongs to a programming language in
[GitHub Linguist](https://github.com/github-linguist/linguist/blob/main/lib/linguist/languages.yml). Comments are
recognised in the common languages; in the others they are counted. `ls cnordenb` lists the public repositories of
a user, forks left out. Type `help` for
the commands. Without a token, GitHub allows 60 counts an hour from one address.

## Contributing

Anyone is welcome to open an [issue](https://github.com/cnordenb/repo-kloc-counter/issues) to submit a bug report or suggest a new feature. Alternatively, you may fork or copy the repository and take it in any direction you wish.

If you wish to contribute work into this repository, please consult [CONTRIBUTING.md](.github/CONTRIBUTING.md) before any commits or pull requests.

## Maintaining

To keep Repo KLOC Counter working and up to date, see [MAINTAINER.md](documentation/MAINTAINER.md).

## Acknowledgements

Development of Repo KLOC Counter was accelerated with Claude Opus 5.5.
