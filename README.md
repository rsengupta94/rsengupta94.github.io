# Personal portfolio

Static personal site built with Jekyll and hosted on GitHub Pages. Articles are
markdown files; GitHub builds them into real pages on push. The only JavaScript
on the site is the dark-mode toggle.

## ⚠️ The content is still placeholder

Everything came from a design mockup and is **invented sample copy**. It
currently claims employers (Northwind Labs, Freightline, Craftworks), metrics,
GitHub star counts and an email address that are not real, and those contradict
the logo strip (Coursera, D. E. Shaw, Amazon, PwC). Replace it all before
publishing.

| Where | What |
| --- | --- |
| `_config.yml` | `url`, email, GitHub / LinkedIn URLs, source URL, "Now", "Open to" |
| `index.html` | the two About-page intro paragraphs |
| `_data/experience.yml` | real employers, dates, achievements |
| `_data/experiments.yml` | real repos and links (every `href` is `#`) |
| `_work/*.md` | real case studies |
| `_posts/*.md` | real articles, or delete the files to empty the tab |
| repo root | add `resume.pdf` |
| `assets/` | add `portrait.jpg`, then set `portrait:` in `_config.yml` |

`url:` in `_config.yml` matters most — canonical tags and `sitemap.xml` are
generated from it, and search engines rely on both being correct.

## Local preview

One-time setup (already done on the machine this was built on — `brew install
ruby` put Ruby 4.x on the PATH, and `bundle install` put the gems in
`vendor/bundle`):

```sh
brew install ruby
bundle install
```

To preview, from the repo root:

```sh
bundle exec jekyll serve --livereload
# → http://localhost:4000
```

Leave it running. Save any file and the browser refreshes itself. Stop it with
Ctrl-C.

Note the local Jekyll is 4.x while GitHub Pages builds with 3.9.x. For a site
this simple the output is identical; the `github-pages` gem, which would pin the
exact versions, no longer installs on current Ruby and isn't worth the trouble
here.

## Pre-publish checks

```sh
ruby scripts/validate.rb
```

Run this before every publish, and after any file rename. It enforces the three
things Jekyll fails at *silently*, where the only symptom is a page that isn't
there:

- **Future-dated posts** — Jekyll skips them with no error
- **Renamed or removed slugs** — the filename is the URL; changing it breaks
  every inbound link and the page's search ranking
- **Colliding slugs** — two files wanting one URL, one silently shadowing the other

It also checks front matter is complete, flags title/description lengths against
SEO limits, catches duplicate descriptions, and warns about leftover placeholder
content and dead `#` links.

Exit 0 means safe to publish. Exit 1 means don't.

## Claude Code workflow

The repo carries a `CLAUDE.md` working agreement and skills in `.claude/skills/`,
so a Claude Code session in this folder can handle the mechanics while you write
the words:

| Skill | What it does |
| --- | --- |
| `preview` | Starts or reuses the local server |
| `new-article` | Takes in a finished article: filename, date, slug, front matter, SEO |
| `new-project` | Same for a case study |
| `seo-summary` | Drafts and checks `title` / `description` |
| `retire-content` | Removes or renames content without breaking URLs |
| `publish` | Validates, shows what would ship, commits only on explicit go-ahead |

The division: you write all content prose; Claude handles filenames, dates, front
matter, placement, validation, and the server. Claude drafts the SEO description
for your approval, derived from your own text. Git runs only when you say so.

## Publishing an article

1. Copy `_templates/article.md` — it holds the front-matter block with the rule
   for every key in comments, and is the one place that contract is written down.
2. Name the copy `YYYY-MM-DD-slug.md`. The date sets the displayed date and sort
   order; the slug becomes the URL (`/articles/slug/`).
3. Save it into `_posts/` and fill in the values.
4. `git add`, `git commit`, `git push`.

It appears at its own URL and on the articles index automatically, in date
order. You never edit the index.

Three traps: **future-dated posts don't publish** (Jekyll skips them, silently);
a filename not matching `YYYY-MM-DD-slug.md` is ignored, also silently; and
changing a slug after publishing breaks every existing link to it.

## Editing

Edit any file, then commit and push — that's the whole loop. For small fixes you
can edit directly on github.com with the pencil icon and skip the clone entirely.

