import { create } from "zustand"
import { persist } from "zustand/middleware"
import {
  startOfWeek,
  endOfWeek,
  addDays,
  addWeeks,
  format,
} from "date-fns"
import { useBrandStore } from "./brand-store"
import { useStrategyStore } from "./strategy-store"

// --- Types ---

export type ContentFormat = "reel" | "carousel" | "single-post" | "story"

export type Platform =
  | "instagram"
  | "facebook"
  | "tiktok"
  | "linkedin"
  | "pinterest"
  | "x"

// Dynamic — derived from strategy content pillars
export type ContentTheme = string

export type ContentThemeInfo = {
  id: string
  label: string
}

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
  isGenerating: boolean
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

// --- Labels & constants ---

const FORMATS: ContentFormat[] = ["reel", "carousel", "single-post", "story"]
const PLATFORMS: Platform[] = ["instagram", "tiktok", "linkedin", "x"]

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

// --- Dynamic themes from strategy ---

const DEFAULT_THEMES: ContentThemeInfo[] = [
  { id: "educational", label: "Educational" },
  { id: "promotional", label: "Promotional" },
  { id: "engagement", label: "Engagement" },
  { id: "behind-the-scenes", label: "Behind the Scenes" },
  { id: "community", label: "Community" },
]

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim()
}

export function parseContentPillars(content: string): ContentThemeInfo[] {
  if (!content || content === "Generating...") return DEFAULT_THEMES
  const regex = /\*\*\d+\.\s*(.+?)\*\*/g
  const themes: ContentThemeInfo[] = []
  let match
  while ((match = regex.exec(content)) !== null) {
    const label = match[1].trim()
    // Remove trailing percentage like "(30%)"
    const cleanLabel = label.replace(/\s*\(\d+%?\)\s*$/, "").trim()
    if (cleanLabel) {
      themes.push({ id: slugify(cleanLabel), label: cleanLabel })
    }
  }
  return themes.length > 0 ? themes : DEFAULT_THEMES
}

export function getStrategyThemes(brandId: string): ContentThemeInfo[] {
  const strategy = useStrategyStore.getState().strategies[brandId]
  if (!strategy) return DEFAULT_THEMES
  const pillarsSection = strategy.sections.find(
    (s) => s.id === "content-pillars"
  )
  if (!pillarsSection) return DEFAULT_THEMES
  return parseContentPillars(pillarsSection.content)
}

const STATUS_PIPELINE: CardStatus[] = [
  "plan",
  "story",
  "prompt",
  "production",
  "caption",
  "ready",
]

const STATUS_LABELS: Record<CardStatus, string> = {
  plan: "Plan",
  story: "Story",
  prompt: "Prompt",
  production: "Production",
  caption: "Caption",
  ready: "Ready",
}

function computeStatus(card: Partial<ContentCard>): CardStatus {
  if (card.caption) return "ready"
  if (card.productionGuide) return "caption"
  if (card.prompts) return "production"
  if (card.narrative) return "prompt"
  if (card.hook) return "story"
  return "plan"
}

