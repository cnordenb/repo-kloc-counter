# Tests

This project strives to have sensible testing. The goal is not to have 100% test coverage but to have tests which _sufficiently_ ensure the functional completeness, functional correctness, maintainability, and accessibility of Repo KLOC Counter. For more guidelines on software quality and accessibility, see [ISO/IEC 25010:2011](https://cdn.standards.iteh.ai/samples/35733/2ca18b477b7845a5b8cae39d6de0c098/ISO-IEC-25010-2011.pdf), [ISO/IEC 25010:2023](https://cdn.standards.iteh.ai/samples/78176/13ff8ea97048443f99318920757df124/ISO-IEC-25010-2023.pdf) and [WCAG 2.2](https://www.w3.org/TR/WCAG22/).

This document lists each test, its purpose, and in which test file it resides. This document is an effort to mitigate redundant tests and ensure test quality. It is intended as an aid in the trouble-shooting of potential false positives.

Test descriptions must remain brief and parameters (eg. Purpose) may not exceed 120 characters. Tests are ordered in order of their execution.

The test report names each test by its number here, such as "Test 15 failed": a test's number is its place in the order
the tests run. So when a test is added, removed or moved, renumber this document to match.

<!--
Each test has an entry of this form, after the table of contents, in the order the tests run:

## Test N

### File residence:
`path/to/test_file`, lines 24-26

### Purpose:
Verify that ... (Req. 3, 4).

### Assertion expectation:
What must hold for the test to pass.
-->

## Table of contents per category

Functional completeness & correctness tests:

- [Test 1](#test-1): no token sent
- [Test 2](#test-2): default branch
- [Test 3](#test-3): code extension counted
- [Test 4](#test-4): excluded extension
- [Test 5](#test-5): non-blank lines
- [Test 6](#test-6): retry
- [Test 7](#test-7): left out
- [Test 8](#test-8): cut-short list counted
- [Test 9](#test-9): done
- [Test 10](#test-10): total
- [Test 11](#test-11): .html counted
- [Test 12](#test-12): .css counted
- [Test 13](#test-13): HTML comments
- [Test 14](#test-14): CSS comments
- [Test 15](#test-15): script comments in HTML
- [Test 16](#test-16): // comments
- [Test 17](#test-17): /* */ comments
- [Test 18](#test-18): # comments
- [Test 19](#test-19): root link
- [Test 20](#test-20): http://
- [Test 21](#test-21): no scheme
- [Test 22](#test-22): www.github.com
- [Test 23](#test-23): rest stripped
- [Test 24](#test-24): .git stripped
- [Test 25](#test-25): other host
- [Test 26](#test-26): owner and repo
- [Test 27](#test-27): owner/repo alone
- [Test 28](#test-28): other host without scheme
- [Test 29](#test-29): help
- [Test 30](#test-30): clear
- [Test 31](#test-31): up arrow
- [Test 32](#test-32): down arrow
- [Test 33](#test-33): input after error
- [Test 34](#test-34): progress line
- [Test 35](#test-35): turning character
- [Test 36](#test-36): 300 ms
- [Test 37](#test-37): one decimal
- [Test 38](#test-38): files counted
- [Test 39](#test-39): exact lines
- [Test 40](#test-40): no code files
- [Test 41](#test-41): empty repository
- [Test 42](#test-42): cut-short warning
- [Test 43](#test-43): left-out warning
- [Test 44](#test-44): invalid link error
- [Test 45](#test-45): rate limit error
- [Test 46](#test-46): not public error
- [Test 47](#test-47): ls lists repositories
- [Test 48](#test-48): ls leaves forks out
- [Test 49](#test-49): ls reads every page
- [Test 50](#test-50): ls with none
- [Test 51](#test-51): ls of no such user
- [Test 52](#test-52): ls without a user
- [Test 53](#test-53): busy during ls

Accessibility tests:

Maintainability tests:

- [Test 54](#test-54): no comments
- [Test 55](#test-55): functions of 60 lines at most

## Test 1

### File residence:
`tests/counting.test.js`, lines 8-12

### Purpose:
Verify that GitHub is called without a token (Req. 4).

### Assertion expectation:
No call to the fake GitHub carries headers.

## Test 2

### File residence:
`tests/counting.test.js`, lines 14-18

### Purpose:
Verify that the default branch is counted (Req. 20).

### Assertion expectation:
The file list is asked for at `git/trees/HEAD?recursive=1`.

## Test 3

### File residence:
`tests/counting.test.js`, lines 20-23

### Purpose:
Verify that a file with a programming extension is counted (Req. 21).

### Assertion expectation:
`src/main.js` gives 1 file.

## Test 4

### File residence:
`tests/counting.test.js`, lines 25-28

### Purpose:
Verify that an excluded extension is not counted (Req. 21).

### Assertion expectation:
`README.md` gives 0 files.

## Test 5

### File residence:
`tests/counting.test.js`, lines 30-33

### Purpose:
Verify that lines of only whitespace are not counted (Req. 22).

### Assertion expectation:
A file of 5 lines, 3 of them blank or whitespace, gives 2 lines.

## Test 6

### File residence:
`tests/counting.test.js`, lines 35-38

### Purpose:
Verify that a file whose fetch fails is retried once (Req. 23).

### Assertion expectation:
A file that fails once gives 1 file.

## Test 7

### File residence:
`tests/counting.test.js`, lines 40-43

### Purpose:
Verify that a file whose retry fails is left out (Req. 24).

### Assertion expectation:
A file that fails twice gives 1 file missed.

## Test 8

### File residence:
`tests/counting.test.js`, lines 45-48

### Purpose:
Verify that the files listed are counted when GitHub cuts the list short (Req. 25).

### Assertion expectation:
A cut-short list of 2 code files gives 2 files.

## Test 9

### File residence:
`tests/counting.test.js`, lines 50-54

### Purpose:
Verify that done is the number of files read (Req. 29).

### Assertion expectation:
With 2 code files, done is reported as 0, 1, 2.

## Test 10

### File residence:
`tests/counting.test.js`, lines 56-61

### Purpose:
Verify that total is the number of files to read (Req. 30).

### Assertion expectation:
With 2 code files and 1 text file, total is always 2.

## Test 11

### File residence:
`tests/counting.test.js`, lines 63-66

### Purpose:
Verify that an `.html` file, an included extension, is counted (Req. 21).

### Assertion expectation:
`index.html` gives 1 file.

## Test 12

### File residence:
`tests/counting.test.js`, lines 68-71

### Purpose:
Verify that a `.css` file, an included extension, is counted (Req. 21).

### Assertion expectation:
`style.css` gives 1 file.

## Test 13

### File residence:
`tests/counting.test.js`, lines 73-77

### Purpose:
Verify that lines of only `<!-- -->` comments are not counted in an `.html` file (Req. 22).

### Assertion expectation:
Six lines, three of them only comment, give 2 lines; a line with code and a comment counts.

## Test 14

### File residence:
`tests/counting.test.js`, lines 79-83

### Purpose:
Verify that lines of only `/* */` comments are not counted in a `.css` file (Req. 22).

### Assertion expectation:
Six lines, three of them only comment, give 2 lines; a line with code and a comment counts.

## Test 15

### File residence:
`tests/counting.test.js`, lines 85-89

### Purpose:
Verify that lines of only `//` comments are not counted in an `.html` file (Req. 22).

### Assertion expectation:
A script of 4 lines with one `//` line gives 3; `https://` in a string is not a comment.

## Test 16

### File residence:
`tests/counting.test.js`, lines 91-95

### Purpose:
Verify that lines of only `//` comments are not counted, as in `.js` (Req. 22).

### Assertion expectation:
Four lines, two of them only comment, give 2 lines; `https://` in a string is not a comment.

## Test 17

### File residence:
`tests/counting.test.js`, lines 97-101

### Purpose:
Verify that lines of only `/* */` comments are not counted, as in `.js` (Req. 22).

### Assertion expectation:
Six lines, four of them only comment, give 2 lines.

## Test 18

### File residence:
`tests/counting.test.js`, lines 103-107

### Purpose:
Verify that lines of only `#` comments are not counted, as in `.py` (Req. 22).

### Assertion expectation:
Five lines, the shebang and two comments among them, give 2; `"#"` in a string is not a comment.

## Test 19

### File residence:
`tests/links.test.js`, lines 6-8

### Purpose:
Verify that a link to the root of a repository is accepted (Req. 12).

### Assertion expectation:
`https://github.com/cnordenb/repo-kloc-counter` gives owner `cnordenb`, repo `repo-kloc-counter`.

## Test 20

### File residence:
`tests/links.test.js`, lines 10-12

### Purpose:
Verify that a link with `http://` is accepted (Req. 13).

### Assertion expectation:
The `http://` link gives the same owner and repo.

## Test 21

### File residence:
`tests/links.test.js`, lines 14-16

### Purpose:
Verify that a link without a scheme is accepted (Req. 14).

### Assertion expectation:
`github.com/cnordenb/repo-kloc-counter` gives the same owner and repo.

## Test 22

### File residence:
`tests/links.test.js`, lines 18-20

### Purpose:
Verify that a link with `www.github.com` is accepted (Req. 15).

### Assertion expectation:
The `www.github.com` link gives the same owner and repo.

## Test 23

### File residence:
`tests/links.test.js`, lines 22-24

### Purpose:
Verify that everything after `{owner}/{repo}` is stripped (Req. 16).

### Assertion expectation:
A link with `/tree/master/src?x=1#top` gives the same owner and repo.

## Test 24

### File residence:
`tests/links.test.js`, lines 26-28

### Purpose:
Verify that a trailing `.git` is stripped from the repository (Req. 17).

### Assertion expectation:
`.../repo-kloc-counter.git` gives repo `repo-kloc-counter`.

## Test 25

### File residence:
`tests/links.test.js`, lines 30-32

### Purpose:
Verify that a link with another host is not a valid link (Req. 18).

### Assertion expectation:
A `gitlab.com` link gives `null`.

## Test 26

### File residence:
`tests/links.test.js`, lines 34-36

### Purpose:
Verify that a link without both owner and repository is not a valid link (Req. 19).

### Assertion expectation:
`https://github.com/cnordenb` gives `null`.

## Test 27

### File residence:
`tests/links.test.js`, lines 38-40

### Purpose:
Verify that `{owner}/{repo}` alone is accepted, as if after `https://github.com/`.

### Assertion expectation:
`cnordenb/aoe2vils.net` gives owner `cnordenb`, repo `aoe2vils.net`.

## Test 28

### File residence:
`tests/links.test.js`, lines 42-44

### Purpose:
Verify that another host without a scheme is not a valid link (Req. 18).

### Assertion expectation:
`gitlab.com/cnordenb/repo-kloc-counter` gives `null`.

## Test 29

### File residence:
`tests/terminal.test.js`, lines 17-20

### Purpose:
Verify that `help` lists the accepted link and the commands (Req. 7).

### Assertion expectation:
The help shows `github.com/{owner}/{repo}`, `help` and `clear`.

## Test 30

### File residence:
`tests/terminal.test.js`, lines 22-27

### Purpose:
Verify that `clear` removes all output from the terminal (Req. 8).

### Assertion expectation:
After `help` and `clear`, the terminal has no lines.

## Test 31

### File residence:
`tests/terminal.test.js`, lines 29-35

### Purpose:
Verify that the up arrow puts the previous input in the prompt (Req. 9).

### Assertion expectation:
After `help`, `clear`, two presses of up give `help`.

## Test 32

### File residence:
`tests/terminal.test.js`, lines 37-44

### Purpose:
Verify that the down arrow puts the next input in the prompt (Req. 10).

### Assertion expectation:
After `help`, `clear`, up, up, a press of down gives `clear`.

## Test 33

### File residence:
`tests/terminal.test.js`, lines 46-50

### Purpose:
Verify that the prompt accepts new input after an error (Req. 11).

### Assertion expectation:
After the error for a 404, the session is not busy.

## Test 34

### File residence:
`tests/terminal.test.js`, lines 52-54

### Purpose:
Verify the form of the progress line (Req. 26).

### Assertion expectation:
Frame 0, 3 done of 12 gives `/ counting lines... (3/12 files)`.

## Test 35

### File residence:
`tests/terminal.test.js`, lines 56-58

### Purpose:
Verify that the character turns through `/`, `-`, `\`, `|` and round again (Req. 27).

### Assertion expectation:
Frames 0 to 4 start with `/`, `-`, `\`, `|`, `/`.

## Test 36

### File residence:
`tests/terminal.test.js`, lines 60-70

### Purpose:
Verify that the turning character changes every 300 ms (Req. 28).

### Assertion expectation:
With mocked timers, the character is `/` at 299 ms and `-` at 300 ms.

## Test 37

### File residence:
`tests/terminal.test.js`, lines 72-74

### Purpose:
Verify that the result shows the KLOC with one decimal (Req. 31).

### Assertion expectation:
12347 lines give a result starting `12.3 KLOC · `.

## Test 38

### File residence:
`tests/terminal.test.js`, lines 76-78

### Purpose:
Verify that the result shows the number of files counted (Req. 32).

### Assertion expectation:
2 code files and 1 `.md` file give ` · 2 files · `.

## Test 39

### File residence:
`tests/terminal.test.js`, lines 80-82

### Purpose:
Verify that the result shows the exact number of lines of code (Req. 33).

### Assertion expectation:
12347 lines give a result ending ` · 12347 lines`.

## Test 40

### File residence:
`tests/terminal.test.js`, lines 84-87

### Purpose:
Verify the result of a repository with no code files (Req. 34).

### Assertion expectation:
Only `README.md` gives exactly `0.0 KLOC · 0 files · 0 lines`, with no warning.

## Test 41

### File residence:
`tests/terminal.test.js`, lines 89-91

### Purpose:
Verify that an empty repository, GitHub's 409, gives the result of no code files (Req. 34).

### Assertion expectation:
A 409 gives exactly `0.0 KLOC · 0 files · 0 lines`, with no warning.

## Test 42

### File residence:
`tests/terminal.test.js`, lines 93-96

### Purpose:
Verify that a file list cut short gives a warning of a partial count (Req. 35).

### Assertion expectation:
The line after the result starts `warning: the count is partial`.

## Test 43

### File residence:
`tests/terminal.test.js`, lines 98-101

### Purpose:
Verify that a file left out gives a warning of a partial count (Req. 36).

### Assertion expectation:
The line after the result starts `warning: the count is partial`.

## Test 44

### File residence:
`tests/terminal.test.js`, lines 103-105

### Purpose:
Verify the error for input that is not a valid link (Req. 37).

### Assertion expectation:
A `gitlab.com` link shows only `error: not a valid link`.

## Test 45

### File residence:
`tests/terminal.test.js`, lines 107-110

### Purpose:
Verify the error for GitHub's hourly rate limit exceeded (Req. 38).

### Assertion expectation:
A 403 with `x-ratelimit-remaining: 0` shows only `error: GitHub's hourly rate limit exceeded`.

## Test 46

### File residence:
`tests/terminal.test.js`, lines 112-115

### Purpose:
Verify the error for a repository GitHub does not show (Req. 39).

### Assertion expectation:
A 404 shows only `error: not a public repository, or no such repository`.

## Test 47

### File residence:
`tests/terminal.test.js`, lines 117-121

### Purpose:
Verify that `ls {user}` lists the user's public repositories as `owner/name`, one a line.

### Assertion expectation:
Two repositories give `cnordenb/aoe2vils.net` and `cnordenb/onkos`, in that order.

## Test 48

### File residence:
`tests/terminal.test.js`, lines 123-126

### Purpose:
Verify that `ls` leaves forks out.

### Assertion expectation:
Of one repository and one fork, only `cnordenb/onkos` is shown.

## Test 49

### File residence:
`tests/terminal.test.js`, lines 128-131

### Purpose:
Verify that `ls` lists every page of GitHub's answer, 100 repositories a page.

### Assertion expectation:
101 repositories give 101 lines.

## Test 50

### File residence:
`tests/terminal.test.js`, lines 133-135

### Purpose:
Verify that `ls` of a user without public repositories says so.

### Assertion expectation:
No repositories give `no public repositories`.

## Test 51

### File residence:
`tests/terminal.test.js`, lines 137-139

### Purpose:
Verify the error of `ls` for a user GitHub does not know.

### Assertion expectation:
A 404 gives `error: no such GitHub user`.

## Test 52

### File residence:
`tests/terminal.test.js`, lines 141-143

### Purpose:
Verify that `ls` without one user shows how to use it.

### Assertion expectation:
`ls` alone gives `error: ls takes one GitHub user, such as: ls cnordenb`.

## Test 53

### File residence:
`tests/terminal.test.js`, lines 145-150

### Purpose:
Prevent input typed while `ls` runs from being lost: the page must hear the terminal is busy.

### Assertion expectation:
While `ls` waits for GitHub, the last change the page was told of has `busy` true.

## Test 54

### File residence:
`tests/verify-rules.test.js`, lines 39-43

### Purpose:
Enforce that no code holds a comment (Rule 10).

### Assertion expectation:
No line of a code file, strings aside, holds `//`, `/*`, `<!--` or, outside JavaScript, `#`.

## Test 55

### File residence:
`tests/verify-rules.test.js`, lines 45-47

### Purpose:
Enforce that no function is longer than 60 lines of code (Rule 11).

### Assertion expectation:
No block opened by `) {` or `=> {` in a code file spans more than 60 lines that are not blank.
