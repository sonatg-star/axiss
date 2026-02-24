"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import {
  useStrategyStore,
  type StrategySection,
  type StrategySectionId,
} from "@/lib/stores/strategy-store"
import { useNavigationStore } from "@/lib/stores/navigation-store"
import { useBrandStore } from "@/lib/stores/brand-store"
import {
  IconEdit,
  IconCheck,
  IconX,
  IconRefresh,
  IconRosetteDiscountCheck,
  IconArrowRight,
  IconBulb,
  IconWorld,
  IconTarget,
  IconUsers,
  IconDeviceMobile,
  IconPuzzle,
  IconMicrophone2,
  IconCalendarEvent,
  IconPhoto,
  IconChartBar,
  IconChevronDown,
  IconChevronUp,
} from "@tabler/icons-react"
import { cn } from "@/lib/utils"

// Section icon mapping
const SECTION_ICONS: Record<StrategySectionId, typeof IconBulb> = {
  "brand-summary": IconBulb,
  "market-overview": IconWorld,
  "competitor-analysis": IconTarget,
  "target-audience": IconUsers,
  "platform-strategy": IconDeviceMobile,
  "content-pillars": IconPuzzle,
  "tone-of-voice": IconMicrophone2,
  "posting-schedule": IconCalendarEvent,
  "format-mix": IconPhoto,
  kpis: IconChartBar,
}

// --- Section Card ---

function SectionCard({
  section,
  brandId,
}: {
  section: StrategySection
  brandId: string
}) {
  const [isEditing, setIsEditing] = useState(false)
  const [editContent, setEditContent] = useState("")
  const [isCollapsed, setIsCollapsed] = useState(false)
  const updateSection = useStrategyStore((s) => s.updateSection)
  const regenerateSection = useStrategyStore((s) => s.regenerateSection)

  const Icon = SECTION_ICONS[section.id]

  const startEdit = () => {
    setEditContent(section.content)
    setIsEditing(true)
  }

  const saveEdit = () => {
    updateSection(brandId, section.id, editContent)
    setIsEditing(false)
  }

  const cancelEdit = () => {
    setIsEditing(false)
  }

  const handleRegenerate = () => {
    regenerateSection(brandId, section.id)
  }

  return (
    <div className="group rounded-xl border border-border bg-card transition-colors hover:border-border/80">
      {/* Section Header */}
      <div className="flex items-center gap-2 px-3 py-3 sm:gap-3 sm:px-5 sm:py-4">
        <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary sm:size-9">
          <Icon className="size-4 sm:size-5" />
        </div>
        <h3 className="flex-1 text-xs font-semibold text-foreground sm:text-sm">
          {section.title}
        </h3>
        <div className="flex items-center gap-1">
          {!isEditing && (
            <>
              <Button
                variant="ghost"
                size="icon"
                className="size-8 text-muted-foreground opacity-100 sm:opacity-0 sm:transition-opacity sm:group-hover:opacity-100"
                onClick={handleRegenerate}
                title="Regenerate this section"
              >
                <IconRefresh className="size-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="size-8 text-muted-foreground opacity-100 sm:opacity-0 sm:transition-opacity sm:group-hover:opacity-100"
                onClick={startEdit}
                title="Edit this section"
              >
                <IconEdit className="size-4" />
              </Button>
            </>
          )}
          <Button
            variant="ghost"
            size="icon"
            className="size-8 text-muted-foreground"
            onClick={() => setIsCollapsed(!isCollapsed)}
          >
            {isCollapsed ? (
              <IconChevronDown className="size-4" />
            ) : (
              <IconChevronUp className="size-4" />
            )}
          </Button>
        </div>
      </div>

      {/* Section Content */}
      {!isCollapsed && (
        <div className="border-t px-3 py-3 sm:px-5 sm:py-4">
          {isEditing ? (
            <div className="space-y-3">
              <Textarea
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
                className="min-h-[200px] resize-y font-mono text-sm"
                placeholder="Edit section content (Markdown supported)..."
              />
              <div className="flex items-center gap-2">
                <Button size="sm" onClick={saveEdit} className="gap-1.5">
                  <IconCheck className="size-3.5" />
                  Save
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={cancelEdit}
                  className="gap-1.5"
                >
                  <IconX className="size-3.5" />
                  Cancel
                </Button>
              </div>
            </div>
          ) : (
            <div
              className="prose-sm max-w-none text-sm leading-relaxed text-foreground/85 [&_strong]:font-semibold [&_strong]:text-foreground [&_li]:ml-4 [&_li]:list-disc [&_p]:mb-3 last:[&_p]:mb-0 [&_table]:w-full [&_table]:border-collapse [&_th]:border [&_th]:border-border [&_th]:bg-muted/50 [&_th]:px-3 [&_th]:py-2 [&_th]:text-left [&_th]:text-xs [&_th]:font-medium [&_td]:border [&_td]:border-border [&_td]:px-3 [&_td]:py-2 [&_td]:text-xs"
              dangerouslySetInnerHTML={{
                __html: formatStrategyMarkdown(section.content),
              }}
            />
          )}
        </div>
      )}
    </div>
  )
}

