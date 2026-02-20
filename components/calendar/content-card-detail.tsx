"use client"

import { useState, useEffect, useCallback, useMemo } from "react"
import {
  useCalendarStore,
  type ContentCard,
  type ContentFormat,
  type Platform,
  type CardStatus,
  FORMAT_LABELS,
  PLATFORM_LABELS,
  STATUS_PIPELINE,
  STATUS_LABELS,
  FORMATS,
  PLATFORMS,
  computeStatus,
  generateField,
  generateId,
  parseContentPillars,
  getStrategyThemes,
} from "@/lib/stores/calendar-store"
import { useStrategyStore } from "@/lib/stores/strategy-store"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { cn } from "@/lib/utils"
import {
  IconSparkles,
  IconTrash,
  IconCopy,
  IconCheck,
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
  IconCalendar,
  IconDeviceFloppy,
} from "@tabler/icons-react"
import { format } from "date-fns"

// --- Icon maps ---

const FORMAT_ICONS: Record<ContentFormat, typeof IconVideo> = {
  reel: IconVideo,
  carousel: IconCarouselHorizontal,
  "single-post": IconPhoto,
  story: IconClock,
}

const PLATFORM_ICONS: Record<Platform, typeof IconBrandInstagram> = {
  instagram: IconBrandInstagram,
  facebook: IconBrandFacebook,
  tiktok: IconBrandTiktok,
  linkedin: IconBrandLinkedin,
  pinterest: IconBrandPinterest,
  x: IconBrandX,
}

// --- Status pipeline colors ---

const STATUS_COLORS: Record<CardStatus, string> = {
  plan: "bg-slate-400",
  story: "bg-blue-500",
  prompt: "bg-violet-500",
  production: "bg-amber-500",
  caption: "bg-emerald-500",
  ready: "bg-green-600",
}

// --- Types ---

type GeneratableField = "hook" | "narrative" | "productionGuide" | "prompts" | "caption"

const GENERATABLE_FIELDS: { key: GeneratableField; label: string }[] = [
  { key: "hook", label: "Hook" },
  { key: "narrative", label: "Story / Narrative" },
  { key: "productionGuide", label: "Production Guide" },
  { key: "prompts", label: "Prompts" },
  { key: "caption", label: "Caption & Hashtags" },
]

// --- Component ---

