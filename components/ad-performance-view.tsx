"use client"

import { Badge } from "@/components/ui/badge"
import {
  IconChartDots,
  IconCurrencyDollar,
  IconClick,
  IconEye,
  IconTarget,
  IconArrowUpRight,
  IconArrowDownRight,
  IconTrendingUp,
  IconBrandInstagram,
  IconBrandTiktok,
  IconBrandLinkedin,
} from "@tabler/icons-react"
import { cn } from "@/lib/utils"

// --- Data ---

function fmtNum(n: number): string {
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1) + "M"
  if (n >= 1_000) return (n / 1_000).toFixed(1) + "K"
  return n.toString()
}

const KPI_CARDS = [
  { label: "Total Ad Spend", value: "$3,171", change: "+12.4%", positive: true, icon: IconCurrencyDollar },
  { label: "Avg. CPC", value: "$0.31", change: "-8.2%", positive: true, icon: IconClick },
  { label: "Avg. CPM", value: "$9.04", change: "-3.1%", positive: true, icon: IconEye },
  { label: "Overall CTR", value: "2.89%", change: "+0.4%", positive: true, icon: IconTarget },
  { label: "Conversions", value: "247", change: "+31.2%", positive: true, icon: IconTrendingUp },
  { label: "ROAS", value: "3.42x", change: "+0.28x", positive: true, icon: IconCurrencyDollar },
]

type CampaignPerf = {
  id: string
  name: string
  platform: string
  status: string
  spend: number
  impressions: number
  clicks: number
  ctr: number
  cpc: number
  conversions: number
  roas: number
}

const CAMPAIGN_PERFORMANCE: CampaignPerf[] = [
  {
    id: "c1",
    name: "Brand Awareness Q1",
    platform: "instagram",
    status: "active",
    spend: 1847,
    impressions: 185_000,
    clicks: 3_420,
    ctr: 1.85,
    cpc: 0.54,
    conversions: 89,
    roas: 2.81,
  },
  {
    id: "c2",
    name: "Coffee Lovers Engagement",
    platform: "tiktok",
    status: "active",
    spend: 892,
    impressions: 124_000,
    clicks: 5_890,
    ctr: 4.75,
    cpc: 0.15,
    conversions: 134,
    roas: 4.92,
  },
  {
    id: "c3",
    name: "Website Traffic — AI Features",
    platform: "linkedin",
    status: "paused",
    spend: 432,
    impressions: 42_000,
    clicks: 890,
    ctr: 2.12,
    cpc: 0.49,
    conversions: 24,
    roas: 1.83,
  },
]

const WEEKLY_SPEND = [
  { label: "W1", spend: 380, conversions: 28 },
  { label: "W2", spend: 420, conversions: 35 },
  { label: "W3", spend: 510, conversions: 42 },
  { label: "W4", spend: 485, conversions: 48 },
  { label: "W5", spend: 550, conversions: 51 },
  { label: "W6", spend: 490, conversions: 43 },
  { label: "W7", spend: 336, conversions: 0 },
]

const PLATFORM_ICONS: Record<string, { icon: typeof IconBrandInstagram; color: string }> = {
  instagram: { icon: IconBrandInstagram, color: "text-pink-500" },
  tiktok: { icon: IconBrandTiktok, color: "text-foreground" },
  linkedin: { icon: IconBrandLinkedin, color: "text-blue-600" },
}

const STATUS_STYLES: Record<string, string> = {
  active: "bg-emerald-500/10 text-emerald-600",
  paused: "bg-amber-500/10 text-amber-600",
  completed: "bg-slate-500/10 text-slate-600",
}

// --- Main ---

