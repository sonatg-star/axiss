import { create } from "zustand"
import { useBrandStore } from "./brand-store"

// --- Types ---

export type StrategySectionId =
  | "brand-summary"
  | "market-overview"
  | "competitor-analysis"
  | "target-audience"
  | "platform-strategy"
  | "content-pillars"
  | "tone-of-voice"
  | "posting-schedule"
  | "format-mix"
  | "kpis"

export type StrategySection = {
  id: StrategySectionId
  title: string
  content: string
}

export type StrategyStatus = "draft" | "approved"

export type BrandStrategy = {
  brandId: string
  status: StrategyStatus
  sections: StrategySection[]
  createdAt: number
}

type StrategyStore = {
  strategies: Record<string, BrandStrategy>
  generateStrategy: (brandId: string, brandName: string) => void
  updateSection: (brandId: string, sectionId: StrategySectionId, content: string) => void
  regenerateSection: (brandId: string, sectionId: StrategySectionId) => void
  approveStrategy: (brandId: string) => void
}

// --- Section definitions ---

const SECTION_META: { id: StrategySectionId; title: string }[] = [
  { id: "brand-summary", title: "Brand Summary" },
  { id: "market-overview", title: "Market Overview" },
  { id: "competitor-analysis", title: "Competitor Analysis" },
  { id: "target-audience", title: "Target Audience" },
  { id: "platform-strategy", title: "Platform Strategy" },
  { id: "content-pillars", title: "Content Pillars" },
  { id: "tone-of-voice", title: "Tone of Voice" },
  { id: "posting-schedule", title: "Posting Schedule" },
  { id: "format-mix", title: "Format Mix" },
  { id: "kpis", title: "KPIs" },
]

// --- Mock strategy data for Coff AI ---