// Enhanced markdown formatter for strategy content
function formatStrategyMarkdown(text: string): string {
  // Tables
  let html = text.replace(
    /\|(.+)\|\n\|[-| ]+\|\n((?:\|.+\|\n?)*)/g,
    (_match, header: string, rows: string) => {
      const headers = header
        .split("|")
        .map((h: string) => h.trim())
        .filter(Boolean)
      const rowLines = rows
        .trim()
        .split("\n")
        .map((r: string) =>
          r
            .split("|")
            .map((c: string) => c.trim())
            .filter(Boolean)
        )

      let table = "<table><thead><tr>"
      headers.forEach((h: string) => {
        table += `<th>${h}</th>`
      })
      table += "</tr></thead><tbody>"
      rowLines.forEach((cols: string[]) => {
        table += "<tr>"
        cols.forEach((c: string) => {
          table += `<td>${c}</td>`
        })
        table += "</tr>"
      })
      table += "</tbody></table>"
      return table
    }
  )

  // Bold
  html = html.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
  // Italic
  html = html.replace(/\*([^*]+)\*/g, "<em>$1</em>")
  // List items
  html = html.replace(/^- (.*)$/gm, "<li>$1</li>")
  // Paragraphs
  html = html.replace(/\n\n/g, "</p><p>")
  // Line breaks
  html = html.replace(/\n/g, "<br/>")
  // Wrap
  html = `<p>${html}</p>`
  // Clean up empty paragraphs
  html = html.replace(/<p><\/p>/g, "")

  return html
}

// --- Main Strategy Document ---

export function StrategyDocument({
  brandId,
}: {
  brandId: string
}) {
  const strategy = useStrategyStore((s) => s.strategies[brandId])
  const approveStrategy = useStrategyStore((s) => s.approveStrategy)
  const unlockTab = useNavigationStore((s) => s.unlockTab)
  const setActiveTab = useNavigationStore((s) => s.setActiveTab)
  const brand = useBrandStore((s) => s.brands.find((b) => b.id === brandId))

  if (!strategy || !brand) return null

  const handleApprove = () => {
    approveStrategy(brandId)
    unlockTab("calendar")
    setActiveTab("calendar")
  }

  return (
    <div className="flex h-full flex-col">
      {/* Header */}
      <div className="flex items-center gap-3 border-b px-4 py-3">
        <div className="flex size-8 items-center justify-center rounded-lg bg-primary/10 text-xs font-bold text-primary">
          {brand.initials}
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-medium text-foreground">
            {brand.name} — Strategy Document
          </p>
          <p className="text-xs text-muted-foreground">
            {strategy.sections.length} sections
          </p>
        </div>
        <Badge
          variant={strategy.status === "approved" ? "default" : "secondary"}
          className={cn(
            "gap-1.5 capitalize",
            strategy.status === "approved" &&
              "bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/15",
            strategy.status === "generating" &&
              "bg-blue-500/10 text-blue-600"
          )}
        >
          {strategy.status === "approved" && (
            <IconRosetteDiscountCheck className="size-3.5" />
          )}
          {strategy.status === "generating" ? "Generating..." : strategy.status}
        </Badge>
      </div>

      {/* Sections */}
      <div className="flex-1 overflow-y-auto px-2 py-4 sm:px-4 sm:py-6">
        <div className="mx-auto flex flex-col gap-3 sm:max-w-3xl sm:gap-4">
          {strategy.sections.map((section) => (
            <SectionCard
              key={section.id}
              section={section}
              brandId={brandId}
            />
          ))}

          {/* Generating indicator */}
          {strategy.status === "generating" && (
            <div className="flex flex-col items-center gap-3 pt-8 pb-8">
              <div className="size-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
              <p className="text-sm text-muted-foreground">
                Generating strategy with AI...
              </p>
            </div>
          )}

          {/* Approve Button */}
          {strategy.status === "draft" && (
            <div className="flex justify-center pt-4 pb-8">
              <Button size="lg" onClick={handleApprove} className="gap-2">
                <IconRosetteDiscountCheck className="size-5" />
                Approve & Continue to Calendar
                <IconArrowRight className="size-4" />
              </Button>
            </div>
          )}

          {strategy.status === "approved" && (
            <div className="flex justify-center pt-4 pb-8">
              <Button
                size="lg"
                variant="outline"
                onClick={() => {
                  unlockTab("calendar")
                  setActiveTab("calendar")
                }}
                className="gap-2"
              >
                Go to Content Calendar
                <IconArrowRight className="size-4" />
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
