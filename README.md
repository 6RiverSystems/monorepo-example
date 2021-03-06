# Template Rush Project

## Instantiating It

### Get a Clean Copy

1. Option 1: This repo is setup as a template you can use as the initial contents
   when creating a new repo in GitHub. This is by far the easiest way to start.
2. Option 2: Do a git clone of this repo, and then delete the `.git` directory
3. Option 3: Use `git archive` (read the manpage) to make an export of this repo
   and then extract that archive to the folder in which you are going to create
   the new repo

### Replace the placeholders

- Search this repository, case insensitively, for the whole word `template`.
  Pretty much every single instance you find of that string needs to be
  replaced.
- Also search for files that have `template` in their name, they almost
  certainly need to be renamed.
- You may wish to rename the `service` package to have a more descriptive name.
- Make sure the copyright date in `LICENSE` is up to date.
- Update the `CODEOWNERS` file to make your team the owners of your new repo

### Update `infrastructure`

Make a PR to the `infrastructure` project to add your repository to the
appropriate lists of repos to be cloned for various groups, and to have `6mon`
start your service(s).

### Enabling CI

- The `.circleci/config.yml` should have everything you need for CircleCI to
  build your copy of this project.
- However, you will need to edit the project settings in the CircleCI web
  interface and add the `CODECOV_TOKEN` environment variable generated from the
  CodeCov web interface before coverage uploads and analysis will work.
- You can optionally enable the 6RS bot to comment the latest version of the
  repository in any PR by following these steps:
  - Option 1: Uncomment the line `# - sixrs-gke/publish-version` in
  `.circleci/config.yaml` to have the 6RS bot automatically comment the latest
   version of the repository in any opened PR.
  - Option2: Remove that line if you do not wish to have the version commented

### Set up branch protection rules

- First, make sure you've got a successful build run in order for all of the
  PR checks to appear in the branch settings
- Go to settings in github and click on branches
- Add a new rule for `master` branch
- Check the boxes for Rule Settings:
  - Require pull request reviews
  - Dismiss stale pull request approvals when new commits are pushed
  - Require all status checks to pass before merging
  - Require branches to be up-to-date before merging
  - Include administrators

### Replace this file

Replace this file (and the other `README.md` files) with material appropriate to
your new project.

### Adding new packages

- If your new package doesn't need "resource" style files (anything other
  than `.ts` sources) copied to its `dist` dir, then use `common` as a
  template so that you use `tsc` directly and get incremental builds.
- If your new pacakge uses loopback, use `service` as a template (you will
  almost certainly have resource files)
- Update `.6mon.json` if your new package provides a service that `6mon` should
  launch

## What It Provides

### Common

The `common` package (in `packages/common`, not to be confused with `common`)
provides boilerplate for a package where you might store common utility code
and types. It is also useful as an example of a pure-typescript package if you
need more of them, as opposed to a loopback-enabled package.

### OAS

The `oas` package provides the boilerplate to define the OAS spec for your
service(s). This is for "internal" or "privileged" APIs, not customer-facing
ones (those must go in the `standard-api` repo)

### Service

The `service` package provides boilerplate for a Loopback 4 service including
database, models, datasource, repositories, and controllers.

## TODO

- Update `gulp-typescript` so that the `incremental` flag in
  `tsconfig-base.json` will actually work for the loopback4 project setup.
  As of May 2019, this is blocked awaiting APIs from Microsoft for
  typescript itself.