function generateId() {
  return `card-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
}

// --- Exports ---

export {
  FORMAT_LABELS,
  PLATFORM_LABELS,
  FORMATS,
  PLATFORMS,
  DEFAULT_THEMES,
  STATUS_PIPELINE,
  STATUS_LABELS,
  computeStatus,
  generateId,
}

// --- AI field generation ---

export async function generateField(
  field: "hook" | "narrative" | "productionGuide" | "prompts" | "caption",
  card: Partial<ContentCard>,
  brandId: string
): Promise<string> {
  const brands = useBrandStore.getState().brands
  const brand = brands.find((b) => b.id === brandId)
  const brandName = brand?.name ?? "Brand"
  const brandDescription = brand?.description ?? ""

  try {
    const response = await fetch("/api/calendar", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "generate-field",
        brandName,
        brandDescription,
        card: {
          title: card.title || "Untitled",
          theme: card.theme || "ai-innovation",
          format: card.format || "single-post",
          platform: card.platform || "instagram",
          date: card.date || "",
        },
        field,
      }),
    })

    if (!response.ok) throw new Error(`API error: ${response.status}`)

    const data = await response.json()
    return data.content
  } catch (error) {
    console.error(`Field generation error (${field}):`, error)
    return `[Error generating ${field}. Please try again.]`
  }
}

// --- Mock fallback for calendar generation ---

const POSTING_TIMES = ["08:00", "10:30", "12:00", "14:30", "17:00", "19:00"]

const MOCK_TITLE_TEMPLATES = [
  (theme: string) => `${theme}: Getting Started`,
  (theme: string) => `${theme} Deep Dive`,
  (theme: string) => `Weekly ${theme} Roundup`,
  (theme: string) => `${theme} Tips & Tricks`,
  (theme: string) => `Best of ${theme}`,
  (theme: string) => `${theme} Spotlight`,
  (theme: string) => `Behind ${theme}`,
  (theme: string) => `${theme} Q&A`,
]

function generateMockCards(brandId: string, startDate: Date): ContentCard[] {
  const themes = getStrategyThemes(brandId)
  const cards: ContentCard[] = []
  const weekStart = startOfWeek(startDate, { weekStartsOn: 1 })

  for (let week = 0; week < 2; week++) {
    for (let day = 0; day < 7; day++) {
      const date = addDays(addWeeks(weekStart, week), day)
      const dateStr = format(date, "yyyy-MM-dd")
      const isWeekend = day >= 5
      const postsToday = isWeekend ? 1 : Math.floor(Math.random() * 2) + 2

      for (let post = 0; post < postsToday; post++) {
        const themeInfo = themes[Math.floor(Math.random() * themes.length)]
        const format_ = FORMATS[Math.floor(Math.random() * FORMATS.length)]
        const platform = PLATFORMS[Math.floor(Math.random() * PLATFORMS.length)]
        const titleFn = MOCK_TITLE_TEMPLATES[Math.floor(Math.random() * MOCK_TITLE_TEMPLATES.length)]
        const time = POSTING_TIMES[Math.floor(Math.random() * POSTING_TIMES.length)]

        cards.push({
          id: generateId(),
          brandId,
          date: dateStr,
          time,
          format: format_,
          platform,
          theme: themeInfo.id,
          title: titleFn(themeInfo.label),
          status: "plan",
        })
      }
    }
  }

  cards.sort((a, b) => {
    if (a.date !== b.date) return a.date.localeCompare(b.date)
    return a.time.localeCompare(b.time)
  })

  return cards
}

// --- Store ---

export const useCalendarStore = create<CalendarStore>()(
  persist(
    (set, get) => ({
  cards: {},
  currentDate: new Date(),
  view: "week",
  isGenerating: false,
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
    const { currentDate, settings } = get()
    const weekStart = startOfWeek(currentDate, { weekStartsOn: 1 })
    const startDate = format(weekStart, "yyyy-MM-dd")
    const endDate = format(addDays(addWeeks(weekStart, 1), 6), "yyyy-MM-dd")

    const brands = useBrandStore.getState().brands
    const brand = brands.find((b) => b.id === brandId)
    const brandName = brand?.name ?? "Brand"
    const brandDescription = brand?.description ?? ""

    // Get strategy context
    const strategy = useStrategyStore.getState().strategies[brandId]
    const strategyContext = strategy
      ? strategy.sections.map((s) => `${s.title}: ${s.content.slice(0, 200)}`).join("\n")
      : ""

    // Get dynamic themes from strategy content pillars
    const themes = getStrategyThemes(brandId)
    const themeIds = themes.map((t) => t.id)
    const themeLabels = themes.map((t) => t.label)

    set({ isGenerating: true })

    fetch("/api/calendar", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "generate-calendar",
        brandName,
        brandDescription,
        strategy: strategyContext,
        startDate,
        endDate,
        postsPerDay: settings.postsPerDay,
        daysPerWeek: settings.daysPerWeek,
        themes: themeIds,
        themeLabels,
      }),
    })
      .then((res) => {
        if (!res.ok) throw new Error(`API error: ${res.status}`)
        return res.json()
      })
      .then((data) => {
        const cards: ContentCard[] = data.cards.map(
          (c: { date: string; time: string; format: ContentFormat; platform: Platform; theme: ContentTheme; title: string }) => ({
            id: generateId(),
            brandId,
            date: c.date,
            time: c.time,
            format: c.format,
            platform: c.platform,
            theme: c.theme,
            title: c.title,
            status: "plan" as const,
          })
        )

        cards.sort((a, b) => {
          if (a.date !== b.date) return a.date.localeCompare(b.date)
          return a.time.localeCompare(b.time)
        })

        set((state) => ({
          cards: { ...state.cards, [brandId]: cards },
          isGenerating: false,
        }))
      })
      .catch((error) => {
        console.error("Calendar generation error:", error)
        // Fallback to mock data
        const cards = generateMockCards(brandId, currentDate)
        set((state) => ({
          cards: { ...state.cards, [brandId]: cards },
          isGenerating: false,
        }))
      })
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
    }),
    {
      name: "axis-calendar",
      partialize: (state) => ({
        cards: state.cards,
        view: state.view,
        settings: state.settings,
        currentDate: state.currentDate,
      }),
      storage: {
        getItem: (name) => {
          if (typeof window === "undefined") return null
          try {
            const str = localStorage.getItem(name)
            if (!str) return null
            const parsed = JSON.parse(str)
            if (parsed?.state?.currentDate) {
              parsed.state.currentDate = new Date(parsed.state.currentDate)
            }
            return parsed
          } catch {
            return null
          }
        },
        setItem: (name, value) => {
          if (typeof window === "undefined") return
          localStorage.setItem(name, JSON.stringify(value))
        },
        removeItem: (name) => {
          if (typeof window === "undefined") return
          localStorage.removeItem(name)
        },
      },
    }
  )
)

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
