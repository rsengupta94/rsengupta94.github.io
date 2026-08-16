# Personal portfolio

Static personal site — plain HTML, CSS and JavaScript. No framework, no build
step, no dependencies. Ported from a Claude Design mockup and intended for
GitHub Pages.

## ⚠️ The content is still placeholder

Everything in `js/data.js` came from the design mockup and is **invented sample
copy**. It currently claims employers (Northwind Labs, Freightline, Craftworks),
metrics, GitHub star counts and an email address that are not real, and those
contradict the logo strip (Coursera, D. E. Shaw, Amazon, PwC). Replace it all
before publishing.

Minimum to fix before going live:

| Where | What |
| --- | --- |
| `js/data.js` → `SITE` | email, GitHub / LinkedIn URLs, source URL, "Now", "Open to" |
| `js/data.js` → `WORKS`, `EXPERIENCE` | real employers, dates, outcomes |
| `js/data.js` → `EXPERIMENTS` | real repos and links (currently `href: '#'`) |
| `js/data.js` → `ARTICLES` | real posts, or delete the array to empty the tab |
| repo root | add `resume.pdf` |
| `assets/` | add `portrait.jpg`, then set `SITE.portrait` |
| `index.html` | `<title>`, `description`, and the Open Graph tags |

## Layout

```
index.html          page shell: nav, contact band, footer
404.html            redirects unknown paths back to the hash router
css/modernist.css   design tokens + shared components (buttons, tags, nav)
css/site.css        page layout
js/data.js          all content — the only file you edit for normal updates
js/app.js           hash router and renderers
assets/             company logos
.nojekyll           serve files as-is, skip Jekyll processing
```

## Running it locally

Any static file server works. It must be served over HTTP rather than opened
as a `file://` path, or the relative asset paths break.

```sh
python3 -m http.server 8000
# then open http://localhost:8000
```

## How routing works

Navigation lives in the URL hash, so GitHub Pages needs no server-side rewrite
rules and every view is linkable:

```
#/              About
#/experiments   Experiments
#/work          Work index
#/work/<slug>   Work case study
#/articles      Articles index
#/articles/<slug>
#/experience    Experience
```

Slugs come from the `slug` field in `js/data.js`. An unknown slug falls back to
the relevant index page rather than erroring.

The trade-off worth knowing: hash routing means crawlers see one page. Links
still preview and share correctly, but if per-article SEO matters later, split
the articles into real `.html` files.

## Deploying to GitHub Pages

For a user site published at `https://<username>.github.io`, the repository
**must** be named exactly `<username>.github.io`.

```sh
# 1. Create the repo on GitHub named <username>.github.io (public, empty).

# 2. Point this folder at it and push.
git remote add origin git@github.com:<username>/<username>.github.io.git
git branch -M main
git push -u origin main
```

Then in the repo: **Settings → Pages → Build and deployment**, set *Source* to
"Deploy from a branch", branch `main`, folder `/ (root)`. The first build takes
a minute or two.

To publish at `https://<username>.github.io/portfolio` instead, name the repo
anything you like and enable Pages the same way. One change is required: in
`404.html`, `location.replace('/' + location.hash)` must become
`location.replace('/portfolio/' + location.hash)`, since the site no longer sits
at the domain root.

### Custom domain

Add a `CNAME` file containing just the domain, point a DNS `CNAME` record at
`<username>.github.io`, then tick "Enforce HTTPS" once the certificate is issued.

## Notes

- Dark mode follows a manual toggle and persists in `localStorage` under
  `pf-theme`. It defaults to light; it does not currently follow the OS setting.
- The theme is applied by an inline script before first paint to avoid a flash
  of the wrong theme on reload.
- Archivo is loaded from Google Fonts — the only external request the site makes.
