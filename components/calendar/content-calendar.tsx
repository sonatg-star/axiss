"use client"

import { useState, useCallback, useEffect } from "react"
import { useCalendarStore, type ContentCard } from "@/lib/stores/calendar-store"
import { CalendarHeader } from "./calendar-header"
import { CalendarSettings } from "./calendar-settings"
import { WeekView } from "./week-view"
import { MonthView } from "./month-view"
import { DayView } from "./day-view"
import { ContentCardDetail, createEmptyCard } from "./content-card-detail"
import { IconCalendarEvent, IconSparkles, IconPlus } from "@tabler/icons-react"
import { Button } from "@/components/ui/button"
import { useIsMobile } from "@/hooks/use-mobile"
import { format } from "date-fns"

function EmptyState({
  onGenerate,
}: {
  onGenerate: () => void
}) {
  return (
    <div className="flex flex-1 items-center justify-center">
      <div className="text-center">
        <div className="mx-auto mb-4 flex size-14 items-center justify-center rounded-2xl bg-primary/10">
          <IconCalendarEvent className="size-7 text-primary" />
        </div>
        <h3 className="text-lg font-semibold text-foreground">
          Generate Your Content Calendar
        </h3>
        <p className="mx-auto mt-1 max-w-sm text-sm text-muted-foreground">
          Based on your approved strategy, we&apos;ll create a content calendar
          with scheduled posts across your platforms.
        </p>
        <Button size="lg" className="mt-6 gap-2" onClick={onGenerate}>
          <IconSparkles className="size-4" />
          Generate Calendar
        </Button>
      </div>
    </div>
  )
}

export function ContentCalendar({ brandId }: { brandId: string }) {
  const cards = useCalendarStore((s) => s.cards[brandId])
  const view = useCalendarStore((s) => s.view)
  const currentDate = useCalendarStore((s) => s.currentDate)
  const generateCalendar = useCalendarStore((s) => s.generateCalendar)
  const addCard = useCalendarStore((s) => s.addCard)
  const isMobile = useIsMobile()

  const isGenerating = useCalendarStore((s) => s.isGenerating)
  const hasCards = !!cards && cards.length > 0

  // Auto-generate mock data if empty
  useEffect(() => {
    if (!hasCards && !isGenerating) {
      generateCalendar(brandId)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [brandId])

  // Detail panel state
  const [selectedCard, setSelectedCard] = useState<ContentCard | null>(null)
  const [detailOpen, setDetailOpen] = useState(false)

  const handleGenerate = () => {
    generateCalendar(brandId)
  }

  const handleCardClick = useCallback(
    (card: ContentCard) => {
      setSelectedCard(card)
      setDetailOpen(true)
    },
    []
  )

  const handleCardChange = useCallback(
    (cardId: string) => {
      // Switch to a different card (e.g., after duplicate)
      const allCards = useCalendarStore.getState().cards[brandId]
      const newCard = allCards?.find((c) => c.id === cardId)
      if (newCard) {
        setSelectedCard(newCard)
      }
    },
    [brandId]
  )

  const handleDetailOpenChange = useCallback(
    (open: boolean) => {
      setDetailOpen(open)
      if (!open) {
        // Refresh selected card from store to pick up unsaved → saved state
        setSelectedCard(null)
      }
    },
    []
  )

  const handleCreateCard = () => {
    const dateStr = format(currentDate, "yyyy-MM-dd")
    const newCard = createEmptyCard(brandId, dateStr)
    addCard(brandId, newCard)
    setSelectedCard(newCard)
    setDetailOpen(true)
  }

  // Keep selectedCard in sync with store
  const currentCard = selectedCard
    ? cards?.find((c) => c.id === selectedCard.id) || selectedCard
    : null

  return (
    <div className="flex h-full flex-col">
      <CalendarHeader
        brandId={brandId}
        hasCards={hasCards}
        onGenerate={handleGenerate}
      />

      {/* Settings bar */}
      {hasCards && (
        <div className="flex items-center justify-between border-b px-4 py-1.5">
          <div className="flex items-center gap-3">
            <span className="text-xs text-muted-foreground">
              {cards.length} posts scheduled
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              className="h-7 gap-1.5 text-xs"
              onClick={handleCreateCard}
            >
              <IconPlus className="size-3.5" />
              New Card
            </Button>
            <CalendarSettings />
          </div>
        </div>
      )}

      {/* Content */}
      {hasCards ? (
        isMobile ? (
          <DayView brandId={brandId} onCardClick={handleCardClick} />
        ) : view === "week" ? (
          <WeekView brandId={brandId} onCardClick={handleCardClick} />
        ) : (
          <MonthView brandId={brandId} onCardClick={handleCardClick} />
        )
      ) : (
        <EmptyState onGenerate={handleGenerate} />
      )}

      {/* Card Detail Panel */}
      <ContentCardDetail
        card={currentCard}
        brandId={brandId}
        open={detailOpen}
        onOpenChange={handleDetailOpenChange}
        onCardChange={handleCardChange}
      />
    </div>
  )
}
