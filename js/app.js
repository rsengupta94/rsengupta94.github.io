/* Portfolio app — hash router + renderers.
   Replaces the Claude Design <x-dc> runtime with plain DOM rendering, so the
   published site carries no framework and no build step. Content lives in
   data.js; visual tokens live in css/. */

(function () {
  'use strict';

  var TABS = ['home', 'experiments', 'work', 'articles', 'experience'];

  var ICON = {
    arrowRight: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14"></path><path d="m12 5 7 7-7 7"></path></svg>',
    arrowLeft: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m12 19-7-7 7-7"></path><path d="M19 12H5"></path></svg>',
    upRight: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M7 7h10v10"></path><path d="M7 17 17 7"></path></svg>',
    upRightAccent: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--color-accent)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M7 7h10v10"></path><path d="M7 17 17 7"></path></svg>',
    schemaArrow: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14"></path><path d="m12 5 7 7-7 7"></path></svg>',
    github: '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"></path><path d="M9 18c-4.51 2-5-2-7-2"></path></svg>',
    linkedin: '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect width="4" height="12" x="2" y="9"></rect><circle cx="4" cy="4" r="2"></circle></svg>',
    mail: '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect width="20" height="16" x="2" y="4"></rect><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path></svg>',
    moon: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"></path></svg>',
    sun: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="4"></circle><path d="M12 2v2"></path><path d="M12 20v2"></path><path d="m4.93 4.93 1.41 1.41"></path><path d="m17.66 17.66 1.41 1.41"></path><path d="M2 12h2"></path><path d="M20 12h2"></path><path d="m6.34 17.66-1.41 1.41"></path><path d="m19.07 4.93-1.41 1.41"></path></svg>',
  };

  function esc(s) {
    return String(s == null ? '' : s)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function tags(list) {
    return (list || []).map(function (t) {
      return '<span class="tag tag-neutral">' + esc(t) + '</span>';
    }).join('');
  }

  /* ── routing ─────────────────────────────────────────────────────── */

  function parseHash() {
    var parts = location.hash.replace(/^#\/?/, '').split('/').filter(Boolean);
    // '#/projects' was the design's earlier name for the experiments tab.
    var first = parts[0] === 'projects' ? 'experiments' : parts[0];
    var tab = TABS.indexOf(first) !== -1 ? first : 'home';
    var slug = (tab === 'articles' || tab === 'work') && parts[1] ? parts[1] : null;
    return { tab: tab, slug: slug };
  }

  /* ── theme ───────────────────────────────────────────────────────── */

  function isDark() {
    try {
      var stored = localStorage.getItem('pf-theme');
      if (stored) return stored === 'dark';
    } catch (e) { /* private mode — fall through to the default */ }
    return false;
  }

  function applyTheme() {
    var dark = isDark();
    document.body.dataset.pfTheme = dark ? 'dark' : 'light';
    var btn = document.getElementById('theme-toggle');
    if (btn) {
      btn.innerHTML = dark ? ICON.sun : ICON.moon;
      btn.setAttribute('aria-label', dark ? 'Switch to light mode' : 'Switch to dark mode');
    }
  }

  function toggleTheme() {
    var next = !isDark();
    try { localStorage.setItem('pf-theme', next ? 'dark' : 'light'); } catch (e) { /* ignore */ }
    applyTheme();
  }

  /* ── views ───────────────────────────────────────────────────────── */

  function viewHome() {
    var photo = SITE.portrait
      ? '<img src="' + esc(SITE.portrait) + '" alt="' + esc(SITE.name) + '">'
      : '<div class="portrait-empty"><p>Add a portrait at <code>assets/portrait.jpg</code>, then point <code>SITE.portrait</code> at it.</p></div>';

    return '' +
      '<section class="hero">' +
        '<div class="hero-col">' +
          '<h1>' + esc(SITE.name) + '.</h1>' +
          '<p class="hero-tagline">' + esc(SITE.tagline) + '</p>' +
          SITE.intro.map(function (p) { return '<p class="body">' + esc(p) + '</p>'; }).join('') +
          '<p class="meta"><strong>Now:</strong> ' + esc(SITE.now) + '</p>' +
          '<p class="meta"><strong>Open to:</strong> ' + esc(SITE.openTo) + '</p>' +
          '<div class="btn-row">' +
            '<a class="btn btn-primary" href="' + esc(SITE.resumeUrl) + '" target="_blank" rel="noopener">View resume ' + ICON.upRight + '</a>' +
            '<a class="btn btn-secondary btn-icon" href="' + esc(SITE.githubUrl) + '" target="_blank" rel="noopener" aria-label="GitHub">' + ICON.github + '</a>' +
            '<a class="btn btn-secondary btn-icon" href="' + esc(SITE.linkedinUrl) + '" target="_blank" rel="noopener" aria-label="LinkedIn">' + ICON.linkedin + '</a>' +
            '<a class="btn btn-ghost" href="mailto:' + esc(SITE.email) + '">' + esc(SITE.email) + '</a>' +
          '</div>' +
        '</div>' +
        '<figure class="portrait">' + photo + '</figure>' +
      '</section>' +

      '<hr class="rule">' +

      '<section class="logos" aria-label="Companies">' +
        '<div class="logos-grid">' +
          SITE.companies.map(function (c) {
            return '<div class="logo-cell"><img src="' + esc(c.src) + '" alt="' + esc(c.alt) +
              '" style="height:' + Number(c.height) + 'px"></div>';
          }).join('') +
        '</div>' +
      '</section>' +

      '<hr class="rule">' +

      '<section class="stack" aria-label="Stack">' +
        '<span class="kicker">Stack</span>' +
        SITE.stack.map(function (row) {
          return '<div class="stack-row">' +
            '<h6>' + esc(row.label) + '</h6>' +
            '<div class="tag-row">' + tags(row.items) + '</div>' +
          '</div>';
        }).join('') +
      '</section>';
  }

  function viewExperiments() {
    return '' +
      '<section class="page-head">' +
        '<span class="kicker">Open source</span>' +
        '<h1>Experiments.</h1>' +
        '<p class="lede">Built to learn, kept because they work. Every one links to code you can run tonight — the full list lives on <a href="' + esc(SITE.githubUrl) + '" target="_blank" rel="noopener">GitHub</a>.</p>' +
      '</section>' +
      '<div class="exp-list">' +
        EXPERIMENTS.map(function (e) {
          return '<div class="exp-item">' +
            '<p class="exp-num">' + esc(e.num) + '</p>' +
            '<div class="exp-main">' +
              '<h2>' + esc(e.title) + '</h2>' +
              '<p>' + esc(e.summary) + '</p>' +
            '</div>' +
            '<div class="exp-side">' +
              '<div class="tags">' + tags(e.tags) + '</div>' +
              '<p class="stat">' + esc(e.stat) + '</p>' +
              '<div class="links">' +
                e.links.map(function (l) {
                  return '<a href="' + esc(l.href) + '">' + esc(l.label) + ' ↗</a>';
                }).join('') +
              '</div>' +
            '</div>' +
          '</div>';
        }).join('') +
      '</div>';
  }

  function viewWorkIndex() {
    return '' +
      '<section class="page-head">' +
        '<span class="kicker">Shipped with teams</span>' +
        '<h1>Work projects.</h1>' +
        '<p class="lede">AI and platform work shipped with teams — problem, decision, outcome. The code stays behind the badge, so each links to a case study with the story and the tech schema.</p>' +
      '</section>' +
      '<div class="work-list">' +
        WORKS.map(function (w) {
          var chain = w.schema.map(function (n) { return n.label; }).join(' → ');
          return '<a class="work-item" href="#/work/' + esc(w.slug) + '">' +
            '<span class="work-outcome">' + esc(w.outcome) + '</span>' +
            '<span class="work-main">' +
              '<span class="work-title">' + esc(w.title) + '</span>' +
              '<span class="work-org">' + esc(w.org) + ' · ' + esc(w.period) + '</span>' +
              '<span class="work-summary">' + esc(w.summary) + '</span>' +
              '<span class="work-chain">' + esc(chain) + '</span>' +
            '</span>' +
            '<span class="work-cta">Case study ' + ICON.arrowRight + '</span>' +
          '</a>';
        }).join('') +
      '</div>';
  }

  function viewWorkDetail(w) {
    return '' +
      '<article class="detail detail-work">' +
        '<a class="back-link" href="#/work">' + ICON.arrowLeft + ' All work projects</a>' +
        '<span class="kicker" style="margin-top:24px">' + esc(w.org) + ' · ' + esc(w.period) + '</span>' +
        '<h1>' + esc(w.title) + '</h1>' +
        '<p class="role">Role: ' + esc(w.role) + '</p>' +
        '<hr class="rule">' +
        w.body.map(function (p) { return '<p class="prose">' + esc(p) + '</p>'; }).join('') +
        '<h2 class="schema-heading">Tech schema</h2>' +
        '<div class="schema">' +
          w.schema.map(function (n, i) {
            return '<span class="schema-step">' +
              (i > 0 ? '<span class="schema-arrow">' + ICON.schemaArrow + '</span>' : '') +
              '<span class="schema-node">' +
                '<span class="label">' + esc(n.label) + '</span>' +
                '<span class="sub">' + esc(n.sub) + '</span>' +
              '</span>' +
            '</span>';
          }).join('') +
        '</div>' +
        '<p class="schema-caveat">Numbers rounded, internals generalized — happy to go deeper in conversation.</p>' +
        '<div class="detail-tags">' + tags(w.tags) + '</div>' +
        '<hr class="rule closing-rule">' +
        '<p class="footnote">Want the longer version? <a href="mailto:' + esc(SITE.email) + '">Email me</a> — architecture walkthroughs are my favorite conversation.</p>' +
      '</article>';
  }

  function viewArticlesIndex() {
    return '' +
      '<section class="page-head">' +
        '<span class="kicker">Writing</span>' +
        '<h1>Field notes from production.</h1>' +
        '<p class="lede">Written in markdown, published from this repo. No paywall, no tracking, one idea per article.</p>' +
      '</section>' +
      '<div class="art-list">' +
        ARTICLES.map(function (a) {
          return '<a class="art-item" href="#/articles/' + esc(a.slug) + '">' +
            '<span class="art-date">' + esc(a.date) + '</span>' +
            '<span class="art-main">' +
              '<span class="art-title">' + esc(a.title) + '</span>' +
              '<span class="art-summary">' + esc(a.summary) + '</span>' +
            '</span>' +
            '<span class="art-side">' +
              '<span class="tag tag-accent">' + esc(a.tag) + '</span>' +
              '<span class="read-time">' + esc(a.readTime) + '</span>' +
              ICON.upRightAccent +
            '</span>' +
          '</a>';
        }).join('') +
      '</div>';
  }

  function viewArticleDetail(a) {
    return '' +
      '<article class="detail detail-article">' +
        '<a class="back-link" href="#/articles">' + ICON.arrowLeft + ' All articles</a>' +
        '<h1>' + esc(a.title) + '</h1>' +
        '<p class="article-meta">' +
          '<span class="num">' + esc(a.date) + '</span><span>·</span>' +
          '<span>' + esc(a.readTime) + ' read</span>' +
          '<span class="tag tag-accent">' + esc(a.tag) + '</span>' +
        '</p>' +
        '<hr class="rule">' +
        a.body.map(function (b) {
          if (b.code) return '<pre>' + esc(b.code) + '</pre>';
          return '<p class="prose">' + esc(b.p) + '</p>';
        }).join('') +
        '<hr class="rule closing-rule">' +
        '<p class="footnote">Spotted an error? <a href="' + esc(SITE.sourceUrl) + '" target="_blank" rel="noopener">Open an issue ↗</a> — every article is a markdown file in the site\'s repo.</p>' +
      '</article>';
  }

  function viewExperience() {
    return '' +
      '<section class="page-head">' +
        '<span class="kicker">Experience</span>' +
        '<h1>Eight years, three teams.</h1>' +
        '<p class="lede">The short version. The complete one is in the <a href="' + esc(SITE.resumeUrl) + '" target="_blank" rel="noopener">resume</a>.</p>' +
      '</section>' +
      EXPERIENCE.map(function (x) {
        return '<div class="xp-row">' +
          '<div class="xp-when">' +
            '<p class="years">' + esc(x.years) + '</p>' +
            (x.badge ? '<p class="badge">' + esc(x.badge) + '</p>' : '') +
          '</div>' +
          '<div class="xp-main">' +
            '<h2' + (x.small ? ' class="small"' : '') + '>' + esc(x.title) + '</h2>' +
            '<p class="where' + (x.points.length ? '' : ' last') + '">' + esc(x.where) + '</p>' +
            (x.points.length
              ? '<ul>' + x.points.map(function (p) { return '<li>' + esc(p) + '</li>'; }).join('') + '</ul>'
              : '') +
            (x.tags.length ? '<div class="tags">' + tags(x.tags) + '</div>' : '') +
          '</div>' +
        '</div>';
      }).join('');
  }

  /* ── render ──────────────────────────────────────────────────────── */

  function render() {
    var route = parseHash();
    var view = document.getElementById('view');
    var html;
    var title;

    if (route.tab === 'work' && route.slug) {
      var work = WORKS.filter(function (w) { return w.slug === route.slug; })[0];
      if (work) {
        html = viewWorkDetail(work);
        title = work.title;
      } else {
        html = viewWorkIndex();
        title = 'Work projects';
      }
    } else if (route.tab === 'articles' && route.slug) {
      var art = ARTICLES.filter(function (a) { return a.slug === route.slug; })[0];
      if (art) {
        html = viewArticleDetail(art);
        title = art.title;
      } else {
        html = viewArticlesIndex();
        title = 'Articles';
      }
    } else if (route.tab === 'experiments') {
      html = viewExperiments();
      title = 'Experiments';
    } else if (route.tab === 'work') {
      html = viewWorkIndex();
      title = 'Work projects';
    } else if (route.tab === 'articles') {
      html = viewArticlesIndex();
      title = 'Articles';
    } else if (route.tab === 'experience') {
      html = viewExperience();
      title = 'Experience';
    } else {
      html = viewHome();
      title = null;
    }

    view.innerHTML = html;
    document.title = title ? title + ' · ' + SITE.name : SITE.name + ' — ' + SITE.tagline;

    // Nav highlighting.
    var links = document.querySelectorAll('.site-nav a[data-tab]');
    for (var i = 0; i < links.length; i++) {
      if (links[i].dataset.tab === route.tab) links[i].setAttribute('aria-current', 'page');
      else links[i].removeAttribute('aria-current');
    }
  }

  /* ── boot ────────────────────────────────────────────────────────── */

  function fillChrome() {
    document.getElementById('contact-email').href = 'mailto:' + SITE.email;
    document.getElementById('contact-email').innerHTML = ICON.mail + ' ' + esc(SITE.email);
    document.getElementById('contact-resume').href = SITE.resumeUrl;
    document.getElementById('contact-resume').innerHTML = 'Resume ' + ICON.upRight;
    document.getElementById('contact-github').href = SITE.githubUrl;
    document.getElementById('contact-linkedin').href = SITE.linkedinUrl;
    document.getElementById('footer-source').href = SITE.sourceUrl;
    document.getElementById('footer-name').textContent = SITE.name;
  }

  document.addEventListener('DOMContentLoaded', function () {
    // Views are rendered after load, so the browser's restored scroll offset
    // would land on the wrong place. Own the scroll position ourselves.
    if ('scrollRestoration' in history) history.scrollRestoration = 'manual';

    applyTheme();
    fillChrome();
    render();

    document.getElementById('theme-toggle').addEventListener('click', toggleTheme);

    window.addEventListener('hashchange', function () {
      render();
      window.scrollTo(0, 0);
    });
  });
})();
