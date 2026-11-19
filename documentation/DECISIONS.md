# Decisions

- [Rules, and how they are read](#rules-and-how-they-are-read)
- [Requirements, and how they are read](#requirements-and-how-they-are-read)
- [Code and files](#code-and-files)
- [Tests](#tests)
- [Documents](#documents)

The decisions recorded in the development log in [DEVLOG/](DEVLOG/DEVLOG1.md), by subject (Rule 23). Each ends with the
day it was made, and the time where the log has one, as a link to its entry in the log. Where a later decision replaced
an earlier one, the earlier one is named after it, with its own link.

## Rules, and how they are read

- **Rules 10 and 11 are tested.** Tests 37 and 38 check every code file, as Rule 25 allows a test to cover a rule.
  Replaced: no tests of rules.
  [2026-11-19 12:14:26](DEVLOG/DEVLOG1.md#121426-the-terminal-counts-a-repositorys-lines-of-code)
  [2026-11-19 12:21:50](DEVLOG/DEVLOG1.md#122150-rules-10-and-11-tested-and-standard-files-outside-rule-14)
- **Standard files.** Left out of Rule 14's count in every folder: the files that tools and GitHub look for by name,
  listed in `standard_files` in `check-rules.sh`.
  [2026-11-19 12:21:50](DEVLOG/DEVLOG1.md#122150-rules-10-and-11-tested-and-standard-files-outside-rule-14)

## Requirements, and how they are read

- **A progress line for ls.** `/ counting repositories...`, turning as during a count.
  [2026-11-19 13:24:29](DEVLOG/DEVLOG1.md#132429-a-progress-line-while-ls-waits)
- **The ls command.** `ls {user}` lists a user's or organisation's public repositories, forks left out, one
  `owner/name` a line in the order of their names; every page of 100 is read.
  [2026-11-19 13:13:59](DEVLOG/DEVLOG1.md#131359-the-ls-command-lists-a-users-repositories)
- **Errors of ls.** `error: no such GitHub user` for a 404, `no public repositories` for none, and how to use it for
  `ls` without one name of letters, digits and hyphens.
  [2026-11-19 13:13:59](DEVLOG/DEVLOG1.md#131359-the-ls-command-lists-a-users-repositories)
- **The first two lines of ls.** `{user} has {n} public source repositories.`, `repository` when n is 1, then 40
  dashes. "source" is kept, as in the format given; a source is a repository that is not a fork.
  [2026-11-19 13:41:59](DEVLOG/DEVLOG1.md#134159-ls-says-how-many-public-source-repositories-a-user-has)
  Requirements 50 to 52. [2026-11-19 13:45:46](DEVLOG/DEVLOG1.md#134546-the-first-two-lines-of-ls-have-their-requirements)
- **ls of a user with none.** The two lines, with 0, then `no public repositories`, as Requirement 47 still asks.
  [2026-11-19 13:41:59](DEVLOG/DEVLOG1.md#134159-ls-says-how-many-public-source-repositories-a-user-has)
- **The default branch is `HEAD`.** The file list is asked for at `git/trees/HEAD?recursive=1`: one API call a count.
  [2026-11-19 12:14:26](DEVLOG/DEVLOG1.md#121426-the-terminal-counts-a-repositorys-lines-of-code)
- **The excluded extensions.** Those Linguist gives both to a programming language and to prose: `.asc`, `.fr`, `.md`,
  `.nb`, `.ncl`, `.scd` (Requirement 21).
  [2026-11-19 12:14:26](DEVLOG/DEVLOG1.md#121426-the-terminal-counts-a-repositorys-lines-of-code)
- **The result line.** `12.3 KLOC · 214 files · 12347 lines`, no thousands separator, always "files" and "lines".
  [2026-11-19 12:14:26](DEVLOG/DEVLOG1.md#121426-the-terminal-counts-a-repositorys-lines-of-code)
- **The rate-limit error.** The text of Requirement 38 alone, with no time of reset.
  [2026-11-19 12:14:26](DEVLOG/DEVLOG1.md#121426-the-terminal-counts-a-repositorys-lines-of-code)
- **An empty repository.** It gives `0.0 KLOC · 0 files · 0 lines`.
  [2026-11-19 12:14:26](DEVLOG/DEVLOG1.md#121426-the-terminal-counts-a-repositorys-lines-of-code)
- **Other input.** Input that is neither a link nor a command gives `error: not a valid link`.
  [2026-11-19 12:14:26](DEVLOG/DEVLOG1.md#121426-the-terminal-counts-a-repositorys-lines-of-code)
- **150 ms.** The turning character changes on a 150 ms interval, `FRAME_MS`, tested with mocked timers. Replaced:
  300 ms. [2026-11-19 12:14:26](DEVLOG/DEVLOG1.md#121426-the-terminal-counts-a-repositorys-lines-of-code)
  [2026-11-19 13:28:43](DEVLOG/DEVLOG1.md#132843-the-progress-line-turns-twice-as-fast-with-a-longer-dash)
- **Accessibility later.** Accessibility is left for later; `.github/ACCESSIBILITY.md` stays as the template left it.
  [2026-11-19 12:14:26](DEVLOG/DEVLOG1.md#121426-the-terminal-counts-a-repositorys-lines-of-code)
- **`{owner}/{repo}` alone.** Without a scheme, a first part with no dot is an owner and `github.com/` goes before it;
  a first part with a dot is a host. With a scheme, nothing goes before it.
  [2026-11-19 13:00:41](DEVLOG/DEVLOG1.md#130041-ownerrepo-alone-accepted)
- **Links without a scheme.** `github.com/...`, `http://` and `www.github.com` are accepted; other hosts are not.
  [2026-11-19 11:50:52](DEVLOG/DEVLOG1.md#115052-packagejson-added-and-the-progress-line-decided)
- **A file that fails to fetch.** Retried once, then left out, with the warning of a partial count.
  [2026-11-19 11:50:52](DEVLOG/DEVLOG1.md#115052-packagejson-added-and-the-progress-line-decided)
- **The progress line.** `/ counting lines... (done/total files)`, its first character turning through `/`, `─`, `\`,
  `|` every 150 ms; done is the files read, total the files to read. `─` is U+2500, a line for terminals, which fills
  its cell in a monospace font. Replaced: `-`, every 300 ms.
  [2026-11-19 11:50:52](DEVLOG/DEVLOG1.md#115052-packagejson-added-and-the-progress-line-decided)
  [2026-11-19 13:28:43](DEVLOG/DEVLOG1.md#132843-the-progress-line-turns-twice-as-fast-with-a-longer-dash)
- **No code files is no error.** Such a repository gives `0.0 KLOC · 0 files · 0 lines`.
  [2026-11-19 11:50:52](DEVLOG/DEVLOG1.md#115052-packagejson-added-and-the-progress-line-decided)
- **No token.** GitHub's API is called without a token, within its 60 calls an hour.
  [2026-11-19 11:45:08](DEVLOG/DEVLOG1.md#114508-how-the-repository-is-read-and-shown-decided)
- **Any link into a repository is accepted.** Everything after `{owner}/{repo}` is stripped; the default branch is
  counted.
  [2026-11-19 11:45:08](DEVLOG/DEVLOG1.md#114508-how-the-repository-is-read-and-shown-decided)
- **The command line.** A page that looks like a terminal, with `help`, `clear` and input history on the arrow keys.
  [2026-11-19 11:45:08](DEVLOG/DEVLOG1.md#114508-how-the-repository-is-read-and-shown-decided)
- **A cut-short file list is counted.** What is listed is counted, with a warning that the count is partial.
  [2026-11-19 11:45:08](DEVLOG/DEVLOG1.md#114508-how-the-repository-is-read-and-shown-decided)
- **A 404 is one error.** "Not a public repository, or no such repository".
  [2026-11-19 11:45:08](DEVLOG/DEVLOG1.md#114508-how-the-repository-is-read-and-shown-decided)
- **One decimal.** The KLOC is shown with one decimal.
  [2026-11-19 11:45:08](DEVLOG/DEVLOG1.md#114508-how-the-repository-is-read-and-shown-decided)
- **The code extensions.** Those of the programming languages in GitHub Linguist's `languages.yml`, in a file of
  their own.
  [2026-11-19 11:45:08](DEVLOG/DEVLOG1.md#114508-how-the-repository-is-read-and-shown-decided)
- **A line of code is neither blank nor only a comment** (Requirement 22). Replaced: comments counted.
  [2026-11-19 11:40:28](DEVLOG/DEVLOG1.md#114028-the-project-set-up-from-the-template)
  [2026-11-19 12:46:59](DEVLOG/DEVLOG1.md#124659-html-and-css-counted-and-comment-lines-left-out)
- **Comments of the common languages.** Recognised through the comment styles of `src/data/comments.json`; in other
  languages, comments are counted.
  [2026-11-19 12:46:59](DEVLOG/DEVLOG1.md#124659-html-and-css-counted-and-comment-lines-left-out)
- **Only code files are counted.** A file counts when its extension is that of a programming language, or `.html` or
  `.css`, the included extensions (Requirement 21). Replaced: programming languages only.
  [2026-11-19 11:40:28](DEVLOG/DEVLOG1.md#114028-the-project-set-up-from-the-template)
  [2026-11-19 12:46:59](DEVLOG/DEVLOG1.md#124659-html-and-css-counted-and-comment-lines-left-out)
- **The output.** The KLOC, the number of files counted and the exact number of lines.
  [2026-11-19 11:40:28](DEVLOG/DEVLOG1.md#114028-the-project-set-up-from-the-template)

## Code and files

- **One place for GitHub's errors.** `parsed` in `github.js` turns every answer that is not ok into a `GitHubError`.
  [2026-11-19 13:13:59](DEVLOG/DEVLOG1.md#131359-the-ls-command-lists-a-users-repositories)
- **One place for being busy.** `whileBusy` in `session.js` marks the terminal busy, shows a progress line until
  the work is done, and shows the lines after; a count and `ls` pass only how their line reads.
  [2026-11-19 13:13:59](DEVLOG/DEVLOG1.md#131359-the-ls-command-lists-a-users-repositories)
  [2026-11-19 13:24:29](DEVLOG/DEVLOG1.md#132429-a-progress-line-while-ls-waits)
- **A snapshot of the code extensions.** `src/data/extensions.json`, remade by `npm run update-extensions` from
  Linguist, plus `included-extensions.json` and less `excluded-extensions.json`, both in `.github/scripts/`; not read
  from Linguist at each count.
  [2026-11-19 12:14:26](DEVLOG/DEVLOG1.md#121426-the-terminal-counts-a-repositorys-lines-of-code)
  [2026-11-19 12:46:59](DEVLOG/DEVLOG1.md#124659-html-and-css-counted-and-comment-lines-left-out)
- **Data in `src/data/`.** The JSON files the code reads, `extensions.json` and `comments.json`, keep `src/` to 7 files.
  [2026-11-19 12:46:59](DEVLOG/DEVLOG1.md#124659-html-and-css-counted-and-comment-lines-left-out)
- **No dependencies.** The code and the tests use only what browsers and Node.js 22 have (Rule 27).
  [2026-11-19 12:14:26](DEVLOG/DEVLOG1.md#121426-the-terminal-counts-a-repositorys-lines-of-code)
- **`index.html` in the main folder.** GitHub Pages serves the main folder of the default branch, with no workflow.
  [2026-11-19 12:14:26](DEVLOG/DEVLOG1.md#121426-the-terminal-counts-a-repositorys-lines-of-code)
- **Plain functions, a thin page.** All behaviour is in `src/session.js` and the modules it uses; `src/main.js` only
  draws and passes keys, and is checked by hand.
  [2026-11-19 12:14:26](DEVLOG/DEVLOG1.md#121426-the-terminal-counts-a-repositorys-lines-of-code)
- **package.json and package-lock.json are committed.** With no dependencies, so that `npm ci` works.
  [2026-11-19 11:50:52](DEVLOG/DEVLOG1.md#115052-packagejson-added-and-the-progress-line-decided)
- **The stack.** Plain JavaScript modules, no build step, `node --test` on Node 22, published with GitHub Pages.
  [2026-11-19 11:45:08](DEVLOG/DEVLOG1.md#114508-how-the-repository-is-read-and-shown-decided)
- **`npm ci` only.** Packages are installed with `npm ci`, never `npm install`.
  [2026-11-19 11:45:08](DEVLOG/DEVLOG1.md#114508-how-the-repository-is-read-and-shown-decided)

## Tests

- **Code files are named once.** The rule tests take the code files from `code_pattern` in `check-rules.sh`.
  [2026-11-19 12:21:50](DEVLOG/DEVLOG1.md#122150-rules-10-and-11-tested-and-standard-files-outside-rule-14)
- **A fake GitHub.** The tests call `src/` with `fakeGitHub` from `tests/fake-github.js`, never the real GitHub.
  [2026-11-19 12:14:26](DEVLOG/DEVLOG1.md#121426-the-terminal-counts-a-repositorys-lines-of-code)
## Documents

- **The name is Repo KLOC Counter.** The repository is cnordenb/repo-kloc-counter.
  [2026-11-19 11:40:28](DEVLOG/DEVLOG1.md#114028-the-project-set-up-from-the-template)

