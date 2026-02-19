"use client"

import { format, isToday } from "date-fns"
import {
  useCalendarStore,
  getWeekDays,
  getCardsForDate,
  type ContentCard,
} from "@/lib/stores/calendar-store"
import { ContentCardMini } from "./content-card-mini"
import { cn } from "@/lib/utils"
import { useMemo, useState, useCallback } from "react"

export function WeekView({
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

  const weekDays = useMemo(() => getWeekDays(currentDate), [currentDate])

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

  return (
    <div className="flex flex-1 overflow-hidden">
      {weekDays.map((day) => {
        const dateStr = format(day, "yyyy-MM-dd")
        const dayCards = getCardsForDate(cards, dateStr)
        const today = isToday(day)
        const isDragOver = dragOverDate === dateStr

        return (
          <div
            key={dateStr}
            className={cn(
              "flex min-w-0 flex-1 flex-col border-r last:border-r-0",
              isDragOver && "bg-primary/5"
            )}
            onDragOver={(e) => handleDragOver(e, dateStr)}
            onDragLeave={handleDragLeave}
            onDrop={(e) => handleDrop(e, dateStr)}
          >
            {/* Day header */}
            <div
              className={cn(
                "flex flex-col items-center border-b px-2 py-2",
                today && "bg-primary/5"
              )}
            >
              <span className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
                {format(day, "EEE")}
              </span>
              <span
                className={cn(
                  "mt-0.5 flex size-7 items-center justify-center rounded-full text-sm font-semibold",
                  today
                    ? "bg-primary text-primary-foreground"
                    : "text-foreground"
                )}
              >
                {format(day, "d")}
              </span>
            </div>

            {/* Cards */}
            <div className="flex-1 space-y-1.5 overflow-y-auto p-1.5">
              {dayCards.map((card) => (
                <div
                  key={card.id}
                  draggable
                  onDragStart={(e) => handleDragStart(e, card.id)}
                  onDragEnd={() => setDraggedCardId(null)}
                >
                  <ContentCardMini
                    card={card}
                    onClick={() => onCardClick(card)}
                    isDragging={draggedCardId === card.id}
                  />
                </div>
              ))}
              {dayCards.length === 0 && (
                <div className="flex h-20 items-center justify-center">
                  <span className="text-[10px] text-muted-foreground/50">
                    No posts
                  </span>
                </div>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}
