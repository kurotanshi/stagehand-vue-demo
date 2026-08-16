# Repository Guidelines

## Project Structure & Module Organization

This repository is a minimal Vue 3, TypeScript, and Vite demonstration of AI-driven browser testing with Stagehand v4. Application code lives in `src/`: `main.ts` mounts the app, `App.vue` contains the todo UI and state, and `style.css` provides global styling. Static files belong in `public/`. Stagehand end-to-end tests live under `tests/e2e/`, while `vite.config.ts`, `vitest.config.ts`, and the TypeScript configuration files define the toolchain. Build output in `dist/` is generated and must not be committed.

## Build, Test, and Development Commands

Use pnpm and Node.js 22.18 or newer.

- `pnpm install` installs dependencies from `pnpm-lock.yaml`.
- `pnpm dev` starts the Vite development server with hot reload.
- `pnpm build` runs `vue-tsc` type checking, then creates a production build.
- `pnpm preview` serves the production build locally for verification.
- `pnpm test:e2e` runs all `tests/e2e/**/*.test.ts` files once with Vitest. The suite starts its own Vite server on port 5199 and launches local Chrome/Chromium.

## Coding Style & Naming Conventions

Follow the existing TypeScript and Vue style: two-space indentation, semicolons, double-quoted imports, and trailing commas in multiline expressions. Use PascalCase for Vue components and interfaces, camelCase for functions and variables, and descriptive kebab-case CSS classes. Keep Vue components organized as `<script setup lang="ts">` followed by `<template>`. Strict unused-code and fallthrough checks are enforced through TypeScript. There is no separate formatter or linter command, so match nearby code and verify with `pnpm build`.

## Testing Guidelines

Vitest is the runner; Stagehand supplies browser automation. Name tests `*.test.ts` and place browser scenarios in `tests/e2e/`. Keep each test independent, use one semantic action per `stagehand.act()` call, and prefer locators for stable DOM paths to reduce latency and model cost. Do not add `data-testid` attributes solely to bypass the demo's semantic-testing purpose. No coverage threshold is configured.

Copy `.env.example` to `.env` and set `OPENAI_API_KEY` before testing. Never commit `.env` or API keys.

## Commit & Pull Request Guidelines

Recent history follows Conventional Commits such as `feat:`, `fix:`, and `docs:`; keep subjects concise and focused. Pull requests should explain the behavior change, list verification commands, link relevant issues, and include screenshots for visible UI changes. Call out changes that affect LLM call count, model choice, test cost, or timing.
