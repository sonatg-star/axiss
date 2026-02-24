"use client"

import {
  format,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  addDays,
  isSameMonth,
  isToday,
} from "date-fns"
import {
  useCalendarStore,
  getCardsForDate,
  type ContentCard,
} from "@/lib/stores/calendar-store"
import { ContentCardCompact } from "./content-card-mini"
import { cn } from "@/lib/utils"
import { useMemo, useState, useCallback } from "react"

export function MonthView({
  brandId,
  onCardClick,
}: {
  brandId: string
  onCardClick: (card: ContentCard) => void
}) {
  const currentDate = useCalendarStore((s) => s.currentDate)
  const cards = useCalendarStore((s) => s.cards[brandId] ?? [])
  const moveCard = useCalendarStore((s) => s.moveCard)

  const [dragOverDate, setDragOverDate] = useState<string | null>(null)
  const [draggedCardId, setDraggedCardId] = useState<string | null>(null)

  // Build the grid: starts at the Monday of the week containing the 1st
  const calendarDays = useMemo(() => {
    const monthStart = startOfMonth(currentDate)
    const monthEnd = endOfMonth(currentDate)
    const gridStart = startOfWeek(monthStart, { weekStartsOn: 1 })
    const gridEnd = endOfWeek(monthEnd, { weekStartsOn: 1 })

    const days: Date[] = []
    let day = gridStart
    while (day <= gridEnd) {
      days.push(day)
      day = addDays(day, 1)
    }
    return days
  }, [currentDate])

  const handleDragStart = useCallback(
    (e: React.DragEvent, cardId: string) => {
      e.dataTransfer.setData("text/plain", cardId)
      e.dataTransfer.effectAllowed = "move"
      setDraggedCardId(cardId)
    },
    []
  )

  const handleDragOver = useCallback(
    (e: React.DragEvent, dateStr: string) => {
      e.preventDefault()
      e.dataTransfer.dropEffect = "move"
      setDragOverDate(dateStr)
    },
    []
  )

  const handleDragLeave = useCallback(() => {
    setDragOverDate(null)
  }, [])

  const handleDrop = useCallback(
    (e: React.DragEvent, dateStr: string) => {
      e.preventDefault()
      const cardId = e.dataTransfer.getData("text/plain")
      if (cardId) {
        moveCard(brandId, cardId, dateStr)
      }
      setDragOverDate(null)
      setDraggedCardId(null)
    },
    [brandId, moveCard]
  )

  const weeks = useMemo(() => {
    const result: Date[][] = []
    for (let i = 0; i < calendarDays.length; i += 7) {
      result.push(calendarDays.slice(i, i + 7))
    }
    return result
  }, [calendarDays])

  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      {/* Day headers */}
      <div className="grid grid-cols-7 border-b">
        {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day) => (
          <div
            key={day}
            className="py-2 text-center text-[10px] font-medium uppercase tracking-wider text-muted-foreground"
          >
            {day}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {weeks.map((week, weekIdx) => (
          <div
            key={weekIdx}
            className="grid flex-1 grid-cols-7 border-b last:border-b-0"
          >
            {week.map((day) => {
              const dateStr = format(day, "yyyy-MM-dd")
              const dayCards = getCardsForDate(cards, dateStr)
              const inMonth = isSameMonth(day, currentDate)
              const today = isToday(day)
              const isDragOver = dragOverDate === dateStr

              return (
                <div
                  key={dateStr}
                  className={cn(
                    "flex min-h-[80px] flex-col border-r p-1 last:border-r-0",
                    !inMonth && "bg-muted/30",
                    isDragOver && "bg-primary/5"
                  )}
                  onDragOver={(e) => handleDragOver(e, dateStr)}
                  onDragLeave={handleDragLeave}
                  onDrop={(e) => handleDrop(e, dateStr)}
                >
                  <span
                    className={cn(
                      "mb-0.5 inline-flex size-5 items-center justify-center self-end rounded-full text-[10px]",
                      today
                        ? "bg-primary text-primary-foreground font-semibold"
                        : inMonth
                          ? "text-foreground"
                          : "text-muted-foreground/50"
                    )}
                  >
                    {format(day, "d")}
                  </span>
                  <div className="flex-1 space-y-0.5 overflow-y-auto">
                    {dayCards.slice(0, 3).map((card) => (
                      <div
                        key={card.id}
                        draggable
                        onDragStart={(e) => handleDragStart(e, card.id)}
                        onDragEnd={() => setDraggedCardId(null)}
                      >
                        <ContentCardCompact
                          card={card}
                          onClick={() => onCardClick(card)}
                        />
                      </div>
                    ))}
                    {dayCards.length > 3 && (
                      <span className="block text-center text-[9px] text-muted-foreground">
                        +{dayCards.length - 3} more
                      </span>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        ))}
      </div>
    </div>
  )
}
