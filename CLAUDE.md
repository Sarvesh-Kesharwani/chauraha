# CLAUDE.md

## Purpose

This file defines how Claude should operate when building this project.

The goal is to produce a production-grade app with strong UX, clean code, predictable architecture, and disciplined deployment choices.

Priorities:

1. Ship working product flows first.
2. Preserve a consistent design system and shell structure.
3. Reuse proven patterns from prior successful projects.
4. Keep code simple, maintainable, and readable.
5. Make deployment decisions intentionally, not randomly.

Do not over-engineer.
Do not introduce speculative abstractions.
Do not rewrite stable working patterns without a concrete reason.

---

## Primary reference project

Use this repository as the main implementation and UX reference:

- `https://github.com/Sarvesh-Kesharwani/tubeo`

Reuse the strong patterns from that app wherever they fit.

Specifically reuse and adapt:

1. **Duolingo-inspired theme**

   - playful but polished
   - rounded surfaces
   - bold visual hierarchy
   - clear CTA treatment
   - strong affordance on interactive elements
   - clean cards, chips, pills, and high-clarity sectioning
2. **Authentication patterns**

   - Google sign-in flow
   - signed-in vs signed-out shell behavior
   - logout behavior
   - user-state-aware header actions
3. **Sync patterns**

   - signed-in sync behavior
   - subtle sync state visibility
   - explicit but non-noisy persistence UX
   - no stale local state after logout
4. **Dashboard shell structure**

   - preserve the same top-level layout philosophy
   - keep sign-in, sign-out, sync, and settings in predictable top-level positions
   - do not bury key controls
   - preserve familiar navigation behavior and page hierarchy

Do not copy Tubeo domain logic or branding.
Do copy its strongest product, auth, sync, dashboard, and UI patterns.

---

## Project bootstrap rules

When starting a new project, first suggest a list of strong project names based on the product purpose.

Once a name is chosen, use it consistently across:

- repository name
- app name
- metadata
- branding
- deployment configuration
- environment naming where relevant

Also propose a cohesive branding direction at project bootstrap:

- logo concept
- favicon concept
- app icon direction
- color direction
- product tone

Keep branding aligned with the app theme and product purpose.

---

## Product and design rules

The app should feel focused, attractive, and production-grade.

### Visual direction

- Duolingo-inspired, but not childish
- bright, clean, friendly, and crisp
- obvious hierarchy
- clear primary actions
- rounded cards and strong section boundaries
- strong empty states and clear next-step UX

### UI constraints

- Prefer one strong primary action per screen.
- Prefer cards and sections over cluttered dense layouts.
- Prefer chips or segmented controls over dropdowns when option count is small.
- Settings must be easy to find.
- Auth controls must be visible and predictable.
- Avoid weak low-contrast UI.
- Avoid generic dull SaaS styling.

### Interaction rules

- Keep flows short.
- Avoid modal spam.
- Confirm destructive actions.
- Use optimistic UI only when rollback is clear.
- Preserve layout stability during loading.
- Every screen should make the next action obvious.

---

## Auth and sync conventions

Prefer Google sign-in when social auth is needed.

### Required auth behavior

- keep sign-in entry points visible in the header or top shell
- reflect signed-in state clearly and immediately
- keep account and settings actions in predictable top-level locations
- logout must reliably clear user-specific transient local state
- do not leave stale local UI state after logout
- do not make authentication feel bolted on

### Sync behavior

If the app stores user-specific preferences, progress, saved items, or configuration:

- support signed-in persistence and sync
- keep sync visibility subtle but clear
- prefer lightweight sync indicators over noisy banners
- handle local-vs-remote state carefully
- use deterministic sync behavior rather than hidden magic

### Google Drive sync

If Google Drive sync is implemented:

- follow the same UX discipline used in prior reference projects
- keep ownership and source of truth understandable
- handle sign-in, sync, and logout coherently
- do not allow confusing stale state after account switch or logout
- errors should be clear and actionable, never cryptic

---

## App shell and dashboard rules

Default shell expectations:

- top header
- product identity on the left
- top-level auth, sync, and settings controls in a predictable area
- simple top navigation
- main content below with generous spacing
- settings should be top-level and easy to reach

When borrowing layout ideas from Tubeo:

- preserve positions of settings, sign-in buttons, and account controls
- preserve the dashboard structure philosophy
- preserve familiar shell ergonomics
- do not relocate core controls without a concrete UX reason

---

## Development workflow rules

Prefer issue-based development over direct ad hoc implementation.

Before starting substantial work:

1. define the task as a GitHub issue
2. clarify objective, scope, constraints, and acceptance criteria
3. implement against that issue rather than vague instructions

For large efforts, parallelize work only through isolated branches and clearly scoped issues.

When working on multiple issues in parallel, prefer `git worktree` so each Claude session operates on its own working tree and branch.

