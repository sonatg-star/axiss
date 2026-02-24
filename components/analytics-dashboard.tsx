"use client"

import { Badge } from "@/components/ui/badge"
import {
  IconChartBar,
  IconUsers,
  IconEye,
  IconClick,
  IconArrowUpRight,
  IconBrandInstagram,
  IconBrandTiktok,
  IconBrandLinkedin,
  IconBrandX,
} from "@tabler/icons-react"
import { cn } from "@/lib/utils"

// --- Data ---

function fmtNum(n: number): string {
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1) + "M"
  if (n >= 1_000) return (n / 1_000).toFixed(1) + "K"
  return n.toString()
}

const OVERVIEW_STATS = [
  { label: "Total Followers", value: "12.8K", change: "+9.4%", icon: IconUsers },
  { label: "Engagement Rate", value: "4.8%", change: "+0.6%", icon: IconClick },
  { label: "Impressions (30d)", value: "487.2K", change: "+22.3%", icon: IconEye },
  { label: "Reach (30d)", value: "312.6K", change: "+18.1%", icon: IconEye },
]

const PLATFORM_STATS = [
  { platform: "Instagram", icon: IconBrandInstagram, color: "text-pink-500", followers: 5240, growth: 9.2, engagement: 5.1 },
  { platform: "TikTok", icon: IconBrandTiktok, color: "text-foreground", followers: 4120, growth: 18.4, engagement: 7.3 },
  { platform: "LinkedIn", icon: IconBrandLinkedin, color: "text-blue-600", followers: 2180, growth: 6.1, engagement: 3.2 },
  { platform: "X", icon: IconBrandX, color: "text-foreground", followers: 1307, growth: 4.8, engagement: 2.9 },
]

const WEEKLY_DATA = [
  { label: "W1 Jan", impressions: 89_400, engagement: 3.9, followers: 11_200 },
  { label: "W2 Jan", impressions: 94_200, engagement: 4.1, followers: 11_520 },
  { label: "W3 Jan", impressions: 108_500, engagement: 4.3, followers: 11_890 },
  { label: "W4 Jan", impressions: 112_300, engagement: 4.5, followers: 12_100 },
  { label: "W1 Feb", impressions: 121_800, engagement: 4.6, followers: 12_340 },
  { label: "W2 Feb", impressions: 134_500, engagement: 4.8, followers: 12_610 },
  { label: "W3 Feb", impressions: 142_000, engagement: 5.1, followers: 12_847 },
]

const TOP_POSTS = [
  { id: 1, title: "Coffee Hack: Cold Brew in 5 min", platform: "TikTok", format: "Video", engagement: 11.2, impressions: 28_300 },
  { id: 2, title: "Friday Coffee Dance", platform: "TikTok", format: "Video", engagement: 9.1, impressions: 19_500 },
  { id: 3, title: "How Coff AI Learns Your Taste", platform: "Instagram", format: "Carousel", engagement: 8.4, impressions: 12_400 },
  { id: 4, title: "Brewing the Perfect Espresso", platform: "Instagram", format: "Reel", engagement: 6.7, impressions: 9_800 },
  { id: 5, title: "Your Coff AI Journeys", platform: "Instagram", format: "Reel", engagement: 6.2, impressions: 8_900 },
  { id: 6, title: "AI-Driven Personalization", platform: "LinkedIn", format: "Article", engagement: 4.3, impressions: 5_200 },
]

// --- Components ---

function StatCard({
  stat,
}: {
  stat: (typeof OVERVIEW_STATS)[0]
}) {
  const Icon = stat.icon
  return (
    <div className="rounded-xl border bg-card p-4">
      <div className="flex items-center justify-between">
        <span className="text-xs text-muted-foreground">{stat.label}</span>
        <Icon className="size-4 text-muted-foreground/60" />
      </div>
      <p className="mt-1 text-2xl font-bold text-foreground">{stat.value}</p>
      <p className="mt-0.5 flex items-center gap-0.5 text-xs font-medium text-emerald-600">
        <IconArrowUpRight className="size-3" />
        {stat.change}
      </p>
    </div>
  )
}

