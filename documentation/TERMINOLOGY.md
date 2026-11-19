requirement - a numbered statement in REQUIREMENTS.md of what the project must do, e.g. "Requirement 4"
rule - a numbered statement in RULES.md of how the project must be made and kept, e.g. "Rule 12"
chief developer - the person who alone writes the requirements, named in Rule 2
test - a check of the project, run on every push and listed by its number in TESTS.md, e.g. "Test 15"
log - the development log in documentation/DEVLOG/: what changed in the project, why, and what is left
part - one file of the log, DEVLOG1.md, DEVLOG2.md and so on, each of at most 1000 lines
day - the entry of the log for one date, titled by it, e.g. "2026-11-02", never split between two parts
section - one change recorded under its day, titled by its time if it was the first written in that minute
decision - a choice made in a section and listed by subject in DECISIONS.md, with a link to that section
question - a numbered point for the chief developer at the end of a section, open until a later section answers it
success criterion - a numbered WCAG 2.2 statement at level A or AA that the interface must meet, e.g. "2.1.1 Keyboard"
human verification - a person's check that a success criterion holds, needed where no test can check it in full
repository - a public GitHub repository, named by its owner and its name, e.g. "cnordenb/repo-kloc-counter"
link - what the user types to name a repository, e.g. "https://github.com/cnordenb/repo-kloc-counter/tree/master"
valid link - a link to github.com or www.github.com holding an owner and a repository's name; anything else is not
default branch - the branch GitHub shows first for a repository, asked for as HEAD
code extension - a file ending counted as code, listed in src/data/extensions.json, e.g. ".js"
included extension - a code extension that no programming language in Linguist's languages.yml has, e.g. ".html"
excluded extension - a file ending of a programming language in languages.yml that is no code extension, e.g. ".md"
code file - a file of the default branch whose name ends in a code extension
comment style - how a code file marks text it ignores, e.g. "#" to the end of the line in ".py", listed in comments.json
comment - text that the comment style of its code file marks as such, e.g. "# note" in a ".py" file
line of code - a line of a code file holding at least one character that is neither whitespace nor in a comment
KLOC - thousands of lines of code, shown with one decimal, e.g. "18.4 KLOC" for 18385 lines of code
count - reading every code file of a repository and adding up its lines of code
partial count - a count that missed code files, as GitHub cut its list of files short or a code file could not be read
terminal - the whole page: lines of output above one line where the user types
prompt - the line at the bottom of the terminal where the user types a link or a command, marked ">"
command - a word typed at the prompt that is not a link: "help" or "clear"
history - the input given at the prompt so far, gone through with the up and down arrows
progress line - the line shown during a count, e.g. "/ counting lines... (3/12 files)", its first character turning
result - the line after a count, e.g. "18.4 KLOC · 171 files · 18385 lines", with a warning below it if partial count
session - the state of the terminal in session.js: its lines, its history, and whether a count is running
