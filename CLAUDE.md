# Portfolio site — working agreement

Jekyll site published to GitHub Pages. Articles and case studies are markdown
files; GitHub builds them into real pages on push.

## Division of labour — read this first

**Rajarshi writes all content prose. Claude never does.**

Articles are written elsewhere and arrive finished. Claude's job is everything
*around* the words: filenames, dates, front-matter keys, folder placement, slug
hygiene, the preview server, validation, and pointing at the exact file and line
to edit.

| Who | What |
| --- | --- |
| Rajarshi | Article bodies, project write-ups, blurbs, bio — every sentence that appears as content |
| Claude | Filenames, dates, front matter, file placement, slug integrity, server, validation, structural edits (layouts, CSS, templates) |
| Claude drafts → Rajarshi approves | SEO `title` and `description` only (see the `seo-summary` skill) |

The SEO description is the one exception, and it is a *derivation* of text
Rajarshi already wrote — never new claims. If the article does not say it, the
description does not say it. Present drafts as options and wait for approval.

**Never invent biographical or factual content.** Employers, dates, metrics,
star counts, job titles. If a field needs a fact Claude does not have, leave a
`TODO` and say so.

## Git — explicit go-ahead only

Never run `git add`, `git commit`, `git push`, or `git init` unless Rajarshi says
so in that message. Read-only git (`status`, `log`, `diff`) is fine any time.

"Publish this" is a request to *prepare and check*, then ask. Show what would be
committed, wait for a clear yes, then run it.

## The three silent traps

Jekyll fails silently on all three — the symptom is a page that just is not
there. `scripts/validate.rb` enforces them. **Run it before any publish, and
after any file rename or move.**

```sh
ruby scripts/validate.rb          # exit 0 = safe, exit 1 = do not publish
ruby scripts/validate.rb --strict # warnings count as errors too
```

1. **Future dates never publish.** A post dated after today is skipped with no
   error. When stamping a date into a filename, always use today's date or
   earlier — never "when it was written" if that is in the future, and never a
   planned publication date.
2. **A published slug can never change.** The filename slug *is* the URL.
   Renaming breaks every existing link and the search ranking. `title:` is free
   to change; the filename is not. To remove or move published content, use the
   `retire-content` skill — never a bare `rm` or `mv`.
3. **Slugs must be unique.** Two files resolving to one URL means one silently
   shadows the other.

## Layout

```
_posts/YYYY-MM-DD-slug.md   articles      → /articles/slug/
_work/slug.md               case studies  → /work/slug/
_data/*.yml                 list content: experiments, stack, experience, logos
index.html                  About page prose
articles.html work.html experiments.html experience.html    index pages
_layouts/ _includes/        page structure, shared nav/contact/footer
css/ js/ assets/            styles, theme toggle, logos
scripts/validate.rb         pre-publish checks
_site/ vendor/              build output — generated, gitignored, never edit
```

Underscore-prefixed folders are Jekyll inputs, not published as-is.

## Routing content to the right place

When Rajarshi describes something to add or change, route it:

| They say | Goes in |
| --- | --- |
| an article, post, write-up, field note | `_posts/YYYY-MM-DD-slug.md` |
| a project, case study, work I shipped | `_work/slug.md` |
| an experiment, side project, repo | an entry in `_data/experiments.yml` |
| a job, role, employer | an entry in `_data/experience.yml` |
| skills, tools, stack | `_data/stack.yml` |
| my bio, intro, "about me" | `index.html` |
| contact details, email, links | `_config.yml` |

The distinction between an article/project and a `_data` entry: if it deserves
its own URL and its own paragraphs, it is a markdown file. If it is a row in a
list, it is YAML.

## Server

Preview runs at `http://localhost:4000`. **Always check for an existing server
before starting one** — `pgrep -f "jekyll serve"` — and reuse it rather than
failing on a port clash. Ruby lives at `/opt/homebrew/opt/ruby/bin` but is
already on PATH; `bundle exec jekyll serve --livereload` from the repo root is
all that is needed.

Live reload picks up every file except `_config.yml`, which is read once at boot
and needs a server restart.

## Current state — placeholder content

The site still carries invented content from the design mockup it was ported
from: employers (Northwind Labs, Freightline, Craftworks), metrics, GitHub star
counts, and the address `hello@rajarshisengupta.dev`. These contradict the real
logo strip (Coursera, D. E. Shaw, Amazon, PwC).

`validate.rb` warns about these. **Flag them before any first publish** — the
tooling should not help publish false claims faster. They are Rajarshi's to
replace, not Claude's to invent.

`url:` in `_config.yml` is also still a placeholder; canonical tags and
`sitemap.xml` derive from it, so it must be correct before deploying.

## Skills

| Skill | Use |
| --- | --- |
| `preview` | Start or reuse the local preview server |
| `new-article` | Take in a finished article file: name, place, front matter, SEO |
| `new-project` | Same, for a work case study |
| `seo-summary` | Draft and check `title` / `description` against researched practice |
| `retire-content` | Remove or move published content without breaking URLs |
| `publish` | Validate, show what would ship, then commit on explicit go-ahead |

## Conventions worth not re-deriving

- **Read time is computed** from word count at build time. There is no
  `read_time` field; do not add one.
- **Experiment numerals are computed** from list position in
  `_data/experiments.yml`. There is no `num:` field; entries can be reordered
  freely.
- **Titles carry no brand suffix on content pages** — see the comment block in
  `_layouts/default.html` for why, before changing it.
- **`noindex: true`** in a page's front matter emits a robots noindex; pair it
  with `sitemap: false`. `jekyll-seo-tag` emits no robots tag on its own.
- **`redirect_from:`** in front matter keeps an old URL alive after a rename. The
  stub template is overridden in `_layouts/redirect.html` to drop the plugin's
  `noindex`, which would otherwise conflict with the redirect.
