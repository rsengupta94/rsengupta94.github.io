# Drop folder

Put finished markdown here, then say "new article" or "new project" in Claude
Code. No file path needed.

What happens next:

1. Claude reads the file and proposes a slug. You approve it, because the slug
   becomes the URL and cannot change after publishing.
2. Claude drafts the SEO `description` from your own text and shows it as
   options. You approve that too.
3. Claude creates the real file in `_posts/` or `_work/` with your prose copied
   in exactly as written, runs `scripts/validate.rb`, and hands back the preview
   URL.
4. The original moves to `_inbox/done/` so this folder only ever shows what has
   not been processed.

Nothing here reaches the built site. `_inbox` is in the `exclude` list in
`_config.yml`, so whatever front matter a dropped file carries, it cannot
publish itself by accident.

Nothing goes live until `git push`, which runs only on your explicit go-ahead
through the `publish` skill.

This README is ignored by the skills. Any other `.md` file here is treated as
content waiting to be set up.
