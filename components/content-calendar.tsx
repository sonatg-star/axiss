"use client"

import { useState, useEffect, type DragEvent } from "react"
import { format, isToday } from "date-fns"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
  SheetClose,
} from "@/components/ui/sheet"
import {
  useCalendarStore,
  getWeekDays,
  getCardsForDate,
  generateId,
  FORMATS,
  PLATFORMS,
  THEMES,
  THEME_LABELS,
  FORMAT_LABELS,
  PLATFORM_LABELS,
  type ContentCard,
  type ContentFormat,
  type Platform,
  type ContentTheme,
} from "@/lib/stores/calendar-store"
import {
  IconChevronLeft,
  IconChevronRight,
  IconCalendarEvent,
  IconVideo,
  IconLayoutGrid,
  IconPhoto,
  IconCamera,
  IconBrandInstagram,
  IconBrandTiktok,
  IconBrandLinkedin,
  IconBrandX,
  IconBrandYoutube,
  IconBrandFacebook,
  IconBrandPinterest,
  IconPlus,
  IconTrash,
  IconGripVertical,
} from "@tabler/icons-react"
import { cn } from "@/lib/utils"

// --- Visual config ---

const FORMAT_ICONS: Record<string, typeof IconVideo> = {
  reel: IconVideo,
  carousel: IconLayoutGrid,
  "single-post": IconPhoto,
  story: IconCamera,
}

const PLATFORM_ICONS: Record<string, { icon: typeof IconBrandInstagram; color: string }> = {
  instagram: { icon: IconBrandInstagram, color: "text-pink-500" },
  tiktok: { icon: IconBrandTiktok, color: "text-foreground" },
  linkedin: { icon: IconBrandLinkedin, color: "text-blue-600" },
  x: { icon: IconBrandX, color: "text-foreground" },
  youtube: { icon: IconBrandYoutube, color: "text-red-500" },
  facebook: { icon: IconBrandFacebook, color: "text-blue-500" },
  pinterest: { icon: IconBrandPinterest, color: "text-red-600" },
}

const THEME_COLORS: Record<string, { border: string; bg: string; dot: string }> = {
  "ai-innovation": { border: "border-l-blue-500", bg: "bg-blue-500/5", dot: "bg-blue-500" },
  "coffee-education": { border: "border-l-amber-500", bg: "bg-amber-500/5", dot: "bg-amber-500" },
  lifestyle: { border: "border-l-rose-500", bg: "bg-rose-500/5", dot: "bg-rose-500" },
  community: { border: "border-l-emerald-500", bg: "bg-emerald-500/5", dot: "bg-emerald-500" },
  "behind-the-scenes": { border: "border-l-violet-500", bg: "bg-violet-500/5", dot: "bg-violet-500" },
}

// --- Card Component ---

function CalendarCard({
  card,
  onEdit,
  onDragStart,
}: {
  card: ContentCard
  onEdit: () => void
  onDragStart: (e: DragEvent) => void
}) {
  const FormatIcon = FORMAT_ICONS[card.format] ?? IconPhoto
  const pmeta = PLATFORM_ICONS[card.platform] ?? PLATFORM_ICONS.instagram
  const PlatformIcon = pmeta.icon
  const tcolors = THEME_COLORS[card.theme] ?? THEME_COLORS["ai-innovation"]

  return (
    <div
      draggable
      onDragStart={onDragStart}
      onClick={onEdit}
      className={cn(
        "group/card cursor-grab rounded-lg border border-border/50 border-l-2 p-2 transition-all hover:bg-accent/50 active:cursor-grabbing active:opacity-70",
        tcolors.border,
        tcolors.bg
      )}
    >
      <div className="mb-1 flex items-center gap-1.5">
        <IconGripVertical className="size-3 text-muted-foreground/40 opacity-0 transition-opacity group-hover/card:opacity-100" />
        <PlatformIcon className={cn("size-3.5", pmeta.color)} />
        <span className="text-[10px] text-muted-foreground">{card.time}</span>
      </div>
      <p className="mb-1 line-clamp-2 text-xs font-medium leading-snug text-foreground">
        {card.title}
      </p>
      <div className="flex items-center gap-1">
        <FormatIcon className="size-3 text-muted-foreground" />
        <span className="text-[10px] text-muted-foreground">
          {FORMAT_LABELS[card.format as ContentFormat] ?? card.format}
        </span>
      </div>
    </div>
  )
}

