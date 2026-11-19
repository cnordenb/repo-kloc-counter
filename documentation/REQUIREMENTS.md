# Requirements
0. These requirements apply to Repo KLOC Counter, a static web page in English, run in a desktop or mobile web browser.

## Delivery
1. Repo KLOC Counter will run entirely in the user's browser, with no server of its own.
2. Repo KLOC Counter will have its program logic written in JavaScript only.
3. Repo KLOC Counter will be published with GitHub Pages.
4. Repo KLOC Counter will call GitHub without a token.

## Command line
5. The page will show nothing but a terminal: lines of output and one prompt for input.
6. The prompt will run its input when Enter is pressed.
7. The command `help` will list the accepted input and the commands.
8. The command `clear` will remove all output from the terminal.
9. The up arrow will put the previous input into the prompt.
10. The down arrow will put the next input into the prompt.
11. The prompt will accept new input after any result or error.

## Accepted links
12. Repo KLOC Counter will accept a link of the form `https://github.com/{owner}/{repo}`.
13. Repo KLOC Counter will accept the link with `http://` instead of `https://`.
14. Repo KLOC Counter will accept the link without a scheme.
15. Repo KLOC Counter will accept the link with `www.github.com` as its host.
16. Repo KLOC Counter will strip everything after `{owner}/{repo}` from the link before counting.
17. Repo KLOC Counter will strip a trailing `.git` from `{repo}`.
18. Repo KLOC Counter will treat a link with any other host as not a valid link.
19. Repo KLOC Counter will treat a link without both `{owner}` and `{repo}` as not a valid link.

## Counting
20. Repo KLOC Counter will count the repository's default branch.
21. Repo KLOC Counter will count only files whose extension belongs to a language of type `programming` in
    GitHub Linguist's `languages.yml` unless arbitrarily excluded.
22. Repo KLOC Counter will count as a line of code every line holding at least one character that is not whitespace.
23. Repo KLOC Counter will retry once a file whose fetch fails.
24. Repo KLOC Counter will leave out of the count a file whose retry fails.
25. Repo KLOC Counter will count the files listed when GitHub cuts the repository's file list short.

## Progress line
26. While files are read, Repo KLOC Counter will show one line `X counting lines... (done/total files)`.
27. The character `X` will turn through `/`, `-`, `\` and `|`, in that order, and round again.
28. The character `X` will change every 300 ms.
29. The number `done` will be the number of files read.
30. The number `total` will be the number of files to read.

## Result
31. The result will show the KLOC with one decimal.
32. The result will show the number of files counted.
33. The result will show the exact number of lines of code.
34. A repository with no code files will give the result `0.0 KLOC · 0 files · 0 lines`.
35. The result will carry a warning that the count is partial when GitHub cut the file list short.
36. The result will carry a warning that the count is partial when a file was left out.

## Errors
37. Input that is not a valid link will give the error "not a valid link".
38. GitHub's hourly rate limit exceeded will give the error "GitHub's hourly rate limit exceeded".
39. A repository GitHub does not show will give the error "not a public repository, or no such repository".