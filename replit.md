# Workspace

## Overview

Niche Seeder — a 2026 AI cinematic content distribution tool. Analyzes video URLs to identify micro-niches, maps target communities, generates human-sounding "Spark Posts," builds platform strategies, and now generates Content Blueprints, cinematic scripts, platform metadata, and multi-episode content series plans.

pnpm workspace monorepo using TypeScript.

## Stack

- **Monorepo tool**: pnpm workspaces
- **Node.js version**: 24
- **Package manager**: pnpm
- **TypeScript version**: 5.9
- **API framework**: Express 5
- **Database**: PostgreSQL + Drizzle ORM
- **Validation**: Zod (`zod/v4`), `drizzle-zod`
- **API codegen**: Orval (from OpenAPI spec)
- **Build**: esbuild (CJS bundle)
- **AI**: OpenAI via Replit AI Integrations (gpt-5.2)

## Features

- **Command Center** (dashboard): Stats, platform breakdown, Platform Signal Keys, 2026 Distribution Waterfall visualization
- **New Injection**: Paste YouTube/TikTok/Facebook URL, AI maps micro-niche, mood keywords, audience profile, hook suggestion
- **Community Mapping**: Top 20 Discord/Telegram/Reddit communities per micro-niche with relevance scores
- **Spark Posts**: Human-sounding organic posts tailored per community and platform
- **Strategy**: Platform-specific Waterfall Trigger, 1.5s Micro-Hook, Content Pillars, Wildcard Play
- **Blueprint**: Algorithm Readiness Score (0-100 with breakdown), Character Consistency Protocol, Sound Design Plan, POV Lore/Digital Artifact concept, Identity Loyalty Factors, High-Intent Gains Tactics
- **Script Generator**: Full 60-90 second cinematic scripts with logline, 1.5-second opening hook, three acts, visual notes, dialogue/text, sound design cues, cliffhanger, character description, and world-building note
- **Metadata Optimizer**: YouTube/TikTok/Facebook titles, descriptions, posting times, search tags, hashtags, thumbnail concept, and A/B hook variants
- **Content Series Planner**: 7-episode cinematic universe plans with recurring lore, episode hooks, cliffhangers, character arcs, and Identity Loyalty hook
- **Photo Studio**: Sidebar-accessible prompt studio with 38 photo filter types inspired by user-provided examples, searchable categories, source photo upload, optional direction notes, filter-applied editable prompts, regenerate controls, and copyable output

## Database Schema

- `analyses` — video analyses with `blueprintData`, `scriptData`, `metadataData`, and `seriesData` (jsonb) columns for persisting generated content tools
- `communities` — mapped communities per analysis
- `spark_posts` — generated organic posts

## Key Commands

- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)

See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details.
