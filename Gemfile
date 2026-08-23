# Local preview only. GitHub Pages builds the site server-side on push and does
# not read this file, so nothing here affects what gets published.
#
# Deliberately NOT the `github-pages` gem: it pins a very old dependency tree
# that fails to build on current Ruby. Plain Jekyll plus the two plugins
# produces the same output for this site, and both plugins are on the GitHub
# Pages allowlist so the server-side build runs them too.
source "https://rubygems.org"

gem "jekyll", "~> 4.3"

# GitHub Pages parses markdown as GFM; matching it locally keeps fenced code
# blocks and autolinks rendering the same way in preview as in production.
gem "kramdown-parser-gfm", "~> 1.1"

# Ruby 3.0 dropped webrick from the standard library and Jekyll's local server
# needs it.
gem "webrick", "~> 1.8"

group :jekyll_plugins do
  gem "jekyll-seo-tag", "~> 2.8"
  gem "jekyll-sitemap", "~> 1.4"
  # Keeps old URLs alive when content is renamed or superseded. On the GitHub
  # Pages allowlist, so the server-side build runs it too.
  gem "jekyll-redirect-from", "~> 0.16"
end
