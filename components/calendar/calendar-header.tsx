"use client"

import { Button } from "@/components/ui/button"
import {
  useCalendarStore,
  type CalendarView,
  getWeekRange,
} from "@/lib/stores/calendar-store"
import { format } from "date-fns"
import {
  IconChevronLeft,
  IconChevronRight,
  IconCalendarEvent,
  IconLayoutGrid,
  IconLayoutList,
  IconSparkles,
} from "@tabler/icons-react"
import { cn } from "@/lib/utils"

export function CalendarHeader({
  brandId,
  hasCards,
  onGenerate,
}: {
  brandId: string
  hasCards: boolean
  onGenerate: () => void
}) {
  const currentDate = useCalendarStore((s) => s.currentDate)
  const view = useCalendarStore((s) => s.view)
  const setView = useCalendarStore((s) => s.setView)
  const navigateForward = useCalendarStore((s) => s.navigateForward)
  const navigateBackward = useCalendarStore((s) => s.navigateBackward)
  const goToToday = useCalendarStore((s) => s.goToToday)

  const { start, end } = getWeekRange(currentDate)

  const dateLabel =
    view === "week"
      ? `${format(start, "MMM d")} — ${format(end, "MMM d, yyyy")}`
      : format(currentDate, "MMMM yyyy")

  return (
    <div className="flex flex-col gap-3 border-b px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
      {/* Left: Title + date */}
      <div className="flex items-center gap-2">
        <IconCalendarEvent className="size-5 text-primary" />
        <h2 className="text-sm font-semibold text-foreground">
          <span className="hidden sm:inline">Content Calendar</span>
          <span className="sm:hidden">Calendar</span>
        </h2>
        <span className="hidden text-sm text-muted-foreground sm:inline">—</span>
        <span className="text-xs font-medium text-foreground sm:text-sm">{dateLabel}</span>
      </div>

      {/* Right: Controls */}
      <div className="flex items-center gap-1.5 sm:gap-2">
        {/* Generate button */}
        <Button
          variant={hasCards ? "outline" : "default"}
          size="sm"
          onClick={onGenerate}
          className="gap-1.5"
        >
          <IconSparkles className="size-3.5" />
          <span className="hidden sm:inline">{hasCards ? "Regenerate" : "Generate Calendar"}</span>
          <span className="sm:hidden">{hasCards ? "Regen" : "Generate"}</span>
        </Button>

        <div className="hidden h-5 w-px bg-border sm:block" />

        {/* View toggle — hidden on mobile (DayView used instead) */}
        <div className="hidden items-center rounded-lg border bg-muted/50 p-0.5 sm:flex">
          <Button
            variant="ghost"
            size="icon"
            className={cn(
              "size-7 rounded-md",
              view === "week" && "bg-background shadow-sm"
            )}
            onClick={() => setView("week")}
            title="Week view"
          >
            <IconLayoutList className="size-3.5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className={cn(
              "size-7 rounded-md",
              view === "month" && "bg-background shadow-sm"
            )}
            onClick={() => setView("month")}
            title="Month view"
          >
            <IconLayoutGrid className="size-3.5" />
          </Button>
        </div>

        <div className="hidden h-5 w-px bg-border sm:block" />

        {/* Date navigation */}
        <Button variant="outline" size="sm" onClick={goToToday} className="hidden sm:flex">
          Today
        </Button>
        <div className="hidden items-center sm:flex">
          <Button
            variant="ghost"
            size="icon"
            className="size-7"
            onClick={navigateBackward}
          >
            <IconChevronLeft className="size-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="size-7"
            onClick={navigateForward}
          >
            <IconChevronRight className="size-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}
