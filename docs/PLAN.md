# AXIS — Phase 1 Implementation Plan

**Goal:** Working V1 (Strategy) + V2 (Content Calendar) — UI first, backend later
**Status:** In Progress
**Date:** February 2026
**Approach:** Frontend-first. All data lives in local state (Zustand) with mock data. Backend (database, auth, API) will be connected later.

---

## Overview

Phase 1 builds the complete UI: users can create brands, generate strategies (mock), and plan content calendars (mock). Everything works visually. Real LLM and database come after the UI is solid.

---

## Task Dependency Graph

```
Step 1: Project Foundation (theme, fonts, colors)
  └── Step 2: App Shell (sidebar + top tabs + layout)
        ├── Step 3: Brand CRUD (local state + mock data)
        │     └── Step 4: V1 — Strategy Chat UI (mock responses)
        │           └── Step 5: V1 — Strategy Output View
        │                 └── Step 6: V2 — Content Calendar UI
        │                       └── Step 7: V2 — Content Card CRUD
        └── Step 8: Mobile Responsive Polish
```

**Backend Phase (later):**
```
Step B1: Database + Auth (Supabase + Prisma)
Step B2: LLM Integration (Vercel AI SDK + Claude)
Step B3: Web Search (Tavily)
Step B4: Connect UI to real APIs
```

---

## Steps

### Step 1: Project Foundation
**What:** Theme colors (blue tones), fonts, base configuration.
**Depends on:** Nothing

Tasks:
- [ ] Update globals.css: blue color palette (PRD: "Blue tones for trust")
- [ ] Geist font already configured — verify it works
- [ ] Install Zustand for client-side state management
- [ ] Verify build passes

**Deliverable:** Blue-themed, clean project that builds.

---

### Step 2: App Shell (Layout, Sidebar, Top Navigation)
**What:** The main layout wrapper — left sidebar + top tabs + main content area.
**Depends on:** Step 1

Tasks:
- [ ] Create `/app/(dashboard)/layout.tsx` — the app shell
- [ ] Left sidebar component:
  - Brand list (from Zustand store, initially empty)
  - Active brand highlight
  - "+ Add Brand" button
  - AXIS logo at top
  - Collapse toggle
- [ ] Top navigation tabs:
  - Strategy (unlocked)
  - Content Calendar (locked)
  - Production (locked)
  - Publish (locked)
  - Analytics (locked)
  - Advertising (locked)
  - Ad Performance (locked)
  - Locked tabs: greyed out, non-clickable, tooltip "Complete previous step"
- [ ] Main content area (renders child routes)
- [ ] Floating assistant placeholder (small button, bottom-right)

**Deliverable:** Full app shell visible. Sidebar shows, tabs show, main area is empty.

---

### Step 3: Brand CRUD
**What:** Create, list, select, edit, delete brands — all in local state.
**Depends on:** Step 2

Tasks:
- [ ] Zustand brand store:
  - `brands[]` — list of brands
  - `activeBrandId` — currently selected brand
  - `addBrand()`, `updateBrand()`, `deleteBrand()`, `setActiveBrand()`
- [ ] "Add Brand" dialog:
  - Brand name (required)
  - Description (optional)
  - Website URL (optional)
  - Initials-based avatar (auto-generated from name)
- [ ] Brand list in sidebar (from store)
- [ ] Click brand → set active → content area updates
- [ ] Edit brand (inline or dialog)
- [ ] Delete brand (confirmation dialog)
- [ ] Empty state: "No brands yet. Create your first brand."
- [ ] Seed with sample brand "Coff AI" for development

**Deliverable:** Create "Coff AI", see it in sidebar, click it, edit it, delete it. All local, no API.

---

### Step 4: V1 — Strategy Chat UI
**What:** Chat interface where user describes their brand. Mock AI responses for now.
**Depends on:** Step 3

Tasks:
- [ ] Chat UI component:
  - Message list (scrollable)
  - User messages (right-aligned, blue)
  - AI messages (left-aligned, gray)
  - Text input + send button at bottom
  - Auto-scroll to latest message
- [ ] Mode selection (before or during chat):
  - "Full Automation" button
  - "Manual" button
  - Visual distinction between modes
- [ ] Mock AI responses:
  - User sends message → fake delay (1-2 sec) → mock response appears
  - Mock responses simulate strategy generation
  - In Manual mode: mock follow-up questions with selectable options
- [ ] Chat state in Zustand store (per brand)
- [ ] "Strategy Ready" trigger → enables strategy view

**Deliverable:** User types about their brand, mock AI responds, conversation flows. No real LLM yet.

---

### Step 5: V1 — Strategy Output View
**What:** Structured strategy document view — the result of the chat.
**Depends on:** Step 4