export function ContentCardDetail({
  card,
  brandId,
  open,
  onOpenChange,
  onCardChange,
}: {
  card: ContentCard | null
  brandId: string
  open: boolean
  onOpenChange: (open: boolean) => void
  onCardChange?: (cardId: string) => void
}) {
  const updateCard = useCalendarStore((s) => s.updateCard)
  const deleteCard = useCalendarStore((s) => s.deleteCard)
  const duplicateCard = useCalendarStore((s) => s.duplicateCard)

  // Dynamic themes from strategy content pillars
  const pillarsContent = useStrategyStore(
    (s) => s.strategies[brandId]?.sections.find((sec) => sec.id === "content-pillars")?.content
  )
  const themes = useMemo(() => parseContentPillars(pillarsContent || ""), [pillarsContent])

  // Local form state
  const [form, setForm] = useState<Partial<ContentCard>>({})
  const [generating, setGenerating] = useState<GeneratableField | "all" | null>(null)
  const [hasChanges, setHasChanges] = useState(false)

  // Sync form when card changes
  useEffect(() => {
    if (card) {
      setForm({ ...card })
      setHasChanges(false)
    }
  }, [card])

  const updateField = useCallback(
    <K extends keyof ContentCard>(key: K, value: ContentCard[K]) => {
      setForm((prev) => {
        const next = { ...prev, [key]: value }
        // Auto-compute status
        const newStatus = computeStatus(next)
        return { ...next, status: newStatus }
      })
      setHasChanges(true)
    },
    []
  )

  const handleSave = () => {
    if (!card) return
    const { id, brandId: _, ...updates } = form
    updateCard(brandId, card.id, updates)
    setHasChanges(false)
  }

  const handleDelete = () => {
    if (!card) return
    deleteCard(brandId, card.id)
    onOpenChange(false)
  }

  const handleDuplicate = () => {
    if (!card) return
    const newCard = duplicateCard(brandId, card.id)
    if (newCard && onCardChange) {
      onCardChange(newCard.id)
    }
  }

  const handleGenerate = async (field: GeneratableField) => {
    setGenerating(field)
    try {
      const value = await generateField(field, form, brandId)
      updateField(field, value)
    } catch (error) {
      console.error(`Error generating ${field}:`, error)
    }
    setGenerating(null)
  }

  const handleGenerateAll = async () => {
    setGenerating("all")
    for (const { key } of GENERATABLE_FIELDS) {
      if (!form[key]) {
        try {
          const value = await generateField(key, form, brandId)
          updateField(key, value)
        } catch (error) {
          console.error(`Error generating ${key}:`, error)
        }
      }
    }
    setGenerating(null)
  }

  if (!card) return null

  const currentStatus = (form.status as CardStatus) || card.status

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="w-full sm:max-w-xl overflow-y-auto"
        showCloseButton
      >
        <SheetHeader className="pb-0">
          <div className="flex items-center gap-2 pr-8">
            <SheetTitle className="flex-1 truncate">
              {form.title || "Untitled Card"}
            </SheetTitle>
            <StatusBadge status={currentStatus} />
          </div>
          <SheetDescription className="sr-only">
            Content card detail editor
          </SheetDescription>
        </SheetHeader>

        <div className="flex flex-col gap-5 px-6 pb-6">
          {/* Status Pipeline */}
          <StatusPipeline status={currentStatus} />

          <Separator />

          {/* Title */}
          <FieldGroup label="Title">
            <Input
              value={form.title || ""}
              onChange={(e) => updateField("title", e.target.value)}
              placeholder="Content title..."
            />
          </FieldGroup>

          {/* Format / Platform / Theme row */}
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            <FieldGroup label="Format">
              <Select
                value={form.format}
                onValueChange={(v) => updateField("format", v as ContentFormat)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {FORMATS.map((f) => {
                    const Icon = FORMAT_ICONS[f]
                    return (
                      <SelectItem key={f} value={f}>
                        <Icon className="size-3.5" />
                        {FORMAT_LABELS[f]}
                      </SelectItem>
                    )
                  })}
                </SelectContent>
              </Select>
            </FieldGroup>

            <FieldGroup label="Platform">
              <Select
                value={form.platform}
                onValueChange={(v) => updateField("platform", v as Platform)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {PLATFORMS.map((p) => {
                    const Icon = PLATFORM_ICONS[p]
                    return (
                      <SelectItem key={p} value={p}>
                        <Icon className="size-3.5" />
                        {PLATFORM_LABELS[p]}
                      </SelectItem>
                    )
                  })}
                </SelectContent>
              </Select>
            </FieldGroup>

            <FieldGroup label="Theme">
              <Select
                value={form.theme}
                onValueChange={(v) => updateField("theme", v)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {themes.map((t) => (
                    <SelectItem key={t.id} value={t.id}>
                      {t.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FieldGroup>
          </div>

          {/* Date & Time */}
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-2">
            <FieldGroup label="Date">
              <Input
                type="date"
                value={form.date || ""}
                onChange={(e) => updateField("date", e.target.value)}
              />
            </FieldGroup>
            <FieldGroup label="Time">
              <Input
                type="time"
                value={form.time || ""}
                onChange={(e) => updateField("time", e.target.value)}
              />
            </FieldGroup>
          </div>

          <Separator />

          {/* Generatable text fields */}
          {GENERATABLE_FIELDS.map(({ key, label }) => (
            <FieldGroup key={key} label={label}>
              <div className="flex flex-col gap-1.5">
                <Textarea
                  value={(form[key] as string) || ""}
                  onChange={(e) => updateField(key, e.target.value)}
                  placeholder={`Enter ${label.toLowerCase()}...`}
                  className="min-h-20"
                />
                <div className="flex justify-end">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-7 gap-1.5 text-xs text-muted-foreground"
                    onClick={() => handleGenerate(key)}
                    disabled={generating !== null}
                  >
                    <IconSparkles className="size-3.5" />
                    {generating === key ? "Generating..." : `Generate ${label.split(" ")[0]}`}
                  </Button>
                </div>
              </div>
            </FieldGroup>
          ))}

          <Separator />

          {/* Actions */}
          <div className="flex items-center gap-2">
            <Button
              onClick={handleSave}
              disabled={!hasChanges}
              className="flex-1 gap-2"
            >
              <IconDeviceFloppy className="size-4" />
              Save Changes
            </Button>

            <Button
              variant="outline"
              className="gap-2"
              onClick={handleGenerateAll}
              disabled={generating !== null}
            >
              <IconSparkles className="size-4" />
              {generating === "all" ? "Generating..." : "Generate All"}
            </Button>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              className="gap-1.5 text-xs"
              onClick={handleDuplicate}
            >
              <IconCopy className="size-3.5" />
              Duplicate
            </Button>

            <Button
              variant="outline"
              size="sm"
              className="gap-1.5 text-xs text-destructive hover:bg-destructive/10"
              onClick={handleDelete}
            >
              <IconTrash className="size-3.5" />
              Delete
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}

// --- Sub-components ---

function FieldGroup({
  label,
  children,
}: {
  label: string
  children: React.ReactNode
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-medium text-muted-foreground">{label}</label>
      {children}
    </div>
  )
}

function StatusPipeline({ status }: { status: CardStatus }) {
  const currentIdx = STATUS_PIPELINE.indexOf(status)

  return (
    <div className="flex items-center gap-0.5 sm:gap-1">
      {STATUS_PIPELINE.map((step, idx) => {
        const isCompleted = idx < currentIdx
        const isCurrent = idx === currentIdx
        const isLast = idx === STATUS_PIPELINE.length - 1

        return (
          <div key={step} className="flex flex-1 items-center gap-0.5 sm:gap-1">
            <div className="flex flex-1 flex-col items-center gap-0.5 sm:gap-1">
              <div
                className={cn(
                  "flex size-5 items-center justify-center rounded-full text-[9px] font-medium transition-colors sm:size-6 sm:text-[10px]",
                  isCompleted && "bg-primary text-primary-foreground",
                  isCurrent && STATUS_COLORS[step] + " text-white",
                  !isCompleted && !isCurrent && "bg-muted text-muted-foreground"
                )}
              >
                {isCompleted ? (
                  <IconCheck className="size-3 sm:size-3.5" />
                ) : (
                  idx + 1
                )}
              </div>
              <span
                className={cn(
                  "text-[8px] leading-tight sm:text-[9px]",
                  isCurrent
                    ? "font-medium text-foreground"
                    : "text-muted-foreground"
                )}
              >
                {STATUS_LABELS[step]}
              </span>
            </div>
            {!isLast && (
              <div
                className={cn(
                  "mb-3.5 h-0.5 w-full min-w-1 rounded-full sm:mb-4 sm:min-w-2",
                  isCompleted ? "bg-primary" : "bg-muted"
                )}
              />
            )}
          </div>
        )
      })}
    </div>
  )
}

function StatusBadge({ status }: { status: CardStatus }) {
  const variant =
    status === "ready"
      ? "default"
      : status === "plan"
        ? "outline"
        : "secondary"

  return <Badge variant={variant}>{STATUS_LABELS[status]}</Badge>
}

// --- Helper to create a new empty card ---

export function createEmptyCard(brandId: string, date: string, theme?: string): ContentCard {
  const defaultTheme = theme || getStrategyThemes(brandId)[0]?.id || "general"
  return {
    id: generateId(),
    brandId,
    date,
    time: "12:00",
    format: "single-post",
    platform: "instagram",
    theme: defaultTheme,
    title: "New Content",
    status: "plan",
  }
}
