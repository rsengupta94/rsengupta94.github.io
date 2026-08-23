---
title: "Building an eval harness for local reasoning models"
description: >-
  Reasoning model outputs require verification at scale. This eval harness is
  a reliable verifier for any local model and multiple dataset types.
tag: "Evals"
---
Setting up evals for model benchmark is a delicate process and quite easy to get silently wrong. A broken eval harness still gives out accuracy scores which look plausible. Sebastian Raschka's book *Build a Reasoning Model (From Scratch)* talks about this at length. One of the roadblocks when I was exploring the use of local models for reasoning tasks was that I needed to verify the output produced by the models, at scale. Spot and ad-hoc checks are neither reliable nor verifiable. A reusable tool that works for any local model and multiple datasets was required.

A little side project led to [reasoning_verifier](https://github.com/rsengupta94/reasoning_verifier). It is a simple tool that points a small YAML file at a Hugging Face reasoning dataset and a local model, and gets back an accuracy score that can be verified.

## How it works

For the user, there are essentially three subcommands:

- `generate` queries the model (any OpenAI-compatible server, Ollama by default) and caches every raw response to disk.
- `verify` grades the cached responses into a new file.
- `report` prints the numbers and sample failures.

Additionally, the `export` command creates a csv file out of the report so that it can be easily examined. It is an optional step.

Configuring the tool to a dataset is one YAML mapping. For example, below is the complete file for the AIME 2024 dataset:

```yaml
source: HuggingFaceH4/aime_2024   # the HF dataset id
split: train
answer_type: numeric              # routes scoring to the numeric comparator
question: problem                 # column holding the question
gold:
  field: answer                   # column holding the gold answer
```

The design makes configuration simple and wrong mappings fail at load time with one-line errors. Once the mapping is ready, it is validated by an adapter.

Inside the tool, we have the following main functional components:

1. **Orchestrator** (`cli.py`) - It parses the subcommand (e.g - `generate`, `verify`, `report` etc.) and directs it to the right module.
2. **Prompts Library** (`prompts.py`) - Stores the prompts to execute three answer types the tool supports - `math`, `multiple_choice`, `closed_set`.
3. **Answer Generator** (`generate.py`) - Does the heavy lifting where each problem is sent to an OpenAI-compatible endpoint and appends one record per problem to a JSON file.
4. **Extractor** (`extract.py`) - It pulls the model's final answer from the freeform output text.
5. **Verifier** (`verify.py`) - The post-processing step, where the extractor is called, and the answer is routed to the relevant comparator for the datatype mentioned above and the extracted answer is compared against ground truth.

Once these steps are done, `report.py` and `export.py` generate the report in JSON and exports it to a CSV respectively.

Now, we usually rely on prompts to extract model answers in a fixed format. However, small models are unreliable in following prompt based instructions. So, the extractor attempts to parse model output in the following order:

1. The last boxed answer.
2. The last "the answer is" marker line.
3. The final number, as the last resort (applicable to numeric datasets only).

The primary outputs are `correct` / `incorrect`, w.r.t golden answer. Anything unparseable returns the verdict `extraction_failed`. Exceptional cases where the model output hits the token limit return `truncated`.

Comparison of model output to golden answer then runs per answer type:

| Answer type     | Compared by          | Example                       |
| --------------- | -------------------- | ----------------------------- |
| Numeric         | exact decimal match  | `72` = `72.0`                 |
| Expression      | symbolic equivalence | `1/2` = `0.5` = `\frac{1}{2}` |
| Multiple choice | letter match         | `B) 4` matches gold `B`       |

When evaluating a harness's performance, we need to remember that harness's failures are separate from the model's incorrect answer. An unparseable or truncated response should not count as a model error. A big gap between the extracted answer and the actual model answer means it is the harness that needs fixing.

## The bugs

The initial bugs of the harness were mostly different failure points of comparing model output to golden answer. In one case, correct answers by the model were marked incorrect, because the checker only read math wrapped in dollar signs. Another error pattern was that right multiple-choice answers were marked incorrect due to misidentification of the option text. Together these bugs had corrupted 32% of one of the first run's verdicts.

There was one bug that was purposefully ignored. A right answer written in prose, with no marker, returns `extraction_failed`. This was deliberate call, to prevent guesswork of outputs. In my experiments, extraction-failure cases were around 1%.

## Limits

The harness was envisioned as a simple, swappable implementation of answer verification. Hence, it verifies final answers only. Step-level verification has been left out of scope for now. There is no LLM-judge fallback. Free-form answers stay out of scope, which keeps every verdict mechanically checkable.

This build left me with the thesis that the same model, on the same task, can score much better under a better-designed harness. There are other public builds to back this up. For example, swapping only the answer extractor re-ranked Hugging Face's math leaderboard and nearly tripled some models' scores. For an advanced implementation of the problem, refer to HF's Math-Verify repo.

## References

1. Sebastian Raschka, *[Build a Reasoning Model (From Scratch)](https://www.manning.com/books/build-a-reasoning-model-from-scratch)*, Manning.
2. Hugging Face, ["Fixing Open LLM Leaderboard with Math-Verify"](https://huggingface.co/blog/math_verify_leaderboard) — swapping only the answer extractor re-ranked the leaderboard, and some models' scores nearly tripled.
3. Melanie Sclar et al., ["Quantifying Language Models' Sensitivity to Spurious Features in Prompt Design"](https://arxiv.org/abs/2310.11324) — prompt-format changes alone swing accuracy by up to 76 points.
