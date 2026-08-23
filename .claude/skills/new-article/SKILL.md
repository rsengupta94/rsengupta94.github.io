---
name: new-article
description: Take in a finished article written outside the repo and set it up correctly — filename, date, slug, front matter, SEO description, preview URL. Use when the user says "add an article", "I have a new post", "ingest this article", "publish this piece I wrote", or hands over a markdown file or pasted article text.
---

# Take in a finished article

The user writes articles elsewhere and hands them over finished. This skill does
the mechanical setup and hands back an exact place to check.

**Do not rewrite, restructure, edit, or "improve" their prose. Not the headline,
not the paragraphs.** The only text you draft is the SEO `description`, and that
comes from the `seo-summary` skill with their approval.

## Steps

### 1. Get the content

**Check `_inbox/` first.** It is the drop folder: the user leaves finished
markdown there and says "new article", with no path.

```sh
ls _inbox/*.md 2>/dev/null | grep -v '/README.md$'
```

`_inbox/README.md` explains the folder and is never content — always filter it
out. Then:

- **One file** — use it, and name the file you picked before doing anything else.
- **Several** — list them and ask which one.
- **None** — they may give you a file path or paste the text instead.

If it is a file outside the repo, read it — do not copy it in yet.

If they have pasted text rather than given a file, say so explicitly before
writing anything, because you are about to create a file containing their words
and they should know where it lands.

### 2. Work out the slug — then confirm it

The slug is permanent once published, so this is the one decision worth a beat.

Derive a candidate from their title: lowercase, words joined by hyphens, no
stop-words padding it out, no dates, no trailing punctuation. Aim for three to
five words that would still make sense in a URL two years from now.

```
"Evals before demos: deciding an AI feature is real"  →  evals-before-demos
```

Check it is not already taken, including by anything previously published:

```sh
ls _posts/ | grep -i "<candidate>"
git log --all --diff-filter=A --name-only --format= -- _posts/ | sort -u
```

**Show the user the proposed slug and the URL it produces, and get agreement
before creating the file.** Explain, once, that the title can change later but
the slug cannot.

### 3. Work out the date

Use **today's date** unless they explicitly want an earlier one. Get it from the
system, never from memory:

```sh
date +%F
```

Never use a future date — Jekyll silently refuses to publish those. If they ask
for a future date, explain that the article would simply not appear, and offer
to hold the file back instead.

### 4. Create the file

Path: `_posts/YYYY-MM-DD-slug.md`

**Copy `_templates/article.md`** — it is the single source of the front-matter
contract, with the keys and the rules for each one in comments. Strip its
comments, fill the values, then add their body **exactly as they wrote it**.

For `tag`, reuse an existing one where it fits — check with:

```sh
grep -h '^tag:' _posts/*.md | sort -u
```

Do not invent a new tag category without asking; a proliferation of one-off tags
makes the index worse.

### 5. Draft the SEO description

Invoke the `seo-summary` skill. This is the step the user explicitly wants
handled for them, so do it properly rather than filling in something passable.

### 6. Validate

```sh
ruby scripts/validate.rb
```

Fix anything mechanical yourself. Report anything that needs their judgement.

### 7. Clear the inbox

If the source came from `_inbox/`, move the original into `_inbox/done/` so the
folder shows only what has not been processed:

```sh
mkdir -p _inbox/done && mv "_inbox/<file>.md" _inbox/done/
```

`_inbox/done/` is gitignored — the canonical copy is now the file in `_posts/`.
Never delete their original without asking.

### 8. Hand back

Give them, in this order:

1. **The exact file path** to open for edits — `_posts/2026-08-17-slug.md`
2. **The exact preview URL** — `http://localhost:4000/articles/slug/`
3. **Where to change the two things they approved**, so they can do it without
   you:
   - **Description** — the `description:` key in that file's front matter. Free
     to change whenever, before or after publishing. Re-run `seo-summary` to
     check length.
   - **Slug** — the filename itself. Free to rename right up until it is pushed.
     After that, renaming breaks every inbound link and the search ranking, so
     use the `retire-content` skill instead of `mv`.
4. **What is still theirs to fill**, with line numbers where possible
5. A reminder that saving refreshes the browser automatically

If the preview server is not running, start it via the `preview` skill first —
otherwise the URL you hand over will not load and looks broken.

### 9. Do not publish

Creating the file does not publish it. Nothing is live until a `git push`, which
happens only on their explicit go-ahead via the `publish` skill. Say this plainly
so there is no ambiguity about whether the article is public.
