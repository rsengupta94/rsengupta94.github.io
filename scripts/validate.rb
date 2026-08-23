#!/usr/bin/env ruby
# frozen_string_literal: true

# Pre-publish validator.
#
# Enforces the rules that fail SILENTLY in Jekyll — the ones you cannot catch by
# looking at the preview, because the symptom is a page that simply isn't there:
#
#   1. Future-dated posts        → Jekyll skips them, with no error
#   2. Renamed/removed slugs     → breaks live URLs and search rankings
#   3. Colliding slugs           → one page silently shadows another
#
# Traps 2 and 3 apply to both collections: articles in _posts and case studies in
# _work. Plus cheaper checks for missing front matter and SEO fields.
#
# Uses Psych (Ruby's stdlib YAML), the same parser Jekyll uses, so anything that
# parses here parses there.
#
# Usage:  ruby scripts/validate.rb [--strict]
#   exit 0 → no errors (warnings may still be printed)
#   exit 1 → errors found; do not publish
#   --strict treats warnings as errors too

require 'yaml'
require 'date'
require 'set'
require 'shellwords'

ROOT = File.expand_path('..', __dir__)
STRICT = ARGV.include?('--strict')

# ── SEO thresholds ───────────────────────────────────────────────────────────
# From the research brief in .claude/skills/seo-summary/RESEARCH.md. Google
# publishes NO numeric limits for either field — every number here is
# third-party convention, so these are warnings, never errors.
#
# Titles: measured against the rendered <title>, which for interior pages is now
# just the page title (the brand suffix was removed — see _layouts/default.html).
# Rewrite rates by length (Zyppy, 80,959 titles): 51–60 chars is the minimum at
# 39–42%; over 60 rises past 76%; over 70 is 99.9%.
TITLE_MIN = 25          # under ~20 chars is rewritten over half the time
TITLE_MAX = 60          # truncation point; 51–60 is the sweet spot
TITLE_HARD = 70         # past here, Google almost always rewrites it

# Descriptions: ~150 desktop / first ~120 visible on mobile. Posts that display
# a date get a SMALLER budget — Portent measured desktop display peaking at 142
# chars for dated results versus 156 undated. Articles here show a date, so they
# are held to the tighter number.
DESC_MIN   = 110
DESC_MAX   = 155        # undated pages (work case studies)
DESC_MAX_DATED = 145    # articles, which render a publish date

errors   = []
warnings = []

def rel(path)
  path.sub("#{ROOT}/", '')
end

# ── front matter ─────────────────────────────────────────────────────────────

# Returns [front_matter_hash, body_string] or [nil, reason] on failure.
def read_front_matter(path)
  text = File.read(path)
  m = /\A---\r?\n(.*?)\r?\n---\r?\n(.*)\z/m.match(text)
  return [nil, 'no front matter block (must start with --- on line 1)'] unless m

  begin
    data = YAML.safe_load(m[1], permitted_classes: [Date, Time]) || {}
  rescue Psych::SyntaxError => e
    return [nil, "YAML syntax error — #{e.message.lines.first.to_s.strip}"]
  end
  return [nil, 'front matter is not a set of key: value pairs'] unless data.is_a?(Hash)

  [data, m[2]]
end

