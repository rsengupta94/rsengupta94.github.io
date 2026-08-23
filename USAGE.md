# Usage

How to add, edit, and remove everything on this site. Line numbers are current
as of 18 Aug 2026; if a file has shifted, search for the key instead.

## Three rules

1. **Never edit anything inside `_site/`.** That folder is generated output. It
   looks like the real site and a browser will happily show your changes, but
   the next build overwrites it and the work is gone. Source files live at the
   repo root and in the underscore folders.
2. **Never change a filename slug after it has been published.** The filename is
   the URL. Renaming breaks every inbound link and the page's search ranking.
   `title:` inside the file can change freely.
3. **Never date a post in the future.** Jekyll skips future-dated posts with no
   error. The page simply is not there.

`ruby scripts/validate.rb` catches all three. Exit 0 means safe, exit 1 means do
not publish.

## Commands

```sh
bundle exec jekyll serve --livereload   # http://localhost:4000
ruby scripts/validate.rb                # run before every publish
```

Live reload picks up every file except `_config.yml`, which is read once at
startup. Change that file and you must restart the server.

Check for a server already running before starting another: `pgrep -f "jekyll serve"`.

## Adding content

### The drop folder

Put a finished `.md` file in `_inbox/`, then say "new article" or "new project"
in Claude Code. No file path needed.

You approve two things. Claude does everything else:

| Yours to approve | Handled for you |
| --- | --- |
| The slug, because it becomes the URL and is permanent | Filename and date |
| The SEO `description`, drafted from your own text | Front matter, `tag`, placement in `_posts/` or `_work/` |
| | Validation, preview URL, index listing |

Your prose is copied in exactly as written. Once the file is set up, the
original moves to `_inbox/done/`, so `_inbox/` only ever shows what is still
waiting.

Nothing in `_inbox/` can reach the built site. The folder is in the `exclude`
list at `_config.yml:81`, so a dropped file cannot publish itself whatever front
matter it carries. And nothing is live until `git push`.

### An article

Drop it in `_inbox/` and say "new article". To do it by hand instead:

1. Copy `_templates/article.md` to `_posts/YYYY-MM-DD-slug.md`.
2. Use today's date or earlier. The slug becomes `/articles/slug/`.
3. Fill in `title`, `description`, `tag`. The body goes below the closing `---`.

It appears at its own URL and on `/articles/` automatically, in date order. You
never edit the index page.

Read time is computed from word count at build time. There is no `read_time`
field to set.

### A project (case study)

Drop it in `_inbox/` and say "new project". To do it by hand instead:

1. Copy `_templates/case-study.md` to `_work/slug.md`. No date in the filename.
2. Fill in `title`, `description`, `org`, `period`, `role`, `outcome`, `summary`,
   `tags`, `order`, and the `schema` list.
3. `order` sorts the `/work/` index, lower first. A case study without it sorts
   above everything else.

When the first case study lands, delete lines 9-11 of `work.html`
(`coming_soon`, `noindex`, `sitemap`). The page returns to normal on its own.

### An experiment

Add an entry to `_data/experiments.yml`. The shape and the rules for each field
are in `_templates/experiments.yml`.

The 01/02/03 numerals come from list position, so entries can be reordered or
removed without renumbering. Every `href` must be a real URL; validate.rb warns
about `#` placeholders.

When the first entry lands, delete lines 9-11 of `experiments.html`.

### A job or qualification

Add an entry to `_data/experience.yml`. Shape in `_templates/experience.yml`.
Entries render top to bottom, so newest first.

The page is currently switched off. To bring it back:

- Delete `published: false` at `experience.html:12`
- Uncomment the Experience link at `_includes/nav.html:16-18`

## Changing a slug or a description yourself

You approve both when the file is created, but neither is locked to that moment.

**The description** is the `description:` key in the file's own front matter:

```
_posts/2026-08-18-your-slug.md    →  description: …
_work/your-slug.md                →  description: …
```

Change it whenever you like, before or after publishing. It has no effect on the
URL. `validate.rb` flags it if the length drifts outside the useful range, and
the `seo-summary` skill will check a rewrite against the same limits.

**The slug** is the filename, and the rule depends on one thing: has it been
pushed?

| State | What to do |
| --- | --- |
| Not pushed yet | Rename the file freely. Nothing points at it. |
| Already pushed | Do not rename. Use the `retire-content` skill, which puts the old path in `redirect_from:` so existing links keep working. |

`validate.rb` fails if a slug that was published before stops resolving, which
is the guard against renaming by accident.

The `title:` inside the file is separate from the slug and is always free to
change.

## Editing content

Body text, titles, and any front-matter value other than the filename can change
whenever you like. Edit the file, save, done.

| What | Where |
| --- | --- |
| An article's text or title | `_posts/YYYY-MM-DD-slug.md` |
| A case study's text or fields | `_work/slug.md` |
| An experiment row | `_data/experiments.yml` |
| A job row | `_data/experience.yml` |
| Logo strip | `_data/companies.yml` |
| Stack rows | `_data/stack.yml` |