function BarChart({
  data,
  valueKey,
  label,
}: {
  data: typeof WEEKLY_DATA
  valueKey: "impressions" | "engagement" | "followers"
  label: string
}) {
  const values = data.map((d) => d[valueKey] as number)
  const max = Math.max(...values)

  return (
    <div className="rounded-xl border bg-card p-4">
      <h3 className="mb-4 text-xs font-semibold text-foreground">{label}</h3>
      <div className="flex items-end gap-2" style={{ height: 160 }}>
        {data.map((d, i) => (
          <div key={i} className="flex flex-1 flex-col items-center gap-1">
            <span className="text-[9px] font-medium text-muted-foreground">
              {typeof d[valueKey] === "number" && d[valueKey] >= 1000
                ? fmtNum(d[valueKey] as number)
                : d[valueKey]}
            </span>
            <div
              className="w-full rounded-t bg-primary transition-all"
              style={{
                height: `${(values[i] / max) * 120}px`,
                opacity: 0.4 + (i / data.length) * 0.6,
              }}
            />
            <span className="text-[9px] text-muted-foreground">
              {d.label.replace(/\s\w+$/, "")}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

// --- Main ---

export function AnalyticsDashboard({ brandId }: { brandId: string }) {
  return (
    <div className="flex h-full flex-col">
      {/* Header */}
      <div className="flex items-center gap-3 border-b px-4 py-3">
        <IconChartBar className="size-5 text-primary" />
        <div>
          <h2 className="text-sm font-semibold text-foreground">Analytics</h2>
          <p className="text-xs text-muted-foreground">
            Last 30 days performance overview
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="mx-auto max-w-5xl space-y-6">
          {/* Overview Stats */}
          <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
            {OVERVIEW_STATS.map((stat) => (
              <StatCard key={stat.label} stat={stat} />
            ))}
          </div>

          {/* Platform Breakdown */}
          <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
            {PLATFORM_STATS.map((p) => {
              const Icon = p.icon
              return (
                <div key={p.platform} className="rounded-xl border bg-card p-4">
                  <div className="flex items-center gap-2">
                    <Icon className={cn("size-4", p.color)} />
                    <span className="text-xs font-medium text-foreground">
                      {p.platform}
                    </span>
                  </div>
                  <p className="mt-2 text-xl font-bold text-foreground">
                    {fmtNum(p.followers)}
                  </p>
                  <div className="mt-1 flex items-center gap-2 text-[10px]">
                    <span className="flex items-center gap-0.5 font-medium text-emerald-600">
                      <IconArrowUpRight className="size-2.5" />
                      +{p.growth}%
                    </span>
                    <span className="text-muted-foreground">
                      {p.engagement}% eng.
                    </span>
                  </div>
                </div>
              )
            })}
          </div>

          {/* Charts */}
          <div className="grid gap-4 lg:grid-cols-2">
            <BarChart
              data={WEEKLY_DATA}
              valueKey="impressions"
              label="Weekly Impressions"
            />
            <BarChart
              data={WEEKLY_DATA}
              valueKey="followers"
              label="Follower Growth"
            />
          </div>

          {/* Top Performing Posts */}
          <div className="rounded-xl border bg-card">
            <div className="border-b px-4 py-3">
              <h3 className="text-xs font-semibold text-foreground">
                Top Performing Posts
              </h3>
            </div>
            <div className="divide-y">
              {TOP_POSTS.map((post, i) => (
                <div
                  key={post.id}
                  className="flex items-center gap-4 px-4 py-3"
                >
                  <span className="w-5 text-xs font-bold text-muted-foreground">
                    #{i + 1}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-foreground">
                      {post.title}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {post.platform} · {post.format}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-foreground">
                      {post.engagement}%
                    </p>
                    <p className="text-[10px] text-muted-foreground">
                      {fmtNum(post.impressions)} imp.
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
