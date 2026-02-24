# AXIS — Phase 1 Implementation Plan

**Goal:** Working V1 (Strategy) + V2 (Content Calendar) with real LLM integration
**Status:** Planning
**Date:** February 2026

---

## Overview

Phase 1 builds the core foundation: users can create brands, generate AI-powered strategies, and plan content calendars. This is the MVP that proves AXIS works.

---

## Task Dependency Graph

```
Step 1: Projth
        └── Step 3: App Shell (Lect Foundation
  └── Step 2: Database + Auayout, Sidebar, Navigation)
              ├── Step 4: Brand CRUD
              │     └── Step 5: V1 — Strategy (Chat + LLM)
              │           └── Step 6: V1 — Strategy Output View
              │                 └── Step 7: V2 — Content Calendar
              │                       └── Step 8: V2 — Content Card CRUD + LLM
              └── Step 9: Mobile Responsive Polish
```

---

## Steps

### Step 1: Project Foundation
**What:** Configure the project base — theme colors, fonts, environment variables.
**Why:** Everything else depends on a clean, configured project.
**Depends on:** Nothing (first step)

Tasks:
- [ ] Update globals.css theme to blue tones (PRD: "Blue tones for trust")
- [ ] Configure Geist font as the primary sans-serif
- [ ] Set up environment variables structure (.env.local for API keys)
- [ ] Verify project builds and runs cleanly (`pnpm dev`)

**Deliverable:** Clean project with AXIS branding, blue color scheme, builds without errors.

---

### Step 2: Database + Auth
**What:** Set up database (PostgreSQL) and authentication system.
**Why:** Users need accounts. Brands, strategies, and content all need persistent storage.
**Depends on:** Step 1

Tasks:
- [ ] Choose and set up database (PostgreSQL via Supabase, Neon, or similar)
- [ ] Set up ORM (Prisma or Drizzle) with initial schema
- [ ] Design database schema:
  - `User` — id, email, name, createdAt
  - `Brand` — id, userId, name, icon, description, website, createdAt
  - `Strategy` — id, brandId, content (JSON), mode (auto/manual), status, createdAt
  - `ContentCard` — id, brandId, strategyId, format, platform, theme, hook, story, productionGuide, prompts, caption, status, scheduledAt, createdAt
- [ ] Set up auth (NextAuth.js or Clerk)
- [ ] Create login/signup pages
- [ ] Protect routes (middleware)

**Deliverable:** Users can sign up, log in, and their data persists.

**Open Question:** Which database provider? Options:
1. **Supabase** (PostgreSQL + auth + realtime — all-in-one, free tier)
2. **Neon** (Serverless PostgreSQL, free tier) + Clerk (auth)
3. **PlanetScale** (MySQL, free tier) + NextAuth

---

### Step 3: App Shell (Layout, Sidebar, Top Navigation)
**What:** Build the main application layout that wraps all pages.
**Why:** PRD defines a specific layout: left sidebar (brands) + top tabs (V1-V7) + main content area. Everything lives inside this shell.
**Depends on:** Step 2 (needs auth to show user info)

Tasks:
- [ ] Create app shell layout: sidebar + top nav + main content area
- [ ] Left sidebar:
  - Brand list (from database)
  - Active brand indicator
  - "+ Add Brand" button
  - User avatar / settings at bottom
- [ ] Top navigation tabs:
  - V1: Strategy (unlocked by default)
  - V2-V7: Locked (greyed out, tooltip says "Complete previous step")
  - Tabs unlock progressively as user completes each stage
- [ ] Floating assistant widget placeholder (bottom-right corner)
- [ ] Responsive: sidebar collapses on mobile

**Deliverable:** Navigable app shell. Clicking brands and tabs routes to correct pages (even if pages are empty).

---

### Step 4: Brand CRUD
**What:** Users can create, view, edit, and delete brands.
**Why:** AXIS is multi-brand. Everything (strategy, calendar, content) belongs to a brand. You can't do V1 without a brand.
**Depends on:** Step 3 (needs sidebar to display brands)

Tasks:
- [ ] "Add Brand" modal/form:
  - Brand name (required)
  - Brand description (optional)
  - Website URL (optional)
  - Brand icon/logo upload (optional, use initials as fallback)
