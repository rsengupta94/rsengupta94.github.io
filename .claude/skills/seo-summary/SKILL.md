---
name: seo-summary
description: Draft and check a page's SEO title and description against researched best practice. Use when adding an article or case study, when the user says "write the SEO summary", "check the description", "improve the snippet", or when a description field is empty or marked TODO.
---

# Draft the SEO title and description

This is the **one** piece of user-facing text Claude drafts. Everything else on
the site is the user's own words.

Two hard rules make that safe:

1. **Derive, never invent.** The description compresses what the article already
   says. If the article does not claim it, the description does not claim it. No
   invented numbers, employers, outcomes, or credentials.
2. **Present, do not install.** Offer options, explain the trade-off, and wait for
   a choice. Write into front matter only after approval.

The evidence behind every number below is in `RESEARCH.md` beside this file, with
sources. Read it if the user questions a recommendation.

## Before drafting: read the article

Read it properly. A description written from the title alone is the failure mode
Google names — a snippet that does not summarise the page.

Identify: what the piece actually argues, the most concrete specific in it (a
number, a named tool, a threshold), and who would search for it.

## The title

Target **51–60 characters.** This is the band where Google rewrites titles least
(39–42%, versus over 76% past 60 and 99.9% past 70).

- **The front-matter `title` is the whole rendered title** for articles and case
  studies — the layout adds no brand suffix, so the budget is all yours.
- **Match the visible H1** — which is automatic here, since `title` generates
  both. Never introduce a diverging SEO title.
- **No repeated words.** Google treats repetition in titles as keyword stuffing.
- **Prefer parentheses to brackets** if you need an aside — bracketed text is
  deleted 32.9% of the time versus 19.7% for parentheses.
- **Be concrete, not clickbait.** Google's quality bar asks that a title "avoid
  exaggerating or being shocking in nature." For technical writing, precision —
  versions, error names, measured numbers — beats a curiosity gap. Google's own
  AI guidance contrasts commodity titles ("7 Tips for…") unfavourably against
  specific first-person ones.
- Front-loading the key phrase is a **convention**, not Google policy. Worth
  doing for scanning and truncation, not because it ranks.

The user wrote the title. **Only suggest a change if it breaks a rule above** —
too long, repeated words, genuinely vague. Say what the rule is and why, and let
them decide. Do not rephrase a working title for style.

## The description

**Target 120–145 characters for articles.** Not the 155–160 commonly quoted:
articles here display a publish date, and Google's visible snippet shrinks to
about 142 characters on desktop and 95–105 on mobile when a date is shown. Case
studies show no date and can run to 155.

**Put everything load-bearing in the first ~120 characters** — that is all mobile
shows.

What earns the click:

- **A summary of the whole page**, not an opening anecdote. Google's stated
  criterion for using your description over its own generated snippet is that
  yours is *more accurate*.
- **Concrete specifics.** Google explicitly endorses non-prose detail for blog
  posts — "the author, date of publication, or byline information." The technical
  equivalent: the stack, the version, the number measured, the size of the thing.
  Prefer "a 40-case harness" over "a rigorous process".
- **Unique per page.** Identical descriptions compete with each other, and Google
  calls them unhelpful.
- **Never a keyword list.** This is the one writing pattern Google links to a
  stated consequence: keyword-string descriptions "are less likely to be
  displayed as a snippet."

Set expectations honestly if it comes up: **Google uses your description only
about 28–37% of the time**, and more often overrides it for the long-tail queries
that make up most of a technical blog's traffic. It is worth doing well, and it is
not worth agonising over. It is also **not a ranking factor** — Google has said so
directly since 2009. Its only job is the click.

## Draft, then check

Offer **two or three genuinely different angles**, not three rewordings — for
example one that leads with the problem, one with the method, one with the
result. Give the character count for each, and flag which sit in the target band.

Format:

```
Description options (target 120–145 for a dated article):

A. 138 chars — leads with the problem
   "A demo convinces a room; an eval convinces a roadmap. The 40-case
    harness I run before an AI feature gets a ship date."

B. 129 chars — leads with the method
   ...
```

Then run the checker, which enforces the same thresholds:

```sh
ruby scripts/validate.rb
```

## Then write it

Only after they choose. Into the front matter as a folded block, so colons and
apostrophes need no escaping:

```yaml
description: >-
  A demo convinces a room; an eval convinces a roadmap. The 40-case harness I
  run before an AI feature gets a ship date.
```

Confirm the rendered result:

```sh
curl -s http://localhost:4000/articles/<slug>/ | grep -oE '<meta name="description"[^>]*'
```

## What not to do

- Do not touch `_layouts/default.html`'s title logic without reading the comment
  block there first. It encodes the brand-suffix decision and why.
- Do not add `nosnippet`, `data-nosnippet`, or a low `max-snippet`. Beyond
  hurting normal results, they make the page ineligible for AI Overviews — a page
  must be showable *with a snippet* to appear there.
- Do not chase "AI SEO" advice. Google's position (May 2026) is explicit: "There
  are no additional requirements to appear in AI Overviews or AI Mode, nor other
  special optimizations necessary." `llms.txt` and special markup are ignored
  entirely.
- Do not present third-party numbers as Google policy. Google publishes **no**
  length limits for either field. Every threshold here is convention drawn from
  the studies in `RESEARCH.md`, which is why the validator warns rather than
  fails.
