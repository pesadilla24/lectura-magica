# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a single-file HTML application — a children's interactive reading app called **Lectura Mágica** (`lectura-magica.html`). No build tools, no dependencies, no package manager. Open the file directly in a browser to run it.

## Architecture

Everything lives in `lectura-magica.html` in three sections:

- **CSS** (`<style>` block) — screen layouts, animations, per-level color theming via CSS custom properties (`--lc`, `--bg`, etc.)
- **HTML** — five `<div class="screen">` blocks (welcome, levels, reading, quiz, results). Only one has `class="active"` at a time.
- **JavaScript** (`<script>` block at the bottom) — vanilla JS, no frameworks

### Key JS patterns

- `go(name)` — central navigation function; maps string names (`'welcome'`, `'levels'`, `'reading'`, `'quiz'`, `'results'`) to screen element IDs and swaps the `active` class
- `G` object — global mutable state (`lvIdx`, `qIdx`, `correct`, `unlocked`, `stars[]`, `speaking`)
- `LEVELS` array — all content (stories, questions, answers, colors) is data-driven; adding a new level means adding an entry here
- `localStorage` key `'lm3'` — persists `unlocked` and `stars` between sessions
- Web Speech API (`window.speechSynthesis`) — used for read-aloud with Spanish voice; gracefully degrades to word-highlight-only if unavailable

### Screen flow

```
welcome → levels → reading → quiz → results
                ↑__________________________|
```

`openLevel(i)` populates the reading screen from `LEVELS[i]` and calls `go('reading')`. `startQuiz()` transitions to quiz. `showResults()` calculates stars, updates `G`, saves to localStorage, then calls `go('results')`.
