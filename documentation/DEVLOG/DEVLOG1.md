# Development log, part 1

Part 1 of the development log. The decisions made in the log are listed in [DECISIONS.md](../DECISIONS.md).

- [2026-11-19](#2026-11-19)

## 2026-11-19

### 11:40:28: the project set up from the template

#### What changed

- **Purpose.** Repo KLOC Counter is a static web page, JavaScript only and run in the browser, whose interface is a
  command line. Given the link of a public GitHub repository, such as `https://github.com/cnordenb/repo-kloc-counter`,
  it shows the repository's KLOC. The errors it must report are: not a valid link, GitHub's hourly rate limit
  exceeded, and not a public repository.
- **Placeholders.** `PROJECT_NAME` became Repo KLOC Counter, `PROJECT_DESCRIPTION` the sentence in `README.md`
  and `AGENTS.md`, `GITHUB_OWNER` cnordenb, `REPO_NAME` repo-kloc-counter, `CHIEF_DEVELOPER` Carl
  Nordenbrink and `AI_MODEL` Claude Opus 5.5, in `README.md`, `AGENTS.md`, `RULES.md`, `MAINTAINER.md`,
  `TESTS.md` and the issue forms. `LICENSE` already held the year 2026 and the name.
- **README.md.** The template's note was deleted.
- **Counting.** It was settled how the KLOC is counted: a line of code is a line with something other than
  whitespace, comments included; only files whose extension is that of a programming language are counted; the
  output gives the KLOC, the number of files counted and the exact number of lines.
- **Tests.** None yet: there is no code.
- **Checked.** `bash .github/scripts/check-rules.sh` was run; it passed and listed the placeholders left.
- **Documents.** `README.md`, `AGENTS.md`, `RULES.md`, `MAINTAINER.md`, `TESTS.md`, the issue forms, `DECISIONS.md`.

#### Not done

- `REQUIREMENTS.md` is still to be written by the chief developer (Rule 2); the counting settled above belongs there.
- Placeholders left: `STACK`, `TEST_COMMAND`, `LANGUAGE`, `USAGE`, `MAINTENANCE_TASK`,
  `MAINTENANCE_TASK_ANCHOR`, `MAINTENANCE_STEPS`, `CODE_OVERVIEW` and `SECURITY_CONTACT`.
- No code was written.

#### Questions

1. **How GitHub is read.** Proposal: one call to `api.github.com/repos/{owner}/{repo}` for the default branch and
   whether the repository is public, one to the Git trees API with `recursive=1` for the list of files, and each
   counted file fetched from `raw.githubusercontent.com`, which is not counted against the API's limit of 60 calls an
   hour. A count would then cost 2 API calls. Should the user also be able to give a token, for 5000 calls an hour?
2. **Accepted links.** Proposal: `https://github.com/{owner}/{repo}` only, with an optional trailing `/` or `.git`;
   links to a branch, a folder or a file (`/tree/...`, `/blob/...`) are not valid links. The default branch is counted.
3. **The command line.** Proposal: a page that looks like a terminal, with a prompt where a link is typed and Enter
   pressed, and the commands `help` and `clear`, with earlier input recalled by the arrow keys.
4. **Large repositories.** GitHub cuts the file list short above 100 000 files. Proposal: count what is listed and
   say that the count is partial. Should a progress line show while files are fetched?
5. **Not public.** GitHub answers 404 both for a private repository and for one that does not exist. Proposal: one
   error, "not a public repository, or no such repository".
6. **The stack.** Proposal: plain JavaScript modules with no dependencies and no build step, tested with Node's own
   `node --test`, published with GitHub Pages from this repository.
7. **The KLOC shown.** Proposal: two decimals, such as `12.35 KLOC`, then the files and the lines.
8. **The list of extensions.** Proposal: the programming languages of GitHub Linguist, kept in one file of its own.

### 11:45:08: how the repository is read and shown, decided

#### What changed

- **Answers.** Of the questions of 11:40:28, in [the project set up from the template](#114028-the-project-set-up-from-the-template):
  - no token: the API is called without one, within its 60 calls an hour (1);
  - any link into a repository is accepted, and everything after `{owner}/{repo}` is stripped, so that the link
    becomes the link of the repository's root; the default branch is counted (2);
  - the command line is a page that looks like a terminal, with `help`, `clear` and earlier input recalled by the
    arrow keys (3);
  - when GitHub cuts the file list short, what is listed is counted and a warning says the count is partial (4);
  - a 404 gives one error, "not a public repository, or no such repository" (5);
  - plain JavaScript modules, no build step, tested with `node --test` on Node 22 and published with GitHub Pages;
    packages are installed with `npm ci` only, never `npm install` (6, 8);
  - the KLOC is shown with one decimal (7);
  - the code extensions are those of the programming languages in GitHub Linguist's `languages.yml`, kept in a file
    of their own (8).
- **Documents.** `DECISIONS.md`.

#### Not done

- `REQUIREMENTS.md` is still to be written by the chief developer (Rule 2); these answers belong there.
- No code was written.

#### Questions

1. **`npm ci` without dependencies.** `npm ci` needs a `package.json` and a `package-lock.json`, even with no
   dependencies. Proposal: both are committed, with no dependencies, so that CI runs `npm ci` then `npm test`.
2. **Links without a scheme.** Should `github.com/{owner}/{repo}` and `www.github.com/...` be accepted too?
   Proposal: yes, and `http://`; any other host is not a valid link.
3. **Files that fail to fetch.** Proposal: a file that cannot be fetched after one retry is left out, and the warning
   of a partial count is shown, as when the list is cut short.
4. **Progress.** Proposal: one line that updates while files are fetched, such as `fetched 120 of 214 files`.
5. **No code files.** Proposal: a repository with no code files gives `0.0 KLOC · 0 files · 0 lines`, not an error.

### 11:50:52: `package.json` added, and the progress line decided

#### What changed

- **Answers.** Of the questions of 11:45:08, in
  [how the repository is read and shown, decided](#114508-how-the-repository-is-read-and-shown-decided):
  - `package.json` and `package-lock.json` are committed with no dependencies, so that `npm ci` works (1);
  - links without a scheme, with `http://` and with `www.github.com` are accepted; any other host is not a valid
    link (2);
  - a file that cannot be fetched after one retry is left out, and the warning of a partial count is shown (3);
  - while files are read, one line shows `/ counting lines... (done/total files)`, such as `(3/12 files)`: the first
    character turns through `/`, `-`, `\`, `|` and round again, one step every 300 ms; done is the number of files
    read, total the number of files to read (4);
  - a repository with no code files gives `0.0 KLOC · 0 files · 0 lines`, not an error (5).
- **package.json.** Private, `"type": "module"`, Node 22 or later, and `npm test` runs `node --test`.
- **package-lock.json.** Written by hand for no dependencies, lockfile version 3, as `npm install` is not used.
- **.gitignore.** `node_modules/` added.
- **Checked.** `npm ci` ran on Node 26.13.0 and npm 10.2.3 and installed nothing, as there is nothing to install.
  `bash .github/scripts/check-rules.sh` passed.
- **Documents.** `DECISIONS.md`.

#### Not done

- `REQUIREMENTS.md` is still to be written by the chief developer (Rule 2); these answers belong there.
- `checks.yml` does not yet run `npm ci` and `npm test`, and the stack and test command placeholders are left: both
  wait for the first code.
- No code was written.

#### Questions

1. **Room in the main folder.** It now holds 8 files, the most Rule 14 allows. Proposal: the page and its scripts go
   in `site/`, the tests in `tests/`, and GitHub Pages publishes `site/` through a workflow.

### 12:14:26: the terminal counts a repository's lines of code

#### What changed

- **Answers.** Of the question of 11:50:52, in
  [`package.json` added, and the progress line decided](#115052-packagejson-added-and-the-progress-line-decided):
  `index.html` stays in the main folder, so that GitHub Pages serves the main folder of the default branch with no
  workflow of its own, and Rule 14 is to allow it (1). Of the choices put before the code was written: the code
  extensions are a snapshot in `src/extensions.json`, remade by a script, not read from Linguist at each count;
  extensions that Linguist also gives to prose are excluded, as Requirement 21 now allows; there are no dependencies,
  as `npm install` is forbidden (Rule 27); accessibility is left for later; the result is
  `12.3 KLOC · 214 files · 12347 lines`, with no thousands separator; the error for the rate limit is the text of
  Requirement 38 alone; an empty repository gives `0.0 KLOC · 0 files · 0 lines`, and input that is neither a link
  nor a command gives `error: not a valid link`; the 300 ms of Requirement 28 is a 300 ms interval, tested with
  mocked timers.
- **index.html.** The page: an output area above a prompt marked `>`, in a terminal's colours, which loads
  `src/main.js` as a module.
- **src/.** `main.js` draws the terminal and passes Enter and the up and down arrows to the session in `session.js`,
  which holds the lines, the history and the commands `help` and `clear`, and runs a count with its progress line.
  `link.js` turns a link into owner and repository. `github.js` asks GitHub for the file list of `HEAD`, the default
  branch, in one API call, and reads each file from `raw.githubusercontent.com`, which the limit of 60 calls an hour
  does not cover, trying twice. `count.js` keeps the code files and counts their lines of code, eight files at a time.
  `output.js` holds every text the terminal shows.
- **Code extensions.** `.github/scripts/update-extensions.js`, run as `npm run update-extensions`, writes the 982
  extensions of Linguist's 573 programming languages, less the excluded ones, to `src/extensions.json`: 976 now.
  `.github/scripts/excluded-extensions.json` excludes `.asc`, `.fr`, `.md`, `.nb`, `.ncl` and `.scd`, the 6
  extensions that Linguist gives both to a programming language and to prose. 61 extensions are shared with data or
  markup too, among them `.ts` and `.rs`; those are counted.
- **Rules.** `check-rules.sh` now measures `.js` and `.html` files as code. `checks.yml` installs Node.js 22 and runs
  `npm ci && npm test`.
- **Tests.** 36, up from 0: Tests 1 to 10 in `tests/counting.test.js`, 11 to 18 in `tests/links.test.js` and 19 to
  36 in `tests/terminal.test.js`, all against `fakeGitHub` in `tests/fake-github.js`. Requirements 1, 2, 3, 5 and 6
  have no test: they are about the page in a browser and its publishing, and are checked by hand.
- **Checked.** All 36 tests passed. Mutation testing changed the code at 60 places; the tests failed for 53 of them.
  Of the 6 left, 3 do not change behaviour (`??` made `||`, and a start value that is always overwritten), and 3
  change what no requirement covers: input during a count, and the numbers on the progress line before GitHub's list
  arrives; Rule 25 allows no test for them. One place, in `main.js`, is not run by the tests. The CRAP score of every
  function is under 10, and no code is written twice. The page was run in a headless Brave against GitHub: `help`, a
  `gitlab.com` link, `octocat/Hello-World` (no code files), a missing repository and the arrows gave what the
  requirements say, and `tj/commander.js` gave `18.4 KLOC · 171 files · 18385 lines`, the same number of lines as a
  count of a clone of it with `grep`.
- **Documents.** `README.md`: usage and the language badge. `AGENTS.md`: stack and test command. `MAINTAINER.md`:
  first chapter "Update the list of code extensions", the files, a diagram, how a count works, trying the page, the
  tests. `TESTS.md`: Tests 1 to 36. `TERMINOLOGY.md`: repository, link, valid link, default branch, code extension,
  excluded extension, code file, line of code, KLOC, count, partial count, terminal, prompt, command, history,
  progress line, result, session. `DECISIONS.md`.

#### Not done

- `check-rules.sh` fails Rule 14: the main folder holds 9 files, and `RULES.md` as it is on disk still allows 8.
- GitHub Pages is not turned on; the page is not published.
- No test of a rule, such as Rule 10 or Rule 11, was written; see Question 1.
- Accessibility was not looked at: `.github/ACCESSIBILITY.md` is not filled in.
- The page was not tried on a phone, nor in Firefox or Safari, which need versions from 2025 or later for the JSON
  import in `count.js`.
- An empty repository was not tried against the real GitHub; its 409 answer is taken from GitHub's documentation.
- The `SECURITY_CONTACT` placeholder is left, for before the first release.

#### Questions

1. **Tests of rules.** Rule 5 allows a test for "rule compliance"; Rule 25 allows a test only for a requirement or a
   bug found before. Tests of Rule 10 (no comments) and Rule 11 (no function over 60 lines) would need such tests.
   Proposal: Rule 25 is the stricter, so none are written, and the tools of `ub-mode` check what they can.

### 12:21:50: Rules 10 and 11 tested, and standard files outside Rule 14

#### What changed

- **Answers.** Of the question of 12:14:26, in
  [the terminal counts a repository's lines of code](#121426-the-terminal-counts-a-repositorys-lines-of-code): Rule 25
  now allows a test to cover a rule, so Rules 10 and 11 are tested (1).
- **Rules.** Rule 14 now leaves standard files, such as `CLAUDE.md`, `README.md` and `package.json`, out of the count.
  Rule 25 now reads "a requirement/rule".
- **Correction.** The section of 12:14:26 gave Rule 14 as failing under Not done. That came from reading only the
  first line of Rule 14, whose second line already left standard files out; the main folder keeps to the rule.
- **check-rules.sh.** `standard_files` names the standard files, which `check_folders` leaves out of every folder's
  count: `.gitattributes`, `.gitignore`, `AGENTS.md`, `CLAUDE.md`, `LICENSE`, `README.md`, `package.json`,
  `package-lock.json`, and the files GitHub looks for by name, `CODE_OF_CONDUCT.md`, `CONTRIBUTING.md`, `FUNDING.yml`,
  `PULL_REQUEST_TEMPLATE.md`, `SECURITY.md`, and `SKILL.md`. The main folder now counts 1 file, `index.html`.
- **Rule 10.** Test 37 found comments in `.github/FUNDING.yml`, left from the template: a heading line and one
  "Replace with ..." after each key. They were taken out; the keys stay, empty, so no funding is shown.
- **Rule 11.** Test 38 found `createSession` in `src/session.js` at 62 lines of code. The count and its progress line
  were moved out of it, into `count` and `startProgress`; the terminal works as before.
- **Tests.** 38, up from 36: Test 37 (no comments) and Test 38 (no function over 60 lines of code), in
  `tests/verify-rules.test.js`, named so that Node, which runs the test files in the order of their names, runs it last.
  Both take the code files from `code_pattern` in `check-rules.sh`.
- **Checked.** All 38 tests passed. Before the fixes, Test 37 failed naming the 14 lines of `FUNDING.yml`, and Test 38
  failed naming `src/session.js:5: 62 lines`. A `//` comment added to `src/link.js` made Test 37 fail naming
  `src/link.js:10`; it was taken out again. Mutation testing of `src/session.js` left the same 5 mutants as before.
  The CRAP score of every function is under 10, and no code is written twice. `check-rules.sh` passed; with 8 more
  files put in the main folder for a moment, it failed Rule 14 at 9 files.
- **Documents.** `TESTS.md`: Tests 37 and 38, under maintainability. `MAINTAINER.md`: the rule tests and what to do
  when they fail, and standard files in the rules. `DECISIONS.md`.

#### Not done

- GitHub Pages is not turned on; the page is not published.
- Accessibility was not looked at.
- The page was not tried on a phone, nor in Firefox or Safari.
- The `SECURITY_CONTACT` placeholder is left, for before the first release.

### 12:46:59: `.html` and `.css` counted, and comment lines left out

#### What changed

- **Why.** A small website, all in one `.html` file, gave `0.0 KLOC · 0 files · 0 lines`: HTML and CSS are not
  programming languages in Linguist. GitHub Pages now publishes the page.
- **Requirements.** Requirement 21 now allows extensions to be included as well as excluded. Requirement 22 now counts
  only lines that are not comments, in every code file. It was decided to recognise the comments of the common
  languages through a table of comment styles; in a language the table does not know, comments are counted.
- **Replaced.** That comments count, and that only programming languages are counted, both of
  [the project set up from the template](#114028-the-project-set-up-from-the-template).
- **Included extensions.** `.github/scripts/included-extensions.json` holds `.css` and `.html`, which
  `update-extensions.js` adds to the list: 978 code extensions, up from 976.
- **src/data/.** `extensions.json` moved here from `src/`, so that `src/` keeps to 7 files. `comments.json` is new: 9
  comment styles, C (`//`, `/* */`), hash (`#`), double dash (`--`, `--[[ ]]`, `{- -}`), semicolon, percent,
  apostrophe, ML (`(* *)`), CSS (`/* */`) and HTML (`<!-- -->`, `/* */`, `//`), and the extensions of each: 146 in
  all, each a code extension and in one style only.
- **count.js.** `extensionOf` finds a path's code extension; `countLines` blanks out the comments of its comment
  style, keeping the line breaks, then counts the lines that are not blank. A line comment counts only where it starts
  the line, so a line with code and a comment is a line of code.
- **Tests.** 46, up from 38. Test 5 no longer holds a `#` line, now a comment. New: Tests 11 and 12 (`.html` and
  `.css` counted), 13 to 15 (HTML, CSS and script comments in `.html`), 16 to 18 (`//`, `/* */` and `#` comments).
  Tests 11 to 38 became 19 to 46.
- **Checked.** All 46 tests passed; before `count.js` was changed, Tests 11 to 15 failed. Mutation testing of
  `src/count.js` changed it at 21 places, and the tests failed for all 21. The CRAP score of every function is under
  10, and no code is written twice. Against GitHub, `octocat/Spoon-Knife`, one `.html` and one `.css` file, gave
  `0.0 KLOC · 2 files · 29 lines`, as a separate count of a clone did; `tj/commander.js` gave
  `15.5 KLOC · 171 files · 15506 lines`, against 15525 by a rougher count with `grep` of lines that do not start with
  `//`, `/*` or `*`. `check-rules.sh` passed.
- **Documents.** `README.md`: what a line of code is, and the example. `MAINTAINER.md`: the first chapter (included
  extensions, the new path), the files, the diagram, how a count works, and a new section "Comment styles".
  `TESTS.md`: Tests 5 and 11 to 18, and the numbers of 19 to 46. `TERMINOLOGY.md`: code extension, excluded
  extension, code file and line of code changed; included extension, comment style and comment added.
  `DECISIONS.md`.

#### Not done

- Comments in languages outside `comments.json` are still counted, as decided.
- A block marker inside a string, such as `"/*"`, is taken for a comment; strings are not parsed.
- Python docstrings are strings, not comments, and are counted.
- Accessibility was not looked at, and the page was not tried on a phone, nor in Firefox or Safari.
- The `SECURITY_CONTACT` placeholder is left, for before the first release.

### 13:00:41: `{owner}/{repo}` alone accepted

#### What changed

- **Why.** Typing `cnordenb/aoe2vils.net` gave `error: not a valid link`; it now counts that repository, as if
  `https://github.com/` came before it. Counting all the repositories of a user was planned and then dropped.
- **link.js.** `parseLink` puts `github.com/` before the input when it has no scheme and its first part, up to the
  first `/`, holds no dot. GitHub names of users hold no dots, so a first part with a dot is a host: `gitlab.com/a/b`
  stays not a valid link (Requirement 18). With a scheme, nothing is put before it, so `https://cnordenb/x` is a link
  to another host, and not valid.
- **output.js.** `help` shows `{owner}/{repo}` among the accepted input.
- **Tests.** 48, up from 46: Test 27 (`cnordenb/aoe2vils.net` accepted) and Test 28 (`gitlab.com/...` without a scheme
  not valid), in `tests/links.test.js`. Tests 27 to 46 became 29 to 48.
- **Checked.** All 48 tests passed; Test 27 failed before `link.js` was changed. Mutation testing of `src/link.js`
  changed it at 5 places, and the tests failed for all 5. `parseLink` has a CRAP score of 5. `check-rules.sh` passed.
  In a headless Brave against GitHub, `cnordenb/aoe2vils.net` gave `3.7 KLOC · 12 files · 3656 lines`,
  `octocat/Spoon-Knife` gave `0.0 KLOC · 2 files · 29 lines`, and `gitlab.com/a/b` gave `error: not a valid link`.
- **Documents.** `README.md`: usage. `MAINTAINER.md`: how a count works, step 1. `TESTS.md`: Tests 27 and 28, and the
  numbers of 29 to 48. `TERMINOLOGY.md`: valid link. `DECISIONS.md`.

#### Not done

- `REQUIREMENTS.md` has no requirement for `{owner}/{repo}` alone yet, so Test 27 names none; see Question 1.

#### Questions

1. **The requirement.** Proposal, for the chief developer to add under "Accepted links": "Repo KLOC Counter will
   accept `{owner}/{repo}` alone, as if `https://github.com/` came before it."

### 13:13:59: the `ls` command lists a user's repositories

#### What changed

- **ls.** `ls {user}` lists the public repositories of a GitHub user or organisation, forks left out, one
  `owner/name` a line, in the order of their names, so that a line can be typed back to count it. A user GitHub does
  not know gives `error: no such GitHub user`, one without public repositories `no public repositories`, and `ls`
  without one user `error: ls takes one GitHub user, such as: ls cnordenb`.
- **github.js.** `listRepos` reads `users/{user}/repos?type=owner&sort=full_name&per_page=100`, page after page while
  a page holds 100, one API call each. `parsed` now holds what `listFiles` and `listRepos` share: an answer that is not
  ok becomes a `GitHubError`, whose 404 kind each caller names. `API` is now `https://api.github.com`.
- **link.js.** `parseUser` accepts a name of letters, digits and hyphens; GitHub's 404 answers the rest.
- **session.js.** `whileBusy` holds what a count and `ls` share: the terminal is busy while they wait, then shows
  their lines.
- **Bug.** While `ls` waited, the prompt stayed open, as nothing told the page that the terminal was busy; input typed
  then was lost without a word. It was found by typing commands one after another in a headless Brave. `whileBusy` now
  tells the page as soon as it marks the terminal busy.
- **output.js.** `help` lists `ls {user}`; the new errors and `no public repositories` are there.
- **Tests.** 55, up from 48: Tests 47 to 52 for `ls` and Test 53, a regression test for the bug, in
  `tests/terminal.test.js`; `fakeGitHub` answers a user's repositories, 100 a page. Tests 47 and 48 became 54 and 55.
- **Checked.** All 55 tests passed; Tests 47 to 52 failed before `ls` was written, and Test 53 failed with the fix
  taken out, which was then put back. Mutation testing: all 14 mutants of `src/github.js` and all 5 of `src/link.js`
  were caught; `src/session.js` and `src/output.js` keep the 5 and 1 survivors of before, none new. The CRAP score of
  every function is under 10, and no code is written twice. In a headless Brave against GitHub, `ls octocat` gave 6
  repositories, GitHub's 8 less its 2 forks; `ls no-such-user-xq-77213` gave `error: no such GitHub user`; and a count
  typed straight after `ls` ran. `users/github/repos` was seen to answer for an organisation. `check-rules.sh` passed.
- **Documents.** `README.md`: usage. `MAINTAINER.md`: the files, the diagram, and a new section "The ls command".
  `TESTS.md`: Tests 47 to 53, and the numbers of 54 and 55. `TERMINOLOGY.md`: command and session. `DECISIONS.md`.

#### Not done

- `REQUIREMENTS.md` has no requirement for `ls` yet, so Tests 47 to 52 name none; see Question 1.
- A user with more than 100 repositories was tried only against `fakeGitHub`.

#### Questions

1. **The requirements.** Proposal, for the chief developer to add: "The command `ls {user}` will list the public
   repositories of that GitHub user, one `{owner}/{repo}` a line." "The command `ls` will leave forks out." "The
   command `ls` will give the error "no such GitHub user" for a user GitHub does not show."

### 13:24:29: a progress line while `ls` waits

#### What changed

- **Progress line.** While `ls` waits for GitHub, the terminal shows `/ counting repositories...`, its first
  character turning through `/`, `-`, `\`, `|` every 300 ms, as during a count.
- **session.js.** `whileBusy` now starts and stops the progress line for both a count and `ls`; each passes how its
  line reads. Starting the line tells the page the terminal is busy, so the separate call to `onChange` was taken out.
- **output.js.** `listingLine` gives the line of `ls`; `turning` gives the character, for it and `progressLine`.
- **Tests.** 57, up from 55: Test 54 (the line of `ls`) and Test 55 (its character turns every 300 ms), in
  `tests/terminal.test.js`. Test 53 now mocks the timers, so that the progress line it starts does not keep the tests
  from ending. Tests 54 and 55 became 56 and 57.
- **Checked.** All 57 tests passed; Tests 54 and 55 failed before the change. Mutation testing of `src/session.js` left
  4 mutants, one fewer than before, all of earlier kinds, and of `src/output.js` the 1 of before. The CRAP score of
  every function is under 10, and no code is written twice. `check-rules.sh` passed.
- **Documents.** `MAINTAINER.md`: the ls command. `TESTS.md`: Tests 54 and 55, and the numbers of 56 and 57.
  `TERMINOLOGY.md`: progress line. `DECISIONS.md`.

#### Not done

- The new line was not seen against the real GitHub: the hour's 60 calls had been used by testing, and
  `ls octocat` gave `error: GitHub's hourly rate limit exceeded`, as it should, until 13:32:41.
- Like the rest of `ls`, the line has no requirement yet; see the questions of 13:13:59.

### 13:28:43: the progress line turns twice as fast, with a longer dash

#### What changed

- **output.js.** `FRAME_MS` is 150, down from 300, and the second of the turning characters is `─` (U+2500, a line
  drawn for terminals), not `-`: in a monospace font it fills the width of its cell, as `/`, `\` and `|` fill its
  height. It holds for the progress lines of both a count and `ls`.
- **Replaced.** The 300 ms of
  [the terminal counts a repository's lines of code](#121426-the-terminal-counts-a-repositorys-lines-of-code), and the
  `-` of [`package.json` added, and the progress line decided](#115052-packagejson-added-and-the-progress-line-decided).
- **Tests.** 57, as before. Test 35 expects `─`; Tests 36 and 55 expect the character at 149 ms and at 150 ms.
- **Checked.** All 57 tests passed; Tests 35, 36 and 55 failed with the old `FRAMES` and `FRAME_MS`. `src/output.js`
  is saved as UTF-8, as `index.html` declares. `check-rules.sh` passed.
- **Documents.** `MAINTAINER.md`: how a count works. `TESTS.md`: Tests 35, 36 and 55. `DECISIONS.md`.

#### Not done

- The page was not looked at in a browser: GitHub's hourly limit was used up until 13:32:41.

#### Questions

1. **Requirements 27 and 28.** They still say `-` and 300 ms. Proposal: "27. The character `X` will turn through
   `/`, `─`, `\` and `|`, in that order, and round again." "28. The character `X` will change every 150 ms."

### 13:41:59: `ls` says how many public source repositories a user has

#### What changed

- **Answers.** Of the questions of 13:13:59, in
  [the `ls` command lists a user's repositories](#131359-the-ls-command-lists-a-users-repositories): Requirements 41
  to 49 were added, and 40 for `{owner}/{repo}` alone (1). Of the question of 13:28:43, in
  [the progress line turns twice as fast, with a longer dash](#132843-the-progress-line-turns-twice-as-fast-with-a-longer-dash):
  Requirements 27 and 28 now say `─` and 150 ms (1).
- **ls.** Its first two lines are `{user} has {n} public source repositories.` and 40 dashes, then the list. With one
  repository the line says `repository`. With none, `no public repositories` follows the two lines, as Requirement 47
  asks.
- **output.js.** `repoLines` takes the user as well as the names, and makes the two lines.
- **Tests.** 60, up from 57: Test 53 (the count line, forks left out of n), Test 54 (40 dashes) and Test 55 (one
  repository), in `tests/terminal.test.js`. Tests 47 to 49 look past the first two lines; Test 50 expects the two
  lines before `no public repositories`. Tests 53 to 57 became 56 to 60. The tests of `ls` and Test 27 name their
  requirements in `TESTS.md`.
- **Checked.** All 60 tests passed; Tests 47 to 50 and 53 to 55 failed before the change. Mutation testing of
  `src/output.js` and `src/session.js` left only the survivors of before. The CRAP score of every function is under
  10, and no code is written twice. In a headless Brave against GitHub, `ls cnordenb` gave
  `cnordenb has 7 public source repositories.`, the dashes and 7 repositories. `check-rules.sh` passed.
- **Documents.** `MAINTAINER.md`: the ls command. `TESTS.md`: Tests 47 to 60, and requirement numbers.
  `DECISIONS.md`.

#### Not done

- No test checks Requirement 43, the order of the names: the order is GitHub's, asked for with `sort=full_name`, and
  `fakeGitHub` gives back the order it is given.

#### Questions

1. **Requirements for the first two lines.** None covers them, and Requirement 47 keeps `no public repositories`
   under them. Proposal: "50. The command `ls` will first show the line `{user} has {n} public source repositories.`,
   where n is the number of repositories listed." "51. The command `ls` will show a line of 40 dashes second." "52. A
   user with one repository will give `{user} has 1 public source repository.`"

### 13:45:46: the first two lines of `ls` have their requirements

#### What changed

- **Answers.** Of the question of 13:41:59, in
  [`ls` says how many public source repositories a user has](#134159-ls-says-how-many-public-source-repositories-a-user-has):
  Requirements 50 to 52 were added as proposed (1). The code already met them and was not changed.
- **Tests.** 60, as before. Tests 53, 54 and 55 name Requirements 50, 51 and 52 in `TESTS.md`.
- **Checked.** All 60 tests passed. `check-rules.sh` passed.
- **Documents.** `TESTS.md`: Tests 53 to 55. `DECISIONS.md`.

#### Not done

- Requirement 43, the order of the names, still has no test; see 13:41:59.