- [ ] Brand list in sidebar (fetched from DB)
- [ ] Click brand → sets as active brand → loads brand data in main area
- [ ] Edit brand (name, description, website)
- [ ] Delete brand (with confirmation dialog)
- [ ] Empty state: "No brands yet. Create your first brand to get started."

**Deliverable:** Full brand management. Create "Coff AI" brand, see it in sidebar, click it, edit it, delete it.

---

### Step 5: V1 — Strategy Chat Interface + LLM Integration
**What:** The main V1 experience — user describes their brand via chat, AI generates a strategy.
**Why:** This is the core value of AXIS. Strategy generation is Phase 1's centerpiece.
**Depends on:** Step 4 (needs a brand to create a strategy for)

Tasks:
- [ ] Chat interface UI:
  - Message bubbles (user + AI)
  - Text input with send button
  - Streaming AI responses (show text as it arrives)
  - Support for URL input (user pastes website)
- [ ] Mode selection UI:
  - "Full Automation" vs "Manual" toggle/choice
  - Show at start of chat or as persistent toggle
  - Full Auto: AI generates strategy immediately after input
  - Manual: AI asks follow-up questions, user approves each step
- [ ] Backend API route: `/api/chat`
  - Receives user message + brand context
  - Calls Claude API (Sonnet for speed)
  - Streams response back to frontend
  - System prompt includes: brand strategist role, what to analyze, output format
- [ ] Web search integration:
  - Use Claude's web search tool or Tavily API
  - Search for: market data, competitors, industry trends
  - Feed search results into LLM context
- [ ] Conversation persistence:
  - Save chat history per brand
  - User can continue conversation later

**Deliverable:** User types "Coff AI is an AI video generation platform", AI researches and generates a complete strategy via chat.

---

### Step 6: V1 — Strategy Output View
**What:** Display the generated strategy as a structured, editable document.
**Why:** The chat generates a strategy, but users need to see it as a clean document they can review and edit.
**Depends on:** Step 5 (needs a generated strategy)

Tasks:
- [ ] Strategy document view with sections:
  1. Brand Summary
  2. Market Overview
  3. Competitor Analysis
  4. Target Audience
  5. Platform Strategy
  6. Content Pillars (4-6 themes)
  7. Tone of Voice
  8. Posting Schedule
  9. Format Mix
  10. KPIs
- [ ] Each section is inline-editable (click to edit, save)
- [ ] "Regenerate" button per section (ask AI to rewrite just that section)
- [ ] "Regenerate All" button (re-run full strategy)
- [ ] Strategy saved to database (JSON format, linked to brand)
- [ ] Strategy status: Draft → Approved
- [ ] "Approve & Continue to Calendar" button → unlocks V2 tab

**Deliverable:** Clean strategy document. User reads it, edits "Tone of Voice", approves, V2 tab unlocks.

---

### Step 7: V2 — Content Calendar UI
**What:** Calendar view showing content slots, generated from the approved strategy.
**Why:** After strategy, the next step is planning what to post and when.
**Depends on:** Step 6 (needs an approved strategy to generate calendar)

Tasks:
- [ ] Calendar UI:
  - Week view (default) and month view toggle
  - Days as columns, time slots as rows
  - Content cards placed in slots
- [ ] LLM calendar generation:
  - Takes strategy as input
  - Generates 1-4 weeks of content slots
  - Each slot has: format, platform, theme, time
  - Respects strategy's posting frequency and platform selection
- [ ] Calendar customization:
  - Days per week: 5, 6, or 7
  - Posts per day: configurable
  - Drag and drop to rearrange cards
- [ ] Empty state: "Your strategy is ready! Generate your first content calendar."
- [ ] "Generate Calendar" button → calls LLM → populates calendar

**Deliverable:** Calendar with content slots. User sees "Monday: Instagram Reel — Behind the Scenes", "Tuesday: LinkedIn Post — Industry Insight", etc.

---

### Step 8: V2 — Content Card CRUD + LLM Generation
**What:** Full content card management — view, edit, generate each field with AI.
**Why:** Each calendar slot is a content card with 10 fields (format, platform, theme, hook, story, etc.). Users need to fill and manage these.
**Depends on:** Step 7 (needs calendar with cards)

