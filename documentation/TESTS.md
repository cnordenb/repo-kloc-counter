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
- [Test 11](#test-11): root link
- [Test 12](#test-12): http://
- [Test 13](#test-13): no scheme
- [Test 14](#test-14): www.github.com
- [Test 15](#test-15): rest stripped
- [Test 16](#test-16): .git stripped
- [Test 17](#test-17): other host
- [Test 18](#test-18): owner and repo
- [Test 19](#test-19): help
- [Test 20](#test-20): clear
- [Test 21](#test-21): up arrow
- [Test 22](#test-22): down arrow
- [Test 23](#test-23): input after error
- [Test 24](#test-24): progress line
- [Test 25](#test-25): turning character
- [Test 26](#test-26): 300 ms
- [Test 27](#test-27): one decimal
- [Test 28](#test-28): files counted
- [Test 29](#test-29): exact lines
- [Test 30](#test-30): no code files
- [Test 31](#test-31): empty repository
- [Test 32](#test-32): cut-short warning
- [Test 33](#test-33): left-out warning
- [Test 34](#test-34): invalid link error
- [Test 35](#test-35): rate limit error
- [Test 36](#test-36): not public error

Accessibility tests:

Maintainability tests:

- [Test 37](#test-37): no comments
- [Test 38](#test-38): functions of 60 lines at most

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
Verify that only lines with a character other than whitespace count (Req. 22).

### Assertion expectation:
A file of 6 lines, 3 of them blank or whitespace, gives 3 lines.

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
`tests/links.test.js`, lines 6-8

### Purpose:
Verify that a link to the root of a repository is accepted (Req. 12).

### Assertion expectation:
`https://github.com/cnordenb/repo-kloc-counter` gives owner `cnordenb`, repo `repo-kloc-counter`.

## Test 12

### File residence:
`tests/links.test.js`, lines 10-12

### Purpose:
Verify that a link with `http://` is accepted (Req. 13).

### Assertion expectation:
The `http://` link gives the same owner and repo.

## Test 13

### File residence:
`tests/links.test.js`, lines 14-16

### Purpose:
Verify that a link without a scheme is accepted (Req. 14).

### Assertion expectation:
`github.com/cnordenb/repo-kloc-counter` gives the same owner and repo.

## Test 14

### File residence:
`tests/links.test.js`, lines 18-20

### Purpose:
Verify that a link with `www.github.com` is accepted (Req. 15).

### Assertion expectation:
The `www.github.com` link gives the same owner and repo.

## Test 15

### File residence:
`tests/links.test.js`, lines 22-24

### Purpose:
Verify that everything after `{owner}/{repo}` is stripped (Req. 16).

### Assertion expectation:
A link with `/tree/master/src?x=1#top` gives the same owner and repo.

## Test 16

### File residence:
`tests/links.test.js`, lines 26-28

### Purpose:
Verify that a trailing `.git` is stripped from the repository (Req. 17).

### Assertion expectation:
`.../repo-kloc-counter.git` gives repo `repo-kloc-counter`.

## Test 17

### File residence:
`tests/links.test.js`, lines 30-32

### Purpose:
Verify that a link with another host is not a valid link (Req. 18).

### Assertion expectation:
A `gitlab.com` link gives `null`.

## Test 18

### File residence:
`tests/links.test.js`, lines 34-36

### Purpose:
Verify that a link without both owner and repository is not a valid link (Req. 19).

### Assertion expectation:
`https://github.com/cnordenb` gives `null`.

## Test 19

### File residence:
`tests/terminal.test.js`, lines 17-20

### Purpose:
Verify that `help` lists the accepted link and the commands (Req. 7).

### Assertion expectation:
The help shows `github.com/{owner}/{repo}`, `help` and `clear`.

## Test 20

### File residence:
`tests/terminal.test.js`, lines 22-27

### Purpose:
Verify that `clear` removes all output from the terminal (Req. 8).

### Assertion expectation:
After `help` and `clear`, the terminal has no lines.

## Test 21

### File residence:
`tests/terminal.test.js`, lines 29-35

### Purpose:
Verify that the up arrow puts the previous input in the prompt (Req. 9).

### Assertion expectation:
After `help`, `clear`, two presses of up give `help`.

## Test 22

### File residence:
`tests/terminal.test.js`, lines 37-44

### Purpose:
Verify that the down arrow puts the next input in the prompt (Req. 10).

### Assertion expectation:
After `help`, `clear`, up, up, a press of down gives `clear`.

## Test 23

### File residence:
`tests/terminal.test.js`, lines 46-50

### Purpose:
Verify that the prompt accepts new input after an error (Req. 11).

### Assertion expectation:
After the error for a 404, the session is not busy.

## Test 24

### File residence:
`tests/terminal.test.js`, lines 52-54

### Purpose:
Verify the form of the progress line (Req. 26).

### Assertion expectation:
Frame 0, 3 done of 12 gives `/ counting lines... (3/12 files)`.

## Test 25

### File residence:
`tests/terminal.test.js`, lines 56-58

### Purpose:
Verify that the character turns through `/`, `-`, `\`, `|` and round again (Req. 27).

### Assertion expectation:
Frames 0 to 4 start with `/`, `-`, `\`, `|`, `/`.

## Test 26

### File residence:
`tests/terminal.test.js`, lines 60-70

### Purpose:
Verify that the turning character changes every 300 ms (Req. 28).

### Assertion expectation:
With mocked timers, the character is `/` at 299 ms and `-` at 300 ms.

## Test 27

### File residence:
`tests/terminal.test.js`, lines 72-74

### Purpose:
Verify that the result shows the KLOC with one decimal (Req. 31).

### Assertion expectation:
12347 lines give a result starting `12.3 KLOC · `.

## Test 28

### File residence:
`tests/terminal.test.js`, lines 76-78

### Purpose:
Verify that the result shows the number of files counted (Req. 32).

### Assertion expectation:
2 code files and 1 `.md` file give ` · 2 files · `.

## Test 29

### File residence:
`tests/terminal.test.js`, lines 80-82

### Purpose:
Verify that the result shows the exact number of lines of code (Req. 33).

### Assertion expectation:
12347 lines give a result ending ` · 12347 lines`.

## Test 30

### File residence:
`tests/terminal.test.js`, lines 84-87

### Purpose:
Verify the result of a repository with no code files (Req. 34).

### Assertion expectation:
Only `README.md` gives exactly `0.0 KLOC · 0 files · 0 lines`, with no warning.

## Test 31

### File residence:
`tests/terminal.test.js`, lines 89-91

### Purpose:
Verify that an empty repository, GitHub's 409, gives the result of no code files (Req. 34).

### Assertion expectation:
A 409 gives exactly `0.0 KLOC · 0 files · 0 lines`, with no warning.

## Test 32

### File residence:
`tests/terminal.test.js`, lines 93-96

### Purpose:
Verify that a file list cut short gives a warning of a partial count (Req. 35).

### Assertion expectation:
The line after the result starts `warning: the count is partial`.

## Test 33

### File residence:
`tests/terminal.test.js`, lines 98-101

### Purpose:
Verify that a file left out gives a warning of a partial count (Req. 36).

### Assertion expectation:
The line after the result starts `warning: the count is partial`.

## Test 34

### File residence:
`tests/terminal.test.js`, lines 103-105

### Purpose:
Verify the error for input that is not a valid link (Req. 37).

### Assertion expectation:
A `gitlab.com` link shows only `error: not a valid link`.

## Test 35

### File residence:
`tests/terminal.test.js`, lines 107-110

### Purpose:
Verify the error for GitHub's hourly rate limit exceeded (Req. 38).

### Assertion expectation:
A 403 with `x-ratelimit-remaining: 0` shows only `error: GitHub's hourly rate limit exceeded`.

## Test 36

### File residence:
`tests/terminal.test.js`, lines 112-115

### Purpose:
Verify the error for a repository GitHub does not show (Req. 39).

### Assertion expectation:
A 404 shows only `error: not a public repository, or no such repository`.

## Test 37

### File residence:
`tests/verify-rules.test.js`, lines 39-43

### Purpose:
Enforce that no code holds a comment (Rule 10).

### Assertion expectation:
No line of a code file, strings aside, holds `//`, `/*`, `<!--` or, outside JavaScript, `#`.

## Test 38

### File residence:
`tests/verify-rules.test.js`, lines 45-47

### Purpose:
Enforce that no function is longer than 60 lines of code (Rule 11).

### Assertion expectation:
No block opened by `) {` or `=> {` in a code file spans more than 60 lines that are not blank.
