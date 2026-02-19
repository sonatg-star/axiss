import { create } from "zustand"
import {
  startOfWeek,
  endOfWeek,
  addDays,
  addWeeks,
  format,
} from "date-fns"

// --- Types ---

export type ContentFormat = "reel" | "carousel" | "single-post" | "story"

export type Platform =
  | "instagram"
  | "facebook"
  | "tiktok"
  | "linkedin"
  | "pinterest"
  | "x"

export type ContentTheme =
  | "ai-innovation"
  | "coffee-education"
  | "lifestyle"
  | "community"
  | "behind-the-scenes"

export type CardStatus =
  | "plan"
  | "story"
  | "prompt"
  | "production"
  | "caption"
  | "ready"

export type ContentCard = {
  id: string
  brandId: string
  date: string // ISO date string (YYYY-MM-DD)
  time: string // HH:mm
  format: ContentFormat
  platform: Platform
  theme: ContentTheme
  title: string
  status: CardStatus
  hook?: string
  narrative?: string
  productionGuide?: string
  prompts?: string
  caption?: string
}

export type CalendarView = "week" | "month"

export type CalendarSettings = {
  postsPerDay: number
  daysPerWeek: 5 | 6 | 7
}

type CalendarStore = {
  cards: Record<string, ContentCard[]> // keyed by brandId
  currentDate: Date
  view: CalendarView
  settings: CalendarSettings
  setView: (view: CalendarView) => void
  setCurrentDate: (date: Date) => void
  navigateForward: () => void
  navigateBackward: () => void
  goToToday: () => void
  updateSettings: (settings: Partial<CalendarSettings>) => void
  generateCalendar: (brandId: string) => void
  moveCard: (brandId: string, cardId: string, newDate: string) => void
  deleteCard: (brandId: string, cardId: string) => void
  updateCard: (brandId: string, cardId: string, updates: Partial<ContentCard>) => void
  addCard: (brandId: string, card: ContentCard) => void
  duplicateCard: (brandId: string, cardId: string) => ContentCard | null
}

// --- Mock data generation ---

const FORMATS: ContentFormat[] = ["reel", "carousel", "single-post", "story"]
const PLATFORMS: Platform[] = ["instagram", "tiktok", "linkedin", "x"]
const THEMES: ContentTheme[] = [
  "ai-innovation",
  "coffee-education",
  "lifestyle",
  "community",
  "behind-the-scenes",
]

const THEME_LABELS: Record<ContentTheme, string> = {
  "ai-innovation": "AI & Innovation",
  "coffee-education": "Coffee Education",
  lifestyle: "Lifestyle & Aesthetics",
  community: "Community & UGC",
  "behind-the-scenes": "Behind the Scenes",
}

const FORMAT_LABELS: Record<ContentFormat, string> = {
  reel: "Reel",
  carousel: "Carousel",
  "single-post": "Single Post",
  story: "Story",
}

const PLATFORM_LABELS: Record<Platform, string> = {
  instagram: "Instagram",
  facebook: "Facebook",
  tiktok: "TikTok",
  linkedin: "LinkedIn",
  pinterest: "Pinterest",
  x: "X",
}

const MOCK_TITLES: Record<ContentTheme, string[]> = {
  "ai-innovation": [
    "How AI Picks Your Perfect Brew",
    "The Algorithm Behind Your Morning Cup",
    "AI Taste Profiling: How It Works",
    "Future of Coffee: AI Predictions",
    "Smart Brewing 101",
  ],
  "coffee-education": [
    "Single Origin vs Blend: The Debate",
    "Water Temperature Matters More Than You Think",
    "5 Brewing Methods Compared",
    "Understanding Coffee Flavor Notes",
    "The Journey from Bean to Cup",
  ],
  lifestyle: [
    "Morning Routine: The Perfect Start",
    "Your Workspace, Your Coffee",
    "Weekend Brewing Vibes",
    "Coffee & Productivity: The Link",
    "Aesthetic Latte Art Moments",
  ],
  community: [
    "Your Brew Stories: This Week",
    "Fan Favorite Recipes Roundup",
    "Community Pick of the Week",
    "Meet Our Top Home Baristas",
    "Share Your Coff AI Moment",
  ],
  "behind-the-scenes": [
    "Inside Our Roasting Process",
    "How We Source Our Beans",
    "Team Tasting Session",
    "Building the AI: Dev Diary",
    "Sustainability in Action",
  ],
}

const POSTING_TIMES = ["08:00", "10:30", "12:00", "14:30", "17:00", "19:00"]

