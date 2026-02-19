"use client"

import { useState, useCallback, useRef } from "react"
import { format, addDays, subDays, isToday } from "date-fns"
import {
  useCalendarStore,
  getCardsForDate,
  type ContentCard,
} from "@/lib/stores/calendar-store"
import { ContentCardMini } from "./content-card-mini"
import { cn } from "@/lib/utils"
import { IconChevronLeft, IconChevronRight } from "@tabler/icons-react"
import { Button } from "@/components/ui/button"

export function DayView({
  brandId,
  onCardClick,
}: {
  brandId: string
  onCardClick: (card: ContentCard) => void
}) {
  const currentDate = useCalendarStore((s) => s.currentDate)
  const cards = useCalendarStore((s) => s.cards[brandId] ?? [])
  const setCurrentDate = useCalendarStore((s) => s.setCurrentDate)

  const [viewDate, setViewDate] = useState(currentDate)
  const containerRef = useRef<HTMLDivElement>(null)
  const touchStartX = useRef(0)
  const touchDelta = useRef(0)

  const dateStr = format(viewDate, "yyyy-MM-dd")
  const dayCards = getCardsForDate(cards, dateStr)
  const today = isToday(viewDate)

  const goToPrev = useCallback(() => {
    setViewDate((d) => subDays(d, 1))
  }, [])

  const goToNext = useCallback(() => {
    setViewDate((d) => addDays(d, 1))
  }, [])

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX
    touchDelta.current = 0
  }, [])

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    touchDelta.current = e.touches[0].clientX - touchStartX.current
  }, [])

  const handleTouchEnd = useCallback(() => {
    const threshold = 60
    if (touchDelta.current > threshold) {
      goToPrev()
    } else if (touchDelta.current < -threshold) {
      goToNext()
    }
    touchDelta.current = 0
  }, [goToPrev, goToNext])

  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      {/* Day navigation */}
      <div className="flex items-center justify-between border-b px-3 py-2">
        <Button variant="ghost" size="icon" className="size-8" onClick={goToPrev}>
          <IconChevronLeft className="size-4" />
        </Button>
        <div className="flex flex-col items-center">
          <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
            {format(viewDate, "EEEE")}
          </span>
          <span
            className={cn(
              "mt-0.5 flex size-8 items-center justify-center rounded-full text-base font-semibold",
              today
                ? "bg-primary text-primary-foreground"
                : "text-foreground"
            )}
          >
            {format(viewDate, "d")}
          </span>
          <span className="text-[10px] text-muted-foreground">
            {format(viewDate, "MMM yyyy")}
          </span>
        </div>
        <Button variant="ghost" size="icon" className="size-8" onClick={goToNext}>
          <IconChevronRight className="size-4" />
        </Button>
      </div>

      {/* Cards */}
      <div
        ref={containerRef}
        className="flex-1 overflow-y-auto px-3 py-3"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {dayCards.length > 0 ? (
          <div className="flex flex-col gap-2">
            {dayCards.map((card) => (
              <ContentCardMini
                key={card.id}
                card={card}
                onClick={() => onCardClick(card)}
              />
            ))}
          </div>
        ) : (
          <div className="flex h-40 items-center justify-center">
            <p className="text-sm text-muted-foreground/60">No posts for this day</p>
          </div>
        )}
      </div>
    </div>
  )
}