Tasks:
- [ ] Content card detail view (modal or side panel):
  - All 10 fields visible (format, platform, theme, hook, story, production guide, prompts, caption, status, schedule)
  - Each field editable
  - Status pipeline: Plan → Story → Prompt → Production → Caption → Ready
- [ ] LLM generation per field:
  - "Generate Hook" button → AI writes attention-grabbing opening
  - "Generate Story" button → AI writes narrative
  - "Generate Prompts" button → AI writes image/video generation prompts
  - "Generate Caption" button → AI writes post text + hashtags
  - "Generate All" button → AI fills all empty fields
- [ ] Cross-platform adaptation:
  - One story → multiple platform versions
  - Each version has its own format, caption style, hashtags
  - "Adapt for Instagram / LinkedIn / TikTok" buttons
- [ ] Card actions: duplicate, delete, add new custom card
- [ ] Content card persistence (save to database)

**Deliverable:** User opens a card, sees all fields, clicks "Generate Story", AI writes it. User edits caption, saves. Card status updates.

---

### Step 9: Mobile Responsive Polish
**What:** Ensure the entire app works well on mobile devices.
**Why:** PRD says "Mobile-first from day one". Social media managers often work from their phones.
**Depends on:** Steps 3-8 (needs all UI built first to make responsive)

Tasks:
- [ ] Sidebar: hamburger menu on mobile, slide-out drawer
- [ ] Top tabs: horizontal scroll on mobile
- [ ] Chat interface: full-width on mobile
- [ ] Calendar: single-day view on mobile (swipe between days)
- [ ] Content cards: full-screen modal on mobile
- [ ] Test on common screen sizes (375px, 390px, 768px, 1024px)

**Deliverable:** AXIS is fully usable on a phone.

---

## Tech Stack Decisions Needed Before Coding

| Decision | Options | Recommendation |
|----------|---------|----------------|
| Database | Supabase / Neon / PlanetScale | **Supabase** — PostgreSQL + auth + free tier |
| ORM | Prisma / Drizzle | **Prisma** — better docs, wider community |
| Auth | NextAuth / Clerk / Supabase Auth | **Supabase Auth** — if using Supabase for DB |
| LLM API | Claude API direct / Vercel AI SDK | **Vercel AI SDK** — built-in streaming, Claude support |
| Web Search | Tavily / SerpAPI / Claude tools | **Tavily** — good free tier, easy integration |
| State Management | React Context / Zustand / Jotai | **Zustand** — simple, lightweight |

---

## New Packages Needed

```
# Core
@supabase/supabase-js     # Database + auth client
prisma                     # ORM (dev dependency)
@prisma/client             # ORM runtime

# AI
ai                         # Vercel AI SDK
@ai-sdk/anthropic          # Claude provider for Vercel AI SDK

# Web Search
tavily                     # Web search API (or alternative)

# State & UI
zustand                    # Client-side state management
date-fns                   # Date utilities for calendar
```

---

## Estimated Order of Work

```
Step 1 (Foundation)         ████░░░░░░  ~1 session
Step 2 (Database + Auth)    ████████░░  ~2 sessions
Step 3 (App Shell)          ██████░░░░  ~2 sessions
Step 4 (Brand CRUD)         ████░░░░░░  ~1 session
Step 5 (V1 Chat + LLM)     ████████████ ~3 sessions
Step 6 (V1 Strategy View)   ██████░░░░  ~2 sessions
Step 7 (V2 Calendar UI)     ████████░░  ~2 sessions
Step 8 (V2 Content Cards)   ████████████ ~3 sessions
Step 9 (Mobile Polish)      ████░░░░░░  ~1 session
```

---

## What's NOT in Phase 1

These are explicitly deferred to later phases:
- V3 (Production) — AI image/video generation
- V4 (Publish) — Social media API publishing
- V5 (Analytics) — Performance tracking
- V6 (Advertising) — Ad campaigns
- V7 (Ad Performance) — Ad analytics
- Web scraping (website analysis)
- Social media scraping (competitor content)
- Multi-user / team features
- Floating assistant (placeholder only)
