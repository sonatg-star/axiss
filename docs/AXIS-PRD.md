# AXIS — Product Requirements Document (PRD)

**Version:** 1.0  
**Date:** February 2026  
**Status:** Planning Phase  
**Pilot Brand:** Coff AI

---

## 1. Product Overview

### What is AXIS?
AXIS is an end-to-end content management and social media strategy platform. It operates like a digital agency — from brand strategy creation to content production, publishing, analytics, and ad management — all in one tool.

### Core Philosophy
- **AI-first, human-controlled:** AI recommends and automates, but manual intervention is always possible at every stage.
- **Story-driven content:** The story/narrative is the foundation. Platforms and formats change, but the story remains. Strong story = strong content.
- **Two modes everywhere:** Full Automation (AI decides) or Manual (user approves). User can switch between modes at any time.
- **Minimal, clean UI:** Blue tones for trust. Every page is clean, spacious, and focused. No clutter.

### Target Users
- Social media managers
- Small business owners
- Marketing agencies managing multiple brands
- Content creators scaling their output

---

## 2. Information Architecture

### Top Navigation (Tabs)
Each tab represents a stage in the content lifecycle. They unlock progressively — user starts at Strategy, and subsequent tabs become available as previous stages are completed.

| Tab | Internal Name | User-Facing Name | Status at Start |
|-----|--------------|-------------------|-----------------|
| V1 | Strategy | 🎯 Strategy | Unlocked |
| V2 | Calendar | 📅 Content Calendar | Locked until V1 complete |
| V3 | Production | 🎬 Production | Locked until V2 complete |
| V4 | Publish | 📤 Publish | Locked until V3 has content |
| V5 | Analytics | 📊 Analytics | Locked until V4 has published posts |
| V6 | Ads | 📢 Advertising | Locked until V5 has data |
| V7 | Ad Analytics | 📈 Ad Performance | Locked until V6 has campaigns |

### Left Sidebar
- Brand list (multiple brands per account)
- Each brand shows: name, icon, completion status across all tabs
- "+ Add Brand" button at bottom
- Clicking a brand loads that brand's data across all tabs

### Persistent Assistant
- Small floating assistant widget (bottom-right or sidebar)
- "How can I help you?" — available on every page
- Context-aware: knows which tab, which brand, which content the user is viewing
- Can answer questions, make suggestions, or guide the user

### User Guide
- Accessible from dashboard or assistant
- Brief, clear explanation of Full Automation vs Manual mode
- A few sentences per concept — not a long document
- Could be an onboarding tooltip flow on first visit

---

## 3. V1 — Strategy

### 3.1 User Flow

**Entry Point:** User lands on dashboard. Clean, minimal screen. Center area has a chatbot interface with a CTA like: *"Tell us about your brand. Let's build your content strategy."*

**Step 1: Mode Selection**
Before or during the chat, user selects:
- ⚡ **Full Automation** — AI creates strategy with whatever info is given. Moves to V2 automatically after generation.
- ✋ **Manual** — AI asks deeper questions, user approves each step before proceeding.

> **Important:** Full Automation is not permanent. User can always go back, modify the strategy, switch to manual, and re-run. The system is built but always editable.

**Step 2: Brand Input (Chat-based)**
User describes their brand in natural language. Examples:
- Minimal: "Coff AI — AI video generation platform"
- Detailed: "Coff AI is an AI-powered video and image generation platform with workflow pipelines, one-click remixes, and collaborative filmmaking. Our competitors are Runway, Kling AI, Pika, Sora. We have ~50 users and ~360 followers. Target audience is non-technical content creators."

User can also paste a website URL → AXIS scrapes and analyzes it.

**Step 3: AI Processing**
Based on mode:
- **Full Automation:** AI takes input → web search → scraping → analysis → generates complete strategy → auto-proceeds to V2
- **Manual:** AI takes input → asks follow-up questions via chat (with selectable options) → user approves → AI generates strategy → user reviews → confirms → proceeds to V2

