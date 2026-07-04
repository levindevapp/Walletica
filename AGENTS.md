# AGENTS.md

# Expense Analysis App

## Project Overview

This is a personal expense management and analysis web application.

The primary goal of this project is not only to record expenses, but to provide powerful visualizations and financial insights through graphs and analytics.

This project is being developed as both a personal tool and a GitHub portfolio project.

---

# Tech Stack

## Frontend

- React
- TypeScript
- Vite

## Backend

- Node.js
- Express

## Database

- SQLite

## Libraries

- React Router
- Zustand
- Recharts
- date-fns
- Lucide React

---

# Development Principles

- Prioritize readability.
- Keep implementations simple.
- Prefer maintainability over clever code.
- Follow standard React and TypeScript patterns.
- Avoid unnecessary abstractions.
- Avoid unnecessary dependencies.
- Build incrementally.

---

# Architecture

Use a feature-based structure.

```
src/
 ├── app/
 ├── components/
 │    ├── common/
 │    └── layout/
 ├── features/
 ├── hooks/
 ├── pages/
 ├── services/
 ├── types/
 ├── utils/
```

Rules:

- Shared UI belongs in `components/common`.
- Layout components belong in `components/layout`.
- Business logic belongs in `features`.
- Pages should contain minimal logic.
- Utility functions belong in `utils`.
- Shared types belong in `types`.

---

# Coding Style

- Use TypeScript.
- Never use `any` unless absolutely necessary.
- Prefer explicit types.
- Use functional React components.
- Use hooks.
- Keep functions focused on a single responsibility.
- Keep components small and reusable.
- Prefer composition over duplication.
- Follow existing naming conventions.
- Minimize comments by writing self-explanatory code.

---

# UI Guidelines

- Clean and minimal design.
- Desktop-first.
- Responsive layout.
- Consistent spacing.
- Reusable components.
- Accessibility whenever practical.

---

# Database

SQLite is the primary database.

Design the schema with future analysis in mind.

Normalize tables where appropriate.

Avoid breaking schema changes without updating related code.

---

# Project Philosophy

This application is analysis-first.

Expense input should remain simple.

Development priority:

1. Financial analysis
2. Visualizations
3. Reports
4. Budget tracking
5. Expense input

Favor features that improve financial insights over features that only improve data entry.

---

# Scope Control

Implement only the requested feature.

Do not:

- Modify unrelated files.
- Refactor unrelated code.
- Update dependencies.
- Fix unrelated warnings or errors.
- Expand the scope without permission.

If additional improvements are identified, suggest them after completing the requested task.

---

# Validation Policy

Do not proactively execute project-wide validation.

Do not automatically run:

- npm run lint
- npm run test
- npm run build
- npm run typecheck
- npm audit
- formatters

unless explicitly requested.

If validation is recommended, mention it instead of executing it automatically.

---

# Git Policy

Never create commits.

Never push changes.

Only suggest commit messages.

Use Conventional Commits.

Examples:

- feat: add expense registration page
- feat: implement monthly analysis
- fix: correct category aggregation
- refactor: simplify expense service
- docs: update README

---

# AI Instructions

Before writing code:

- Read the existing implementation.
- Follow existing architecture.
- Follow existing naming conventions.
- Keep changes minimal.
- Avoid introducing new libraries.
- Prefer commonly used production patterns.
- Explain architectural decisions when necessary.

---

# Development Policy

This project is also a learning project.

When implementing features:

- Prefer standard industry practices.
- Avoid experimental APIs.
- Avoid overengineering.
- Explain why a solution was chosen when appropriate.
- Optimize for maintainability and readability.

---

# Primary Rule

Follow the user's request exactly.

Do not expand the requested scope.

Complete the requested task first.

Only after completion may you suggest additional improvements without implementing them automatically.