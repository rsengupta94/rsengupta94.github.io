---
name: publish
description: Validate everything, show exactly what would go live, and commit and push only after explicit go-ahead. Use when the user says "publish", "ship it", "push this live", "deploy", or "make it live".
---

# Publish

"Publish" means: **check everything, show what would ship, then stop and ask.**

Git runs only after the user says yes in that exchange. Never fold `git add`,
`commit`, or `push` into the preparation steps and never treat an earlier "yes"
from a previous publish as standing permission.

## 1. Validate — this gates everything

```sh
ruby scripts/validate.rb
```

**Any error means stop.** Report them and fix what is mechanical (a filename, a
missing front-matter key). Anything needing their judgement goes back to them.
Do not offer to publish "anyway" — the checks exist because these failures are
invisible in preview.

## 2. Confirm the production build succeeds

Preview and the real build differ enough to be worth one command:

```sh
bundle exec jekyll build
```

A clean build here means GitHub's build will almost certainly also succeed.

## 3. First-publish gate

If this is the first ever push, two things are blockers rather than warnings.
Check both:

```sh
grep '^url:' _config.yml
ruby scripts/validate.rb | grep -i placeholder
```

- **`url:` still `yourhandle.github.io`** — canonical tags and `sitemap.xml` are
  generated from it. Publishing with the wrong value actively misdirects search
  engines. Must be fixed first.
- **Placeholder content from the design mockup** — invented employers (Northwind
  Labs, Freightline, Craftworks), fabricated metrics and star counts, a fake
  email address. Publishing these means publishing false claims about the user's
  own career. **Raise this explicitly and get a deliberate decision.** Do not
  quietly proceed because the checks technically passed.

## 4. Show exactly what would ship

```sh
git status --short
git diff --stat
```

Summarise in plain terms — not a raw diff dump:

- Which articles or projects are new, and their live URLs once pushed
- Which existing files changed
- Anything unexpected (build artifacts, stray files)

If `_site/`, `vendor/`, or `.jekyll-cache/` appear, something is wrong with
`.gitignore` — stop and fix that first rather than committing build output.

## 5. Propose the commit, then wait

Draft a message describing the change from the reader's perspective:

```
Add article: evals before demos
Fix broken repo link on experiments page
Update role and dates in experience
```

Then ask for the go-ahead. Show the exact commands you intend to run:

```sh
git add <specific paths, never -A on a first publish>
git commit -m "<message>"
git push
```

**Stop here.** Wait for a clear yes.

## 6. On explicit go-ahead

Run them. Stage specific paths rather than `git add -A` so nothing unrelated is
swept in. If the push fails (no remote, no upstream branch, auth), report the
actual error and stop — do not improvise remote configuration.

## 7. After pushing

Tell them:

- GitHub rebuilds automatically; roughly a minute
- The live URL of anything new
- If the build fails, GitHub emails them and the error appears under the repo's
  **Actions** tab
- **First publish only:** submit `https://<domain>/sitemap.xml` in Google Search
  Console once, or nothing gets indexed promptly. This is theirs to do in a
  browser.

## First-ever deploy — repo setup

Only relevant if no remote exists yet (`git remote -v` is empty).

For a user site at `https://<username>.github.io`, the repository **must** be
named exactly `<username>.github.io`. Then:

```sh
git remote add origin git@github.com:<username>/<username>.github.io.git
git branch -M main
git push -u origin main
```

Then **Settings → Pages → Build and deployment**: source "Deploy from a branch",
branch `main`, folder `/ (root)`.

Creating the GitHub repository and changing repository settings are **theirs to
do** — walk them through it, do not attempt it.

For a project site at `<username>.github.io/portfolio` instead, set
`baseurl: "/portfolio"` in `_config.yml`; every internal link already runs through
`relative_url`, so that is the only code change needed.