### 3.2 AI Capabilities in V1

| Capability | Method | Notes |
|-----------|--------|-------|
| Brand understanding | User input + web scraping | Scrape website deeply (all pages, not just homepage) |
| Market research | Web search (real-time) | Current market data, trends, pricing |
| Competitor analysis | Web search + scraping | Find competitors, analyze their positioning, content |
| Competitor social media analysis | Web scraping / API | What competitors post, frequency, formats |
| Target audience definition | LLM analysis | Based on brand + market + competitor data |
| Platform recommendation | LLM decision | Which platforms matter for this brand (may exclude some — e.g., Threads may be irrelevant for Coff AI) |
| Content themes | LLM generation | Recurring content pillars/themes |
| Posting frequency | LLM recommendation | Based on competitor analysis + best practices |
| Tone of voice | LLM recommendation | Based on brand personality + audience |

### 3.3 Strategy Output

The strategy document/view should include:
1. **Brand Summary** — what AXIS understood about the brand
2. **Market Overview** — current market landscape
3. **Competitor Analysis** — key competitors, their strengths/weaknesses, content patterns
4. **Target Audience** — demographics, psychographics, behavior
5. **Platform Strategy** — which platforms, why, priority order
6. **Content Pillars** — 4-6 recurring themes/topics
7. **Tone of Voice** — communication style guidelines
8. **Posting Schedule** — frequency per platform
9. **Format Mix** — recommended ratio of Reels/Carousels/Posts/Stories etc.
10. **KPIs** — what success looks like (follower growth, engagement rate, etc.)

User can edit any section manually or ask the assistant to revise.

### 3.4 Technical Requirements — V1

| Requirement | Details | Priority |
|------------|---------|----------|
| LLM Integration | Claude API (Sonnet for speed, Opus for deep analysis) | P0 |
| Web Search | Real-time search for market/competitor data | P0 |
| Web Scraping | Deep site scraping (homepage + subpages) | P1 |
| Social Media Scraping | Competitor Instagram/X/TikTok content analysis | P1 |
| Chat Interface | Streaming responses, selectable options, file/URL input | P0 |
| Strategy Storage | Save generated strategy per brand, editable | P0 |
| Mode Toggle | Full Auto / Manual — switchable at any time | P0 |

**Scraping Technical Notes:**
- First priority: find a free/open-source scraping solution
- Ideal: build own backend scraping service for depth and control
- Fallback: third-party services (Firecrawl, Apify, ScrapingBee)
- Must handle: JavaScript-rendered pages, pagination, rate limiting

---

## 4. V2 — Content Calendar

### 4.1 User Flow

User arrives here after V1 strategy is approved (auto or manual).

**What they see:** A calendar view (weekly by default, switchable to monthly) populated with content slots. Each slot is a content card.

### 4.2 Calendar Generation

LLM generates the calendar based on V1 strategy output:
- **Platform selection:** LLM decides which platforms (user can override in manual mode)
- **Format selection:** LLM decides format per slot based on competitor analysis and strategy
  - If competitors post heavy Reels → more Reels suggested
  - If brand needs education → more Carousels
  - If product showcase → more single image posts
- **Frequency:** Based on strategy (e.g., 6 posts/week for Coff AI)
- **Theme assignment:** Each day gets a theme from content pillars
- **Time slots:** LLM suggests optimal posting times per platform

### 4.3 Content Card Structure

Each content card contains (in production order):

