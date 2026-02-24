"use client"

import {
  type ContentCard,
  type ContentFormat,
  type Platform,
} from "@/lib/stores/calendar-store"
import {
  IconVideo,
  IconCarouselHorizontal,
  IconPhoto,
  IconClock,
  IconBrandInstagram,
  IconBrandFacebook,
  IconBrandTiktok,
  IconBrandLinkedin,
  IconBrandPinterest,
  IconBrandX,
} from "@tabler/icons-react"
import { cn } from "@/lib/utils"

// Dynamic theme color palette — assigned by hashing theme id
const THEME_COLOR_PALETTE = [
  { bg: "bg-blue-50 dark:bg-blue-950/30", border: "border-blue-200 dark:border-blue-800", dot: "bg-blue-500" },
  { bg: "bg-amber-50 dark:bg-amber-950/30", border: "border-amber-200 dark:border-amber-800", dot: "bg-amber-500" },
  { bg: "bg-rose-50 dark:bg-rose-950/30", border: "border-rose-200 dark:border-rose-800", dot: "bg-rose-500" },
  { bg: "bg-emerald-50 dark:bg-emerald-950/30", border: "border-emerald-200 dark:border-emerald-800", dot: "bg-emerald-500" },
  { bg: "bg-purple-50 dark:bg-purple-950/30", border: "border-purple-200 dark:border-purple-800", dot: "bg-purple-500" },
  { bg: "bg-cyan-50 dark:bg-cyan-950/30", border: "border-cyan-200 dark:border-cyan-800", dot: "bg-cyan-500" },
  { bg: "bg-orange-50 dark:bg-orange-950/30", border: "border-orange-200 dark:border-orange-800", dot: "bg-orange-500" },
  { bg: "bg-indigo-50 dark:bg-indigo-950/30", border: "border-indigo-200 dark:border-indigo-800", dot: "bg-indigo-500" },
]

function hashString(str: string): number {
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) - hash + str.charCodeAt(i)) | 0
  }
  return Math.abs(hash)
}

export function getThemeColor(theme: string) {
  if (!theme) return THEME_COLOR_PALETTE[0]
  const idx = hashString(theme) % THEME_COLOR_PALETTE.length
  return THEME_COLOR_PALETTE[idx]
}

// Format icons
const FORMAT_ICONS: Record<ContentFormat, typeof IconVideo> = {
  reel: IconVideo,
  carousel: IconCarouselHorizontal,
  "single-post": IconPhoto,
  story: IconClock,
}

// Platform icons
const PLATFORM_ICONS: Record<Platform, typeof IconBrandInstagram> = {
  instagram: IconBrandInstagram,
  facebook: IconBrandFacebook,
  tiktok: IconBrandTiktok,
  linkedin: IconBrandLinkedin,
  pinterest: IconBrandPinterest,
  x: IconBrandX,
}

export function ContentCardMini({
  card,
  onClick,
  isDragging,
}: {
  card: ContentCard
  onClick?: () => void
  isDragging?: boolean
}) {
  const colors = getThemeColor(card.theme)
  const FormatIcon = FORMAT_ICONS[card.format] ?? IconVideo
  const PlatformIcon = PLATFORM_ICONS[card.platform] ?? IconBrandInstagram

  return (
    <button
      onClick={onClick}
      className={cn(
        "group w-full cursor-pointer rounded-lg border p-2 text-left transition-all",
        colors.bg,
        colors.border,
        isDragging && "rotate-2 scale-105 shadow-lg opacity-80",
        !isDragging && "hover:shadow-sm"
      )}
    >
      <div className="flex items-start gap-1.5">
        <div className={cn("mt-1 size-1.5 shrink-0 rounded-full", colors.dot)} />
        <div className="min-w-0 flex-1">
          <p className="truncate text-xs font-medium text-foreground">
            {card.title}
          </p>
          <div className="mt-1 flex items-center gap-1.5">
            <FormatIcon className="size-3 text-muted-foreground" />
            <PlatformIcon className="size-3 text-muted-foreground" />
            <span className="text-[10px] text-muted-foreground">{card.time}</span>
          </div>
        </div>
      </div>
    </button>
  )
}

export function ContentCardCompact({
  card,
  onClick,
}: {
  card: ContentCard
  onClick?: () => void
}) {
  const colors = getThemeColor(card.theme)

  return (
    <button
      onClick={onClick}
      className={cn(
        "w-full cursor-pointer rounded border px-1.5 py-0.5 text-left transition-colors",
        colors.bg,
        colors.border,
        "hover:shadow-sm"
      )}
    >
      <div className="flex items-center gap-1">
        <div className={cn("size-1.5 shrink-0 rounded-full", colors.dot)} />
        <span className="truncate text-[10px] font-medium text-foreground">
          {card.title}
        </span>
      </div>
    </button>
  )
}

export { THEME_COLOR_PALETTE }