// --- Edit Sheet ---

function CardEditSheet({
  card,
  brandId,
  onClose,
}: {
  card: ContentCard
  brandId: string
  onClose: () => void
}) {
  const updateCard = useCalendarStore((s) => s.updateCard)
  const deleteCard = useCalendarStore((s) => s.deleteCard)
  const duplicateCard = useCalendarStore((s) => s.duplicateCard)

  const [draft, setDraft] = useState({ ...card })

  // Sync draft when card changes (e.g. after move)
  useEffect(() => {
    setDraft({ ...card })
  }, [card])

  const handleSave = () => {
    updateCard(brandId, card.id, {
      title: draft.title,
      format: draft.format,
      platform: draft.platform,
      theme: draft.theme,
      time: draft.time,
    })
    onClose()
  }

  const handleDelete = () => {
    deleteCard(brandId, card.id)
    onClose()
  }

  const handleDuplicate = () => {
    duplicateCard(brandId, card.id)
    onClose()
  }

  return (
    <div className="flex flex-col gap-5 pt-4">
      {/* Title */}
      <div className="space-y-1.5">
        <Label>Title</Label>
        <Input
          value={draft.title}
          onChange={(e) => setDraft({ ...draft, title: e.target.value })}
        />
      </div>

      {/* Format */}
      <div className="space-y-1.5">
        <Label>Format</Label>
        <Select
          value={draft.format}
          onValueChange={(v) => setDraft({ ...draft, format: v as ContentFormat })}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {FORMATS.map((f) => (
              <SelectItem key={f} value={f}>
                {FORMAT_LABELS[f]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Platform */}
      <div className="space-y-1.5">
        <Label>Platform</Label>
        <Select
          value={draft.platform}
          onValueChange={(v) => setDraft({ ...draft, platform: v as Platform })}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {PLATFORMS.map((p) => (
              <SelectItem key={p} value={p}>
                {PLATFORM_LABELS[p]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Theme */}
      <div className="space-y-1.5">
        <Label>Theme</Label>
        <Select
          value={draft.theme}
          onValueChange={(v) => setDraft({ ...draft, theme: v as ContentTheme })}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {THEMES.map((t) => (
              <SelectItem key={t} value={t}>
                {THEME_LABELS[t]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Time */}
      <div className="space-y-1.5">
        <Label>Time</Label>
        <Input
          value={draft.time}
          onChange={(e) => setDraft({ ...draft, time: e.target.value })}
          placeholder="08:00"
        />
      </div>

      {/* Date (read-only, moved via DnD) */}
      <div className="space-y-1.5">
        <Label>Date</Label>
        <Input value={card.date} disabled className="opacity-60" />
        <p className="text-[10px] text-muted-foreground">
          Drag the card to move to another day
        </p>
      </div>

      {/* Actions */}
      <div className="flex gap-2 border-t pt-4">
        <Button onClick={handleSave} className="flex-1">
          Save Changes
        </Button>
        <Button variant="outline" onClick={handleDuplicate}>
          Duplicate
        </Button>
        <Button variant="destructive" size="icon" onClick={handleDelete}>
          <IconTrash className="size-4" />
        </Button>
      </div>
    </div>
  )
}

// --- Main Calendar ---

export function ContentCalendar({ brandId }: { brandId: string }) {
  const cards = useCalendarStore((s) => s.cards[brandId] ?? [])
  const currentDate = useCalendarStore((s) => s.currentDate)
  const generateCalendar = useCalendarStore((s) => s.generateCalendar)
  const navigateForward = useCalendarStore((s) => s.navigateForward)
  const navigateBackward = useCalendarStore((s) => s.navigateBackward)
  const goToToday = useCalendarStore((s) => s.goToToday)
  const moveCard = useCalendarStore((s) => s.moveCard)
  const addCard = useCalendarStore((s) => s.addCard)

  const [editingCard, setEditingCard] = useState<ContentCard | null>(null)
  const [dragOverDay, setDragOverDay] = useState<string | null>(null)

  // Auto-generate mock data if empty
  useEffect(() => {
    if (cards.length === 0) {
      generateCalendar(brandId)
    }
  }, [brandId, cards.length, generateCalendar])

  const weekDays = getWeekDays(currentDate)
  const weekStart = weekDays[0]
  const weekEnd = weekDays[6]

  const handleDrop = (e: DragEvent, dateStr: string) => {
    e.preventDefault()
    setDragOverDay(null)
    const cardId = e.dataTransfer.getData("cardId")
    if (cardId) {
      moveCard(brandId, cardId, dateStr)
    }
  }

  const handleAddCard = (dateStr: string) => {
    const newCard: ContentCard = {
      id: generateId(),
      brandId,
      date: dateStr,
      time: "12:00",
      format: "single-post",
      platform: "instagram",
      theme: "ai-innovation",
      title: "New Post",
      status: "plan",
    }
    addCard(brandId, newCard)
    setEditingCard(newCard)
  }

  // Keep editing card in sync with store
  const currentEditCard = editingCard
    ? cards.find((c) => c.id === editingCard.id) ?? null
    : null

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
              {format(weekEnd, "MMM d, yyyy")}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            className="size-8"
            onClick={navigateBackward}
          >
            <IconChevronLeft className="size-4" />
          </Button>
          <Button variant="outline" size="sm" onClick={goToToday}>
            Today
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="size-8"
            onClick={navigateForward}
          >
            <IconChevronRight className="size-4" />
          </Button>
        </div>
      </div>

      {/* Theme Legend */}
      <div className="flex flex-wrap gap-3 border-b px-4 py-2">
        {Object.entries(THEME_COLORS).map(([key, style]) => (
          <div key={key} className="flex items-center gap-1.5">
            <span className={cn("size-2 rounded-full", style.dot)} />
            <span className="text-[10px] text-muted-foreground">
              {THEME_LABELS[key as ContentTheme] ?? key}
            </span>
          </div>
        ))}
        <Badge variant="secondary" className="ml-auto text-[10px]">
          {cards.filter((c) => {
            const ws = format(weekStart, "yyyy-MM-dd")
            const we = format(weekEnd, "yyyy-MM-dd")
            return c.date >= ws && c.date <= we
          }).length}{" "}
          posts this week
        </Badge>
      </div>

      {/* Calendar Grid */}
      <div className="flex-1 overflow-auto">
        <div className="grid min-w-[700px] grid-cols-7 divide-x border-b">
          {weekDays.map((day) => {
            const dateStr = format(day, "yyyy-MM-dd")
            const dayCards = getCardsForDate(cards, dateStr)
            const today = isToday(day)
            const isDragOver = dragOverDay === dateStr

            return (
              <div
                key={dateStr}
                className={cn(
                  "min-h-[500px] transition-colors",
                  today && "bg-primary/[0.02]",
                  isDragOver && "bg-primary/[0.06]"
                )}
                onDragOver={(e) => {
                  e.preventDefault()
                  setDragOverDay(dateStr)
                }}
                onDragLeave={() => setDragOverDay(null)}
                onDrop={(e) => handleDrop(e, dateStr)}
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

                {/* Day Cards */}
                <div className="flex flex-col gap-1.5 p-1.5">
                  {dayCards.map((card) => (
                    <CalendarCard
                      key={card.id}
                      card={card}
                      onEdit={() => setEditingCard(card)}
                      onDragStart={(e) =>
                        e.dataTransfer.setData("cardId", card.id)
                      }
                    />
                  ))}

                  {/* Add Button */}
                  <button
                    onClick={() => handleAddCard(dateStr)}
                    className="flex items-center justify-center gap-1 rounded-lg border border-dashed border-border/60 py-2 text-[10px] text-muted-foreground/60 transition-colors hover:border-primary/30 hover:bg-primary/5 hover:text-muted-foreground"
                  >
                    <IconPlus className="size-3" />
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Edit Sheet */}
      <Sheet
        open={!!currentEditCard}
        onOpenChange={(open) => !open && setEditingCard(null)}
      >
        <SheetContent side="right" className="overflow-y-auto sm:max-w-md">
          <SheetHeader>
            <SheetTitle>Edit Content</SheetTitle>
          </SheetHeader>
          {currentEditCard && (
            <CardEditSheet
              key={currentEditCard.id}
              card={currentEditCard}
              brandId={brandId}
              onClose={() => setEditingCard(null)}
            />
          )}
        </SheetContent>
      </Sheet>
    </div>
  )
}