| # | Field | Description | AI-Generated | Manually Editable |
|---|-------|-------------|:---:|:---:|
| 1 | Format | Reel, Carousel, Single Post, Story, etc. | ✅ | ✅ |
| 2 | Platform(s) | Instagram, Facebook, TikTok, LinkedIn, Pinterest, X | ✅ | ✅ |
| 3 | Theme | Content pillar this belongs to | ✅ | ✅ |
| 4 | Hook | Attention-grabbing opening (EN, localizable) | ✅ | ✅ |
| 5 | Story / Narrative | The core narrative — what are we telling, what's the wow moment | ✅ | ✅ |
| 6 | Production Guide | Step-by-step checklist for creating the content | ✅ | ✅ |
| 7 | Prompt(s) | AI generation prompts for visuals/video (for V3) | ✅ | ✅ |
| 8 | Caption | Post text + hashtags (written LAST, after content is produced) | ✅ | ✅ |
| 9 | Status | Plan → Story → Prompt → Production → Caption → Ready | Auto | ✅ |
| 10 | Schedule | Date + time for publishing | ✅ | ✅ |

### 4.4 Cross-Platform Adaptation

When a story is created, AXIS adapts it per platform:
- Same story → Instagram Reel version + Pinterest Pin version + LinkedIn Post version
- Each adaptation has its own format, caption style, hashtag strategy, and dimensions
- LLM handles adaptation but user can edit each individually
- AXIS may recommend skipping certain platforms for certain content (e.g., "This behind-the-scenes content isn't suitable for LinkedIn")

### 4.5 Calendar Customization
- Days per week: configurable per brand (5, 6, or 7 days)
- Posts per day: configurable
- Drag and drop to rearrange
- Duplicate content card
- Delete content card
- Add custom content card

### 4.6 Technical Requirements — V2

| Requirement | Details | Priority |
|------------|---------|----------|
| Calendar UI | Week/month view, drag-drop, responsive | P0 |
| LLM Calendar Generation | Auto-generate full week/month based on strategy | P0 |
| Content Card CRUD | Create, read, update, delete content cards | P0 |
| Cross-platform adaptation | One story → multiple platform versions | P1 |
| Status tracking | 6-stage pipeline per card | P0 |
| LLM per field | Generate/rewrite any individual field | P0 |
| Bulk actions | Generate all cards, approve all, etc. | P2 |

---

## 5. V3 — Production

### 5.1 User Flow

User has content cards with stories and prompts from V2. Now they produce the actual visuals/videos.

**What they see:** Content cards in production view. Each card shows:
- The prompt(s) from V2
- "Generate with AI" button
- "Upload manually" button
- Preview area for generated/uploaded content

### 5.2 Two Production Paths (Always Side by Side)

**Path A: AI Generation**
- AXIS sends prompts to integrated AI tools
- For pilot (Coff AI): uses Coff AI's own API (Seedream 4.5, Kling 3, Veo 3.1, Recraft, etc.)
- AXIS recommends which tool to use based on content type, but user can override
- Generated content appears in preview
- User can: approve, regenerate, request variation, or switch to manual

**Path B: Manual Upload**
- User uploads their own images/videos
- Necessary for: real product photos, real footage, branded assets
- Example: A watch brand needs real product shots — AI can't replace this
- Example: Coff AI might need screen recordings — must be uploaded manually

**Decision Logic:**
- AXIS suggests which path based on content type
- For Coff AI: most content can be AI-generated end-to-end
- For physical product brands: manual upload will be primary, AI for enhancement
- User always decides final path

### 5.3 Tool Selection (Pilot Phase — Coff AI)

| Content Type | Recommended Tool | Fallback |
|-------------|-----------------|----------|
| Image generation | Seedream 4.5, GPT Image 1.5 | Manual upload |
| Image enhancement | Recraft (inside Coff AI) | Manual upload |
| Video generation | Kling 3, Veo 3.1, Sora 2 | Manual upload |
| Video editing | Coff AI Filmmaking | Manual upload |
| Background removal | Coff AI Remix (RemoveBG) | Manual upload |
| Upscaling | Coff AI Remix (HD Upscale) | Manual upload |

### 5.4 Technical Requirements — V3

