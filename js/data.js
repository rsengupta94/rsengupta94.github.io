/* ═══════════════════════════════════════════════════════════════════════
   SITE CONTENT — this is the only file you need to edit for normal updates.

   ⚠️  EVERYTHING BELOW IS PLACEHOLDER COPY carried over verbatim from the
   Claude Design mockup. The employers, metrics, repo names, star counts,
   article text and contact details are invented sample content, and they
   contradict the logo strip (Coursera, D. E. Shaw, Amazon, PwC).
   Replace every field with your real details before publishing.
   ═══════════════════════════════════════════════════════════════════════ */

const SITE = {
  name: 'Rajarshi Sengupta',
  tagline: 'I turn AI capability into shipped product.',

  // TODO: replace with your real links before going live.
  email: 'hello@rajarshisengupta.dev',
  githubUrl: 'https://github.com/yourhandle',
  linkedinUrl: 'https://www.linkedin.com/in/yourhandle',
  sourceUrl: 'https://github.com/yourhandle/yourhandle.github.io',
  resumeUrl: 'resume.pdf', // drop resume.pdf in the repo root

  // Leave empty to show a placeholder box instead of a photo.
  portrait: '',

  intro: [
    "Product-minded engineer — 8 years across data platforms and distributed systems, now applied AI. I scope what's worth building, prototype fast, and carry it through demo, eval, and rollout — with customers in the room.",
    'I optimize for legibility — in demos, docs, and decisions. Everything I claim here links to a prototype, a case study, or an article you can check.',
  ],
  now: 'Senior Data Platform Engineer at Northwind Labs, Bengaluru · UTC+5:30',
  openTo: 'Staff-level AI Product, Solution Engineer roles',

  companies: [
    { src: 'assets/logo-coursera.svg', alt: 'Coursera', height: 26 },
    { src: 'assets/logo-deshaw.png', alt: 'D. E. Shaw & Co', height: 36 },
    { src: 'assets/logo-amazon.png', alt: 'Amazon', height: 44 },
    { src: 'assets/logo-pwc-ink.png', alt: 'PwC', height: 42 },
  ],

  stack: [
    { label: 'AI & LLM', items: ['RAG', 'Evals', 'Agents', 'Prompt design', 'Model APIs'] },
    { label: 'Build & prototype', items: ['Python', 'TypeScript', 'SQL', 'FastAPI', 'Streamlit'] },
    { label: 'Data & cloud', items: ['Kafka', 'Postgres', 'dbt', 'AWS', 'Kubernetes'] },
    { label: 'Product & delivery', items: ['Discovery', 'PRDs & RFCs', 'Solution architecture', 'Demos & POCs', 'Technical writing'] },
  ],
};

const EXPERIMENTS = [
  {
    num: '01',
    title: 'streamlite',
    summary: 'Exactly-once stream processing in ~4k lines of Go. Kafka-compatible sources and sinks, Raft-backed checkpoints, ships as a single binary.',
    tags: ['Go', 'Kafka', 'Raft'],
    stat: '★ 2.1k · MIT',
    links: [{ label: 'Repository', href: '#' }, { label: 'Benchmarks', href: '#' }],
  },
  {
    num: '02',
    title: 'dbt-guard',
    summary: 'CI gate for dbt projects: catches breaking schema changes, orphaned models, and warehouse cost regressions before merge. Runs as a GitHub Action.',
    tags: ['Python', 'dbt', 'GitHub Actions'],
    stat: '★ 640 · Apache-2.0',
    links: [{ label: 'Repository', href: '#' }, { label: 'Docs', href: '#' }],
  },
  {
    num: '03',
    title: 'kvlite',
    summary: 'A single-file LSM key-value store in Rust, built to understand storage engines from the block up. Ships with a bench harness against RocksDB — and loses honestly.',
    tags: ['Rust', 'LSM', 'Storage'],
    stat: '★ 380 · MIT',
    links: [{ label: 'Repository', href: '#' }, { label: 'Write-up', href: '#' }],
  },
  {
    num: '04',
    title: 'infra-templates',
    summary: "Production-grade Terraform modules for the unglamorous parts: VPC layouts, IAM boundaries, budget alarms. Copied into three companies' stacks so far.",
    tags: ['Terraform', 'AWS'],
    stat: '★ 210 · MIT',
    links: [{ label: 'Repository', href: '#' }],
  },
  {
    num: '05',
    title: 'This site',
    summary: 'Plain HTML on GitHub Pages, no framework. A 60-line GitHub Action turns markdown files into the articles index. Function over form, practiced.',
    tags: ['HTML', 'GitHub Pages'],
    stat: '★ 45 · View source',
    links: [{ label: 'Repository', href: '#' }],
  },
];