# Title, description and body checks. Identical for both collections except the
# description budget: anything rendering a publish date gets a smaller one,
# because the date eats into the snippet Google displays.
#
# Returns the front matter so the caller can run its own collection-specific
# checks on top, or nil if the file could not be parsed at all.
def check_content(path, errors, warnings, dated:)
  cap = dated ? DESC_MAX_DATED : DESC_MAX

  data, body = read_front_matter(path)
  unless data
    errors << "#{rel(path)}: #{body}"
    return nil
  end

  title = data['title'].to_s.strip
  desc  = data['description'].to_s.strip.gsub(/\s+/, ' ')

  if title.empty?
    errors << "#{rel(path)}: missing 'title'"
  else
    if title.length > TITLE_HARD
      warnings << "#{rel(path)}: title is #{title.length} chars — over " \
                  "#{TITLE_HARD}, Google rewrites the displayed title almost " \
                  'every time (99.9% in the largest study). Aim for 51–60.'
    elsif title.length > TITLE_MAX
      warnings << "#{rel(path)}: title is #{title.length} chars; past " \
                  "#{TITLE_MAX} it is truncated in results and the rewrite rate " \
                  'roughly doubles. Aim for 51–60.'
    elsif title.length < TITLE_MIN
      warnings << "#{rel(path)}: title is only #{title.length} chars — short " \
                  'titles are rewritten more than half the time. Aim for 51–60.'
    end

    # Google explicitly calls out repeated words as keyword stuffing, and says it
    # makes results "look spammy".
    words = title.downcase.scan(/[a-z][a-z'-]{3,}/)
    repeated = words.tally.select { |_, n| n > 1 }.keys
    unless repeated.empty?
      warnings << "#{rel(path)}: title repeats #{repeated.map { |w| "'#{w}'" }.join(', ')} — " \
                  'Google treats repetition in titles as keyword stuffing'
    end
  end

  if desc.empty?
    errors << "#{rel(path)}: missing 'description' — this is the search-result " \
              'snippet and the summary shown on the index'
  elsif desc.length > cap
    reason = dated ? 'this page shows a publish date, which cuts the visible snippet to about' \
                   : 'the visible snippet is cut off on desktop at about'
    warnings << "#{rel(path)}: description is #{desc.length} chars — #{reason} " \
                "#{cap} chars. Trim to #{cap}."
  elsif desc.length < DESC_MIN
    warnings << "#{rel(path)}: description is only #{desc.length} chars — too " \
                'thin to earn a click; Google lists one-line descriptions as a ' \
                "failure case. Aim for #{DESC_MIN + 10}–#{cap}."
  end

  if body.to_s.strip.empty?
    errors << "#{rel(path)}: body is empty — nothing would render"
  end

  data
end

# ── trap 1 + 3: filenames, dates, slug collisions ────────────────────────────

posts = Dir[File.join(ROOT, '_posts', '*.{md,markdown,html}')].sort
today = Date.today
slugs = {}

posts.each do |path|
  name = File.basename(path)

  # Filename problems don't stop the content checks below — surfacing everything
  # in one pass beats a fix-then-rerun-for-more-errors loop.
  if (m = /\A(\d{4})-(\d{2})-(\d{2})-(.+)\.(md|markdown|html)\z/.match(name))
    slug = m[4]

    date = begin
      Date.new(m[1].to_i, m[2].to_i, m[3].to_i)
    rescue ArgumentError
      errors << "#{rel(path)}: #{m[1]}-#{m[2]}-#{m[3]} is not a real date"
      nil
    end

    # TRAP 1 — future dates publish nothing, with no warning from Jekyll.
    if date && date > today
      errors << "#{rel(path)}: dated #{date} which is in the future — Jekyll will " \
                "skip it and the article will NOT appear (today is #{today}). " \
                'Rename the file with today\'s date or earlier.'
    end

    # TRAP 3 — two files resolving to one URL.
    if slugs.key?(slug)
      errors << "#{rel(path)}: slug '#{slug}' already used by " \
                "#{rel(slugs[slug])} — both want /articles/#{slug}/, so one " \
                'would shadow the other'
    else
      slugs[slug] = path
    end
  else
    errors << "#{rel(path)}: filename must be YYYY-MM-DD-slug.md — Jekyll ignores " \
              'anything else, silently, so this post would never publish'
  end

  data = check_content(path, errors, warnings, dated: true)
  next unless data

  warnings << "#{rel(path)}: no 'tag' set" if data['tag'].to_s.strip.empty?
end

# ── work case studies ────────────────────────────────────────────────────────
#
# The same content checks, minus the filename rules — a _work filename carries no
# date — and with the wider description budget, since these pages render no date.

works = Dir[File.join(ROOT, '_work', '*.{md,markdown,html}')].sort
work_slugs = {}
orders = {}

works.each do |path|
  slug = File.basename(path).sub(/\.(md|markdown|html)\z/, '')

  # TRAP 3 again: foo.md and foo.html both want /work/foo/.
  if work_slugs.key?(slug)
    errors << "#{rel(path)}: slug '#{slug}' already used by " \
              "#{rel(work_slugs[slug])} — both want /work/#{slug}/, so one " \
              'would shadow the other'
  else
    work_slugs[slug] = path
  end

  data = check_content(path, errors, warnings, dated: false)
  next unless data

  # Fields the work layout and the index row render directly, so a missing one
  # shows up as a visible gap — a stray "·" with no org, an empty schema block.
  missing_fields = %w[org period role outcome summary schema].reject do |key|
    value = data[key]
    value.is_a?(Array) ? value.any? : !value.to_s.strip.empty?
  end
  unless missing_fields.empty?
    warnings << "#{rel(path)}: missing #{missing_fields.map { |f| "'#{f}'" }.join(', ')} — " \
                'the case-study page and the work index render these, so the gaps show'
  end

  # work.html sorts on `order`, and a document without one sorts to the FRONT of
  # the list — a new case study silently lands at the top.
  if data['order'].nil?
    warnings << "#{rel(path)}: no 'order' set — /work/ sorts on it and a missing " \
                'value sorts this page above everything else'
  elsif orders.key?(data['order'])
    warnings << "#{rel(path)}: order #{data['order']} is also used by " \
                "#{rel(orders[data['order']])} — the two sort arbitrarily against " \
                'each other'
  else
    orders[data['order']] = path
  end
end

# ── trap 2: a published URL must never stop resolving ────────────────────────
#
# Git history is the record of what has been published. Any article or case study
# that has ever been committed must still resolve, either because the file is
# still there or because a redirect now covers it (see the retire-content
# workflow). Renaming a file is indistinguishable from delete + create, which is
# exactly why this check exists.

COLLECTIONS = {
  '_posts' => { prefix: '/articles/', dated: true },
  '_work'  => { prefix: '/work/',     dated: false }
}.freeze

# "/articles/foo", "articles/foo" and "/articles/foo/" all name one URL.
def normalize_url(path)
  "/#{path.to_s.strip.split('/').reject(&:empty?).join('/')}/"
end

# Every slug ever committed under `dir`. A _posts filename carries a date prefix
# that is not part of its URL; a _work filename is the slug itself.
def committed_slugs(dir, dated:)
  return Set.new unless Dir.exist?(File.join(ROOT, '.git'))

  out = `cd #{ROOT.shellescape} && git log --all --diff-filter=A --name-only --format= -- #{dir}/ 2>/dev/null`
  return Set.new unless $?.success?

  pattern = dated ? /\A\d{4}-\d{2}-\d{2}-(.+)\.(md|markdown|html)\z/
                  : /\A(.+)\.(md|markdown|html)\z/

  out.lines.map(&:strip).reject(&:empty?).each_with_object(Set.new) do |line, set|
    m = pattern.match(File.basename(line))
    set << m[1] if m
  end
end

# Every URL a redirect stub currently keeps alive. `redirect_from` can sit on
# either collection — a case study may well supersede an article — and it is
# matched as a full path, so /articles/x/ and /work/x/ stay distinct.
redirect_urls = (posts + works).each_with_object(Set.new) do |path, set|
  data, = read_front_matter(path)
  next unless data

  Array(data['redirect_from']).each { |from| set << normalize_url(from) }
end

live_urls = slugs.keys.map { |s| "/articles/#{s}/" }
                 .concat(work_slugs.keys.map { |s| "/work/#{s}/" })
                 .to_set

COLLECTIONS.each do |dir, meta|
  committed_slugs(dir, dated: meta[:dated]).each do |slug|
    url = "#{meta[:prefix]}#{slug}/"
    next if live_urls.include?(url) || redirect_urls.include?(url)

    errors << "#{url} was published before but no longer resolves — it would " \
              'start returning 404, breaking every existing link to it and its ' \
              'search ranking. Use the retire-content workflow to add a ' \
              'redirect, or confirm the 404 is intended.'
  end
end

# ── duplicate descriptions across pages ─────────────────────────────────────

seen_desc = {}
(posts + works).each do |path|
  data, = read_front_matter(path)
  next unless data

  d = data['description'].to_s.strip.gsub(/\s+/, ' ')
  next if d.empty?

  if seen_desc.key?(d)
    warnings << "#{rel(path)}: description is identical to #{rel(seen_desc[d])} — " \
                'duplicate snippets compete with each other in search'
  else
    seen_desc[d] = path
  end
end

# ── deploy-readiness warnings ───────────────────────────────────────────────

config_path = File.join(ROOT, '_config.yml')
if File.exist?(config_path)
  cfg = begin
    YAML.safe_load(File.read(config_path), permitted_classes: [Date, Time]) || {}
  rescue Psych::SyntaxError => e
    errors << "_config.yml: YAML syntax error — #{e.message.lines.first.to_s.strip}"
    {}
  end

  if cfg['url'].to_s.include?('yourhandle')
    warnings << "_config.yml: 'url' is still the placeholder (#{cfg['url']}) — " \
                'canonical tags and sitemap.xml are generated from it, so ' \
                'search engines would be pointed at the wrong domain'
  end
end

placeholder_hits = []
%w[_data _posts _work index.html].each do |target|
  Dir[File.join(ROOT, target, '**', '*')].each do |path|
    next unless File.file?(path)

    body = File.read(path)
    %w[Northwind Freightline Craftworks yourhandle rajarshisengupta.dev].each do |marker|
      placeholder_hits << "#{rel(path)} (#{marker})" if body.include?(marker)
    end
  end
end
unless placeholder_hits.empty?
  warnings << "placeholder content from the design mockup is still present in " \
              "#{placeholder_hits.uniq.size} place(s), e.g. " \
              "#{placeholder_hits.uniq.first(3).join(', ')} — these are invented " \
              'employers and contact details'
end

dead_links = []
Dir[File.join(ROOT, '_data', '*.yml')].each do |path|
  data = begin
    YAML.safe_load(File.read(path)) || []
  rescue Psych::SyntaxError => e
    errors << "#{rel(path)}: YAML syntax error — #{e.message.lines.first.to_s.strip}"
    next
  end

  Array(data).each do |entry|
    next unless entry.is_a?(Hash)

    Array(entry['links']).each do |l|
      next unless l.is_a?(Hash)

      dead_links << "#{rel(path)}: #{entry['title']} → #{l['label']}" if l['href'].to_s.strip == '#'
    end
  end
end
unless dead_links.empty?
  warnings << "#{dead_links.size} link(s) still point at '#': " \
              "#{dead_links.first(3).join('; ')}#{dead_links.size > 3 ? ' …' : ''}"
end

# ── report ──────────────────────────────────────────────────────────────────

puts
unless errors.empty?
  puts "ERRORS (#{errors.size}) — these break the site or silently hide content:"
  errors.each { |e| puts "  ✗ #{e}" }
  puts
end

unless warnings.empty?
  puts "WARNINGS (#{warnings.size}) — worth fixing, will not break the build:"
  warnings.each { |w| puts "  ! #{w}" }
  puts
end

if errors.empty? && warnings.empty?
  puts "✓ #{posts.size} article(s) and #{works.size} project(s) checked — " \
       'no problems found.'
  puts
elsif errors.empty?
  puts "✓ No errors. #{posts.size} article(s) and #{works.size} project(s) " \
       'checked. Safe to publish.'
  puts
end

exit 1 if !errors.empty? || (STRICT && !warnings.empty?)
exit 0