export function AdPerformanceView({ brandId }: { brandId: string }) {
  const maxSpend = Math.max(...WEEKLY_SPEND.map((w) => w.spend))

  return (
    <div className="flex h-full flex-col">
      {/* Header */}
      <div className="flex items-center gap-3 border-b px-4 py-3">
        <IconChartDots className="size-5 text-primary" />
        <div>
          <h2 className="text-sm font-semibold text-foreground">
            Ad Performance
          </h2>
          <p className="text-xs text-muted-foreground">
            Campaign metrics and ROI tracking
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="mx-auto max-w-5xl space-y-6">
          {/* KPI Grid */}
          <div className="grid grid-cols-2 gap-3 lg:grid-cols-3 xl:grid-cols-6">
            {KPI_CARDS.map((kpi) => {
              const Icon = kpi.icon
              return (
                <div key={kpi.label} className="rounded-xl border bg-card p-4">
                  <div className="mb-1 flex items-center gap-1.5">
                    <Icon className="size-3.5 text-muted-foreground/60" />
                    <span className="text-[10px] text-muted-foreground">
                      {kpi.label}
                    </span>
                  </div>
                  <p className="text-lg font-bold text-foreground">
                    {kpi.value}
                  </p>
                  <p
                    className={cn(
                      "flex items-center gap-0.5 text-[10px] font-medium",
                      kpi.positive ? "text-emerald-600" : "text-red-500"
                    )}
                  >
                    {kpi.positive ? (
                      <IconArrowUpRight className="size-2.5" />
                    ) : (
                      <IconArrowDownRight className="size-2.5" />
                    )}
                    {kpi.change}
                  </p>
                </div>
              )
            })}
          </div>

          {/* Spend Chart */}
          <div className="rounded-xl border bg-card p-4">
            <h3 className="mb-4 text-xs font-semibold text-foreground">
              Weekly Ad Spend vs Conversions
            </h3>
            <div className="flex items-end gap-3" style={{ height: 140 }}>
              {WEEKLY_SPEND.map((w, i) => (
                <div
                  key={i}
                  className="flex flex-1 flex-col items-center gap-1"
                >
                  <span className="text-[9px] font-medium text-muted-foreground">
                    ${w.spend}
                  </span>
                  <div className="flex w-full gap-0.5">
                    <div
                      className="flex-1 rounded-t bg-primary"
                      style={{
                        height: `${(w.spend / maxSpend) * 100}px`,
                        opacity: 0.5 + (i / WEEKLY_SPEND.length) * 0.5,
                      }}
                    />
                    <div
                      className="flex-1 rounded-t bg-emerald-500"
                      style={{
                        height: `${(w.conversions / 60) * 100}px`,
                        opacity: 0.5 + (i / WEEKLY_SPEND.length) * 0.5,
                      }}
                    />
                  </div>
                  <span className="text-[9px] text-muted-foreground">
                    {w.label}
                  </span>
                </div>
              ))}
            </div>
            <div className="mt-3 flex items-center gap-4 border-t pt-2">
              <div className="flex items-center gap-1.5">
                <span className="size-2 rounded-sm bg-primary" />
                <span className="text-[10px] text-muted-foreground">
                  Ad Spend
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="size-2 rounded-sm bg-emerald-500" />
                <span className="text-[10px] text-muted-foreground">
                  Conversions
                </span>
              </div>
            </div>
          </div>

          {/* Campaign Performance Table */}
          <div className="rounded-xl border bg-card">
            <div className="border-b px-4 py-3">
              <h3 className="text-xs font-semibold text-foreground">
                Campaign Performance Comparison
              </h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b text-left text-[10px] font-medium text-muted-foreground">
                    <th className="px-4 py-2.5">Campaign</th>
                    <th className="px-4 py-2.5">Status</th>
                    <th className="px-4 py-2.5 text-right">Spend</th>
                    <th className="px-4 py-2.5 text-right">Impressions</th>
                    <th className="px-4 py-2.5 text-right">Clicks</th>
                    <th className="px-4 py-2.5 text-right">CTR</th>
                    <th className="px-4 py-2.5 text-right">CPC</th>
                    <th className="px-4 py-2.5 text-right">Conv.</th>
                    <th className="px-4 py-2.5 text-right">ROAS</th>
                  </tr>
                </thead>
                <tbody>
                  {CAMPAIGN_PERFORMANCE.map((c) => {
                    const pmeta =
                      PLATFORM_ICONS[c.platform] ?? PLATFORM_ICONS.instagram
                    const PIcon = pmeta.icon
                    return (
                      <tr
                        key={c.id}
                        className="border-b last:border-0 hover:bg-accent/30"
                      >
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <PIcon
                              className={cn("size-3.5", pmeta.color)}
                            />
                            <span className="text-xs font-medium text-foreground">
                              {c.name}
                            </span>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <Badge
                            variant="secondary"
                            className={cn(
                              "text-[10px] capitalize",
                              STATUS_STYLES[c.status]
                            )}
                          >
                            {c.status}
                          </Badge>
                        </td>
                        <td className="px-4 py-3 text-right text-xs font-medium text-foreground">
                          ${c.spend.toLocaleString()}
                        </td>
                        <td className="px-4 py-3 text-right text-xs text-foreground">
                          {fmtNum(c.impressions)}
                        </td>
                        <td className="px-4 py-3 text-right text-xs text-foreground">
                          {fmtNum(c.clicks)}
                        </td>
                        <td className="px-4 py-3 text-right text-xs text-foreground">
                          {c.ctr}%
                        </td>
                        <td className="px-4 py-3 text-right text-xs text-foreground">
                          ${c.cpc.toFixed(2)}
                        </td>
                        <td className="px-4 py-3 text-right text-xs font-medium text-foreground">
                          {c.conversions}
                        </td>
                        <td className="px-4 py-3 text-right">
                          <span
                            className={cn(
                              "text-xs font-semibold",
                              c.roas >= 3
                                ? "text-emerald-600"
                                : c.roas >= 2
                                  ? "text-amber-600"
                                  : "text-red-500"
                            )}
                          >
                            {c.roas}x
                          </span>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
