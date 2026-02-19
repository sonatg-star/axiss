"use client"

import { useState } from "react"
import {
  startOfWeek,
  addDays,
  addWeeks,
  subWeeks,
  format,
  isToday,
} from "date-fns"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  IconChevronLeft,
  IconChevronRight,
  IconCalendarEvent,
  IconVideo,
  IconLayoutGrid,
  IconPhoto,
  IconCamera,
  IconFileText,
  IconMessage,
  IconBrandInstagram,
  IconBrandTiktok,
  IconBrandLinkedin,
  IconBrandX,
} from "@tabler/icons-react"
import { cn } from "@/lib/utils"

// --- Types & Data ---

type ContentItem = {
  id: string
  dayOffset: number
  time: string
  format: string
  platform: string
  theme: string
  title: string
}

const MOCK_WEEK: ContentItem[] = [
  // Monday
  { id: "1", dayOffset: 0, time: "8:00 AM", format: "reel", platform: "instagram", theme: "coffee-education", title: "Brewing the Perfect Espresso" },
  { id: "2", dayOffset: 0, time: "12:00 PM", format: "video", platform: "tiktok", theme: "coffee-education", title: "Coffee Hack: Cold Brew in 5 min" },
  { id: "3", dayOffset: 0, time: "12:30 PM", format: "article", platform: "linkedin", theme: "ai-innovation", title: "How AI is Reshaping Coffee Culture" },
  { id: "4", dayOffset: 0, time: "5:00 PM", format: "thread", platform: "x", theme: "ai-innovation", title: "The future of personalized coffee" },
  // Tuesday
  { id: "5", dayOffset: 1, time: "8:00 AM", format: "carousel", platform: "instagram", theme: "ai-innovation", title: "How Coff AI Learns Your Taste" },
  { id: "6", dayOffset: 1, time: "1:00 PM", format: "static", platform: "x", theme: "coffee-education", title: "Quick Tip: Water Temperature Matters" },
  // Wednesday
  { id: "7", dayOffset: 2, time: "9:00 AM", format: "story", platform: "instagram", theme: "behind-scenes", title: "A Day at Coff AI HQ" },
  { id: "8", dayOffset: 2, time: "12:00 PM", format: "video", platform: "tiktok", theme: "lifestyle", title: "Trending: ASMR Coffee Making" },
  { id: "9", dayOffset: 2, time: "12:30 PM", format: "article", platform: "linkedin", theme: "ai-innovation", title: "AI-Driven Personalization in F&B" },
  { id: "10", dayOffset: 2, time: "5:00 PM", format: "static", platform: "x", theme: "community", title: "What's your coffee order today?" },
  // Thursday
  { id: "11", dayOffset: 3, time: "8:00 AM", format: "static", platform: "instagram", theme: "lifestyle", title: "Morning Ritual: Coffee & Code" },
  { id: "12", dayOffset: 3, time: "12:00 PM", format: "video", platform: "tiktok", theme: "behind-scenes", title: "Meet the Team Behind Coff AI" },
  { id: "13", dayOffset: 3, time: "1:00 PM", format: "static", platform: "x", theme: "ai-innovation", title: "New Feature: Flavor Match v2" },
  // Friday
  { id: "14", dayOffset: 4, time: "8:00 AM", format: "reel", platform: "instagram", theme: "community", title: "Your Coff AI Journeys" },
  { id: "15", dayOffset: 4, time: "12:00 PM", format: "video", platform: "tiktok", theme: "lifestyle", title: "Friday Coffee Dance" },
  { id: "16", dayOffset: 4, time: "12:30 PM", format: "article", platform: "linkedin", theme: "community", title: "This Week at Coff AI: Recap" },
  { id: "17", dayOffset: 4, time: "5:00 PM", format: "static", platform: "x", theme: "community", title: "Weekend plans? Brewing something..." },
  // Saturday
  { id: "18", dayOffset: 5, time: "10:00 AM", format: "story", platform: "instagram", theme: "lifestyle", title: "Weekend Vibes" },
]

const FORMAT_META: Record<string, { label: string; icon: typeof IconVideo }> = {
  reel: { label: "Reel", icon: IconVideo },
  carousel: { label: "Carousel", icon: IconLayoutGrid },
  static: { label: "Static", icon: IconPhoto },
  story: { label: "Story", icon: IconCamera },
  article: { label: "Article", icon: IconFileText },
  thread: { label: "Thread", icon: IconMessage },
  video: { label: "Video", icon: IconVideo },
}

const PLATFORM_META: Record<string, { label: string; icon: typeof IconBrandInstagram; color: string }> = {
  instagram: { label: "Instagram", icon: IconBrandInstagram, color: "text-pink-500" },
  tiktok: { label: "TikTok", icon: IconBrandTiktok, color: "text-foreground" },
  linkedin: { label: "LinkedIn", icon: IconBrandLinkedin, color: "text-blue-600" },
  x: { label: "X", icon: IconBrandX, color: "text-foreground" },
}