const WORKS = [
  {
    slug: 'ingestion-platform',
    title: 'Unified ingestion platform',
    org: 'Northwind Labs',
    period: '2022 — Now',
    role: 'Led a team of four — roadmap, RFCs, rollout',
    outcome: '40 TB/day · zero pages in 2 quarters',
    summary: '40 TB/day across 300+ Kafka topics, landed exactly-once into the lake. One config file to onboard a source; zero ingestion pages in two quarters.',
    tags: ['Go', 'Kafka', 'Iceberg', 'AWS'],
    body: [
      'Every team shipped events its own way — sidecar agents, cron dumps, one heroic bash script. The platform replaces all of it with one contract: declare a source in a config file, get an exactly-once path into the lake with schemas, lineage, and alerting attached.',
      'The interesting part is the failure model. Workers checkpoint offsets transactionally with writes, so replays are free; bad payloads route to quarantine tables instead of stopping the world; backfills use the same code path as live traffic, just pointed at older offsets.',
      'Two years in: 40 TB/day, 300+ topics, a four-person team, and ingestion has not paged anyone in two quarters. Boring, as designed.',
    ],
    schema: [
      { label: 'Sources', sub: '300+ services & DBs' },
      { label: 'Kafka', sub: 'CDC + event topics' },
      { label: 'Ingest workers', sub: 'Go · exactly-once' },
      { label: 'Iceberg lake', sub: 'partitioned, ACID' },
      { label: 'Warehouse + dbt', sub: 'modeled marts' },
    ],
  },
  {
    slug: 'event-driven-orchestration',
    title: 'Event-driven warehouse orchestration',
    org: 'Northwind Labs',
    period: '2023 — 2024',
    role: 'Drove design, stakeholder buy-in & rollout',
    outcome: 'p95 freshness 6 h → 40 min',
    summary: 'Moved ~400 pipelines from nightly cron to event-driven Airflow + dbt. Warehouse p95 freshness fell from 6 h to 40 min on the same compute.',
    tags: ['Airflow', 'dbt', 'Python'],
    body: [
      'The warehouse ran on cron: every model rebuilt nightly whether its inputs changed or not. Freshness was a 6-hour p95 and the compute bill grew with the model count, not the data.',
      'The fix was to make data arrival the trigger. Partition commits in the lake publish events; Airflow DAGs subscribe to the datasets they read; dbt runs state-aware, so only what sits downstream of a change rebuilds.',
      'p95 freshness fell to 40 minutes with no new compute, and "is this dashboard current?" stopped being a Slack question — every mart now carries its own freshness SLO.',
    ],
    schema: [
      { label: 'Lake events', sub: 'partition commits' },
      { label: 'Event bus', sub: 'SNS/SQS fan-out' },
      { label: 'Airflow', sub: 'dataset-triggered DAGs' },
      { label: 'dbt runs', sub: 'state-aware, partial' },
      { label: 'Marts + BI', sub: 'freshness SLOs' },
    ],
  },
  {
    slug: 'shipment-tracking',
    title: 'Shipment-tracking event pipeline',
    org: 'Freightline',
    period: '2019 — 2022',
    role: 'Built end-to-end with ops & customer teams',
    outcome: '12k events/s · 3 years in prod',
    summary: 'Live position and status for every shipment: 12k events/s through Kafka into Postgres, serving the customer tracking page and carrier SLAs.',
    tags: ['Python', 'Kafka', 'Postgres'],
    body: [
      'Freightline promised customers a live answer to one question — where is my shipment? — across dozens of carriers reporting by GPS ping, EDI batch, or webhook, each with its own clock and its own idea of truth.',
      'The pipeline normalizes everything into one event schema, dedups on carrier sequence numbers, and upserts into partitioned Postgres so replays and late data are harmless. Peak load ran 12k events/s on hardware a startup could afford.',
      'It carried the tracking page, carrier SLA scoring, and the ops dashboard for three years — and outlived my tenure, the best compliment infrastructure gets.',
    ],
    schema: [
      { label: 'Carrier feeds', sub: 'GPS, EDI, webhooks' },
      { label: 'Normalizer', sub: 'schema + dedup' },
      { label: 'Kafka', sub: '12k events/s' },
      { label: 'Postgres', sub: 'partitioned, upserts' },
      { label: 'Tracking API', sub: 'customer page + SLAs' },
    ],
  },
];

