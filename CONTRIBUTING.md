# How to Contribute

We'd love to accept your patches and contributions to this project. There are
just a few small guidelines you need to follow.

## Version control
### Commit style
To make sure that all our commits remain consistent through time, the project is set up to validate (on Pull Requests)
that all commits have to the following format:

```bash
:gitmoji: type(scope?): subject
body?
footer?
```

For that we use [commitlint-config-gitmoji](https://www.npmjs.com/package/commitlint-config-gitmoji)
as our [commitlint](https://www.npmjs.com/package/commitlint), if you are worried you might write a commit
using a wrong emoji, make sure have the project node dependencies installed (`npm install`), this will enable
a pre-commit hook that checks for the correct format before each commit.

If desired, you could also bypass this check by adding the `-n` option at the end of your commit,
this might be convenient if you just want to try some things out.

```shell
git commit -m "wrong commit" -n
```

#### [:gitmoji:](https://gitmoji.dev/) (required)
Must be a valid emoji code, you could easily find out the correct one by executing
in your shell:

```shell
npx gitmoji-cli --search <string>
```

where `<string>` could be the word "bug" if you are looking for the bug emoji.

#### type (required)
**Must** be one of the following

```text
  'feat'           // Introducing new features
  'fix'            // Fixing a bug
  'refactor'       // Refactoring code (Not Introducing features or fix)
  'docs'           // add documents
  'test'           // Adding unit tests or e2e test
  'perf'           // Improving performance
  'revert'         // Reverting changes or commits
  'style'          // Updating the UI and style files
  'build'          // build artifacts
  'ci'             // working about CI build system
  'wip'            // Work in progress
  'chore';         // Work with configuration or other stuff
```

#### scope (optional)
e.g. Unguard microservices (`like-service`, `membership-service`, etc), `docs`, etc.

#### subject (required)
**Must** be written following the styles: `Sentence case`, `Start Case` and `PascalCase`.

And use them as you normally would:
* `Sentence case` for normal sentences
* `Start Case` for names
* `PascalCase` for referring to file/class names that have that casing style.

*Note: Acronyms are allowed:* `HTTP`, `SSL`, `DSL`.

## Contributor License Agreement

Contributions to this project must be accompanied by a Contributor License
Agreement. You (or your employer) retain the copyright to your contribution;
this simply gives us permission to use and redistribute your contributions as
part of the project.

You generally only need to submit a CLA once, so if you've already submitted one
(even if it was for a different project), you probably don't need to do it
again.

## Code Reviews

All submissions, including submissions by project members, require review. We
use GitHub pull requests for this purpose. Consult
[GitHub Help](https://help.github.com/articles/about-pull-requests/) for more
information on using pull requests.