| Requirement | Details | Priority |
|------------|---------|----------|
| Coff AI API integration | Send prompts, receive generated content | P0 |
| Manual upload | Image + video upload (drag-drop) | P0 |
| Preview | Show generated/uploaded content in-card | P0 |
| Regenerate | Re-run generation with same or modified prompt | P1 |
| Tool selection UI | Show available tools, let user/AI choose | P1 |
| Storage | Cloud storage for generated/uploaded assets (S3, R2, or similar — TBD with developers) | P0 |
| Format validation | Check dimensions/format match target platform requirements | P2 |

---

## 6. V4 — Publish

### 6.1 User Flow

Content is produced and approved. Now publish or schedule.

**What they see:** Calendar view with content ready for publishing. Each card shows:
- Content preview (image/video)
- Caption
- Target platform(s)
- Schedule date/time
- "Publish Now" or "Schedule" buttons

### 6.2 Publishing Method

**Primary approach:** Direct API integration with each platform.

| Platform | API | Status | Priority |
|----------|-----|--------|----------|
| Instagram | Instagram Graph API (Content Publishing) | UI first, backend later | P0 |
| Facebook | Facebook Pages API | UI first, backend later | P0 |
| TikTok | TikTok Content Posting API | UI first, backend later | P0 |
| X (Twitter) | X API v2 | UI first, backend later | P1 |
| LinkedIn | LinkedIn Marketing API | UI first, backend later | P1 |
| Pinterest | Pinterest API | UI first, backend later | P2 |
| Tumblr | Tumblr API | UI first, backend later | P3 |

**Alternative/Fallback:** Buffer API integration
- Buffer supports all major platforms
- Handles scheduling, queue management
- Cost consideration: Buffer charges per channel — need to decide if cost is passed to user or absorbed
- Could be used as middleware while building direct integrations

> **MVP Approach:** Build the UI and scheduling interface first. Show full functionality in the interface. Connect actual APIs incrementally. Start with Meta (Instagram + Facebook), then TikTok, then others.

### 6.3 Scheduling Features
- Pick date and time per post
- AI-suggested optimal posting times (based on audience data from V5)
- Queue management (view all scheduled posts)
- Bulk scheduling
- Reschedule (drag to new time)
- Cancel scheduled post

### 6.4 Platform Requirements

| Platform | Account Type Required | Key Limitations |
|----------|----------------------|----------------|
| Instagram | Business or Creator account | Reels via Content Publishing API; Stories limited |
| Facebook | Facebook Page (not personal) | Full support via Pages API |
| TikTok | Developer app approval required | Content Posting API requires review |
| X | API v2 access (Basic or Pro tier) | Rate limits vary by tier |
| LinkedIn | Company Page or personal | Posting API available |
| Pinterest | Business account | Pin creation API available |

### 6.5 Technical Requirements — V4

| Requirement | Details | Priority |
|------------|---------|----------|
| Publishing UI | Calendar + queue view, schedule picker | P0 |
| Meta API integration | Instagram + Facebook publishing | P0 (after UI) |
| TikTok API integration | TikTok Content Posting API | P1 (after UI) |
| Buffer fallback | Buffer API as alternative publishing method | P2 |
| Scheduling engine | Backend job scheduler for timed posts | P0 (after UI) |
| Multi-platform post | One click → publish to multiple platforms | P1 |
| Post status tracking | Scheduled / Published / Failed | P0 |

---

## 7. V5 — Analytics

### 7.1 User Flow

Posts are published. Now track performance.

**What they see:** Analytics dashboard with infographics, charts, and metrics per post and overall.

### 7.2 Metrics Tracked

| Metric | Description | Granularity |
|--------|-------------|-------------|
| Impressions | Times content was displayed | Daily |
| Reach | Unique accounts that saw content | Daily |
| Engagement Rate | (Likes + Comments + Shares + Saves) / Reach | Daily |
| Likes | Total likes | Per post |
| Comments | Total comments | Per post |
| Shares | Total shares | Per post |
| Saves | Total saves (Instagram) | Per post |
| Click-through Rate | Link clicks / impressions | Per post |
| Follower Growth | Net new followers | Daily |
| Profile Visits | Visits to profile from content | Daily |
| Audience Demographics | Age, gender, location | Weekly |