Use one Claude session per issue branch when parallelizing work.

Merge back only after validation.

---

## Branch strategy

Use this branch structure unless explicitly overridden:

- `dev`: active development branch
- `prod`: production branch
- `plus`: optional branch for experimental, premium, or polish work if the project requires it

Rules:

- do not push broken or incomplete work to shared branches
- never push directly to `prod` unless explicitly instructed
- complete meaningful working units of change before committing
- create focused commits on `dev`
- production-ready changes should flow from `dev` into `prod` through deliberate promotion, not chaos

If `plus` is used, define its exact purpose in the repo README or project notes and keep that purpose consistent.

---

## Git and repo rules

When bootstrapping a new project:

- create a GitHub repository early
- connect the local project to the repository
- keep repository naming consistent with selected product naming
- structure the repo cleanly from the start

Commit policy:

- commit after meaningful, successful, working changes
- do not create noisy junk commits
- do not batch unrelated changes into one commit
- push ongoing implementation work to `dev`, not `prod`

---

## Deployment policy

Deployment must follow the project type.

### Static or frontend-only projects

Use **Vercel** for static or frontend-only projects.

Production deployment should track the `prod` branch only.

Do not let production deployments follow `dev`.

Preview deployments may use non-production branches where useful.

### Backend or fullstack projects

Prefer **Cloudflare** first for backend or fullstack deployment.

Use Cloudflare first when:

- backend APIs are needed
- auth callbacks are needed
- storage or edge logic is needed
- fullstack deployment is desired
- Claude Code tooling or MCP integration benefits from Cloudflare

Reason:
Cloudflare is preferred because it aligns well with the intended Claude Code workflow and MCP-aware operational model.

### Render fallback

Use **Render** as the fallback for backend or fullstack deployment when:

- the runtime is a poor fit for Cloudflare
- long-running or conventional server behavior is needed
- dependency compatibility is easier on a traditional platform
- operational simplicity is better on Render for that project

### Deployment decision rule

If unclear:

1. choose **Cloudflare** first for backend/fullstack
2. use **Render** if Cloudflare is not the right operational fit
3. use **Vercel** for static/frontend-only apps

---

## Code quality rules

### General

- Write straightforward TypeScript.
- Prefer clarity over cleverness.
- Keep files cohesive.
- Keep component trees understandable.
- Avoid unnecessary custom hooks and abstraction layers.
- Avoid giant utility dumping grounds.
- Avoid speculative architecture.

### Separation of concerns

Separate:

- UI components
- auth/session logic
- sync logic
- domain logic
- data access
- deployment/platform-specific adapters

Keep platform-specific code isolated so Cloudflare, Render, or Vercel choices do not leak across the codebase.

### Reuse policy

Before creating a new implementation pattern, check whether Tubeo already provides a solid pattern for:

- auth controls
- header layout
- settings placement
- sync indicators
- buttons/chips/cards
- dashboard shell
- navigation structure

If a good pattern already exists, reuse the idea.

---

## Context-efficiency rules

Keep the repository easy for Claude to read and modify.

That means:

- stable folder structure
- clear naming
- no random file sprawl
- concise architecture documentation
- predictable component organization
- minimal context waste from duplicated patterns

Prefer maintainable structure over trendy complexity.

Do not add vague token-saving tools or workflow gimmicks unless they are already proven and explicitly adopted for the repo.

---

## Implementation workflow

When asked to build a feature:

1. identify whether it belongs in the existing shell or needs a new route/view
2. check whether Tubeo already has a reusable pattern
3. implement the smallest complete working slice first
4. make it visually coherent with the Duolingo-inspired system
5. wire auth, user state, and sync properly
6. respect the correct deployment target from the start
7. refine only after the core flow works

Do not begin with refactors.
Do not begin with broad rewrites.
Start with the working slice.

---

## Decision rules for Claude

When making tradeoffs, prefer:

- clarity over cleverness
- consistency over novelty
- reuse over reinvention
- working UX over decorative complexity
- issue-based implementation over vague task hopping
- isolated worktrees over parallel branch chaos
- Cloudflare for backend/fullstack where practical
- Render as fallback when Cloudflare is a poor fit
- Vercel for static/frontend-only apps

If adding a dependency, justify it by:

- product need
- maintenance cost
- deployment compatibility
- implementation simplicity

---

## Non-negotiables

- Keep the UI polished.
- Keep the shell predictable.
- Keep auth simple and solid.
- Keep settings easy to find.
- Keep sync understandable.
- Reuse the strongest patterns from Tubeo.
- Prefer Cloudflare for backend/fullstack.
- Use Render when Cloudflare is the wrong fit.
- Use Vercel for static/frontend-only deployments.
- Use issue-based development for substantial work.
- Use isolated branches or worktrees for parallel Claude sessions.
- Commit meaningful working changes to `dev`.
- Do not push directly to `prod` unless explicitly instructed.