function generateMockContent(brandName: string): Record<StrategySectionId, string> {
  return {
    "brand-summary": `**${brandName}** is an AI-powered short video and image generation platform that enables anyone to create professional-quality visual content using text prompts or reference images. From social media videos to marketing visuals, ${brandName} turns ideas into stunning content in seconds.\n\n**Mission:** Democratize visual content creation through AI.\n**Vision:** A world where anyone can bring their visual ideas to life instantly.\n**Values:** Creativity, Accessibility, Speed, Quality.`,

    "market-overview": `The global AI-generated content market is valued at **$12.1B** (2025) and projected to reach **$68B** by 2030, growing at a CAGR of 41.2%.\n\n**Key Trends:**\n- AI video generation quality has reached near-production levels\n- 78% of marketers plan to use AI for visual content in 2026\n- Short-form video remains the #1 content format across all platforms\n- Small businesses and solo creators are the fastest-growing adopter segment\n- Text-to-video and image-to-video capabilities are becoming table stakes\n\n**Opportunity:** ${brandName} sits at the intersection of the AI revolution and the creator economy — a market where demand for visual content far outpaces the ability to produce it manually.`,

    "competitor-analysis": `**Direct Competitors:**\n- **Runway** — Professional-grade AI video tools. Powerful but complex UI, targets filmmakers and studios.\n- **Pika** — Text-to-video with strong community. Growing fast but limited editing features.\n- **Kling AI** — High-quality video generation. Strong in Asia, building global presence.\n\n**Indirect Competitors:**\n- **Canva** — All-in-one design tool with AI features, but AI video is not the core focus.\n- **CapCut** — Powerful video editor with AI effects, but not generative AI-first.\n- **Midjourney / DALL-E** — Image generation only, no video capabilities.\n\n**${brandName}'s Edge:** Combines both video and image generation in one intuitive platform. Focuses on speed and simplicity for everyday creators, not just professionals.`,

    "target-audience": `**Primary Persona — "The Content Creator"**\n- Age: 20–35\n- Income: $30K–$80K\n- Behavior: Posts daily on TikTok/Instagram/YouTube, always looking for tools to speed up workflow\n- Pain Point: Needs high-quality visuals fast but can't afford a production team\n\n**Secondary Persona — "The Social Media Manager"**\n- Age: 25–40\n- Income: $50K–$100K\n- Behavior: Manages multiple brand accounts, juggles deadlines, needs scalable content solutions\n- Pain Point: Volume demands outpace production capacity, needs to generate varied visuals quickly\n\n**Tertiary Persona — "The Small Business Owner"**\n- Age: 28–50\n- Income: $40K–$150K\n- Behavior: Runs their own marketing, limited design skills, values ease-of-use\n- Pain Point: Wants professional-looking ads and social posts without hiring a designer`,

    "platform-strategy": `**Primary Platforms:**\n\n📱 **Instagram** (Priority: High)\n- Visual showcase of AI-generated content — before/after, prompt-to-result\n- Reels showing the creation process in real-time\n- Stories for tips, polls, and feature previews\n- Target: 4–5 posts/week\n\n🎵 **TikTok** (Priority: High)\n- "Watch me create this in 10 seconds" format\n- Trending challenges recreated with AI\n- Prompt engineering tips and tricks\n- Target: 5–7 videos/week\n\n▶️ **YouTube** (Priority: Medium)\n- Tutorials, deep dives, and use case showcases\n- Comparison videos (AI vs. traditional production)\n- Creator spotlight series\n- Target: 2 videos/week\n\n🐦 **X / Twitter** (Priority: Medium)\n- Product updates, AI industry commentary\n- User showcase threads, quick tips\n- Community engagement and support\n- Target: 3–5 posts/week`,

    "content-pillars": `**1. AI Creation Showcase** (30%)\nStunning before/after reveals, prompt-to-result demonstrations, and "made with ${brandName}" content. Show the magic of AI generation.\n\n**2. Creator Education** (25%)\nPrompt engineering tips, workflow tutorials, editing guides. Help users get the most out of ${brandName} and become better creators.\n\n**3. Use Cases & Inspiration** (20%)\nReal-world applications: ads, social content, presentations, storytelling. Show what's possible and inspire new ideas.\n\n**4. Community & UGC** (15%)\nUser creations, creator spotlights, contests, challenges. Celebrate the community and build social proof.\n\n**5. Product & Innovation** (10%)\nNew features, behind-the-scenes of AI development, industry trends. Keep users excited about what's coming next.`,

    "tone-of-voice": `**Brand Voice:** Creative and empowering. Think "the friend who makes you feel like you can create anything."\n\n**Tone Attributes:**\n- **Inspiring** — "Look what you can create" energy, never intimidating\n- **Playful** — Fun, experimental, celebrates creative exploration\n- **Clear** — Simple language, no AI jargon overload\n- **Bold** — Confident about the future of AI creation\n\n**Do's:**\n- Celebrate user creativity over technology\n- Use active, energetic language ("Create," "Transform," "Imagine")\n- Share prompts and tips openly\n- Be enthusiastic about what users make\n\n**Don'ts:**\n- Don't be overly technical about AI models and architecture\n- Don't position AI as replacing human creativity\n- Don't use "revolutionary" or "disrupting" — show, don't tell\n- Don't ignore ethical considerations around AI content`,

    "posting-schedule": `**Weekly Posting Cadence:**\n\n| Day | Instagram | TikTok | YouTube | X/Twitter |\n|-----|-----------|--------|----------|-----------|\n| Mon | Reel (Creation Showcase) | Video (Quick Create) | — | Thread (Tips) |\n| Tue | Carousel (Tutorial) | Video (Trending + AI) | Tutorial | Product Update |\n| Wed | Story Series (Tips) | Video (Use Case) | — | Community Repost |\n| Thu | Static (User Spotlight) | Video (Before/After) | Deep Dive | Industry Take |\n| Fri | Reel (Challenge) | Video (Fun/Viral) | Creator Spotlight | Casual Chat |\n| Sat | Story (Weekend Create) | Video (Prompt Tips) | — | — |\n| Sun | — | — | — | — |\n\n**Best Posting Times:**\n- Instagram: 9:00 AM, 12:30 PM, 7:00 PM\n- TikTok: 8:00 AM, 12:00 PM, 8:00 PM\n- YouTube: 2:00 PM (Tue), 10:00 AM (Thu/Fri)\n- X/Twitter: 9:00 AM, 1:00 PM, 5:00 PM`,

    "format-mix": `**Content Format Distribution:**\n\n📹 **Short-form Video** — 40%\nReels, TikToks, Shorts. Show AI creation in action — the core format for ${brandName}.\n\n🖼️ **Carousels / Slides** — 20%\nStep-by-step tutorials, prompt guides, before/after comparisons.\n\n📸 **Static Images** — 10%\nAI-generated showcase images, user spotlights, quotes.\n\n📝 **Long-form Video** — 15%\nYouTube tutorials, deep dives, creator interviews.\n\n📊 **Stories / Ephemeral** — 10%\nPolls, quick tips, behind-the-scenes, feature previews.\n\n🎙️ **Live / Interactive** — 5%\nLive creation sessions, Q&A, feature launch events.\n\n**Ratio Target:** 50% value-driven (education + showcase), 30% engagement-driven, 20% promotional.`,

    kpis: `**Growth KPIs (Monthly Targets):**\n- Instagram followers: +10–15% month-over-month\n- TikTok followers: +20–30% month-over-month\n- YouTube subscribers: +10–15% month-over-month\n- Total social reach: 1M+ impressions/month by month 3\n\n**Engagement KPIs:**\n- Average engagement rate: 5%+ (Instagram), 8%+ (TikTok)\n- Comments per post: 20+ average\n- Share/save rate: 5%+ per post (high share potential for AI-generated content)\n- Video completion rate: 65%+\n\n**Conversion KPIs:**\n- Link clicks from social: 5,000+/month\n- Social-attributed signups: 500+/month\n- Free-to-paid conversion from social traffic: 8%+\n\n**Brand KPIs:**\n- Brand mention growth: +15% monthly\n- Sentiment score: 85%+ positive\n- "Made with ${brandName}" UGC submissions: 100+/month`,
  }
}

