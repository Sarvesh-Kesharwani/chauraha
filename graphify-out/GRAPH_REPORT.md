# Graph Report - .  (2026-04-25)

## Corpus Check
- Corpus is ~8,177 words - fits in a single context window. You may not need a graph.

## Summary
- 88 nodes · 104 edges · 7 communities detected
- Extraction: 89% EXTRACTED · 11% INFERRED · 0% AMBIGUOUS · INFERRED: 11 edges (avg confidence: 0.77)
- Token cost: 0 input · 0 output

## Community Hubs (Navigation)
- [[_COMMUNITY_Codex Dev & Deployment Rules|Codex Dev & Deployment Rules]]
- [[_COMMUNITY_Road Grid & Scoring Engine|Road Grid & Scoring Engine]]
- [[_COMMUNITY_Claude Design & UX Guide|Claude Design & UX Guide]]
- [[_COMMUNITY_Claude Git & Deploy Policy|Claude Git & Deploy Policy]]
- [[_COMMUNITY_Code Quality Standards|Code Quality Standards]]
- [[_COMMUNITY_Road Tile Component|Road Tile Component]]
- [[_COMMUNITY_Branding & Bootstrap|Branding & Bootstrap]]

## God Nodes (most connected - your core abstractions)
1. `AGENTS.md - Codex Operating Instructions` - 18 edges
2. `Tubeo Reference Project` - 8 edges
3. `Tubeo Reference Project` - 7 edges
4. `bfsComponent()` - 5 edges
5. `hasConnector()` - 5 edges
6. `Non-Negotiables` - 5 edges
7. `cellKey()` - 4 edges
8. `evalTile()` - 4 edges
9. `scoreGrid()` - 4 edges
10. `Branch Strategy (dev/prod/plus)` - 4 edges

## Surprising Connections (you probably didn't know these)
- `onKey()` --calls--> `cellKey()`  [INFERRED]
  src\components\GridCanvas.tsx → src\lib\grid.ts
- `evalTile()` --calls--> `hasConnector()`  [INFERRED]
  src\lib\grid.ts → D:\katni_map_game\src\lib\roads.ts
- `bfsComponent()` --calls--> `hasConnector()`  [INFERRED]
  src\lib\grid.ts → D:\katni_map_game\src\lib\roads.ts

## Hyperedges (group relationships)
- **Deployment Platform Trio Decision** — claudemd_deploy_vercel, claudemd_deploy_cloudflare, claudemd_deploy_render [EXTRACTED 1.00]
- **Tubeo Reuse Surfaces** — claudemd_duolingo_theme, claudemd_auth_patterns, claudemd_sync_patterns, claudemd_dashboard_shell [EXTRACTED 1.00]
- **Branch Strategy Trio** — claudemd_branch_dev, claudemd_branch_prod, claudemd_branch_plus [EXTRACTED 1.00]
- **Tubeo Reuse Patterns** — agents_tubeo, agents_duolingo_theme, agents_auth_google, agents_sync_patterns, agents_dashboard_shell [EXTRACTED 1.00]
- **Deployment Decision Policy** — agents_deployment_vercel, agents_deployment_cloudflare, agents_deployment_render [EXTRACTED 1.00]
- **Development Discipline Cluster** — agents_dev_workflow, agents_branch_strategy, agents_git_worktree, agents_impl_workflow [INFERRED 0.85]
- **UI Design System** — agents_duolingo_theme, agents_visual_direction, agents_ui_constraints, agents_interaction_rules, agents_app_shell [INFERRED 0.90]

## Communities

### Community 0 - "Codex Dev & Deployment Rules"
Cohesion: 0.16
Nodes (22): AGENTS.md - Codex Operating Instructions, App Shell Rules, Google Sign-In Authentication Pattern, Branch Strategy (dev, prod, plus), Code Quality Rules, Dashboard Shell Structure, Cloudflare Deployment, Render Deployment (+14 more)

### Community 1 - "Road Grid & Scoring Engine"
Cohesion: 0.25
Nodes (9): bfsComponent(), cellKey(), countLoops(), evalTile(), parseKey(), scoreGrid(), onKey(), hasConnector() (+1 more)

### Community 2 - "Claude Design & UX Guide"
Cohesion: 0.16
Nodes (14): Authentication Patterns, Claude Operating Guide, Dashboard Shell Structure, Duolingo-inspired Theme, Google Drive Sync, Google Sign-in Flow, Implementation Workflow (smallest working slice), Interaction Rules (+6 more)

### Community 3 - "Claude Git & Deploy Policy"
Cohesion: 0.18
Nodes (14): dev Branch, plus Branch, prod Branch, Branch Strategy (dev/prod/plus), Claude Code + MCP Workflow Alignment, Commit Policy, Decision Rules for Claude, Cloudflare Deployment (backend/fullstack) (+6 more)

### Community 4 - "Code Quality Standards"
Cohesion: 0.5
Nodes (5): Code Quality Rules, Context-efficiency Rules, Reuse Policy, Separation of Concerns, TypeScript

### Community 5 - "Road Tile Component"
Cohesion: 0.67
Nodes (1): StraightLane()

### Community 9 - "Branding & Bootstrap"
Cohesion: 1.0
Nodes (2): Branding Direction, Project Bootstrap Rules

## Knowledge Gaps
- **15 isolated node(s):** `Google Sign-in Flow`, `Google Drive Sync`, `Project Bootstrap Rules`, `Branding Direction`, `Interaction Rules` (+10 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **Thin community `Road Tile Component`** (3 nodes): `RoadTile.tsx`, `StraightLane()`, `RoadTile.tsx`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Branding & Bootstrap`** (2 nodes): `Branding Direction`, `Project Bootstrap Rules`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `Reuse Policy` connect `Code Quality Standards` to `Claude Design & UX Guide`, `Claude Git & Deploy Policy`?**
  _High betweenness centrality (0.082) - this node is a cross-community bridge._
- **Why does `Tubeo Reference Project` connect `Claude Design & UX Guide` to `Code Quality Standards`?**
  _High betweenness centrality (0.082) - this node is a cross-community bridge._
- **Why does `Non-negotiables` connect `Claude Git & Deploy Policy` to `Code Quality Standards`?**
  _High betweenness centrality (0.069) - this node is a cross-community bridge._
- **Are the 2 inferred relationships involving `hasConnector()` (e.g. with `evalTile()` and `bfsComponent()`) actually correct?**
  _`hasConnector()` has 2 INFERRED edges - model-reasoned connections that need verification._
- **What connects `Google Sign-in Flow`, `Google Drive Sync`, `Project Bootstrap Rules` to the rest of the system?**
  _15 weakly-connected nodes found - possible documentation gaps or missing edges._