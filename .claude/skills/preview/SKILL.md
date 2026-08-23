---
name: preview
description: Start or reuse the local Jekyll preview server for the portfolio and report the URL. Use when the user says "start preview", "start jekyll", "run the site", "let me see it locally", or at the beginning of a content session.
---

# Start the preview server

Goal: the user ends up with a working `http://localhost:4000` and knows it is
live. Never start a second server on top of a running one.

## Steps

**1. Check whether a server is already running.**

```sh
pgrep -f "jekyll serve" >/dev/null && echo RUNNING || echo STOPPED
```

**2a. If RUNNING** — confirm it actually answers before trusting it:

```sh
curl -s -o /dev/null -w "%{http_code}" http://localhost:4000/
```

- `200` → tell the user it is already up at `http://localhost:4000` and stop. Do
  not restart it.
- anything else → the process is stale. Report that, and ask before killing it
  (it may belong to another terminal the user has open).

**2b. If STOPPED** — start it in the background from the repo root:

```sh
bundle exec jekyll serve --livereload --port 4000
```

Run it with `run_in_background: true`. It is a long-lived process; do not wait on
it. Then poll until it answers rather than guessing at a sleep duration:

```sh
for i in $(seq 1 20); do
  code=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:4000/ 2>/dev/null)
  [ "$code" = "200" ] && echo "ready" && break
  sleep 1
done
```

**3. If it fails to come up**, read the background task output and report the
actual error. The two common causes:

- A YAML syntax error in front matter or a `_data` file — the error names the
  file and line.
- Port 4000 occupied by something that is not Jekyll.

Do not paper over a failure by reporting success.

**4. Run the validator once** so the session starts with a known state:

```sh
ruby scripts/validate.rb
```

Report errors prominently. Summarise warnings in one line rather than pasting
all of them — the placeholder-content warning is expected and known.

## What to tell the user

- The URL, and that live reload is on, so saving any file refreshes the browser.
- That `_config.yml` is the exception and needs a restart.
- Any validator errors, in full.

Keep it to a few lines. They asked to start a server, not for a status report.