// Alternate content for "regenerate" — slightly different wording
function generateAlternateContent(
  brandName: string,
  sectionId: StrategySectionId,
  currentContent: string
): string {
  const alternates: Partial<Record<StrategySectionId, string[]>> = {
    "brand-summary": [
      `**${brandName}** makes AI-powered visual content creation accessible to everyone. Whether it's a TikTok ad, an Instagram story, or a product demo video, ${brandName} turns simple text prompts and reference images into professional-quality visuals in seconds.\n\n**Mission:** Remove the barriers between ideas and visual content.\n**Vision:** To be the default creative tool for the AI-native generation.\n**Values:** Speed, Simplicity, Creative Freedom, Accessibility.`,
      `At the heart of **${brandName}** is a simple belief: great visual content shouldn't require a production studio. Using cutting-edge generative AI, ${brandName} empowers creators, marketers, and businesses to produce videos and images that look professionally made — in a fraction of the time and cost.\n\n**Mission:** Empower everyone to be a visual storyteller.\n**Vision:** A world where your imagination is the only limit to what you can create.\n**Values:** Innovation, Empowerment, Quality, Community.`,
    ],
    "market-overview": [
      `The AI content generation industry is on an explosive growth trajectory, with the market expected to surpass **$50B by 2028**. Key growth drivers include the short-form video boom, rising demand for personalized marketing at scale, and rapid improvements in generative AI quality.\n\n**Key Insights:**\n- 85% of content consumed online will be video by 2026\n- AI-generated content adoption among SMBs grew 67% YoY\n- Creator economy is now a $250B market with tools as the fastest-growing segment\n- Cost of traditional video production ($5K–$50K) is pushing businesses to AI alternatives\n\n**Strategic Position:** ${brandName} is positioned at the convergence of the AI revolution and the creator economy — where demand for visual content massively outpaces supply.`,
    ],
    "tone-of-voice": [
      `**Voice Character:** The creative director who speaks in plain language. Expert without being intimidating, techy without being cold.\n\n**Core Principles:**\n- **Empowering** — Make users feel capable and excited to create\n- **Approachable** — No AI jargon, just clear and friendly language\n- **Energetic** — Match the creative energy of the platform\n- **Forward-Looking** — Always pointing toward what's possible\n\n**Writing Style:**\n- Short, punchy sentences that inspire action\n- Active voice always ("Create," "Build," "Transform")\n- Show results, not just features\n- Celebrate user creations loudly\n\n**Avoid:**\n- Corporate buzzwords ("synergy," "leverage," "disrupt")\n- Overpromising on AI capabilities\n- Positioning AI as replacing human creativity\n- Being preachy about technology`,
    ],
  }

  const options = alternates[sectionId]
  if (options) {
    // Pick a different option than current
    const different = options.find((alt) => alt !== currentContent)
    if (different) return different
    return options[0]
  }

  // Default: append a regeneration note to signal change
  return currentContent.replace(
    /\n\n/,
    `\n\n*[Updated ${new Date().toLocaleDateString("en-US", { month: "short", day: "numeric" })}]* `
  )
}