### 7.3 Restrategy Feature

**Core concept:** Analytics data feeds back into V1 strategy.

- **Full Automation mode:** AXIS automatically analyzes performance data and suggests strategy updates
  - "Reels are getting 3x more engagement than carousels — shifting format mix"
  - "Tuesday posts perform 40% better — adjusting schedule"
  - "Audience is 70% 25-34 age range — adjusting tone"
  - These suggestions auto-apply in Full Automation, or appear as recommendations in Manual mode
- **Manual mode:** AXIS presents insights and recommendations, user decides what to change

**Feedback Loop:** V5 → V1 (strategy update) → V2 (calendar adjustment) → cycle continues

### 7.4 Technical Requirements — V5

| Requirement | Details | Priority |
|------------|---------|----------|
| Analytics UI | Dashboard with charts, infographics | P0 (UI first) |
| Meta Insights API | Instagram + Facebook analytics data | P0 (after UI) |
| TikTok Analytics API | TikTok performance data | P1 (after UI) |
| Per-post analytics | Link each published post to its metrics | P0 |
| Restrategy engine | LLM analyzes data → generates recommendations | P1 |
| Data visualization | Charts (line, bar, pie), trend indicators | P0 |
| Export | CSV/PDF export of reports | P3 |

---

## 8. V6 — Advertising

### 8.1 User Flow

Based on analytics, user (or AI) decides to boost or advertise certain content.

**What they see:** Ad campaign creation interface within AXIS. AI recommends which posts to promote and suggests targeting.

### 8.2 Capabilities

| Feature | Description | Phase |
|---------|-------------|-------|
| Campaign creation | Create ad campaigns from within AXIS | Pilot — UI first |
| Post boosting | Boost existing published posts | Pilot |
| Audience targeting | LLM suggests audiences based on V1 strategy + V5 data | Pilot |
| Budget management | Set daily/lifetime budgets | Pilot |
| Ad creative | Use existing content or create ad-specific versions | Pilot |
| Pixel management | Generate and manage tracking pixels for client websites | Pilot |
| Conversion tracking | Track conversions from ads via pixel | Pilot |
| A/B testing | Test ad variations | Future |
| Lookalike audiences | Create lookalike audiences from existing data | Future |
| Retargeting/Remarketing | Target users who interacted with previous content | Future |

### 8.3 Ad Strategy Generation

LLM generates ad strategy based on:
- Brand data from V1
- Content performance from V5
- Target audience insights
- Budget constraints (user input)
- Campaign objectives (awareness, engagement, conversions)

> **Note:** This is social media advertising specific. Not Google Ads, not display network. Meta Ads is the primary platform.

### 8.4 Pixel Integration

