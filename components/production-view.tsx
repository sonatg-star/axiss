"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  IconVideo,
  IconLayoutGrid,
  IconPhoto,
  IconCamera,
  IconFileText,
  IconMessage,
  IconBrandInstagram,
  IconBrandTiktok,
  IconBrandLinkedin,
  IconBrandX,
  IconSparkles,
  IconUpload,
  IconMovie,
} from "@tabler/icons-react"
import { cn } from "@/lib/utils"

// --- Data ---

type ProductionCard = {
  id: string
  title: string
  format: string
  platform: string
  theme: string
  status: string
  hasAsset: boolean
}

const PIPELINE_STAGES = [
  { id: "plan", label: "Plan", color: "bg-slate-400" },
  { id: "story", label: "Story", color: "bg-blue-500" },
  { id: "prompt", label: "Prompt", color: "bg-violet-500" },
  { id: "production", label: "Production", color: "bg-amber-500" },
  { id: "caption", label: "Caption", color: "bg-emerald-500" },
  { id: "ready", label: "Ready", color: "bg-green-600" },
]

const MOCK_CARDS: ProductionCard[] = [
  { id: "p1", title: "Brewing the Perfect Espresso", format: "reel", platform: "instagram", theme: "coffee-education", status: "ready", hasAsset: true },
  { id: "p2", title: "How Coff AI Learns Your Taste", format: "carousel", platform: "instagram", theme: "ai-innovation", status: "ready", hasAsset: true },
  { id: "p3", title: "Cold Brew Hack: 5 min Recipe", format: "video", platform: "tiktok", theme: "coffee-education", status: "caption", hasAsset: true },
  { id: "p4", title: "AI is Reshaping Coffee Culture", format: "article", platform: "linkedin", theme: "ai-innovation", status: "caption", hasAsset: false },
  { id: "p5", title: "Trending: ASMR Coffee Making", format: "video", platform: "tiktok", theme: "lifestyle", status: "production", hasAsset: false },
  { id: "p6", title: "A Day at Coff AI HQ", format: "story", platform: "instagram", theme: "behind-scenes", status: "production", hasAsset: false },
  { id: "p7", title: "Morning Ritual: Coffee & Code", format: "static", platform: "instagram", theme: "lifestyle", status: "prompt", hasAsset: false },
  { id: "p8", title: "Meet the Team Behind Coff AI", format: "video", platform: "tiktok", theme: "behind-scenes", status: "prompt", hasAsset: false },
  { id: "p9", title: "Your Coff AI Journeys", format: "reel", platform: "instagram", theme: "community", status: "story", hasAsset: false },
  { id: "p10", title: "Friday Coffee Dance", format: "video", platform: "tiktok", theme: "lifestyle", status: "story", hasAsset: false },
  { id: "p11", title: "Weekend Vibes", format: "story", platform: "instagram", theme: "lifestyle", status: "plan", hasAsset: false },
  { id: "p12", title: "New Feature: Flavor Match v2", format: "static", platform: "x", theme: "ai-innovation", status: "plan", hasAsset: false },
]

const FORMAT_ICONS: Record<string, typeof IconVideo> = {
  reel: IconVideo,
  carousel: IconLayoutGrid,
  static: IconPhoto,
  story: IconCamera,
  article: IconFileText,
  thread: IconMessage,
  video: IconVideo,
}

const PLATFORM_META: Record<string, { icon: typeof IconBrandInstagram; color: string }> = {
  instagram: { icon: IconBrandInstagram, color: "text-pink-500" },
  tiktok: { icon: IconBrandTiktok, color: "text-foreground" },
  linkedin: { icon: IconBrandLinkedin, color: "text-blue-600" },
  x: { icon: IconBrandX, color: "text-foreground" },
}

const THEME_DOT: Record<string, string> = {
  "ai-innovation": "bg-blue-500",
  "coffee-education": "bg-amber-500",
  "lifestyle": "bg-rose-500",
  "community": "bg-emerald-500",
  "behind-scenes": "bg-violet-500",
}

// --- Components ---

function KanbanCard({ card }: { card: ProductionCard }) {
  const FormatIcon = FORMAT_ICONS[card.format] ?? IconPhoto
  const pmeta = PLATFORM_META[card.platform] ?? PLATFORM_META.instagram
  const PlatformIcon = pmeta.icon

  return (
    <div className="cursor-pointer rounded-lg border bg-card p-3 transition-colors hover:bg-accent/30">
      <div className="mb-2 flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <PlatformIcon className={cn("size-3.5", pmeta.color)} />
          <FormatIcon className="size-3.5 text-muted-foreground" />
        </div>
        <span
          className={cn("size-2 rounded-full", THEME_DOT[card.theme] ?? "bg-slate-400")}
        />
      </div>
      <p className="mb-2 line-clamp-2 text-xs font-medium leading-snug text-foreground">
        {card.title}
      </p>
      {card.hasAsset ? (
        <div className="flex h-16 items-center justify-center rounded-md bg-muted">
          <IconMovie className="size-5 text-muted-foreground/50" />
        </div>
      ) : (
        <div className="flex gap-1.5">
          <Button variant="outline" size="sm" className="h-7 flex-1 gap-1 text-[10px]">
            <IconSparkles className="size-3" />
            Generate
          </Button>
          <Button variant="outline" size="sm" className="h-7 flex-1 gap-1 text-[10px]">
            <IconUpload className="size-3" />
            Upload
          </Button>
        </div>
      )}
    </div>
  )
}

// --- Main ---

export function ProductionView({ brandId }: { brandId: string }) {
  return (
    <div className="flex h-full flex-col">
      {/* Header */}
      <div className="flex items-center justify-between border-b px-4 py-3">
        <div className="flex items-center gap-3">
          <IconMovie className="size-5 text-primary" />
          <div>
            <h2 className="text-sm font-semibold text-foreground">
              Production Pipeline
            </h2>
            <p className="text-xs text-muted-foreground">
              {MOCK_CARDS.length} content pieces in pipeline
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="gap-1.5">
            <IconUpload className="size-3.5" />
            Upload Asset
          </Button>
          <Button size="sm" className="gap-1.5">
            <IconSparkles className="size-3.5" />
            Generate All
          </Button>
        </div>
      </div>

      {/* Kanban Board */}
      <div className="flex-1 overflow-x-auto p-4">
        <div className="flex min-w-max gap-4">
          {PIPELINE_STAGES.map((stage) => {
            const cards = MOCK_CARDS.filter((c) => c.status === stage.id)
            return (
              <div key={stage.id} className="w-60 shrink-0">
                {/* Column Header */}
                <div className="mb-3 flex items-center gap-2">
                  <span className={cn("size-2 rounded-full", stage.color)} />
                  <span className="text-xs font-semibold text-foreground">
                    {stage.label}
                  </span>
                  <Badge variant="secondary" className="ml-auto text-[10px]">
                    {cards.length}
                  </Badge>
                </div>

                {/* Column Cards */}
                <div className="flex flex-col gap-2">
                  {cards.map((card) => (
                    <KanbanCard key={card.id} card={card} />
                  ))}
                  {cards.length === 0 && (
                    <div className="rounded-lg border border-dashed p-4 text-center">
                      <p className="text-[10px] text-muted-foreground">
                        No items
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