The `_data/*.yml` files are plain lists. YAML is whitespace-sensitive, and bad
indentation there is the most likely cause of a failed build.

## Deleting content

For an article or case study, what to do depends on whether something replaces
it. `validate.rb` fails if a previously published slug stops resolving, which is
the guard against doing this by accident.

**Something replaces it, or you are renaming.** Put the old path in the
replacement's front matter, then delete the old file:

```yaml
redirect_from:
  - /articles/old-slug/
```

**Nothing replaces it.** Delete the file. The URL returns a real 404 and Google
drops it. Do not redirect it to the homepage; that creates a soft 404 and keeps
the dead URL being crawled.

**You want the URL alive but out of search.** Add `noindex: true` and
`sitemap: false` to its front matter. Leave it crawlable, or Google never sees
the noindex.

For experiments and experience, delete the YAML block. No URL is involved and
nothing breaks.

The `retire-content` skill walks through all of this.

## The About page, area by area

`index.html` is the About page. Some of what it shows is written inline, and
some is pulled from `_config.yml` because other pages use the same value.

| Visible area | File and line |
| --- | --- |
| Your name, the big heading | `_config.yml:10` (`title`) |
| Tagline under the name | `_config.yml:11` (`tagline`) |
| First intro paragraph | `index.html:13-15` |
| Second intro paragraph | `index.html:16-18` |
| "Now:" line | `_config.yml:35` (`now`) |
| "Open to:" line | `_config.yml:36` (`open_to`) |
| Email button | `_config.yml:23` (`email`) |
| GitHub button | `_config.yml:24` (`github_url`) |
| LinkedIn button | `_config.yml:25` (`linkedin_url`) |
| Resume button | `_config.yml:30` (`resume_url`) |
| Portrait photo | `_config.yml:33` plus the file in `assets/` |
| Logo strip | `_data/companies.yml` |
| Stack section | `_data/stack.yml` |

The values in `_config.yml` are there because more than one page reads them.
`tagline` also fills the homepage browser-tab title. `email` also appears in the
contact band and at the foot of every case study. `resume_url` drives buttons on
three pages, and leaving it empty hides all of them rather than shipping a dead
link.

Everything in that table needs a server restart if you change it in
`_config.yml`. The two paragraphs in `index.html` reload instantly.

## Everything else

| What | Where |
| --- | --- |
| Nav links | `_includes/nav.html` |
| Contact band, on every page | `_includes/contact.html` |
| Footer | `_includes/footer.html` |
| Heading and intro on the articles page | `articles.html` |
| Heading and intro on the work page | `work.html` |
| Heading and intro on the experiments page | `experiments.html` |
| Heading and intro on the experience page | `experience.html` |
| Every article page at once | `_layouts/article.html` |
| Every case study at once | `_layouts/work.html` |
| Browser tab titles | `_layouts/default.html:39-47` |
| Colours, fonts, spacing | `css/modernist.css` |
| Page layout | `css/site.css` |
| Dark-mode toggle | `js/app.js` |
| 404 page | `404.html` |

## Pending right now

**Blocks going live:**

| Item | Why it matters |
| --- | --- |
| `_config.yml:16` `url` is `https://yourhandle.github.io` | Canonical tags and `sitemap.xml` are generated from it. Search engines would be pointed at the wrong domain. |
| `_config.yml:26` `source_url` is `yourhandle/yourhandle.github.io` | Powers the "Site source" link in the footer and "Open an issue" on every article. Both currently 404. |

**Sections with no content:**

| Section | State |
| --- | --- |
| `/articles/` | `_posts/` is empty. The page renders its heading and intro with an empty list below. Unlike work and experiments, it has no "coming soon" guard, so it looks unfinished rather than deliberate. |
| `/work/` | `_work/` is empty. Shows "Coming soon", hidden from search. |
| `/experiments/` | `_data/experiments.yml` is empty. Shows "Coming soon", hidden from search. |
| `/experience/` | `_data/experience.yml` is empty and the page is switched off entirely. No URL, no nav link. |

**Smaller items:**

- `resume_url` is empty, so the resume buttons are hidden on the About page, the
  contact band, and the experience page. Add `resume.pdf` at the repo root and
  set `resume_url: /resume.pdf` to bring them back.
- `README.md` still warns about placeholder employers (Northwind Labs,
  Freightline, Craftworks) and invented metrics. That content is gone from the
  data files. The warning is stale and can be rewritten.

## Claude Code skills

| Skill | What it does |
| --- | --- |
| `preview` | Starts or reuses the local server |
| `new-article` | Takes a finished article and handles filename, date, slug, front matter, SEO |
| `new-project` | Same for a case study |
| `seo-summary` | Drafts and checks `title` and `description` |
| `retire-content` | Removes or renames content without breaking URLs |
| `publish` | Validates, shows what would ship, commits only on explicit go-ahead |

You write all content prose. Claude handles filenames, dates, front matter,
placement, validation, and the server, and drafts the SEO description from your
own text for your approval. Git runs only when you say so.