- AXIS generates a pixel code snippet
- User places pixel on their website (requires user's website access)
- AXIS tracks conversion events
- Data feeds into V7 and Restrategy

### 8.5 Technical Requirements — V6

| Requirement | Details | Priority |
|------------|---------|----------|
| Ad campaign UI | Campaign builder interface | P0 (UI first) |
| Meta Marketing API | Create/manage campaigns programmatically | P1 (after UI) |
| Meta Business Verification | Required for Marketing API access | P1 |
| Pixel generation | Generate tracking pixel code | P1 (after UI) |
| LLM ad strategy | AI recommends campaign setup, targeting, budget | P0 |
| Budget controls | Set and track ad spend | P1 |

---

## 9. V7 — Ad Performance

### 9.1 User Flow

Ads are running. Track their performance.

**What they see:** Ad-specific analytics dashboard. Similar to V5 but focused on ad metrics.

### 9.2 Ad Metrics

| Metric | Description |
|--------|-------------|
| Ad Spend | Total money spent |
| Cost per Click (CPC) | Average cost per click |
| Cost per Mille (CPM) | Cost per 1000 impressions |
| Click-Through Rate (CTR) | Clicks / impressions |
| Conversions | Tracked via pixel |
| Cost per Conversion | Ad spend / conversions |
| Return on Ad Spend (ROAS) | Revenue / ad spend |
| Reach | Unique people who saw the ad |
| Frequency | Average times a person saw the ad |

### 9.3 Remarketing Integration (Future)

- Custom audiences from website visitors (via pixel)
- Retarget users who engaged with organic content
- Lookalike audience creation
- Funnel visualization (impression → click → conversion)

### 9.4 Technical Requirements — V7

| Requirement | Details | Priority |
|------------|---------|----------|
| Ad analytics UI | Dashboard with ad-specific metrics | P0 (UI first) |
| Meta Ads Insights API | Pull ad performance data | P1 (after UI) |
| Conversion tracking | Pixel data → conversion attribution | P1 (after UI) |
| Remarketing UI | Audience builder, retargeting options | P2 |
| ROAS calculator | Revenue tracking + ad spend comparison | P2 |

---

## 10. Global Technical Architecture

### 10.1 Tech Stack (TBD with developers)

| Layer | Options to Evaluate |
|-------|-------------------|
| Frontend | Next.js (React) — recommended for SEO + SSR |
| Styling | Tailwind CSS — clean, minimal, blue tones |
| Backend | Node.js (Express/Fastify) or Python (FastAPI) |
| Database | PostgreSQL (relational data) + Redis (caching/sessions) |
| LLM | Claude API (Sonnet for speed, Opus for deep analysis) |
| Web Search | Claude web search tool or Tavily/SerpAPI |
| Web Scraping | Custom backend service (preferred) or Firecrawl/Apify (fallback) |
| File Storage | AWS S3, Cloudflare R2, or similar (TBD) |
| Job Scheduler | Bull/BullMQ (for scheduled publishing) or similar |
| Auth | NextAuth.js or Clerk |
| Hosting | Vercel (frontend) + Railway/Fly.io (backend) — TBD |

### 10.2 API Integrations Needed

| Service | API | Purpose | Phase |
|---------|-----|---------|-------|
| Claude (Anthropic) | Messages API | LLM for all AI features | V1 |
| Web Search | Claude tools / Tavily / SerpAPI | Market research, competitor analysis | V1 |
| Web Scraper | Custom / Firecrawl | Website analysis | V1 |
| Coff AI | Coff AI API | Image/video generation | V3 |
| Instagram | Graph API + Content Publishing API | Publish + analytics | V4/V5 |
| Facebook | Pages API + Insights API | Publish + analytics | V4/V5 |
| TikTok | Content Posting API + Analytics API | Publish + analytics | V4/V5 |
| X (Twitter) | API v2 | Publish + analytics | V4/V5 |
| LinkedIn | Marketing API | Publish + analytics | V4/V5 |
| Pinterest | API v5 | Publish + analytics | V4/V5 |
| Buffer | Buffer API | Fallback publishing | V4 |
| Meta Ads | Marketing API | Ad campaign management | V6 |
| Meta Pixel | Pixel API | Conversion tracking | V6/V7 |

### 10.3 LLM System Architecture

AXIS uses LLM at every stage but with different system prompts and contexts:

| Stage | LLM Role | Input Context |
|-------|----------|---------------|
| V1 | Brand strategist | User input + scraped data + search results |
| V2 | Content planner | V1 strategy + competitor content patterns |
| V3 | Production advisor | Content card + available tools |
| V4 | Publishing optimizer | Content + audience data + platform best practices |
| V5 | Data analyst | Performance metrics + strategy |
| V6 | Ad strategist | Brand data + performance + audience insights |
| V7 | Performance analyst | Ad metrics + conversion data |

Each stage's LLM has access to all previous stages' data for context.

---

## 11. UI/UX Principles

### Design System
- **Primary color:** Blue tones (trust, professionalism)
- **Style:** Minimal, clean, spacious
- **Typography:** Modern sans-serif (Inter, Geist, or similar)
- **Layout:** Left sidebar (brands) + top tabs (V1-V7) + main content area
- **Responsive:** Mobile-first from day one

### Key UI Patterns
- Chat interface for AI interactions (V1 primary, assistant everywhere)
- Card-based content management (V2, V3)
- Calendar views (V2, V4)
- Dashboard/infographic views (V5, V7)
- Form-based campaign builder (V6)
- Toggle between Full Automation / Manual everywhere
- Inline editing on all AI-generated content
- Status indicators on all content cards

### Progressive Disclosure
- Tabs unlock as user progresses: V1 → V2 → V3 → V4 → V5 → V6 → V7
- User sees only what's relevant to their current stage
- No overwhelming with features they haven't reached yet

---

## 12. Development Phases

### Phase 1: Foundation (MVP)
**Goal:** Working V1 + V2 with real LLM integration

- [ ] Project setup (Next.js + Tailwind + database)
- [ ] Auth system
- [ ] Brand CRUD (create, list, switch, delete)
- [ ] V1: Chat interface + LLM strategy generation
- [ ] V1: Full Auto / Manual mode toggle
- [ ] V1: Web search integration for market research
- [ ] V1: Strategy output view (editable)
- [ ] V2: Calendar UI (week/month view)
- [ ] V2: Content card CRUD with all fields
- [ ] V2: LLM content generation per field
- [ ] V2: Cross-platform adaptation
- [ ] Left sidebar + top navigation
- [ ] Mobile responsive

### Phase 2: Production + Publishing
**Goal:** V3 + V4 — create and publish content

- [ ] V3: Coff AI API integration
- [ ] V3: Manual upload system
- [ ] V3: AI tool recommendation
- [ ] V3: Content preview
- [ ] V3: Cloud storage setup
- [ ] V4: Publishing UI (calendar + queue)
- [ ] V4: Meta API integration (Instagram + Facebook)
- [ ] V4: Scheduling engine
- [ ] V4: TikTok API integration
- [ ] Web scraping backend service

### Phase 3: Analytics + Ads
**Goal:** V5 + V6 + V7 — measure and optimize

- [ ] V5: Analytics dashboard UI
- [ ] V5: Meta Insights API integration
- [ ] V5: Restrategy feature
- [ ] V6: Ad campaign builder UI
- [ ] V6: Meta Marketing API integration
- [ ] V6: Pixel generation
- [ ] V7: Ad analytics dashboard
- [ ] V7: Remarketing features

### Phase 4: Scale
**Goal:** All platforms + advanced features

- [ ] All platform API integrations (X, LinkedIn, Pinterest, Tumblr)
- [ ] Advanced remarketing and audience building
- [ ] Custom AI model training on brand data
- [ ] Multi-user/team support
- [ ] White-label options
- [ ] API for third-party integrations

---

## 13. Open Questions (TBD with Team)

| # | Question | Owner | Status |
|---|----------|-------|--------|
| 1 | Cloud storage provider (S3 vs R2 vs other) | Developers | TBD |
| 2 | Web scraping: build custom vs use service | Developers | TBD |
| 3 | Buffer integration vs direct API — cost analysis | Product + Dev | TBD |
| 4 | Meta Business Verification timeline | Business | TBD |
| 5 | TikTok Developer app approval timeline | Business | TBD |
| 6 | Coff AI API capabilities and rate limits | Coff AI team | TBD |
| 7 | Pricing model for AXIS itself | Business | TBD |
| 8 | Multi-user/team features scope | Product | TBD |
| 9 | Custom domain / white-label priority | Product | TBD |
| 10 | Hosting architecture and scaling plan | Developers | TBD |
