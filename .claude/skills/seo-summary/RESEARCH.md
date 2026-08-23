# Research brief: titles and meta descriptions

Gathered 2026-08-17 from Google Search Central plus the largest public studies.
This is the evidence behind the thresholds in `SKILL.md` and
`scripts/validate.rb`. Change them together.

## The most important caveat

**Google publishes no numeric length limit for either field.** Verbatim, on
titles: "While there's no limit on how long a `<title>` element can be, the title
link is truncated in Google Search results as needed, typically to fit the device
width." The same hedge appears in the snippet doc.

So every number below is third-party convention, not policy. That is why the
validator treats all length findings as **warnings, never errors**.

Sources: <https://developers.google.com/search/docs/appearance/title-link> ·
<https://developers.google.com/search/docs/appearance/snippet>

## Titles

### Length

Target **51–60 characters**. Truncation is by *pixel* width (~580px, hard ceiling
600px), not character count — "WWW" is far wider than "iii" — so character counts
are a proxy.

Rewrite rate by title length (Zyppy, 80,959 titles across 2,370 sites, Q1 2022):

| Length | Rewritten |
| --- | --- |
| 1–5 chars | 96.6% |
| ≤20 chars | >50% |
| **51–60 chars** | **39–42% — the minimum** |
| 60+ chars | >76% |
| 70+ chars | 99.9% |

Zyppy's traffic analysis of ~250,000 URLs also peaked at 55–60 characters.

<https://zyppy.com/title-tags/meta-title-tag-length/> ·
<https://zyppy.com/seo/google-title-rewrite-study/>

Disagreement on the pixel ceiling: 550 (Semrush) vs 580–600 (Zyppy) vs 600
(Ahrefs). We use 580 target / 600 cap.

Conflict worth knowing: a Backlinko study claims 15–40-char titles earn 36% more
clicks, pulling against the 51–60 rewrite data. No reconciliation found. We
follow Zyppy since its traffic data also favours the longer range.

### How often Google rewrites

- **Google's own figure: `<title>` is used "around 87% of the time"** (Danny
  Sullivan, Sept 2021). This counts whether the title was *the source*.
- **Zyppy measured 61.6% at least partially rewritten** — i.e. shown verbatim
  only ~38% of the time.

Both figures are 2021–2022 and Google has published no update. **This is the
largest recency gap in the research.**

<https://developers.google.com/search/blog/2021/09/more-info-about-titles>

### What keeps a title intact

- **Length in the 51–60 band** — the strongest single correlate.
- **Hyphen, not pipe, as separator.** Dashes stripped 19.7% of the time; pipes
  41.0% — more than double.
- **Parentheses over brackets.** Brackets: 77.6% rewrite, contents deleted
  entirely 32.9%. Parentheses: 61.9% / 19.7%.
- **Match the title to the visible H1.** A number present in the title but not
  the H1 was stripped 25.8% of the time; present in **both**, retained 97.3%.
  On this site the post title generates both, so this is free — the risk is only
  a hand-overridden title that diverges.
- **No repeated words**, brand included. Google calls repetition keyword stuffing
  and says it makes results "look spammy".

### Google's nine title sources, in documented priority order

`<title>` → main visual title → `<h1>` → `og:title` → other prominent styled
text → other page text → on-page anchor text → inbound anchor text → `WebSite`
structured data.

### Google's seven documented rewrite triggers

1. Half-empty titles (`| Site Name`)
2. Obsolete titles (title says 2020, H1 says 2021)
3. Inaccurate titles (static title over dynamic content)
4. Micro-boilerplate (identical across a subset of pages)
5. No clear main title (competing equal-weight headings)
6. Language/writing-system mismatch with the body
7. **Site-name duplication** — "Google may omit the site name from the title
   link, if it's repetitive with the site name that's already shown in the
   search result"

Trigger 7 is why this site dropped the brand suffix from content pages: Google
renders the site name as its own SERP element, so repeating it spends ~21
characters of a 60-character budget on something already displayed.

### Brand placement

Google's documented position: brand the **home page** ("a reasonable place to
include some additional information about your site"), and on interior pages
"consider including just your site name at the beginning or end … separated …
with a delimiter such as a hyphen, colon, or pipe." Repeating a full brand line
everywhere "will look repetitive if several pages from your site are returned for
the same query."

To control the displayed site name properly, use `WebSite` structured data on the
home page.

<https://developers.google.com/search/docs/appearance/site-names>

### Keyword front-loading

**Google has never advised keyword position.** Its only keyword statement is
prohibitive (no stuffing). Front-loading remains a secondary-source convention
(Yoast, Ahrefs); the defensible rationale is truncation and scanning, not
ranking.

### Two ranking facts

- The title **is** a ranking factor, but "a tiny factor" (Mueller).
- **A rewrite does not cost ranking.** Mueller: "Even if when we display the
  title for your page we swap out maybe that one keyword that you care about, we
  would still use that for ranking." A rewrite is a **CTR problem, not a ranking
  problem** — which sets how much to care.

## Meta descriptions

### Not a ranking factor

Direct and still-current: "Even though we sometimes use the `description` meta
tag for the snippets we show, we still don't use the `description` meta tag in
our ranking." Reaffirmed by Mueller in 2020.