const THEME_STYLES: Record<string, { border: string; bg: string; label: string; dot: string }> = {
  "ai-innovation": { border: "border-l-blue-500", bg: "bg-blue-500/5", label: "AI & Innovation", dot: "bg-blue-500" },
  "coffee-education": { border: "border-l-amber-500", bg: "bg-amber-500/5", label: "Coffee Education", dot: "bg-amber-500" },
  "lifestyle": { border: "border-l-rose-500", bg: "bg-rose-500/5", label: "Lifestyle", dot: "bg-rose-500" },
  "community": { border: "border-l-emerald-500", bg: "bg-emerald-500/5", label: "Community", dot: "bg-emerald-500" },
  "behind-scenes": { border: "border-l-violet-500", bg: "bg-violet-500/5", label: "Behind the Scenes", dot: "bg-violet-500" },
}

// --- Components ---

function ContentCard({ item }: { item: ContentItem }) {
  const fmeta = FORMAT_META[item.format] ?? FORMAT_META.static
  const pmeta = PLATFORM_META[item.platform] ?? PLATFORM_META.instagram
  const tmeta = THEME_STYLES[item.theme] ?? THEME_STYLES["ai-innovation"]
  const FormatIcon = fmeta.icon
  const PlatformIcon = pmeta.icon

  return (
    <div
      className={cn(
        "cursor-pointer rounded-lg border border-border/50 border-l-2 p-2.5 transition-colors hover:bg-accent/50",
        tmeta.border,
        tmeta.bg
      )}
    >
      <div className="mb-1 flex items-center gap-1.5">
        <PlatformIcon className={cn("size-3.5", pmeta.color)} />
        <span className="text-[10px] text-muted-foreground">{item.time}</span>
      </div>
      <p className="mb-1.5 line-clamp-2 text-xs font-medium leading-snug text-foreground">
        {item.title}
      </p>
      <div className="flex items-center gap-1">
        <FormatIcon className="size-3 text-muted-foreground" />
        <span className="text-[10px] text-muted-foreground">{fmeta.label}</span>
      </div>
    </div>
  )
}

// --- Main ---

export function ContentCalendar({ brandId }: { brandId: string }) {
  const [weekStart, setWeekStart] = useState(() =>
    startOfWeek(new Date(), { weekStartsOn: 1 })
  )

  const days = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i))

  return (
    <div className="flex h-full flex-col">
      {/* Header */}
      <div className="flex items-center justify-between border-b px-4 py-3">
        <div className="flex items-center gap-3">
          <IconCalendarEvent className="size-5 text-primary" />
          <div>
            <h2 className="text-sm font-semibold text-foreground">
              Content Calendar
            </h2>
            <p className="text-xs text-muted-foreground">
              {format(weekStart, "MMM d")} –{" "}
              {format(addDays(weekStart, 6), "MMM d, yyyy")}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            className="size-8"
            onClick={() => setWeekStart((s) => subWeeks(s, 1))}
          >
            <IconChevronLeft className="size-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() =>
              setWeekStart(startOfWeek(new Date(), { weekStartsOn: 1 }))
            }
          >
            Today
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="size-8"
            onClick={() => setWeekStart((s) => addWeeks(s, 1))}
          >
            <IconChevronRight className="size-4" />
          </Button>
        </div>
      </div>

      {/* Theme Legend */}
      <div className="flex flex-wrap gap-3 border-b px-4 py-2">
        {Object.entries(THEME_STYLES).map(([key, style]) => (
          <div key={key} className="flex items-center gap-1.5">
            <span className={cn("size-2 rounded-full", style.dot)} />
            <span className="text-[10px] text-muted-foreground">
              {style.label}
            </span>
          </div>
        ))}
        <Badge variant="secondary" className="ml-auto text-[10px]">
          {MOCK_WEEK.length} posts this week
        </Badge>
      </div>

      {/* Calendar Grid */}
      <div className="flex-1 overflow-auto">
        <div className="grid min-w-[700px] grid-cols-7 divide-x border-b">
          {days.map((day, dayIdx) => {
            const dayItems = MOCK_WEEK.filter(
              (item) => item.dayOffset === dayIdx
            )
            const today = isToday(day)

            return (
              <div
                key={dayIdx}
                className={cn("min-h-[500px]", today && "bg-primary/[0.02]")}
              >
                {/* Day Header */}
                <div
                  className={cn(
                    "sticky top-0 z-10 border-b px-2 py-2 text-center",
                    today && "bg-primary/5"
                  )}
                >
                  <p className="text-[10px] font-medium uppercase text-muted-foreground">
                    {format(day, "EEE")}
                  </p>
                  <p
                    className={cn(
                      "text-sm font-semibold",
                      today ? "text-primary" : "text-foreground"
                    )}
                  >
                    {format(day, "d")}
                  </p>
                </div>

                {/* Day Content */}
                <div className="flex flex-col gap-2 p-2">
                  {dayItems.map((item) => (
                    <ContentCard key={item.id} item={item} />
                  ))}
                  {dayItems.length === 0 && (
                    <p className="py-8 text-center text-[10px] text-muted-foreground/50">
                      No posts
                    </p>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
