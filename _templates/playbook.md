---
# Copy this file to _playbooks/YYYY-MM-DD-slug.md and fill it in.
#
# The DATE in the filename must be today or earlier. A future-dated playbook is
# worse than a future-dated article: Jekyll skips building its page but still
# lists it on /playbooks/ and in sitemap.xml, so both link straight to a 404.
# The SLUG in the filename becomes the URL (/playbooks/slug/) and can never
# change once published. `title:` below can change freely; the filename cannot.
#
# A playbook that arrives as a complete HTML page with its own design: name the
# file .html, set `layout: playbook` (_layouts/playbook.html), and drop the
# page's own <meta charset> and <title>. The layout puts it inside the site
# shell like an article: nav, theme toggle, footer, SEO tags, back link.
# Its stylesheet must be scoped first, or it restyles the site around it:
#   - every selector prefixed with .playbook; :root and body become .playbook
#   - dark mode keyed to body[data-pf-theme="dark"] .playbook, not the OS
#   - no rule for .wrap (the site column) and nothing named .hero
#   - sticky elements offset by var(--nav-h, 62px), the sticky site nav

title: ""

# Part of a series? Set both, and start the title with "<series>: ", e.g.
#   series: "Classification Fine Tuning Series"
#   part: 1
#   title: "Classification Fine Tuning Series: Data Decisions"
# /playbooks/ groups by series, orders by part, and drops the prefix in the
# row. The full title is what Google and the browser tab show.
# series: ""
# part: 1

# The search-result snippet and the summary shown on the playbooks index.
# Target 120–145 characters — playbooks render a publish date, which shortens
# what Google displays. Drafted via the seo-summary skill, from your own text.
description: >-

# Reuse an existing tag where one fits rather than inventing a new category:
#   grep -h '^tag:' _playbooks/*.md _posts/*.md | sort -u
tag: ""

# Optional. Only when this playbook replaces a URL that was already published —
# see the retire-content skill before using it.
# redirect_from:
#   - /playbooks/old-slug/
---

Body goes here, exactly as written. No `read_time` field — read time is
computed from the word count at build time.