<https://developers.google.com/search/blog/2009/09/google-does-not-use-keywords-meta-tag>

Its only job is earning the click.

### Length — and the dated-post penalty

| Context | Target |
| --- | --- |
| Undated page, desktop | 150–160, peak 156, sharp drop after 165 |
| **Dated page, desktop** | **138–148, peak 142** |
| Undated, mobile | peak 118, target <120 |
| **Dated, mobile** | **95–105** |

Portent, 30,000 keywords via STAT, Sept 2020.
<https://portent.com/blog/seo/how-often-google-ignores-our-meta-descriptions.htm>

**Articles on this site display a publish date, so they get the tighter budget —
~145 max, not 160.** Case studies show no date and take the wider one.

Put everything load-bearing in the **first ~120 characters**; that is all mobile
shows.

Sources disagree: 135 (Semrush) vs 155–156 (Yoast) vs 150–160 (Portent) vs ~160
(Ahrefs).

### Google uses your description only ~28–37% of the time

| Study | Uses yours |
| --- | --- |
| Portent, 30,000 keywords, 2020 | ~30% (68% desktop / 71% mobile rewritten) |
| Ahrefs, 1,002,165 domains, 2023 | ~37% |
| Semrush, small sample, 2025 | ~28% |

Snippets are query-dependent — "Google Search might show different snippets for
different searches" — so no description wins every query. Rewrite rates rise for
**long-tail queries**, which is most of a technical blog's traffic. Expect
override more often than the baseline. Write for the human's click decision, not
as an SEO artifact.

### What makes Google use yours

- **Accuracy** — the only criterion Google states: it uses the tag "if it might
  give users a more accurate description of the page than content taken directly
  from the page."
- **Unique per page.** "Identical or similar descriptions on every page of a site
  aren't helpful."
- **Not a keyword list.** The one place Google links a writing pattern to
  selection: keyword-string descriptions "are less likely to be displayed as a
  snippet."
- Head terms and branded queries favour yours over a generated snippet.

### What it should contain

Google: "A short, relevant summary of what a particular page is about … like a
pitch that convince[s] the user that the page is exactly what they're looking
for."

**It need not be prose.** "News or blog postings can list the author, date of
publication, or byline information." The technical equivalent: language/framework
version, stack, or what was measured.

Google's own bad→better pairs define the failure modes: keyword list; one
description reused site-wide; opening with an anecdote instead of the topic; too
short ("Mechanical pencil"). The better versions summarise the whole page and add
concrete specifics.

## AI Overviews / AI Mode

**There is no separate guidance, and that absence is the finding.** From Google's
AI-optimization guide (15 May 2026): "There are no additional requirements to
appear in AI Overviews or AI Mode, nor other special optimizations necessary."
Titles and descriptions are not mentioned anywhere in it. "Optimizing for
generative AI search **is** optimizing for the search experience, and thus still
SEO." `llms.txt` and special markup are ignored — they "neither harm nor help".

**The one metadata dependency:** to be eligible, a page "must be indexed and
eligible to be shown in Google Search **with a snippet**." So `nosnippet`,
`data-nosnippet`, a low `max-snippet`, or `noindex` all restrict AI-feature
appearance. That is the single metadata mistake that can remove a page from AI
Overviews.

Also relevant to a technical portfolio: the guide contrasts "commodity content
('7 Tips for First-Time Homebuyers')" against specific first-person content
("Why We Waived the Inspection & Saved Money"), and asks for content that could
not "easily be produced by a generative AI model". That is a direct argument for
concrete, experience-specific titles over generic "How to X" phrasing.

<https://developers.google.com/search/docs/fundamentals/ai-optimization-guide>

**Discard:** claims circulating that titles are "the most efficient relevance
signal AI systems have", or that AI citation cards use your meta description
verbatim. Traced only to low-authority marketing blogs, and they contradict
Google's own "no special optimizations" statement.

## Most common mistakes, by prevalence

Ahrefs Site Audit, 1,002,165 domains, 2023 — % of domains with the issue on ≥1
page:

| Issue | % |
| --- | --- |
| Description missing or empty | 72.9% |
| Page title ≠ SERP title | 68.5% |
| Title too long | 63.2% |
| Description too short | 59.2% |
| Description too long | 54.5% |
| Title too short | 32.8% |
| Title missing | 5.6% |

<https://ahrefs.com/blog/site-audit-study/>

## Notes specific to this site

1. **The "prioritise critical URLs" escape hatch does not apply.** Google offers
   it to sites too large to hand-write descriptions. A portfolio with tens of
   pages should have a unique, hand-written description on **every** page — and
   hand-written beats Google's endorsed programmatic route.
2. **Articles show dates**, so hold them to ~140 desktop / ~100 mobile.
3. **Title/H1 match is automatic** here, since the front-matter title generates
   both. Do not introduce a separate SEO title that diverges from it.
4. **No clickbait.** Google's helpful-content self-assessment asks whether a
   title "avoid[s] exaggerating or being shocking in nature." For technical
   content, precision (versions, error names, numbers) beats curiosity gaps.

## Sources blocked during research

`searchengineland.com` (Cloudflare 403) and `moz.com` were unreachable. Search
Engine Land's pixel-length study is therefore reported second-hand and was not
used for any threshold.
