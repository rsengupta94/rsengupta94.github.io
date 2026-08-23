---
name: new-project
description: Set up a new work case study in the _work collection — slug, front matter, tech schema, SEO description, preview URL. Use when the user says "add a project", "new case study", "add work I shipped", or hands over a project write-up.
---

# Take in a work case study

Same contract as `new-article`: **the user writes every word of the write-up.**
You handle placement, front matter, and the SEO description only.

Case studies differ from articles in three ways:

- They live in `_work/slug.md` with **no date in the filename**
- They carry structured front matter (`org`, `period`, `role`, `outcome`, `schema`)
- Ordering on the index is explicit via `order:`, not chronological

## Steps

### 1. Get the content

**Check `_inbox/` first.** It is the drop folder: the user leaves a finished
write-up there and says "new project", with no path.

```sh
ls _inbox/*.md 2>/dev/null | grep -v '/README.md$'
```

`_inbox/README.md` explains the folder and is never content — always filter it
out. One file: use it and name it. Several: ask which. None: they may give you a
path or paste the text.

### 2. Slug and URL

Same rules as articles — permanent once published, three to five words:

```
"Unified ingestion platform"  →  ingestion-platform  →  /work/ingestion-platform/
```

Confirm with the user before creating. Check for collisions:

```sh
ls _work/
```

### 3. Gather the structured fields

**Copy `_templates/case-study.md`** — it is the single source of the front-matter
contract, with the rule for each key in comments.

These are **facts about their work** — never guess or fill them in plausibly.
Ask for anything missing, or leave a visible `TODO`:

| Field | What it is | Example |
| --- | --- | --- |
| `title` | The project name | `Unified ingestion platform` |
| `org` | Employer or client | `Coursera` |
| `period` | When | `2022 — Now` |
| `role` | What they personally did | `Led a team of four — roadmap, RFCs, rollout` |
| `outcome` | The headline result, shown in the left column of the index | `40 TB/day · zero pages in 2 quarters` |
| `summary` | One or two sentences for the index row | |
| `description` | The SEO snippet — via `seo-summary` | |
| `tags` | Technologies | `[Go, Kafka, Iceberg, AWS]` |
| `order` | Position on the index; lower first | `1` |
| `schema` | The pipeline diagram, 4–6 stages | see below |

`outcome` and `summary` are content — their words. If they have not given you an
`outcome`, ask; do not derive a number from the body and present it as a claim.

### 4. The tech schema

Renders as a left-to-right flow of boxes on the case-study page. Four to six
stages reads best; more than six wraps awkwardly.

```yaml
schema:
  - { label: Sources,         sub: 300+ services & DBs }
  - { label: Kafka,           sub: CDC + event topics }
  - { label: Ingest workers,  sub: "Go · exactly-once" }
  - { label: Iceberg lake,    sub: "partitioned, ACID" }
  - { label: Warehouse + dbt, sub: modeled marts }
```

`label` is the component; `sub` is the one-line detail under it. Quote any value
containing a colon or `·`.

The labels are also joined with arrows to form the monospace chain shown on the
work index, so they should read as a sequence.

### 5. Set `order:`

Check what is already taken, and confirm where they want it:

```sh
grep -H '^order:' _work/*.md
```

Renumbering others is fine — `order:` is not a URL and has no SEO consequence.

### 6. Create, validate, hand back

Front matter, then their write-up verbatim. Then:

```sh
ruby scripts/validate.rb
```

If the source came from `_inbox/`, move the original into `_inbox/done/`:

```sh
mkdir -p _inbox/done && mv "_inbox/<file>.md" _inbox/done/
```

`_inbox/done/` is gitignored — the canonical copy is now the file in `_work/`.
Never delete their original without asking.

Hand back the file path, the preview URL `http://localhost:4000/work/slug/`, and
what is still theirs to fill. Start the preview server first if it is not up.

Also tell them where to change the two things they approved:

- **Description** — the `description:` key in that file's front matter. Free to
  change whenever, before or after publishing.
- **Slug** — the filename itself. Free to rename until it is pushed. After that,
  use the `retire-content` skill rather than `mv`.

Creating the file does not publish it. Nothing is live until an explicit
`publish`.