| What to change | File |
| --- | --- |
| Contact details, site title, "Now" / "Open to" | `_config.yml` |
| About-page intro | `index.html` |
| Logo strip | `_data/companies.yml` |
| Stack rows | `_data/stack.yml` |
| Experiments list | `_data/experiments.yml` |
| Job history | `_data/experience.yml` |
| A case study | `_work/<slug>.md` |
| A section page's heading and intro | `articles.html`, `work.html`, `experiments.html`, `experience.html` |
| Nav links | `_includes/nav.html` |
| Contact band | `_includes/contact.html` |
| Footer | `_includes/footer.html` |
| Every article page at once | `_layouts/article.html` |
| Every case study at once | `_layouts/work.html` |
| Colors, fonts, spacing tokens | `css/modernist.css` |
| Page layout | `css/site.css` |

The `_data/*.yml` files are plain lists — add or remove an entry and the page
follows. YAML is whitespace-sensitive, and bad indentation there is the most
likely cause of a failed build.

## Removing or renaming published content

The filename is the URL, so deleting or renaming a published article throws away
every inbound link to it and its accumulated search ranking. `validate.rb` fails
if a previously published slug stops resolving, which is the guard against doing
this by accident.

What to do depends on one question — is there a replacement?

**A newer page covers it, or you're renaming.** Put the old path in the
replacement's front matter, then delete the old file:

```yaml
---
title: "The newer article"
redirect_from:
  - /articles/old-slug/
---
```

`jekyll-redirect-from` generates a stub at the old URL with a canonical link, an
instant meta refresh, and a JS redirect. Google interprets an instant meta
refresh as a permanent redirect and does not drop PageRank across it, which is
the closest thing available on GitHub Pages — static hosting cannot send a real
HTTP 301. Keep the stub indefinitely; Google's guidance is a year minimum and it
costs nothing.

**It's genuinely gone with no successor.** Just delete the file. The URL returns
a real 404, `404.html` is served, and Google drops it. That's correct: 404s don't
harm ranking, and honest 404s improve crawl coverage of what remains.

Do **not** redirect a dead page to the homepage or an index as consolation — that
creates a "soft 404", keeps the dead URL being crawled, and consolidates nothing.
Google discourages it explicitly.

**You want to keep the URL alive but out of search.** Add `noindex: true` and
`sitemap: false` to its front matter. The page must stay crawlable — never also
block it in `robots.txt`, or Google never sees the `noindex`.

## Layout

```
_config.yml         site settings and collection/permalink config
_layouts/           default.html (page shell), article.html, work.html
_includes/          nav, contact band, footer — shared by every page
_data/              companies, stack, experiments, experience
_templates/         skeletons to copy for new content — not published
_posts/             articles → /articles/<slug>/
_work/              case studies → /work/<slug>/
index.html          About page
articles.html       articles index (loops over _posts)
work.html           work index (loops over _work)
experiments.html    experiments index
experience.html     experience page
404.html            not-found page
robots.txt          points crawlers at sitemap.xml
css/, js/, assets/  styles, the theme toggle, logos
```

`_site/`, `vendor/` and `.jekyll-cache/` are build output and are gitignored.

## Deploying to GitHub Pages

For a user site at `https://<username>.github.io`, the repository **must** be
named exactly `<username>.github.io`.

```sh
git remote add origin git@github.com:<username>/<username>.github.io.git
git branch -M main
git push -u origin main
```

Then **Settings → Pages → Build and deployment**: source "Deploy from a branch",
branch `main`, folder `/ (root)`. The first build takes a minute or two. There is
no `.nojekyll` file, and there must not be — its presence would disable the
Jekyll build.

If the build fails, GitHub emails you and shows the error under the repo's
**Actions** tab.

To publish at `https://<username>.github.io/portfolio` instead, name the repo
whatever you like and set `baseurl: "/portfolio"` in `_config.yml`. Every
internal link already runs through `relative_url`, so that one line is the only
change needed.

### After the first deploy

Submit `https://<yourdomain>/sitemap.xml` in
[Google Search Console](https://search.google.com/search-console) once. New
articles are then discovered automatically.

### Custom domain

Add a `CNAME` file containing just the domain, point a DNS `CNAME` record at
`<username>.github.io`, update `url:` in `_config.yml`, then enable "Enforce
HTTPS" once the certificate is issued.

## Notes

- Dark mode is a manual toggle persisted in `localStorage` under `pf-theme`. It
  defaults to light and does not follow the OS setting. An inline script in
  `_layouts/default.html` applies it before first paint to avoid a flash of the
  wrong theme.
- Every page renders fully without JavaScript, including nav highlighting.
- Archivo is loaded from Google Fonts — the only external request the site makes.