Tasks:
- [ ] Strategy view with 10 sections (cards or accordion):
  1. Brand Summary
  2. Market Overview
  3. Competitor Analysis
  4. Target Audience
  5. Platform Strategy
  6. Content Pillars
  7. Tone of Voice
  8. Posting Schedule
  9. Format Mix
  10. KPIs
- [ ] Mock strategy data (realistic for Coff AI)
- [ ] Each section: display mode + edit mode (click to edit)
- [ ] "Regenerate" button per section (mock: replaces with slightly different text)
- [ ] Strategy status badge: Draft / Approved
- [ ] "Approve & Continue to Calendar" button → unlocks V2 tab
- [ ] Zustand store for strategy data (per brand)

**Deliverable:** Beautiful strategy document with mock Coff AI data. Edit a section, approve, V2 tab unlocks.

---

### Step 6: V2 — Content Calendar UI
**What:** Weekly/monthly calendar with content slots.
**Depends on:** Step 5

Tasks:
- [ ] Calendar component:
  - Week view (default): 7 columns (Mon-Sun), content cards in each day
  - Month view: grid of days, compact card previews
  - Week/Month toggle
  - Navigate between weeks/months (prev/next arrows)
- [ ] Mock calendar data:
  - Generate 2 weeks of content slots from mock strategy
  - Each slot: format icon, platform icon, theme label, time
- [ ] Calendar customization:
  - Posts per day selector
  - Days per week selector (5/6/7)
- [ ] Content cards on calendar:
  - Mini card: shows format + platform + theme
  - Color-coded by theme/platform
  - Click to open detail view (Step 7)
- [ ] "Generate Calendar" button (mock: populates with sample data)
- [ ] Drag and drop to move cards between days
- [ ] Empty state: "Generate your content calendar"

**Deliverable:** Visual calendar with colored content cards. Navigate weeks, see what's planned for each day.

---

### Step 7: V2 — Content Card CRUD
**What:** Full content card detail view with all 10 fields.
**Depends on:** Step 6

Tasks:
- [ ] Card detail panel (slide-out from right, or modal):
  - Format selector (Reel, Carousel, Single Post, Story)
  - Platform selector (Instagram, Facebook, TikTok, LinkedIn, Pinterest, X)
  - Theme (from strategy's content pillars)
  - Hook (text area)
  - Story / Narrative (text area)
  - Production Guide (checklist)
  - Prompts (text area)
  - Caption + hashtags (text area)
  - Status pipeline: Plan → Story → Prompt → Production → Caption → Ready
  - Schedule: date + time picker
- [ ] Mock "Generate" buttons per field:
  - "Generate Hook" → fills with mock text
  - "Generate Story" → fills with mock narrative
  - "Generate All" → fills all empty fields
- [ ] Status auto-advances as fields are filled
- [ ] Card actions: duplicate, delete, create new
- [ ] Cross-platform preview: "Adapt for Instagram / LinkedIn" (mock)
- [ ] Zustand store for content cards (per brand)

**Deliverable:** Open a card, see all fields, fill them (manually or mock-generate), status updates. Full card lifecycle works.

---

### Step 8: Mobile Responsive Polish
**What:** Make everything work on phones.
**Depends on:** Steps 2-7

Tasks:
- [ ] Sidebar: hamburger menu, slide-out drawer
- [ ] Top tabs: horizontal scroll
- [ ] Chat: full-width
- [ ] Calendar: single-day view on mobile, swipe between days
- [ ] Content card: full-screen on mobile
- [ ] Test: 375px, 390px, 768px, 1024px

**Deliverable:** AXIS fully usable on mobile.

---

## Tech Stack (Frontend Phase)

| Layer | Choice | Why |
|-------|--------|-----|
| Framework | Next.js 16 (already set up) | SSR + file-based routing |
| Styling | Tailwind CSS 4 (already set up) | Fast, utility-first |
| UI Components | shadcn/ui (already set up) | Beautiful, accessible |
| Icons | Tabler Icons (already set up) | Clean, consistent |
| State | Zustand | Simple, lightweight, no boilerplate |
| Date Utils | date-fns | Lightweight date handling |

## Packages to Install Now

```
zustand        # Client-side state management
date-fns       # Date utilities for calendar
```

## Packages for Backend Phase (later)

```
@supabase/supabase-js     # Database + Auth
prisma + @prisma/client    # ORM
ai + @ai-sdk/anthropic     # Vercel AI SDK + Claude
@tavily/core               # Web search
```

---

## What's Deferred

**To Backend Phase:**
- Database (Supabase + Prisma)
- Authentication (Supabase Auth)
- Real LLM integration (Claude API)
- Web search (Tavily)
- API routes

**To Phase 2+:**
- V3-V7 (Production, Publish, Analytics, Ads)
- Web scraping
- Social media APIs
- Multi-user / team features
