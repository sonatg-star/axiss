"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  IconSend,
  IconClock,
  IconCheck,
  IconX,
  IconCalendarEvent,
  IconBrandInstagram,
  IconBrandTiktok,
  IconBrandLinkedin,
  IconBrandX,
  IconVideo,
  IconLayoutGrid,
  IconPhoto,
  IconCamera,
  IconFileText,
  IconMessage,
} from "@tabler/icons-react"
import { cn } from "@/lib/utils"

// --- Data ---

type PublishItem = {
  id: string
  title: string
  platform: string
  format: string
  scheduledDate: string
  status: "scheduled" | "published" | "failed"
  engagement?: string
  error?: string
}

const MOCK_ITEMS: PublishItem[] = [
  // Scheduled
  { id: "pub1", title: "How Coff AI Learns Your Taste", platform: "instagram", format: "carousel", scheduledDate: "Feb 19, 8:00 AM", status: "scheduled" },
  { id: "pub2", title: "Coffee Hack: Cold Brew in 5 min", platform: "tiktok", format: "video", scheduledDate: "Feb 19, 12:00 PM", status: "scheduled" },
  { id: "pub3", title: "AI-Driven Personalization in F&B", platform: "linkedin", format: "article", scheduledDate: "Feb 19, 12:30 PM", status: "scheduled" },
  { id: "pub4", title: "Quick Tip: Water Temperature", platform: "x", format: "static", scheduledDate: "Feb 20, 1:00 PM", status: "scheduled" },
  { id: "pub5", title: "A Day at Coff AI HQ", platform: "instagram", format: "story", scheduledDate: "Feb 20, 9:00 AM", status: "scheduled" },
  // Published
  { id: "pub6", title: "Brewing the Perfect Espresso", platform: "instagram", format: "reel", scheduledDate: "Feb 17, 8:00 AM", status: "published", engagement: "5.2%" },
  { id: "pub7", title: "Coffee Hack: Pour Over Guide", platform: "tiktok", format: "video", scheduledDate: "Feb 17, 12:00 PM", status: "published", engagement: "8.1%" },
  { id: "pub8", title: "How AI is Reshaping Coffee", platform: "linkedin", format: "article", scheduledDate: "Feb 17, 12:30 PM", status: "published", engagement: "3.4%" },
  { id: "pub9", title: "The future of personalized coffee", platform: "x", format: "thread", scheduledDate: "Feb 17, 5:00 PM", status: "published", engagement: "2.8%" },
  { id: "pub10", title: "Your Coff AI Journeys", platform: "instagram", format: "reel", scheduledDate: "Feb 14, 8:00 AM", status: "published", engagement: "6.7%" },
  // Failed
  { id: "pub11", title: "Weekend Vibes Story", platform: "instagram", format: "story", scheduledDate: "Feb 15, 10:00 AM", status: "failed", error: "Authentication expired" },
]

const PLATFORM_META: Record<string, { icon: typeof IconBrandInstagram; color: string; label: string }> = {
  instagram: { icon: IconBrandInstagram, color: "text-pink-500", label: "Instagram" },
  tiktok: { icon: IconBrandTiktok, color: "text-foreground", label: "TikTok" },
  linkedin: { icon: IconBrandLinkedin, color: "text-blue-600", label: "LinkedIn" },
  x: { icon: IconBrandX, color: "text-foreground", label: "X" },
}

const FORMAT_LABELS: Record<string, { icon: typeof IconVideo; label: string }> = {
  reel: { icon: IconVideo, label: "Reel" },
  carousel: { icon: IconLayoutGrid, label: "Carousel" },
  static: { icon: IconPhoto, label: "Static" },
  story: { icon: IconCamera, label: "Story" },
  article: { icon: IconFileText, label: "Article" },
  thread: { icon: IconMessage, label: "Thread" },
  video: { icon: IconVideo, label: "Video" },
}

const STATUS_CONFIG = {
  scheduled: { icon: IconClock, color: "text-blue-600 bg-blue-500/10", label: "Scheduled" },
  published: { icon: IconCheck, color: "text-emerald-600 bg-emerald-500/10", label: "Published" },
  failed: { icon: IconX, color: "text-red-600 bg-red-500/10", label: "Failed" },
}

// --- Components ---

