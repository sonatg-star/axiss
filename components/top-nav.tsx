"use client"

import { cn } from "@/lib/utils"
import { useNavigationStore, type TabId } from "@/lib/stores/navigation-store"
import { useBrandStore } from "@/lib/stores/brand-store"
import {
  IconBulb,
  IconCalendar,
  IconVideo,
  IconSend,
  IconChartBar,
  IconSpeakerphone,
  IconChartDots,
  IconLock,
} from "@tabler/icons-react"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"

const tabs: { id: TabId; label: string; icon: typeof IconBulb }[] = [
  { id: "strategy", label: "Strategy", icon: IconBulb },
  { id: "calendar", label: "Content Calendar", icon: IconCalendar },
  { id: "production", label: "Production", icon: IconVideo },
  { id: "publish", label: "Publish", icon: IconSend },
  { id: "analytics", label: "Analytics", icon: IconChartBar },
  { id: "advertising", label: "Advertising", icon: IconSpeakerphone },
  { id: "ad-performance", label: "Ad Performance", icon: IconChartDots },
]

// Coff AI is the pilot brand — all tabs unlocked
const PILOT_BRAND_ID = "seed-coff-ai"

export function TopNav() {
  const activeTab = useNavigationStore((s) => s.activeTab)
  const unlockedTabs = useNavigationStore((s) => s.unlockedTabs)
  const setActiveTab = useNavigationStore((s) => s.setActiveTab)
  const activeBrandId = useBrandStore((s) => s.activeBrandId)

  const isPilot = activeBrandId === PILOT_BRAND_ID

  return (
    <nav className="flex items-center gap-0.5 overflow-x-auto border-b px-2 py-1.5 sm:gap-1 sm:px-4 sm:py-2">
      {tabs.map((tab) => {
        const isActive = tab.id === activeTab
        const isLocked = !isPilot && !unlockedTabs.includes(tab.id)
        const Icon = tab.icon

        if (isLocked) {
          return (
            <Tooltip key={tab.id}>
              <TooltipTrigger asChild>
                <button
                  disabled
                  className={cn(
                    "flex shrink-0 items-center gap-1.5 rounded-md px-2 py-1.5 text-sm font-medium transition-colors sm:gap-2 sm:px-3 sm:py-2",
                    "cursor-not-allowed text-muted-foreground/50"
                  )}
                >
                  <Icon className="size-4" />
                  <span className="hidden sm:inline">{tab.label}</span>
                  <IconLock className="hidden size-3 sm:block" />
                </button>
              </TooltipTrigger>
              <TooltipContent>Complete previous step</TooltipContent>
            </Tooltip>
          )
        }

        return (
          <Tooltip key={tab.id}>
            <TooltipTrigger asChild>
              <button
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "flex shrink-0 items-center gap-1.5 rounded-md px-2 py-1.5 text-sm font-medium transition-colors sm:gap-2 sm:px-3 sm:py-2",
                  isActive
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                )}
              >
                <Icon className="size-4" />
                <span className="hidden sm:inline">{tab.label}</span>
              </button>
            </TooltipTrigger>
            <TooltipContent className="sm:hidden">{tab.label}</TooltipContent>
          </Tooltip>
        )
      })}
    </nav>
  )
}
