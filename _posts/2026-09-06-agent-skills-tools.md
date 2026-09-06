---
title: "Building tools out of Agent Skills"
description: >-
  Agent Skills can run a whole workflow, not just one task. The five parts of
  a skills based tool and four questions to answer before building.
tag: "Agent Skills"
---
Agent Skills are an open format for adding capabilities to a coding agent you already use. A skill is a folder with a `SKILL.md` file, and in its simplest form, consists of just markdown files. They are supported by all major model families such as Claude, GPT, Gemini etc. Skills are recommended for repeatable tasks, introducing a change in the agent's behaviour or providing the agent some specific context. The most common application of skills is standalone tasks, which is also how I used skills until recently.

Open-source plugins that package several skills together changed that view. I realised that a group of agent skills can also be used for repeatable workflows. They solve for the workflow, without requiring to write any code. What it does require is structured thinking and a clear understanding of the problem statement.

## Components of a skill based tool

Every tool built this way has the same five parts:

1. `AGENTS.md`. The agent loads it every session. It states what the tool is for and the rules that always apply. Keep it about one page, because long files get partially ignored.
2. **Skills**{:.term}. Each skill packages one workflow you repeat, so you never re-explain it.
3. **Specs**{:.term}. A spec is the command's manual, with output format, edge cases, and a worked example. It loads only when that command runs. Split a spec out when the skill outgrows a page.
4. **Subagents**{:.term}. It starts with a fresh context and sees only what it is handed, so it works best as a checker of the main agent's work.
5. **Your files**{:.term}. Plain files and folders, no database, no backend. Put the folder in git for history and sync.

Before writing any of them, answer four questions about the workflow:

- **The problem.** What job is the tool doing, and what does a good session produce?
- **The actions.** What will you repeat every session? These become your skills.
- **The guardrails.** What must never happen without your OK? These become the rules in `AGENTS.md`.
- **The checkpoints.** What gets checked before anything is saved? This becomes your checker.

Once these four have answers, the build is the easy part. In this article, I will walk you through an Agent Skills based tool that I had created.

## My problem statement

Things move fast in applied AI. I found myself with an ever expanding list of content bookmarks, saved articles, X posts with barely any time to go through them. I needed a structured way of collecting content, new terms and concepts that I come across, building my understanding, and actually ideating and shipping products. Without this loop being closed, my applied learning would be incomplete.

My initial solutioning was to develop a full product with a frontend and a backend, chat functions etc. Very soon, I realised it was an overkill. I primarily work in a CLI, and I needed something that just works. Several lightbulb moments later, I zeroed in on using Agent Skills to build the tool.

## Learning OS

[Learning OS](https://github.com/rsengupta94/learning-os-beta) is a single-user, CLI-only tool that runs inside a coding agent. The agent reads `AGENTS.md`, and each command is an Agent Skill that reads its spec before responding. There is no code, no database. All new content is stored as markdown files within new folders. You just need a CLI agent and git to sync.

Work is organised around topics, which are focused study areas. A topic is a folder with a `_topic.md` file, holding the goal and your calibration on the fundamentals. Around it sit an `_inbox/` drop zone, `absorbed/` for sources, `synthesis/` for concept notes and ideas, `projects/` for specs, and `_sessions/` for dated logs.

Four commands move a topic through one pipeline:

| Command | Role | What it does |
| --- | --- | --- |
| `/absorb` | Capture | Ingests a URL, PDF, image, text, or transcript into the topic. It also analyses the existing knowledge corpus and surfaces gaps. |
| `/synth` | Learn | Teaches the topic in bite-sized dialogue at applied-builder depth. Writes notes only when you ask. |
| `/ideate` | Generate | Proposes project candidates anchored to the topic. It is a two way discussion, where the user can suggest and ultimately decide. |
| `/apply` | Build | Turns a chosen candidate into a verified `spec.md`, with details on what to build and how. |

A fifth command, `/done`, writes the session log. The session log is required so that learning can be picked up at a later date from where it was left. The flow never auto-advances. Every transition requires an explicit command.

![The Learning OS pipeline: /absorb (Capture), /synth (Learn), /ideate (Generate), /apply (Build)]({{ '/assets/learning-os-pipeline.svg' | relative_url }})

Two capabilities are command agnostic and are triggered by keyword. Saying "research X" sends a subagent to research the topic and surface the findings. Saying "verify that" runs the verifier on the matter at hand to explicitly validate against external sources. The teaching itself responds to plain phrases such as "capture this", "go deeper", "back up", and "wrap up".

Grounding every claim to its source is the key to building trust. It is enforced in two parts. First at generation time where every claim the agent makes carries one of five provenance tags:

| Tag | Meaning |
| --- | --- |
| `[ABSORBED]` | From a source in this topic's `absorbed/` |
| `[RESEARCH]` | From the agent's external research this session |
| `[INFERENCE]` | The agent's reasoning over the above |
| `[MODEL-STABLE]` | Foundational model knowledge, textbook material |
| `[MODEL-UNCERTAIN]` | Model knowledge in hallucination-prone territory |

Verification is again performed during capture. A subagent verifier checks every notes, facts before it is written to disk. It returns PASS or FAIL, and a FAIL blocks the write.

## Where this goes

I have used this tool to learn a number of topics and to experiment by building. The same approach now runs other workflows and tools of mine. This approach is highly recommended for repeatable workflows where you just need to get things done.

Infact, Addy Osmani has taken a similar idea into core engineering work. His blog article on "Agent Skills" describes a set of skills that walk a coding agent through spec, plan, build, test, review, and ship. It is worth reading next.

## References

1. Agent Skills, [agentskills.io](https://agentskills.io/home). Format overview, progressive disclosure, and supported clients.
2. [Learning OS repository](https://github.com/rsengupta94/learning-os-beta), `README.md`.
3. Addy Osmani, ["Agent Skills"](https://addyosmani.com/blog/agent-skills/), May 2026.