function PublishCard({ item }: { item: PublishItem }) {
  const pmeta = PLATFORM_META[item.platform] ?? PLATFORM_META.instagram
  const fmeta = FORMAT_LABELS[item.format] ?? FORMAT_LABELS.static
  const smeta = STATUS_CONFIG[item.status]
  const PlatformIcon = pmeta.icon
  const FormatIcon = fmeta.icon
  const StatusIcon = smeta.icon

  return (
    <div className="flex items-center gap-4 rounded-lg border bg-card p-4 transition-colors hover:bg-accent/30">
      {/* Platform + Format */}
      <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-muted">
        <PlatformIcon className={cn("size-5", pmeta.color)} />
      </div>

      {/* Content */}
      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium text-foreground">{item.title}</p>
        <div className="mt-1 flex items-center gap-3 text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <FormatIcon className="size-3" />
            {fmeta.label}
          </span>
          <span>{pmeta.label}</span>
          <span className="flex items-center gap-1">
            <IconCalendarEvent className="size-3" />
            {item.scheduledDate}
          </span>
        </div>
      </div>

      {/* Engagement / Error */}
      {item.engagement && (
        <div className="text-right">
          <p className="text-sm font-semibold text-foreground">
            {item.engagement}
          </p>
          <p className="text-[10px] text-muted-foreground">engagement</p>
        </div>
      )}
      {item.error && (
        <p className="max-w-[120px] text-right text-xs text-red-500">
          {item.error}
        </p>
      )}

      {/* Status Badge */}
      <Badge variant="secondary" className={cn("gap-1 text-[10px]", smeta.color)}>
        <StatusIcon className="size-3" />
        {smeta.label}
      </Badge>

      {/* Actions */}
      {item.status === "scheduled" && (
        <Button size="sm" className="gap-1.5">
          <IconSend className="size-3.5" />
          Publish Now
        </Button>
      )}
      {item.status === "failed" && (
        <Button size="sm" variant="outline" className="gap-1.5">
          Retry
        </Button>
      )}
    </div>
  )
}

// --- Main ---

export function PublishView({ brandId }: { brandId: string }) {
  const scheduled = MOCK_ITEMS.filter((i) => i.status === "scheduled")
  const published = MOCK_ITEMS.filter((i) => i.status === "published")
  const failed = MOCK_ITEMS.filter((i) => i.status === "failed")

  return (
    <div className="flex h-full flex-col">
      {/* Header */}
      <div className="flex items-center justify-between border-b px-4 py-3">
        <div className="flex items-center gap-3">
          <IconSend className="size-5 text-primary" />
          <div>
            <h2 className="text-sm font-semibold text-foreground">Publish</h2>
            <p className="text-xs text-muted-foreground">
              {scheduled.length} scheduled, {published.length} published
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            Schedule All
          </Button>
          <Button size="sm" className="gap-1.5">
            <IconSend className="size-3.5" />
            Publish All Ready
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="mx-auto max-w-4xl space-y-6">
          {/* Scheduled */}
          <section>
            <div className="mb-3 flex items-center gap-2">
              <IconClock className="size-4 text-blue-500" />
              <h3 className="text-xs font-semibold text-foreground">
                Scheduled
              </h3>
              <Badge variant="secondary" className="text-[10px]">
                {scheduled.length}
              </Badge>
            </div>
            <div className="space-y-2">
              {scheduled.map((item) => (
                <PublishCard key={item.id} item={item} />
              ))}
            </div>
          </section>

          {/* Failed */}
          {failed.length > 0 && (
            <section>
              <div className="mb-3 flex items-center gap-2">
                <IconX className="size-4 text-red-500" />
                <h3 className="text-xs font-semibold text-foreground">
                  Failed
                </h3>
                <Badge variant="secondary" className="text-[10px]">
                  {failed.length}
                </Badge>
              </div>
              <div className="space-y-2">
                {failed.map((item) => (
                  <PublishCard key={item.id} item={item} />
                ))}
              </div>
            </section>
          )}

          {/* Published */}
          <section>
            <div className="mb-3 flex items-center gap-2">
              <IconCheck className="size-4 text-emerald-500" />
              <h3 className="text-xs font-semibold text-foreground">
                Published
              </h3>
              <Badge variant="secondary" className="text-[10px]">
                {published.length}
              </Badge>
            </div>
            <div className="space-y-2">
              {published.map((item) => (
                <PublishCard key={item.id} item={item} />
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}