// --- Store ---

// Pre-seed Coff AI strategy (pilot brand)
const COFF_AI_STRATEGY: BrandStrategy = {
  brandId: "seed-coff-ai",
  status: "approved",
  sections: SECTION_META.map((meta) => ({
    id: meta.id,
    title: meta.title,
    content: generateMockContent("Coff AI")[meta.id],
  })),
  createdAt: Date.now(),
}

export const useStrategyStore = create<StrategyStore>((set) => ({
  strategies: {
    "seed-coff-ai": COFF_AI_STRATEGY,
  },

  generateStrategy: (brandId, brandName) => {
    set((state) => {
      if (state.strategies[brandId]) return state // Don't overwrite existing strategy

      const content = generateMockContent(brandName)
      const sections: StrategySection[] = SECTION_META.map((meta) => ({
        id: meta.id,
        title: meta.title,
        content: content[meta.id],
      }))

      return {
        strategies: {
          ...state.strategies,
          [brandId]: {
            brandId,
            status: "draft" as const,
            sections,
            createdAt: Date.now(),
          },
        },
      }
    })
  },

  updateSection: (brandId, sectionId, content) => {
    set((state) => {
      const strategy = state.strategies[brandId]
      if (!strategy) return state
      return {
        strategies: {
          ...state.strategies,
          [brandId]: {
            ...strategy,
            status: "draft" as const,
            sections: strategy.sections.map((s) =>
              s.id === sectionId ? { ...s, content } : s
            ),
          },
        },
      }
    })
  },

  regenerateSection: (brandId, sectionId) => {
    set((state) => {
      const strategy = state.strategies[brandId]
      if (!strategy) return state

      const section = strategy.sections.find((s) => s.id === sectionId)
      if (!section) return state

      const { brands } = useBrandStore.getState()
      const brand = brands.find((b) => b.id === brandId)
      const brandName = brand?.name ?? "Brand"
      const newContent = generateAlternateContent(brandName, sectionId, section.content)

      return {
        strategies: {
          ...state.strategies,
          [brandId]: {
            ...strategy,
            status: "draft" as const,
            sections: strategy.sections.map((s) =>
              s.id === sectionId ? { ...s, content: newContent } : s
            ),
          },
        },
      }
    })
  },

  approveStrategy: (brandId) => {
    set((state) => {
      const strategy = state.strategies[brandId]
      if (!strategy) return state
      return {
        strategies: {
          ...state.strategies,
          [brandId]: {
            ...strategy,
            status: "approved" as const,
          },
        },
      }
    })
  },
}))
