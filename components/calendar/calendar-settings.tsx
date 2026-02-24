"use client"

import { Button } from "@/components/ui/button"
import { useCalendarStore } from "@/lib/stores/calendar-store"
import { IconSettings, IconMinus, IconPlus } from "@tabler/icons-react"
import { cn } from "@/lib/utils"
import { useState, useRef, useEffect } from "react"

export function CalendarSettings() {
  const settings = useCalendarStore((s) => s.settings)
  const updateSettings = useCalendarStore((s) => s.updateSettings)
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  // Close on outside click
  useEffect(() => {
    if (!open) return
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClick)
    return () => document.removeEventListener("mousedown", handleClick)
  }, [open])

  return (
    <div className="relative" ref={ref}>
      <Button
        variant="ghost"
        size="icon"
        className="size-8"
        onClick={() => setOpen(!open)}
        title="Calendar settings"
      >
        <IconSettings className="size-4" />
      </Button>

      {open && (
        <div className="absolute right-0 top-full z-50 mt-1 w-56 rounded-xl border bg-popover p-3 shadow-md">
          <p className="mb-3 text-xs font-semibold text-foreground">
            Calendar Settings
          </p>

          {/* Posts per day */}
          <div className="mb-3">
            <label className="mb-1.5 block text-[11px] text-muted-foreground">
              Posts per day
            </label>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="icon"
                className="size-7"
                onClick={() =>
                  updateSettings({
                    postsPerDay: Math.max(1, settings.postsPerDay - 1),
                  })
                }
                disabled={settings.postsPerDay <= 1}
              >
                <IconMinus className="size-3" />
              </Button>
              <span className="w-6 text-center text-sm font-medium">
                {settings.postsPerDay}
              </span>
              <Button
                variant="outline"
                size="icon"
                className="size-7"
                onClick={() =>
                  updateSettings({
                    postsPerDay: Math.min(10, settings.postsPerDay + 1),
                  })
                }
                disabled={settings.postsPerDay >= 10}
              >
                <IconPlus className="size-3" />
              </Button>
            </div>
          </div>

          {/* Days per week */}
          <div>
            <label className="mb-1.5 block text-[11px] text-muted-foreground">
              Days per week
            </label>
            <div className="flex gap-1">
              {([5, 6, 7] as const).map((n) => (
                <Button
                  key={n}
                  variant="outline"
                  size="sm"
                  className={cn(
                    "flex-1 text-xs",
                    settings.daysPerWeek === n &&
                      "border-primary bg-primary/10 text-primary"
                  )}
                  onClick={() => updateSettings({ daysPerWeek: n })}
                >
                  {n}
                </Button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
