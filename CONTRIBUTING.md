# Contributing to FCT Blueprint Compressor

Thanks for considering a contribution. You’re awesome.

This project is intentionally lightweight and frontend-only, so high-signal PRs, clean diffs, and predictable behavior matter more than fancy abstractions.

## Introduction

Whether you’re fixing a bug, improving UX copy, adding locale support, or tightening compression logic, your contribution is welcome.

Before opening a PR, read this guide once end-to-end so we can keep review cycles short and merge velocity high.

## I Have a Question

Please **do not** use GitHub Issues for usage questions.

Issues are reserved for confirmed bugs and actionable feature work. For “how do I use this?” or “is this expected behavior?” type questions, use community channels:

- Telegram chat: <https://t.me/FCTostin>
- YouTube channel for updates/context: <https://www.youtube.com/@FCT-Ostin>
- Steam group discussions: <https://steamcommunity.com/groups/FCTgroup>

If you still open an Issue with a support question, maintainers may close it and redirect you.

## Reporting Bugs

A strong bug report should be reproducible and scoped.

### Before filing

- Search open and closed Issues to avoid duplicates.
- Re-test on the latest `main` branch.
- Verify the input blueprint starts with `0` and is valid in Factorio.

### Include in every bug report

- **Environment**
  - OS and version (e.g., Windows 11 23H2, Ubuntu 24.04)
  - Browser and version (e.g., Chrome 125, Firefox 126)
  - App version/commit SHA
  - Factorio version (if relevant to blueprint compatibility)
- **Steps to Reproduce**
  - Exact sequence of actions from page load to failure
  - Input sample (sanitized if needed)
- **Expected Behavior**
  - What should have happened
- **Actual Behavior**
  - What happened instead
  - Full error text / screenshot if applicable

Minimal, deterministic repros get fixed much faster.

## Suggesting Enhancements

Feature requests are welcome, but pitch them with product-level clarity.

Include:

- The problem you’re solving
- Why current behavior is insufficient
- One or more real-world use cases
- Tradeoffs (complexity, UX cost, performance, maintenance)

Great enhancement proposals read like mini design docs, not just “please add X”.

## Local Development / Setup

### Fork and clone

```bash
# 1) Fork repository on GitHub, then clone your fork
git clone https://github.com/<your-username>/blueprint-code_compression.git
cd blueprint-code_compression

# 2) Add upstream for sync
git remote add upstream https://github.com/fctostin-team/blueprint-code_compression.git
```

### Run locally

```bash
# Option A: open directly
xdg-open index.html   # use `open` on macOS or `start` on Windows

# Option B: use a local server (recommended)
python3 -m http.server 8080
# open http://localhost:8080
```

### Environment variables

No `.env` setup is required in the current architecture.

If you add runtime config in future PRs:

- Provide `.env.example` (if backend/build tooling is introduced)
- Document every variable in `README.md`
- Add sane defaults for local development

## Pull Request Process

### Branch naming strategy

Use descriptive branch names:

- `feature/<short-name>`
- `bugfix/<issue-id-or-short-name>`
- `docs/<short-name>`
- `refactor/<short-name>`

Examples:

- `feature/locale-it-support`
- `bugfix/invalid-blueprint-status-copy`
- `docs/readme-rework`

### Commit message format

Use **Conventional Commits**:

- `feat: add zh locale fallback fixes`
- `fix: handle malformed base64 payload`
- `docs: rewrite getting started section`
- `refactor: simplify json optimization recursion`
- `chore: clean unused css selectors`

### Keep your branch in sync

```bash
git fetch upstream
git checkout main
git rebase upstream/main
git checkout <your-branch>
git rebase main
```

### PR description checklist

Every PR should include:

- Linked Issue(s), if applicable (`Closes #123`)
- What changed and why
- Testing notes (manual steps or command output)
- Screenshots/GIFs for visible UI updates
- Any breaking changes or migration notes

## Styleguides

### Code quality rules

- Keep patches focused; avoid drive-by refactors.
- Match existing coding style in each file.
- Prefer readable, explicit logic over clever micro-optimizations.
- Avoid adding dependencies unless there is clear long-term payoff.

### Linters and formatters

This repo currently has no mandatory linter/formatter pipeline configured.

If you introduce one (e.g., ESLint/Prettier), include configuration and docs in the same PR, and keep adoption incremental.

### Architecture expectations

- Preserve frontend-only workflow unless a backend is intentionally proposed.
- Keep i18n additions in `profiles/*.js` aligned with existing keys.
- Preserve local-first data handling and avoid sending blueprint payloads externally.

## Testing

All behavior changes must be tested locally before opening a PR.

Minimum validation for UI/logic changes:

```bash
python3 -m http.server 8080
# open http://localhost:8080
```

Then validate:

- Compression flow works with a valid blueprint string
- Verify flow catches invalid payloads gracefully
- Status messages are understandable
- Locale switching still updates text labels

If you add automated tests/tooling, document exact commands in `README.md`.

## Code Review Process

- Maintainers review PRs for correctness, scope, readability, and regression risk.
- Typical expectation: at least **one maintainer approval** before merge.
- For risky or architectural changes, additional approvals may be requested.
- Address review comments with follow-up commits or replies explaining tradeoffs.
- Keep discussions technical, concise, and solution-oriented.

Thanks again for contributing and helping keep this tool fast, reliable, and contributor-friendly.