function generateId() {
  return `card-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
}

function generateMockCards(brandId: string, startDate: Date): ContentCard[] {
  const cards: ContentCard[] = []
  const weekStart = startOfWeek(startDate, { weekStartsOn: 1 })

  // Generate 2 weeks of content
  for (let week = 0; week < 2; week++) {
    for (let day = 0; day < 7; day++) {
      const date = addDays(addWeeks(weekStart, week), day)
      const dateStr = format(date, "yyyy-MM-dd")

      // Skip weekends for lighter schedule
      const isWeekend = day >= 5
      const postsToday = isWeekend ? 1 : Math.floor(Math.random() * 2) + 2 // 2-3 on weekdays, 1 on weekends

      for (let post = 0; post < postsToday; post++) {
        const theme = THEMES[Math.floor(Math.random() * THEMES.length)]
        const format_ = FORMATS[Math.floor(Math.random() * FORMATS.length)]
        const platform = PLATFORMS[Math.floor(Math.random() * PLATFORMS.length)]
        const titles = MOCK_TITLES[theme]
        const title = titles[Math.floor(Math.random() * titles.length)]
        const time = POSTING_TIMES[Math.floor(Math.random() * POSTING_TIMES.length)]

        cards.push({
          id: generateId(),
          brandId,
          date: dateStr,
          time,
          format: format_,
          platform,
          theme,
          title,
          status: "plan",
        })
      }
    }
  }

  // Sort by date and time
  cards.sort((a, b) => {
    if (a.date !== b.date) return a.date.localeCompare(b.date)
    return a.time.localeCompare(b.time)
  })

  return cards
}

// --- Constants & Helpers (exported for components) ---

export { THEME_LABELS, FORMAT_LABELS, PLATFORM_LABELS, FORMATS, PLATFORMS, THEMES }

export const STATUS_PIPELINE: CardStatus[] = [
  "plan",
  "story",
  "prompt",
  "production",
  "caption",
  "ready",
]

export const STATUS_LABELS: Record<CardStatus, string> = {
  plan: "Plan",
  story: "Story",
  prompt: "Prompt",
  production: "Production",
  caption: "Caption",
  ready: "Ready",
}

export function computeStatus(card: Partial<ContentCard>): CardStatus {
  if (card.caption) return "ready"
  if (card.productionGuide) return "caption"
  if (card.prompts) return "production"
  if (card.narrative) return "prompt"
  if (card.hook) return "story"
  return "plan"
}

export { generateId }

// --- Mock content generation ---

const MOCK_HOOKS: Record<ContentTheme, string[]> = {
  "ai-innovation": [
    "What if your coffee knew exactly how you like it? ☕🤖",
    "We trained an AI on 10,000 flavor profiles. Here's what it found.",
    "Stop guessing. Let AI find your perfect brew.",
  ],
  "coffee-education": [
    "You've been brewing your coffee wrong. Here's the fix.",
    "Water temperature can make or break your cup. Here's why.",
    "Think all espresso tastes the same? Think again.",
  ],
  lifestyle: [
    "The morning ritual that changed everything.",
    "Your desk setup is incomplete without this.",
    "POV: The perfect Sunday morning brew.",
  ],
  community: [
    "This barista's latte art will blow your mind 🎨",
    "You asked, we answered: your top 5 brew questions.",
    "Our community's most creative coffee recipes this week.",
  ],
  "behind-the-scenes": [
    "Ever wonder what happens before the beans reach your cup?",
    "A day in the life at the Coff AI roastery.",
    "The team tried 47 blends to find this one.",
  ],
}

const MOCK_NARRATIVES: Record<ContentTheme, string[]> = {
  "ai-innovation": [
    "Walk through how our AI taste-matching algorithm works. Start with the user filling out a quick flavor preference quiz, then show the AI analyzing patterns across thousands of coffee profiles. End with the personalized recommendation reveal.",
    "Compare traditional cupping scores with our AI predictions. Show a split-screen of a professional cupper vs. our algorithm rating the same 5 coffees. Highlight where they agree and where AI found surprising matches.",
  ],
  "coffee-education": [
    "Break down the 4 main brewing methods (pour-over, French press, espresso, cold brew) with side-by-side comparisons. Focus on grind size, water temp, and extraction time. End with a 'which one is right for you' decision framework.",
    "Deep dive into single-origin vs. blend. Start with where beans are sourced, show the roasting differences, then do a taste comparison. Make it accessible — no jargon.",
  ],
  lifestyle: [
    "Document the perfect morning routine: wake up, grind fresh beans, brew with intention. Capture the aesthetic — steam rising, sunlight through the window. Tie it back to productivity and mindfulness.",
    "Show 3 different workspace setups and the coffee that fits each vibe: minimalist desk + black coffee, cozy home office + latte, standing desk + cold brew. Make viewers tag their setup.",
  ],
  community: [
    "Feature 3 community members and their unique coffee rituals. Quick interview style: what they brew, how they brew it, and what coffee means to them. End with a CTA to share your own.",
    "Compile the best user-submitted latte art from the past month. Show the progression from beginner attempts to pro-level designs. Encourage everyone to keep practicing.",
  ],
  "behind-the-scenes": [
    "Follow a bag of beans from the farm to the roastery. Show the sourcing relationship, quality checks, sample roasting, and the final packaging. Emphasize sustainability and fair trade.",
    "Take viewers through a team tasting session. Show the setup, the blind tasting process, everyone's reactions, and the final scores. Reveal which blend won and announce it as next month's special.",
  ],
}

const MOCK_PRODUCTION_GUIDES: string[] = [
  "• Shoot in natural lighting (golden hour preferred)\n• Use vertical format (9:16) for Reels/TikTok\n• Include B-roll of coffee preparation\n• Add text overlays for key points\n• Background music: lo-fi or acoustic",
  "• Film in the studio with ring light setup\n• Multiple angles: overhead, 45°, close-up\n• Capture steam/pour shots in slow motion\n• Use brand color palette in graphics\n• Duration: 30-60 seconds",
  "• User-generated style — casual, authentic\n• Phone camera is fine (adds authenticity)\n• Include face-to-camera segments\n• Add captions/subtitles\n• Keep transitions simple and clean",
]

const MOCK_PROMPTS: string[] = [
  "Create a visually engaging post about [topic]. Use warm, inviting tones. Include a strong opening hook, 3 key points, and end with a question to drive engagement. Target audience: coffee enthusiasts aged 25-40.",
  "Generate a storytelling post that connects [topic] to everyday life. Use conversational language, include specific details that make it relatable, and end with a clear call-to-action.",
  "Write an educational post about [topic] that's accessible to beginners. Break complex concepts into simple analogies. Include one surprising fact. End with a 'try this at home' suggestion.",
]

const MOCK_CAPTIONS: Record<ContentTheme, string[]> = {
  "ai-innovation": [
    "The future of coffee is personal. Our AI doesn't just recommend — it learns your palate. ☕✨\n\nWhat's your go-to brew? Drop it below and let's see if our AI agrees 👇\n\n#CoffAI #AIcoffee #PersonalizedCoffee #CoffeeTech #SmartBrewing #FutureOfCoffee #CoffeeLovers",
    "We asked our AI to predict the next big coffee trend. The answer surprised even us. 🤖☕\n\nSwipe to see the full breakdown →\n\n#CoffeeTrends #AIpredictions #CoffAI #CoffeeInnovation #TechMeetsCoffee",
  ],
  "coffee-education": [
    "Your water temperature matters more than your beans. Yes, really. 🌡️☕\n\nHere's the perfect temp for every brewing method (save this!):\n→ Pour-over: 195-205°F\n→ French Press: 200°F\n→ Cold Brew: Room temp\n→ Espresso: 195-200°F\n\n#CoffeeEducation #BrewingTips #CoffeeScience #HomeBarista #CoffeeFacts",
    "Single origin or blend? Here's how to actually choose. ☕\n\nSingle origin = unique, terroir-driven flavors\nBlend = balanced, consistent, complex\n\nNeither is better — it's about what YOU enjoy.\n\n#CoffeeKnowledge #SingleOrigin #CoffeeBlend #CoffAI #CoffeeGuide",
  ],
  lifestyle: [
    "The best mornings start before the world wakes up. ☀️☕\n\nGrind. Brew. Breathe. The ritual matters as much as the cup.\n\nHow do you start your mornings? ☕👇\n\n#MorningRitual #CoffeeRoutine #SlowMorning #CoffeeMoments #MindfulBrewing",
    "Your workspace, your rules. Your coffee, your way. 💻☕\n\nTag someone who needs to upgrade their desk setup ☕✨\n\n#WorkFromHome #CoffeeAndWork #DeskSetup #CoffeeAesthetic #ProductivityTips",
  ],
  community: [
    "This week's community spotlight goes to @coffeelover2026 for this INCREDIBLE latte art! 🎨☕\n\nWant to be featured? Tag us in your best coffee moment!\n\n#CoffAICommunity #LatteArt #CoffeeCommunity #HomeBarista #CoffeeCreatives",
    "You asked, we answered! Here are your TOP 5 brewing questions this week ☕\n\nSwipe through for the answers → Which one surprised you most?\n\n#CoffeeQA #AskCoffAI #CoffeeTips #CommunityQuestions #CoffeeAnswers",
  ],
  "behind-the-scenes": [
    "From farm to cup — here's what happens before your coffee reaches you. 🌱→☕\n\nEvery bag has a story. This is ours.\n\n#BehindTheScenes #CoffeeJourney #FarmToCup #Sustainability #CoffAI #EthicalCoffee",
    "47 blends. Countless hours. One perfect cup. ☕\n\nTake a peek at our team's tasting session — this is how we find your next favorite.\n\n#TeamCoffAI #CoffeeTasting #BTS #Roastery #CoffeeProcess",
  ],
}

export function generateMockField(
  field: "hook" | "narrative" | "productionGuide" | "prompts" | "caption",
  theme: ContentTheme
): string {
  const pick = <T>(arr: T[]) => arr[Math.floor(Math.random() * arr.length)]
  switch (field) {
    case "hook":
      return pick(MOCK_HOOKS[theme])
    case "narrative":
      return pick(MOCK_NARRATIVES[theme])
    case "productionGuide":
      return pick(MOCK_PRODUCTION_GUIDES)
    case "prompts":
      return pick(MOCK_PROMPTS)
    case "caption":
      return pick(MOCK_CAPTIONS[theme])
  }
}

// --- Store ---

export const useCalendarStore = create<CalendarStore>((set, get) => ({
  cards: {},
  currentDate: new Date(),
  view: "week",
  settings: {
    postsPerDay: 3,
    daysPerWeek: 7,
  },

  setView: (view) => set({ view }),

  setCurrentDate: (date) => set({ currentDate: date }),

  navigateForward: () => {
    const { currentDate, view } = get()
    if (view === "week") {
      set({ currentDate: addWeeks(currentDate, 1) })
    } else {
      // Move forward by ~1 month
      const next = new Date(currentDate)
      next.setMonth(next.getMonth() + 1)
      set({ currentDate: next })
    }
  },

  navigateBackward: () => {
    const { currentDate, view } = get()
    if (view === "week") {
      set({ currentDate: addWeeks(currentDate, -1) })
    } else {
      const prev = new Date(currentDate)
      prev.setMonth(prev.getMonth() - 1)
      set({ currentDate: prev })
    }
  },

  goToToday: () => set({ currentDate: new Date() }),

  updateSettings: (updates) => {
    set((state) => ({
      settings: { ...state.settings, ...updates },
    }))
  },

  generateCalendar: (brandId) => {
    const { currentDate } = get()
    const cards = generateMockCards(brandId, currentDate)
    set((state) => ({
      cards: { ...state.cards, [brandId]: cards },
    }))
  },

  moveCard: (brandId, cardId, newDate) => {
    set((state) => {
      const brandCards = state.cards[brandId]
      if (!brandCards) return state
      return {
        cards: {
          ...state.cards,
          [brandId]: brandCards.map((card) =>
            card.id === cardId ? { ...card, date: newDate } : card
          ),
        },
      }
    })
  },

  deleteCard: (brandId, cardId) => {
    set((state) => {
      const brandCards = state.cards[brandId]
      if (!brandCards) return state
      return {
        cards: {
          ...state.cards,
          [brandId]: brandCards.filter((card) => card.id !== cardId),
        },
      }
    })
  },

  updateCard: (brandId, cardId, updates) => {
    set((state) => {
      const brandCards = state.cards[brandId]
      if (!brandCards) return state
      return {
        cards: {
          ...state.cards,
          [brandId]: brandCards.map((card) =>
            card.id === cardId ? { ...card, ...updates } : card
          ),
        },
      }
    })
  },

  addCard: (brandId, card) => {
    set((state) => {
      const brandCards = state.cards[brandId] || []
      return {
        cards: {
          ...state.cards,
          [brandId]: [...brandCards, card].sort((a, b) => {
            if (a.date !== b.date) return a.date.localeCompare(b.date)
            return a.time.localeCompare(b.time)
          }),
        },
      }
    })
  },

  duplicateCard: (brandId, cardId) => {
    const { cards } = get()
    const brandCards = cards[brandId]
    if (!brandCards) return null
    const original = brandCards.find((c) => c.id === cardId)
    if (!original) return null

    const newCard: ContentCard = {
      ...original,
      id: generateId(),
      title: `${original.title} (copy)`,
      status: "plan",
    }

    set((state) => ({
      cards: {
        ...state.cards,
        [brandId]: [...(state.cards[brandId] || []), newCard].sort((a, b) => {
          if (a.date !== b.date) return a.date.localeCompare(b.date)
          return a.time.localeCompare(b.time)
        }),
      },
    }))

    return newCard
  },
}))

// --- Selector helpers ---

export function getCardsForDate(cards: ContentCard[], dateStr: string) {
  return cards
    .filter((c) => c.date === dateStr)
    .sort((a, b) => a.time.localeCompare(b.time))
}

export function getWeekDays(date: Date): Date[] {
  const start = startOfWeek(date, { weekStartsOn: 1 })
  return Array.from({ length: 7 }, (_, i) => addDays(start, i))
}

export function getWeekRange(date: Date) {
  const start = startOfWeek(date, { weekStartsOn: 1 })
  const end = endOfWeek(date, { weekStartsOn: 1 })
  return { start, end }
}