const ARTICLES = [
  {
    slug: 'evals-before-demos',
    title: 'Evals before demos: deciding an AI feature is real',
    date: 'Jul 2026',
    readTime: '8 min',
    tag: 'AI product',
    summary: 'A demo convinces a room; an eval convinces a roadmap. The 40-case harness I run before anything gets a ship date.',
    body: [
      { p: 'Every AI feature looks magical in the demo, because the demo is a best case. The number that matters is the hit rate on the worst realistic day — and that is an eval, not a vibe.' },
      { p: 'My bar before a roadmap commitment: 40 real cases pulled from support tickets and sales calls, graded pass/fail by someone who owns the workflow — not by the person who built the prompt. If we cannot assemble 40 real cases, the feature is a hypothesis, not a plan.' },
      { code: '# eval.yaml — the whole harness\ncases: ./cases/*.json    # real tickets, not synthetic\ngrader: rubric           # owner-written, 3 criteria\nship_gate: 85% pass, zero critical fails' },
      { p: 'The side effect is alignment: the argument about the rubric happens before the build, with product, support, and the customer in the same doc. By the time the demo happens, it is a formality.' },
    ],
  },
  {
    slug: 'rag-after-the-pilot',
    title: 'What RAG actually costs after the pilot',
    date: 'May 2026',
    readTime: '11 min',
    tag: 'Solutions',
    summary: 'Retrieval drift, index refresh, permissions — and the meeting where someone asks who owns the chunks. A checklist for the architecture review.',
    body: [
      { p: 'The pilot is the cheap part. The costs that surface in month three: keeping the index in sync with sources that keep changing, respecting document permissions at query time, and deciding who is on call when retrieval quality drifts.' },
      { p: 'Before signing off an architecture I want four answers: how fresh must the index be, who can see what, what happens when retrieval misses, and which number tells us quality dropped before a customer does.' },
      { p: 'None of these are model problems. They are product decisions wearing infrastructure costumes — which is why the architecture review needs the PM in the room, not just the platform team.' },
    ],
  },
  {
    slug: 'boring-pipelines',
    title: 'The boring pipeline manifesto',
    date: 'Feb 2026',
    readTime: '6 min',
    tag: 'Platform',
    summary: 'Idempotent, observable, re-runnable. A short argument for pipelines nobody has to think about.',
    body: [
      { p: 'A boring pipeline is one nobody thinks about: it backfills itself, alerts before the dashboard is wrong, and can be re-run from any point without a meeting. Boring is a feature you build deliberately.' },
      { p: 'The manifesto in one line: every pipeline must be idempotent, observable, and re-runnable by someone who did not write it. Everything else — the orchestrator, the file format, the vendor — is negotiable.' },
    ],
  },
  {
    slug: 'discovery-questions',
    title: 'Five questions that kill bad AI projects early',
    date: 'Nov 2025',
    readTime: '7 min',
    tag: 'AI product',
    summary: 'Where does the data live, who owns the workflow, what does "good" cost today — the first-call checklist that saves quarters.',
    body: [
      { p: 'Most doomed AI projects are doomed in the first call; you just find out two quarters later. The tell is always the same — enthusiasm about the model, silence about the workflow it has to live in.' },
      { p: 'The five: Where does the input data actually live, and who will let us touch it? Who owns the workflow we are changing, and do they want it changed? What does the current process cost, in hours or dollars? Which failure is unacceptable? And who signs off that it works?' },
      { p: 'Three crisp answers out of five and I will prototype it that week. Fewer, and the kindest thing a solutions engineer can do is say "not yet" — and leave the checklist behind.' },
    ],
  },
];

const EXPERIENCE = [
  {
    years: '2022 — Now',
    badge: 'Current',
    title: 'Senior Data Platform Engineer',
    where: 'Northwind Labs · Bengaluru',
    points: [
      'Own the ingestion platform: 40 TB/day across 300+ Kafka topics, exactly-once into the lake.',
      'Cut warehouse pipeline p95 from 6 h to 40 min by moving orchestration to event-driven Airflow + dbt.',
      "Run a team of four; write the platform's RFCs, runbooks, and postmortems.",
    ],
    tags: ['Go', 'Kafka', 'Airflow', 'dbt', 'AWS'],
  },
  {
    years: '2019 — 2022',
    title: 'Software Engineer',
    where: 'Freightline · Remote',
    points: [
      'Built the shipment-tracking event pipeline — Kafka and Postgres at 12k events/s.',
      'Led the migration from cron-based ETL to streaming; deleted 40% of the pipeline code on the way.',
      'Carried the pager; ran incident reviews that halved repeat incidents in a year.',
    ],
    tags: ['Python', 'Kafka', 'Postgres', 'Kubernetes'],
  },
  {
    years: '2017 — 2019',
    title: 'Backend Engineer',
    where: 'Craftworks (early-stage) · Bengaluru',
    points: [
      'First backend hire; took the Django monolith from prototype to 200k users.',
      'Instrumented everything — tracing and metrics before the first outage, not after.',
    ],
    tags: ['Python', 'Django', 'Redis'],
  },
  {
    years: '2013 — 2017',
    title: 'B.Tech, Computer Science',
    small: true,
    where: 'University name · AWS Solutions Architect (2021)',
    points: [],
    tags: [],
  },
];
