---
name: retire-content
description: Remove, rename, or unpublish an article or case study without breaking live URLs or search rankings. Use when the user says "delete this article", "remove that post", "rename this article", "change the slug", "unpublish this", or "take that down".
---

# Retire or move published content

**Never `rm` or `mv` a published article directly.** The filename is the URL. A
bare delete or rename silently breaks every inbound link and throws away the
page's accumulated search ranking. `scripts/validate.rb` will refuse to pass if a
previously published slug stops resolving, which is the backstop for exactly this
mistake.

The right action depends on one question, so **ask it first**:

> Is there another page that now covers this material, or is this content simply
> gone?

## First, establish whether it was ever actually published

This changes everything. If the URL was never live, none of the SEO machinery
matters and you can just delete the file.

```sh
git log --all --diff-filter=A --name-only --format= -- _posts/ _work/ | sort -u
grep '^url:' _config.yml
```

If the slug never appears in git history, **or** `url:` is still the placeholder
`yourhandle.github.io` (meaning the site has never been published under a real
domain), then simply delete the file and say so. Do not build redirect machinery
for a URL the world never saw.

## Decision tree

### Case 1 — Superseded: a newer/better page covers it

Add the old path to the **replacement** page's front matter:

```yaml
---
title: "The newer article"
redirect_from:
  - /articles/old-slug/
---
```

Then delete the old file. `jekyll-redirect-from` generates a stub at the old URL
carrying `rel=canonical`, an instant meta refresh, and a JS redirect — all
pointing at the replacement.

Why this works: Google documents that it interprets an **instant** meta refresh
as a permanent redirect, and states that permanent redirects do not lose
PageRank. GitHub Pages cannot issue a real HTTP 301, so this is the closest
available, and it is the officially supported plugin for it.

**Keep the redirect forever.** Google's guidance is a minimum of one year for
signals to transfer; the stub costs nothing, so there is no reason to remove it.

The replacement must genuinely cover the same ground. Redirecting to a loosely
related page — or to the index, or the homepage — is treated as a *soft 404* and
is explicitly discouraged. If there is no true successor, use Case 2 instead.

### Case 2 — Genuinely gone, no replacement

Delete the file. That's it.

The URL then returns a real HTTP 404 from GitHub Pages, `404.html` is served, and
Google drops it from the index. This is correct and healthy: Google states plainly
that 404s do not harm a site's ranking or indexing, and that reporting missing
pages honestly *improves* crawl coverage of the content that remains.

**Do not** redirect it to `/`, `/articles/`, or anything else as a consolation.
That produces a soft 404, keeps the dead URL being crawled, and consolidates no
signal anywhere. Google calls this out specifically.

Also drop any internal links pointing at it — check with:

```sh
grep -rn "old-slug" --include="*.md" --include="*.html" --include="*.yml" \
  . --exclude-dir=_site --exclude-dir=vendor
```

`sitemap.xml` regenerates on every build, so the URL disappears from it
automatically. Nothing to do.

410 would be marginally faster than 404, but Google treats them identically and
GitHub Pages cannot send a 410 anyway. Not worth a thought.

### Case 3 — Renaming / changing a slug

Mechanically identical to Case 1: the "replacement" is the same article at its new
name.

1. Create the file under the new name
2. Add the old path under `redirect_from:` in its front matter
3. Delete the old file
4. Run `ruby scripts/validate.rb` to confirm the old slug still resolves

Before doing any of it, **push back once**: is the rename worth it? The visible
`title:` can change freely without touching the URL, and that is usually what the
user actually wants. A slug change costs a permanent redirect stub and a period of
ranking turbulence. Worth it for a genuinely wrong or embarrassing URL; not worth
it for a tidier phrasing.

### Case 4 — Keep the URL working, but remove it from search

For content with inbound links or archive value that should no longer surface in
results. Add to the page's front matter:

```yaml
noindex: true
sitemap: false
```

`_layouts/default.html` turns `noindex: true` into `<meta name="robots"
content="noindex">`, and `sitemap: false` keeps it out of `sitemap.xml`.

Critical constraint: the page **must stay crawlable**. Never also block it in
`robots.txt` — if Google cannot fetch the page, it never sees the `noindex` and
the URL can linger in results indefinitely.

### Case 5 — Urgent: wrong or sensitive information is live in search results

Ordering matters here, and it is counter-intuitive.

1. **First**, while the URL still resolves, use Search Console → Removals →
   "Temporarily remove URL". This suppresses it from results within about a day.
2. **Then** ship the deletion (Case 1 or 2).
3. **Then** use URL Inspection → Request indexing to prompt a recrawl.

Why that order: the removal request *expires early if Google finds the URL
already 404ing*. Deleting first undermines the fast suppression. Note the block is
display-only and lasts roughly six months — it buys time, it does not de-index.
The permanent fix is the deletion itself.

These are Search Console actions in a browser. **Tell the user to do them; do not
attempt them.**

## Always finish with

```sh
ruby scripts/validate.rb
```

Then state plainly:

- Which case applied and why
- Which files changed
- Whether the old URL still resolves, and how
- That nothing is live until they explicitly publish
- Any Search Console step that is theirs to do manually
